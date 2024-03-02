import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TodosService } from '../todos.service';

@Component({
  selector: 'app-upsert-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './upsert-todo.component.html',
  styleUrls: ['./upsert-todo.component.scss'],
})
export class UpsertTodoComponent {
  private todoService = inject(TodosService);
  private dialogData = inject(MAT_DIALOG_DATA);

  descriptionControl = new FormControl(
    this.dialogData.current?.description ?? '',
    Validators.required
  );

  onSave() {
    const value = this.descriptionControl.value as string;

    switch (this.dialogData.action) {
      case 'add':
        this.todoService.add$$.next(value);
        break;
      case 'update':
        this.todoService.update$$.next({
          ...this.dialogData.current,
          description: value,
        });
        break;
      default:
        throw new Error('Please provide a legit action!');
    }
  }
}
