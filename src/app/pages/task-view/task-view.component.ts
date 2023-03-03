import { SnackBarService } from './../shared/snack-bar.service';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { list, task } from 'src/app/models/task-model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit, OnChanges, AfterViewInit {
  currentTaskList = '';
  currentParams!: Params;
  dataFromTasks!: any;
  dataFromLists!: any;

  deleteModeIsOn = false;
  deleteModeIsOnFor!: number;

  todaysDate = new Date();

  @ViewChildren('container') container!: QueryList<ElementRef>;
  @ViewChildren('text') text!: QueryList<ElementRef>;

  isTextTooLong(id: string) {
    return (
      (
        this.text?.toArray().find((text) => text.nativeElement.id === id)
          ?.nativeElement as HTMLElement
      )?.offsetWidth >
      (
        this.container
          ?.toArray()
          .find((container) => container.nativeElement.id === id)
          ?.nativeElement as HTMLElement
      )?.offsetWidth
    );
  }

  constructor(
    private http: HttpClient,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private snackBar: SnackBarService,
    private cdr: ChangeDetectorRef
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

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
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
      this.snackBar.openOK('Deletion successful');
      // this.taskService.deleteTasks(idList).subscribe({
      this.getTaskLists(), (this.dataFromTasks = []);
      // });
    });
  }

  showData() {
    console.log(this.dataFromTasks);
  }

  addNewTask() {
    this.taskService
      .createTask(this.currentParams.listId, 'New task')
      .subscribe(() => {
        this.getAllTasksByListId(this.currentParams.listId),
          this.snackBar.openOK('New task has been added!');
      });
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

  checkDate(taskDate: any) {
    const classic = {
      'font-size': 'smaller',
      opacity: '50%',
    };
    const remind1 = {
      'font-size': 'smaller',
      opacity: '50%',
      color: 'rgb(221, 57, 28)',
    };
    const remind2 = {
      'font-size': 'smaller',
      opacity: '50%',
      color: 'rgb(50, 110, 0)',
    };

    const tempDays = new Date(taskDate);
    const remaining = this.todaysDate.getDate() - tempDays.getDate();
    // const remDays = (remaining / (1000 * 3600 * 24)) as number;
    const remDays = remaining as number;
    if (remDays <= 1) {
      return remind1;
    } else if (remDays <= 6) {
      return remind2;
    } else return classic;
  }
}
