import {Component, inject, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {debounceTime, exhaustMap, filter, startWith, tap, withLatestFrom} from "rxjs";
import {ScrollDispatcher, ScrollingModule} from "@angular/cdk/scrolling";
import {MatTableModule} from "@angular/material/table";
import {TableVirtualScrollDataSource, TableVirtualScrollModule} from "ng-table-virtual-scroll";
import {RxState} from "@rx-angular/state";
import {IProduct} from "./products.model";
import {selectSlice} from "@rx-angular/state/selections";
import {ProductsService} from "./products.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatSliderModule} from "@angular/material/slider";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, TableVirtualScrollModule, ScrollingModule, MatTableModule, MatSliderModule],
  providers: [ProductsService],
  template: `
    <mat-slider>
      <input matSliderStartThumb (valueChange)="onSliderChange('price_min', $event)">
      <input matSliderEndThumb (valueChange)="onSliderChange('price_max', $event)">
    </mat-slider>
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

        <ng-container matColumnDef="price">
          <th mat-header-cell
              *matHeaderCellDef
              class="col-sm">Price
          </th>
          <td mat-cell
              *matCellDef="let element"
              class="col-sm">{{element.price}}</td>
        </ng-container>

        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let element">{{element.title}}</td>
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
export class ProductsComponent implements OnInit {
  private productService = inject(ProductsService);
  displayedColumns = ['index', 'price', 'title'];

  dataSource = new TableVirtualScrollDataSource([] as IProduct[]);

  dataList$ = this.productService.select('dataList').pipe(takeUntilDestroyed(), tap((dataList) => {
    this.dataSource.data = dataList;
  }));


  ngOnInit() {
    this.dataList$.subscribe();
  }

  onSliderChange(filterName: 'price_min' | 'price_max', value: number) {
    this.productService.set((oldState) => ({
      params: {
        ...oldState.params,
        [filterName]: value,
      }
    }));
  }
}
