import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';

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
    private route: ActivatedRoute
  ) {}

  newListName = new FormControl('', [Validators.required]);

  currentParams!: Params;
  Lists!: any;

  ngOnInit(): void {
    this.route.params.subscribe((params) => (this.currentParams = params));

    this.taskService
      .getLists()
      .subscribe((response: any) => (this.Lists = response));
  }

  // EditList() {
  //   this.taskService.patchList(this.newListName.value).subscribe();
  // }
}
