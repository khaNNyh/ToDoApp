import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { task, taskState } from 'src/app/models/task-model';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit, AfterViewInit {
  currentTaskList = 1;
  dataFromTasks!: any;
  dataFromLists!: any;

  deleteModeIsOn = false;
  deleteModeIsOnFor!: number;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getTaskLists();
    this.getAllTasksByListId(this.currentTaskList);
  }

  ngAfterViewInit(): void {}

  getTaskLists() {
    this.http
      .get('http://localhost:3000/lists')
      .subscribe((res: any) => (this.dataFromLists = res));
  }

  getAllTasksByListId(idList: number) {
    this.currentTaskList = idList;
    this.http
      .get('http://localhost:3000/tasks/' + this.currentTaskList)
      .subscribe((res: any) => (this.dataFromTasks = res));
  }

  setCurrentTaskList(i: number) {
    this.currentTaskList = i;
  }

  changeTaskState(task: task) {
    if (task.state === taskState.NOTDONE) {
      task.state = taskState.DONE;
      if (task.subtasks?.length !== 0) {
        task.subtasks?.forEach((subtask) => (subtask.state = taskState.DONE));
      }
    } else {
      task.state = taskState.NOTDONE;
      if (task.subtasks) {
        task.subtasks?.forEach(
          (subtask) => (subtask.state = taskState.NOTDONE)
        );
      }
    }
  }

  changeSubtaskState(subtask: task) {
    if (subtask.state === taskState.NOTDONE) {
      subtask.state = taskState.DONE;
    } else {
      subtask.state = taskState.NOTDONE;
    }
  }

  deleteListById(id: number) {
    this.http
      .delete('http://localhost:3000/lists/' + String(id))
      .subscribe(() =>
        this.http.delete('http://localhost:3000/tasks/' + String(id))
      );
  }

  showData() {
    console.log(this.dataFromTasks);
  }
}
