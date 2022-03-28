import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TodosHttpStore, TodosHttpState } from './todos-http.store';

@Injectable({ providedIn: 'root' })
export class TodosHttpQuery extends QueryEntity<TodosHttpState> {

  constructor(protected override store: TodosHttpStore) {
    super(store);
  }

}
