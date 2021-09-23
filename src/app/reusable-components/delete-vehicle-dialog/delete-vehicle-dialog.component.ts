import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Car } from 'src/app/models/car.model';

export interface DialogData {
  vehicle: Car;
}

@Component({
  selector: 'app-delete-vehicle-dialog',
  templateUrl: './delete-vehicle-dialog.component.html',
  styleUrls: ['./delete-vehicle-dialog.component.scss']
})
export class DeleteVehicleDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    console.log('data: ', this.data);
  }

}
