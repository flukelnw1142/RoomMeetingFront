import { Component,Inject } from '@angular/core';
//import { CustomizerSettingsService } from './customizer-settings.service';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbarModule } from 'ngx-scrollbar';
import Swal from 'sweetalert2';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogData {
    animal: string;
    name: string;
}
@Component({
    selector: 'app-add-new.',
    standalone: true,
    imports: [RouterLink,MatCardModule, NgClass,MatDatepickerModule, MatDividerModule, MatIconModule, MatButtonModule,MatNativeDateModule, NgScrollbarModule],
    templateUrl: './add-new.component.html',
    styleUrl: './add-new.component.scss'
})
export class AddNewComponent {

// Basic Dialog
animal: string;
name: string;

constructor(
    public dialog: MatDialog
) {}

openDialog(): void {
    const dialogRef = this.dialog.open(AddNewDialog, {
        width: '500px', // กำหนดความกว้าง
        height: '400px', // กำหนดความสูง
        data: {name: this.name, animal: this.animal},
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.animal = result;
    });
}


}

@Component({
    selector: 'add-new-dialog',
    templateUrl: 'add-new-dialog.component.html',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatDatepickerModule,
        MatButtonModule,
        MatDialogTitle,MatCardModule,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,MatNativeDateModule,
        NgxMaterialTimepickerModule
    ]
})

export class AddNewDialog {
  
    selectedDate!: Date; // วันที่ที่เลือก
    fromTime: string = ''; // เวลาเริ่มต้น
    toTime: string = ''; // เวลาสิ้นสุด
    classApplied = false;
    constructor(
        public dialogRef: MatDialogRef<AddNewDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}

    closeDialog(): void {
        this.dialogRef.close();
    }
    getDateTimeRange(): any {
        return {
          date: this.selectedDate,
          from: this.fromTime,
          to: this.toTime
        };
      }
      toggleClass() {
        this.classApplied = !this.classApplied;
    }
}