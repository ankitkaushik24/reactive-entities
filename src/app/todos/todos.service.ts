import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ITodo} from "./todos.model";
import { merge, shareReplay, startWith, Subject, switchMap, tap} from "rxjs";

@Injectable()
export class TodosService {
  // actions
  addTodo$$ = new Subject<{ payload: string; postRequest: () => void }>();
  updateTodo$$ = new Subject<ITodo>();
  deleteTodo$$ = new Subject<string>();

  // events
  private todoAdded$ = this.addTodo$$.pipe(
    switchMap(({ payload, postRequest}) => this.createTodo(payload).pipe(
      tap(() => postRequest())
    ))
  )

  private todoDeleted$ = this.deleteTodo$$.pipe(
    switchMap((id) => this.deleteTodo(id))
  )

  private todoUpdated$ = this.updateTodo$$.pipe(
    switchMap((todoToBeUpdated) => this.updateTodo(todoToBeUpdated))
  );


  private http = inject(HttpClient);

  constructor() { }

  // queries
  todos$ = merge(this.todoAdded$, this.todoUpdated$, this.todoDeleted$).pipe(
    startWith(null),
    switchMap((value) => this.fetchTodos()),
    shareReplay({bufferSize: 1, refCount: true})
  );// fn (updated, added, deleted, params$)

  // API calls
  private fetchTodos() {
    return this.http.get<ITodo[]>('todos')
  }
  private createTodo(description: string) {
    return this.http.post<ITodo[]>('todos', { description, completed: false });
  }

  private updateTodo(updatedTodo: ITodo) {
    return this.http.put(`todos/${updatedTodo._id}`, updatedTodo);
  }

  private deleteTodo(_id: string) {
    return this.http.delete(`todos/${_id}`);
  }
}
