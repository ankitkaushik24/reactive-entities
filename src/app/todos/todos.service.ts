import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITodo } from './todos.model';
import { merge, startWith, Subject, switchMap } from 'rxjs';

@Injectable()
export class TodosService {
  // actions
  add$$ = new Subject<string>();
  delete$$ = new Subject<ITodo>();
  update$$ = new Subject<ITodo>();
  markAsComplete$$ = new Subject<{ todo: ITodo; isCompleted: boolean }>();

  private http = inject(HttpClient);

  // events
  todoAdded$ = this.add$$.pipe(
    switchMap((description) => this.createTodo(description))
  );

  todoDeleted$ = this.delete$$.pipe(
    switchMap((todo) => this.deleteTodo(todo.id))
  );

  todoCompleted$ = this.markAsComplete$$.pipe(
    switchMap(({ todo, isCompleted }) =>
      this.updateTodo(todo.id, { ...todo, completed: isCompleted })
    )
  );

  todoUpdated$ = this.update$$.pipe(
    switchMap((todo) => this.updateTodo(todo.id, todo))
  );

  todosAffected$ = merge(
    this.todoAdded$,
    this.todoDeleted$,
    this.todoCompleted$,
    this.todoUpdated$
  );

  constructor() {}

  todos$ = this.todosAffected$.pipe(
    startWith(null),
    switchMap(() => this.fetchTodos())
  );

  private fetchTodos() {
    return this.http.get<ITodo[]>('todos');
  }

  private createTodo(description: string) {
    return this.http.post<ITodo[]>('todos', { description, completed: false });
  }

  private updateTodo(id: string, updatedTodo: ITodo) {
    return this.http.put(`todos/${id}`, updatedTodo);
  }

  private deleteTodo(id: string) {
    return this.http.delete(`todos/${id}`);
  }
}
