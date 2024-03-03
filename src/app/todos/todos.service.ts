import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITodo } from './todos.model';
import { map, merge, scan, startWith, Subject, switchMap } from 'rxjs';

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

  onAdded = (todo: ITodo) => (todos: ITodo[]) => todos.concat(todo);

  onDeleted = (todo: ITodo) => (todos: ITodo[]) =>
    todos.filter((td) => td.id !== todo.id);

  onCompleted = (todo: ITodo) => (todos: ITodo[]) => {
    return todos.map((td) => {
      if (td.id === todo.id) {
        return { ...td, completed: todo.completed };
      }
      return td;
    });
  };

  onUpdated = (todo: ITodo) => (todos: ITodo[]) => {
    return todos.map((td) => {
      if (td.id === todo.id) {
        return { ...td, ...todo };
      }
      return td;
    });
  };

  todosAffected$ = merge(
    this.todoAdded$.pipe(map(this.onAdded)),
    this.todoDeleted$.pipe(map(this.onDeleted)),
    this.todoCompleted$.pipe(map(this.onCompleted)),
    this.todoUpdated$.pipe(map(this.onUpdated))
  );

  constructor() {}

  initialTodos$ = this.fetchTodos();

  todos$ = this.todosAffected$.pipe(
    startWith(null),
    switchMap(() => this.fetchTodos())
  );

  latestTodos$ = this.initialTodos$.pipe(
    switchMap((todos) =>
      this.todosAffected$.pipe(
        startWith((all) => all),
        scan((acc, callbackFn) => callbackFn(acc), todos)
      )
    )
  );

  private fetchTodos() {
    return this.http.get<ITodo[]>('todos');
  }

  private createTodo(description: string) {
    return this.http.post<ITodo>('todos', { description, completed: false });
  }

  private updateTodo(id: string, updatedTodo: ITodo) {
    return this.http.put<ITodo>(`todos/${id}`, updatedTodo);
  }

  private deleteTodo(id: string) {
    return this.http.delete<ITodo>(`todos/${id}`);
  }
}
