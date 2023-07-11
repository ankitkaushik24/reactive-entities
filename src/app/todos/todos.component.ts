import {ChangeDetectionStrategy, Component, inject, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TodosService} from "./todos.service";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {UpsertTodoComponent} from "./upsert-todo/upsert-todo.component";
import {ITodo} from "./todos.model";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {RxFor} from "@rx-angular/template/for";
import {RxLet} from "@rx-angular/template/let";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {RxPush} from "@rx-angular/template/push";

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    CommonModule, MatListModule, MatButtonModule, MatIconModule, MatDialogModule,
    MatToolbarModule, MatSlideToggleModule, RxFor, RxLet, RxPush,
    MatProgressBarModule, MatButtonToggleModule
  ],
  providers: [TodosService],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosComponent {
  protected todosService = inject(TodosService);
  private dialog = inject(MatDialog);
  private injector = inject(Injector);

  openTodoDialog(action: 'add' | 'update', selectedTodo?: ITodo) {
    this.dialog.open(UpsertTodoComponent, {
      data: {
        action,
        currentValue: selectedTodo
      },
      injector: this.injector,
    })
  }

  deleteTodo(todoItem: ITodo) {
    this.todosService.deleteTodo$$.next(todoItem._id);
  }

  markCompleted(todoItem: ITodo, isChecked: boolean) {
    this.todosService.updateTodo$$.next({...todoItem, completed: isChecked});
  }

}
