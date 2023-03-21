import { SnackBarService } from './../shared/snack-bar.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { messages } from '../shared/messages';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss'],
})
export class NewListComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private snackBar: SnackBarService
  ) {}

  newListName = new FormControl<string>('', [Validators.required]);

  Lists!: any;

  ngOnInit(): void {
    this.taskService
      .getLists()
      .subscribe((response) => (this.Lists = response));
  }

  addNewList() {
    if (this.newListName.value) {
      this.taskService
        .createList(this.newListName.value)
        .subscribe(() => this.snackBar.openOK(messages.NewListAdded));
    }
  }
}
