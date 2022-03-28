import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TodosHttp } from './todos-http.model';

export interface TodosHttpState extends EntityState<TodosHttp> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'todosHttp' })
export class TodosHttpStore extends EntityStore<TodosHttpState> {

  constructor() {
    super();
  }

}
