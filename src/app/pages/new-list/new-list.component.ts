import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss'],
})
export class NewListComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private _formBuilder: UntypedFormBuilder,
    private taskService: TaskService
  ) {}

  newListName = new UntypedFormControl('', [Validators.required]);

  Lists!: any;

  ngOnInit(): void {
    this.taskService
      .getLists()
      .subscribe((response) => (this.Lists = response));
  }

  addNewList() {
    this.taskService.createList(this.newListName.value).subscribe();
  }
}
