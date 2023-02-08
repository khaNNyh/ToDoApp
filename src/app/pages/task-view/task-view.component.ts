import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { list, task } from 'src/app/models/task-model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit, OnChanges {
  currentTaskList = '';
  currentParams!: Params;
  dataFromTasks!: any;
  dataFromLists!: any;

  deleteModeIsOn = false;
  deleteModeIsOnFor!: number;

  constructor(
    private http: HttpClient,
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getTaskLists();

    this.route.params.subscribe((params: Params) => {
      this.currentParams = params;
      if (params.listId) {
        this.taskService
          .getTasks(params.listId)
          .subscribe((res: any) => (this.dataFromTasks = res));
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getTaskLists();
  }

  getTaskLists() {
    this.taskService
      .getLists()
      .subscribe((res: any) => (this.dataFromLists = res));
  }

  getAllTasksByListId(idList: string) {
    this.currentTaskList = idList;
    this.taskService
      .getTasks(idList)
      .subscribe((res: any) => (this.dataFromTasks = res));
  }

  changeListState(list: list) {
    const currentListId = this.currentParams.listId;
    if (list.done === false) {
      list.done = true;
      this.taskService.patchList(currentListId, list).subscribe();
      // if (task.subtasks?.length !== 0) {
      //   task.subtasks?.forEach((subtask) => (subtask.done = true));
      // }
    } else {
      list.done = false;
      this.taskService.patchList(currentListId, list).subscribe();
      // if (task.subtasks) {
      //   task.subtasks?.forEach((subtask) => (subtask.done = false));
      // }
    }
  }

  setCurrentTaskList(i: string) {
    this.currentTaskList = i;
  }

  changeTaskState(task: task) {
    const currentListId = this.currentParams.listId;
    if (task.done === false) {
      task.done = true;
      console.log(this.dataFromTasks);
      this.taskService.patchTask(currentListId, task._id, task).subscribe();
      // if (task.subtasks?.length !== 0) {
      //   task.subtasks?.forEach((subtask) => (subtask.done = true));
      // }
    } else {
      task.done = false;
      this.taskService.patchTask(currentListId, task._id, task).subscribe();
      // if (task.subtasks) {
      //   task.subtasks?.forEach((subtask) => (subtask.done = false));
      // }
    }
  }

  // changeSubtaskState(subtask: task) {
  //   if (subtask.done === taskState.NOTDONE) {
  //     subtask.state = taskState.DONE;
  //   } else {
  //     subtask.state = taskState.NOTDONE;
  //   }
  // }

  deleteListById(idList: string) {
    this.taskService.deleteList(idList).subscribe(() => {
      this.taskService.deleteTasks(idList).subscribe({
        next: () => {
          this.getTaskLists(), (this.dataFromTasks = []);
        },
        error: (err) => {
          this.getTaskLists(), (this.dataFromTasks = []);
        },
      });
    });
  }

  showData() {
    console.log(this.dataFromTasks);
  }

  addNewTask() {
    this.taskService
      .createTask(this.currentParams.listId, 'New task')
      .subscribe(() => this.getAllTasksByListId(this.currentParams.listId));
  }

  deleteTask(taskId: string) {
    const currentListId = this.currentParams.listId;
    this.taskService
      .deleteTask(currentListId, taskId)
      .subscribe(() => this.getAllTasksByListId(currentListId));
  }

  deleteSubTask(taskId: number, subId: number) {
    this.http
      .delete(
        'http://localhost:3000/tasks/' +
          String(taskId) +
          '/subtasks/' +
          String(subId)
      )
      .subscribe();
  }
}
