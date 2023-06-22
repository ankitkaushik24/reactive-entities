import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ITodo} from "./todos.model";

@Injectable()
export class TodosService {
  private http = inject(HttpClient);

  constructor() { }

  todos$ = this.http.get<ITodo[]>('todos');

  private createTodo(description: string) {
    return this.http.post<ITodo[]>('todos', { description, completed: false });
  }

  private updateTodo(_id: string, updatedTodo: ITodo) {
    return this.http.put(`todos/${_id}`, updatedTodo);
  }

  private deleteTodo(_id: string) {
    return this.http.delete(`todos/${_id}`);
  }
}
