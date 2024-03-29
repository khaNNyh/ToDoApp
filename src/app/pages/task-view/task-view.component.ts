import { SnackBarService } from './../shared/snack-bar.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ChangeDetectorRef,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewChecked,
} from '@angular/core';
import { list, task } from 'src/app/models/task-model';
import { TaskService } from 'src/app/services/task.service';
import { messages } from '../shared/messages';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit, OnChanges, AfterViewChecked {
  currentTaskList = '';
  currentParams!: Params;
  dataFromTasks!: any;
  dataFromLists!: any;

  deleteModeIsOn = false;
  deleteModeIsOnFor!: number;

  todaysDate = new Date();

  localStorage = localStorage;

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
    private _route: Router,
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

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  logoutMe() {
    this.localStorage.removeItem('x-access-token');
    this.localStorage.removeItem('x-refresh-token');
    this._route.navigate(['/login']);
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
    } else {
      list.done = false;
      this.taskService.patchList(currentListId, list).subscribe();
    }
  }

  setCurrentTaskList(i: string) {
    this.currentTaskList = i;
  }

  changeTaskState(task: task) {
    const currentListId = this.currentParams.listId;
    if (task.done === false) {
      task.done = true;
      this.taskService.patchTask(currentListId, task._id, task).subscribe();
    } else {
      task.done = false;
      this.taskService.patchTask(currentListId, task._id, task).subscribe();
    }
  }

  deleteListById(idList: string) {
    this.taskService.deleteList(idList).subscribe(() => {
      this.snackBar.openOK(messages.DeletionSuccessful);
      this.getTaskLists(), (this.dataFromTasks = []);
    });
  }

  showData() {
    console.log(this.dataFromTasks);
  }

  addNewTask() {
    this.taskService
      .createTask(this.currentParams.listId, messages.NewTask)
      .subscribe(() => {
        this.getAllTasksByListId(this.currentParams.listId),
          this.snackBar.openOK(messages.NewTaskAdded);
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
    const remaining = tempDays.getDate() - this.todaysDate.getDate();
    const remDays = remaining as number;
    switch (true) {
      case remDays <= 1:
        return remind1;
      case remDays <= 6:
        return remind2;
      default:
        return classic;
    }
  }
}
