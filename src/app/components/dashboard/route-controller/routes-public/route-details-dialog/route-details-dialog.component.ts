import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-route-details-dialog',
  templateUrl: './route-details-dialog.component.html',
  styleUrls: ['./route-details-dialog.component.css']
})
export class RouteDetailsDialogComponent implements OnInit {

  private joined: boolean;
  private response;

  constructor(private _userService: UserService, public dialogRef: MatDialogRef<RouteDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.joined = false;
  }

  private joinTheRoute(key): void {
  	this._userService.joinPublicRoute(key).subscribe(result => {
          this.joined = true;
          this.response = result.text;
      });
  }

}
