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
    private _formBuilder: UntypedFormBuilder,
    private taskService: TaskService
  ) {}

  newTaskName = new UntypedFormControl('', [Validators.required]);
  newTaskNote = new UntypedFormControl('');
  newTaskDate = new UntypedFormControl('');

  task!: any;
  currentParams!: Params;

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
      });
  }

  editTask() {
    this.taskService.createList(this.newTaskName.value).subscribe();
  }
}
