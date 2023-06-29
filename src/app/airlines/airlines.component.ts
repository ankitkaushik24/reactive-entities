import {Component, ElementRef, inject, OnInit, ViewChild} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {debounceTime, exhaustMap, filter, map, Observable, scan, startWith, Subject, tap} from "rxjs";
import {ScrollDispatcher, ScrollingModule} from "@angular/cdk/scrolling";
import {MatTableModule} from "@angular/material/table";
import {
  CdkTableVirtualScrollDataSource,
  TableVirtualScrollDataSource,
  TableVirtualScrollModule
} from "ng-table-virtual-scroll";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IAirlineInfo, IAirlineResponse} from "./airlines.model";
import {RxState} from "@rx-angular/state";

@Component({
  selector: 'app-airlines',
  standalone: true,
  imports: [CommonModule, TableVirtualScrollModule, ScrollingModule, MatTableModule],
  template: `

    <cdk-virtual-scroll-viewport tvsItemSize="20" headerHeight="56"
                                 class="wrapper mat-elevation-z2">

      <table mat-table [dataSource]="dataSource">

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

        <ng-container matColumnDef="index">
          <th mat-header-cell
              *matHeaderCellDef
              class="col-sm">No.
          </th>
          <td mat-cell
              *matCellDef="let element"
              class="col-sm">{{element.num}}</td>
        </ng-container>

        <ng-container matColumnDef="trips">
          <th mat-header-cell
              *matHeaderCellDef
              class="col-sm">Trips
          </th>
          <td mat-cell
              *matCellDef="let element"
              class="col-sm">{{element.trips}}</td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let element">{{element.name}}</td>
        </ng-container>

      </table>

    </cdk-virtual-scroll-viewport>

  `,
  styles: [` .wrapper {
    border: 1px solid;
    height: 500px;
    margin: 0;
    padding: 24px;
  }
  `],
})
export class AirlinesComponent extends RxState<{
  page: number;
  dataList: IAirlineInfo[];
  totalPages: number;
}> implements OnInit {
  displayedColumns = ['index', 'trips', 'name'];

  dataSource = new TableVirtualScrollDataSource([] as IAirlineResponse['data']);
  // list$ = this.response$.pipe(
  //   map(({data}) => data),
  //   scan((acc, value) => {
  //     return acc.concat(value);
  //   }, [] as any[]),
  //   map(data => data.map((el, i) => ({...el, num: i}))),
  //   takeUntilDestroyed(),
  // );
  private http = inject(HttpClient);
  private scrollDispatcher = inject(ScrollDispatcher);
  private scrolled$$ = new Subject<unknown>();
  private scrollEnd$ = this.scrollDispatcher.scrolled().pipe(
    debounceTime(300),
    filter((e) => {
      return !!e && e.measureScrollOffset('bottom') <= 50;
    }),
    // filter(isScrollEnd => !!isScrollEnd)
  );
  response$ = this.scrollEnd$.pipe(
    startWith(null),
    filter(() => this.get('page') < this.get('totalPages')),
    exhaustMap(() => this.http.get<IAirlineResponse>(`https://api.instantwebtools.net/v1/passenger?page=${this.get('page')}&size=40`)),
  )

  constructor() {
    super();

    this.set({
      page: 0,
      totalPages: 1,
    });
  }

  onScroll(event: any) {
    this.scrolled$$.next(event);
  }

  ngOnInit() {
    this.connect(this.response$, (oldState, value) => ({
      page: oldState.page + 1,
      dataList: (() => {
        const startIndex = oldState.dataList?.length ?? 0;
        return (oldState.dataList || []).concat(value.data.map((item, idx) => ({
          ...item,
          num: startIndex + idx + 1
        })))
      })(),
      totalPages: value.totalPages
    }));

    this.hold(this.select('dataList'), (dataList) => {
      this.dataSource.data = dataList;
    });
  }
}
