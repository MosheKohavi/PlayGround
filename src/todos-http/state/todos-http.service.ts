import { Injectable } from '@angular/core';
import { NgEntityService } from '@datorama/akita-ng-entity-service';
import { TodosHttpStore, TodosHttpState } from './todos-http.store';

@Injectable({ providedIn: 'root' })
export class TodosHttpService extends NgEntityService<TodosHttpState> {

  constructor(protected override store: TodosHttpStore) {
    super(store);
  }

}
