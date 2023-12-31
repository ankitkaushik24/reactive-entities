import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TodosComponent} from "./todos/todos.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TodosComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'reactive-todos';
}
