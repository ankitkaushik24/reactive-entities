import {TestBed} from '@angular/core/testing';

import {TodosService} from './todos.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ITodo} from "./todos.model";
import {take, toArray} from "rxjs";
import createSpy = jasmine.createSpy;

describe('TodosService', () => {
  let service: TodosService;
  let httpTestController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodosService]
    });
    service = TestBed.inject(TodosService);
    httpTestController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve existing todos', () => {

    service.todos$.subscribe(todos => {
      expect(todos).toEqual([]);
    })

    const req = httpTestController.expectOne('todos');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should delete a todo', (done) => {
    const idToBeDeleted = 'random_id';
    const responses: ITodo[][] = [[{_id: 'vid', completed: false, description: 'todo-1'}], []];

    service.todos$.pipe(take(2), toArray()).subscribe((collection) => {
      expect(collection).toEqual(responses);
      done();
    }, done.fail);

    const getReq = httpTestController.expectOne('todos');
    expect(getReq.request.method).toBe('GET');
    getReq.flush(responses[0]);

    service.deleteTodo$$.next(idToBeDeleted);

    const deleteReq = httpTestController.expectOne(`todos/${idToBeDeleted}`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({});

    const getReq2 = httpTestController.expectOne('todos');
    expect(getReq2.request.method).toBe('GET');
    getReq2.flush(responses[1]);

  });

  it('should add a todo', (done) => {
    const itemDescription = 'random_description';
    const responses: ITodo[][] = [[{_id: 'vid', completed: false, description: 'todo-1'}], []];
    const postRequestSpy = createSpy('postRequest', () => {
    });

    service.todos$.pipe(take(2), toArray()).subscribe({
      next: (collection) => {
        expect(collection).toEqual(responses);
        expect(postRequestSpy).toHaveBeenCalled();
        done();
      },
      error: done.fail
    });

    const getReq = httpTestController.expectOne('todos');
    expect(getReq.request.method).toBe('GET');
    getReq.flush(responses[0]);

    service.addTodo$$.next({payload: itemDescription, postRequest: postRequestSpy});

    const addReq = httpTestController.expectOne(`todos`);
    expect(addReq.request.method).toBe('POST');
    addReq.flush(null);

    const getReq2 = httpTestController.expectOne('todos');
    expect(getReq2.request.method).toBe('GET');
    getReq2.flush(responses[1]);

  });

  it('should add a todo', (done) => {
    const itemDescription = 'random_description';
    const responses: ITodo[][] = [[{_id: 'vid', completed: false, description: 'todo-1'}], []];
    const todoTobeUpdated = {_id: 'update_id', description: 'todo desc', completed: true};

    service.todos$.pipe(take(2), toArray()).subscribe({
      next: (collection) => {
        expect(collection).toEqual(responses);
        done();
      },
      error: done.fail
    });

    const getReq = httpTestController.expectOne('todos');
    expect(getReq.request.method).toBe('GET');
    getReq.flush(responses[0]);

    service.updateTodo$$.next(todoTobeUpdated);

    const updateReq = httpTestController.expectOne(
      (req) => req.url === `todos/${todoTobeUpdated._id}` && req.method === 'PUT'
    );
    updateReq.flush(null);

    const getReq2 = httpTestController.expectOne('todos');
    expect(getReq2.request.method).toBe('GET');
    getReq2.flush(responses[1]);
  });


});
