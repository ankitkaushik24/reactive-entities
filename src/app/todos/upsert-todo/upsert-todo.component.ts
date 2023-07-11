import {Component, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {TodosService} from "../todos.service";
import {delayWhen, Subject, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-upsert-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './upsert-todo.component.html',
  styleUrls: ['./upsert-todo.component.scss']
})
export class UpsertTodoComponent implements OnInit {
  activeTodo = signal({
    _id: '',
    description: '',
    completed: false
  });

  private matDialogRef = inject(MatDialogRef);
  private dialogData = inject(MAT_DIALOG_DATA);

  constructor(private todosService: TodosService) {
  }

  ngOnInit() {
    const {action, currentValue} = this.dialogData;
    if (action === 'update') {
      this.activeTodo.set(currentValue);
    }
  }

  onDescriptionInput(value: string) {
    this.activeTodo.mutate(todo => todo.description = value);
  }

  onSave() {
    const {action} = this.dialogData;
    const postRequest = () => this.matDialogRef.close();

    if (action === 'add') {
      this.todosService.addTodo$$.next({
        payload: this.activeTodo().description,
        postRequest
      });
    }

    if (action === 'update') {
      this.todosService.updateTodo$$.next(this.activeTodo());
    }
  }
}
