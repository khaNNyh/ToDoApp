import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss'],
})
export class NewListComponent implements OnInit {
  constructor(private http: HttpClient, private _formBuilder: FormBuilder) {}

  newListName = new FormControl('', [Validators.required]);

  Lists!: any;

  ngOnInit(): void {
    this.http
      .get('http://localhost:3000/lists')
      .subscribe((response) => (this.Lists = response));
  }

  addNewList() {
    const newListData = {
      id: this.Lists.length + 1,
      name: this.newListName.value,
    };
    this.http.post('http://localhost:3000/lists', newListData).subscribe();
  }
}
