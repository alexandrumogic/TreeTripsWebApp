import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-route-details-dialog',
  templateUrl: './route-details-dialog.component.html',
  styleUrls: ['./route-details-dialog.component.css']
})
export class RouteDetailsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RouteDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
