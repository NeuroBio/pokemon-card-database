import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {

  constructor(private snackbar: MatSnackBar) { }

  send(message: string): void {
    this.snackbar.open(message, undefined, { duration: 1000 });
  }
}
