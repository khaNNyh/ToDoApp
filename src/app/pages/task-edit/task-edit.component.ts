import { SnackBarService } from './../shared/snack-bar.service';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { task } from 'src/app/models/task-model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],
})
export class TaskEditComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private taskService: TaskService,
    private snackBar: SnackBarService
  ) {}

  newTaskName = new FormControl<string>('', [Validators.required]);
  newTaskNote = new FormControl<string>('');
  newTaskDate = new FormControl<Date | undefined>(undefined);

  task!: any;
  currentParams!: Params;
  today: Date = new Date();

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.currentParams = params;
    });

    this.taskService
      .getTaskById(this.currentParams.listId, this.currentParams.taskId)
      .subscribe((response) => {
        //workaround casue of fake backend
        let responseTask: any;
        responseTask = response;
        this.task = responseTask[0];
        this.newTaskName.setValue(this.task.title);
        this.newTaskNote.setValue(this.task.note);
        this.newTaskDate.setValue(this.task.dueDate);
      });
  }

  editTask() {
    let finalTask: any = {};
    finalTask.title = this.newTaskName.value as string;
    finalTask.note = this.newTaskNote.value as string;
    finalTask.dueDate = this.newTaskDate.value as Date;

    this.taskService
      .patchTask(
        this.currentParams.listId,
        this.currentParams.taskId,
        finalTask
      )
      .subscribe(() => this.snackBar.openOK('Edit successful'));
  }
}
