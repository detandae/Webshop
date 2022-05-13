
import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  question: string;
  title: string;
}

@Component({
  selector: 'app-question-dialog-window',
  templateUrl: './question-dialog-window.component.html',
  styleUrls: ['./question-dialog-window.component.css']
})
export class QuestionDialogWindowComponent{

  question:string;
  title:string;

  
  constructor(
    public dialogRef: MatDialogRef<QuestionDialogWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.question=data.question;
      this.title=data.title;
    }

    cancel() {
      // closing itself and sending data to parent component
      this.dialogRef.close({ data: 'cancel' })
    }
  
    confirm() {
      // closing itself and sending data to parent component
      this.dialogRef.close({ data: 'confirm' })
    }

}
