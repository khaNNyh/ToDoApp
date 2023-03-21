import { SnackBarService } from './../shared/snack-bar.service';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { messages } from '../shared/messages';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss'],
})
export class EditListComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private snackBar: SnackBarService
  ) {}

  newListName = new FormControl<string>('', [Validators.required]);
  colorCtr = new FormControl<string>('');

  currentParams!: Params;
  list!: any;

  ngOnInit(): void {
    this.route.params.subscribe((params) => (this.currentParams = params));

    this.taskService
      .getList(this.currentParams.listId)
      .subscribe((response: any) => {
        (this.list = response),
          this.newListName.setValue(this.list.title),
          this.colorCtr.setValue(this.list.color ? this.list.color : '#ffffff');
      });
  }

  editList() {
    this.taskService
      .patchList(this.currentParams.listId, {
        title: this.newListName.value,
        color: this.colorCtr.value,
      })
      .subscribe(() => this.snackBar.openOK(messages.EditSuccessful));
  }
}
