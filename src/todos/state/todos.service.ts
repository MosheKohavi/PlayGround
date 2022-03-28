import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {Todo} from './todo.model';
import {TodosStore} from './todos.store';
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({ providedIn: 'root' })
export class TodosService {

  constructor(private todosStore: TodosStore, private http: HttpClient, firestore: AngularFirestore) {
    firestore.collection<Date>('some').valueChanges({idField: 'id'})
    firestore.collection<Date>('some').snapshotChanges(['added', 'removed'])
  }


  get() {
    return this.http.get<Todo[]>('https://api.com').pipe(tap(entities => {
      this.todosStore.set(entities);
    }));
  }

  add(todo: Todo) {
    this.todosStore.add(todo);
  }

  update(id: string, todo: Partial<Todo>) {
    this.todosStore.update(id, todo);
  }

  remove(id: string) {
    this.todosStore.remove(id);
  }

}
