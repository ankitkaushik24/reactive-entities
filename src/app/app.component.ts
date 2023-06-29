import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TodosComponent} from "./todos/todos.component";
import {AirlinesComponent} from "./airlines/airlines.component";
import {MatTabsModule} from "@angular/material/tabs";
import {ProductsComponent} from "./products/products.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TodosComponent, AirlinesComponent, MatTabsModule, ProductsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'reactive-todos';
}
