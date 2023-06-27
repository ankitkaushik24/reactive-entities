import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {TodosService} from "../todos.service";
import {delayWhen, Subject, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-upsert-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './upsert-todo.component.html',
  styleUrls: ['./upsert-todo.component.scss']
})
export class UpsertTodoComponent {
  descriptionControl = new FormControl('');
  private matDialogRef = inject(MatDialogRef);

  constructor(private todosService: TodosService) {
  }

  onSave() {
    this.todosService.addTodo$$.next({
      payload: this.descriptionControl.value as string,
      postRequest: () => this.matDialogRef.close()
    });
  }
}
