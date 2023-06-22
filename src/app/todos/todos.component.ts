import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TodosService} from "./todos.service";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {UpsertTodoComponent} from "./upsert-todo/upsert-todo.component";
import {ITodo} from "./todos.model";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatDialogModule, MatToolbarModule, MatSlideToggleModule],
  providers: [TodosService],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent {
  private todosService = inject(TodosService);
  private dialog = inject(MatDialog);

  todos$ = this.todosService.todos$;

  openTodoDialog(action: 'add' | 'update') {
    this.dialog.open(UpsertTodoComponent, {
      data: {
        action
      },
    })
  }

  deleteTodo(todoItem: ITodo) {

  }

  markCompleted(todoItem: ITodo) {

  }

}
