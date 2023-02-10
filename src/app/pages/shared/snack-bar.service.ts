import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { config } from 'process';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  openOK(message: string) {
    this.snackBar.open(message, '👍', { duration: 3000 });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}
