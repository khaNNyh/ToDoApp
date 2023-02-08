import { WebRequestService } from './web-request.service';
import { Injectable } from '@angular/core';
import { task } from '../models/task-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private webReqServ: WebRequestService) {}

  getLists() {
    return this.webReqServ.get('lists');
  }

  createList(title: string) {
    return this.webReqServ.post('lists', { title });
  }

  patchList(idList: string, editedList: Object) {
    return this.webReqServ.patch('lists/' + idList, editedList);
  }

  deleteList(idList: string) {
    return this.webReqServ.delete('lists/' + idList);
  }

  getTasks(idList: string) {
    return this.webReqServ.get('lists/' + idList + '/tasks');
  }

  getTaskById(idList: string, idTask: string) {
    return this.webReqServ.get('lists/' + idList + '/tasks/' + idTask);
  }

  createTask(idList: string, title: string) {
    return this.webReqServ.post('lists/' + idList + '/tasks', { title });
  }

  patchTask(idList: string, idTask: string, editedTask: task) {
    return this.webReqServ.patch(
      'lists/' + idList + '/tasks/' + idTask,
      editedTask
    );
  }

  deleteTask(idList: string, idTask: string) {
    return this.webReqServ.delete('lists/' + idList + '/tasks/' + idTask);
  }

  deleteTasks(idList: string) {
    return this.webReqServ.delete('lists/' + idList + '/tasks');
  }
}
