import { Component, OnInit } from '@angular/core';
import { MapService } from '../../../../services/map.service';
import { UserService } from '../../../../services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RouteDetailsDialogComponent } from './route-details-dialog/route-details-dialog.component';

@Component({
  selector: 'routes-public',
  templateUrl: './routes-public.component.html',
  styleUrls: ['./routes-public.component.css']
})
export class RoutesPublicComponent implements OnInit {

  isUserAuthenticated: boolean;
  publicRoutes = [];
  displayedColumns = ['date', 'distance', 'trees', 'halts', 'action'];
  dataSource = [];

  constructor(private _mapService: MapService, public dialog: MatDialog) { }

  ngOnInit() {
    this._mapService.getPublicRoutes().subscribe(value => {

      var tempArr = [];
      Object.keys(value).map(function(key) {
        var route = { key: key, value: value[key] };
        tempArr.push(route);
      });

      this.publicRoutes = tempArr;
      this.dataSource = this.publicRoutes;

    });
  }

  showRoute(element) {
    this._mapService.setOrigin(element.value.origin);
    this._mapService.setDestination(element.value.destination);
    this._mapService.setWaypoints(element.value.waypoints);
    this._mapService.calculateRoute();
  }

  showDetails(element) {
    let participantsArray = Object.keys(element.value.participants).map(function(key) {
      return element.value.participants[key];
    });
    
    let dialogRef = this.dialog.open(RouteDetailsDialogComponent, {
      width: '300px',
      data: { 
        data: element.value.date,
        info: element.value.info,
        organizer: element.value.organizer,
        participants: participantsArray,
        key: element.key
       }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
