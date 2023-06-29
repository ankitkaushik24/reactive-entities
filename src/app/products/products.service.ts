import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ScrollDispatcher} from "@angular/cdk/scrolling";
import {debounceTime, exhaustMap, filter, map, startWith, switchMap, tap, withLatestFrom} from "rxjs";
import {selectSlice} from "@rx-angular/state/selections";
import {IProduct} from "./products.model";
import {RxState} from "@rx-angular/state";

@Injectable()
export class ProductsService extends RxState<{
  offset: number;
  limit: number;
  dataList: IProduct[];
  params: {
    price_min?: number;
    price_max?: number;
  }
}> {
  private http = inject(HttpClient);
  private scrollDispatcher = inject(ScrollDispatcher);
  private scrolled$$ = this.scrollDispatcher.scrolled();
  private scrollEnd$ = this.scrolled$$.pipe(
    debounceTime(300),
    filter((e) => {
      return !!e && e.measureScrollOffset('bottom') <= 50;
    }),
  );
  response$ = this.select('params')
    .pipe(
      debounceTime(300),
      tap(() => this.set({offset: 0})),
      switchMap((params) => this.scrollEnd$.pipe(startWith(null), map(() => params))),
      withLatestFrom(this.select(selectSlice(['offset', 'limit']))),
      exhaustMap(
        ([params, {offset, limit}]) => this.http.get<IProduct[]>(
          `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${limit}`, {
            params
          }
        )
      ),
    )

  constructor() {
    super();

    this.set({
      offset: 0,
      limit: 40,
      params: {},
    });

    this.connect(this.response$, (oldState, value) => ({
      offset: oldState.offset + oldState.limit,
      dataList: (() => {
        const startIndex = oldState.offset === 0 ? 0 : (oldState.dataList?.length || 0);
        const newList = value.map((item, idx) => ({
          ...item,
          num: startIndex + idx + 1
        }));
        return oldState.offset === 0 ? newList : (oldState.dataList || []).concat(newList);
      })(),
    }));
  }
}
