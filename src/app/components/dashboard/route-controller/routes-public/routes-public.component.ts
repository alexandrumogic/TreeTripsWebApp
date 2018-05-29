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

  private isUserAuthenticated: boolean;
  private publicRoutes = [];
  private displayedColumns = ['date', 'distance', 'trees', 'halts', 'action'];
  private dataSource = [];

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

  private showRoute(route): void {
    this._mapService.setOrigin(route.value.origin);
    this._mapService.setDestination(route.value.destination);
    this._mapService.setWaypoints(route.value.waypoints);
    this._mapService.calculateRoute();
  }

  private showDetails(route): void {
    let participantsArray = Object.keys(route.value.participants).map(function(key) {
      return route.value.participants[key];
    });
    
    let dialogRef = this.dialog.open(RouteDetailsDialogComponent, {
      width: '300px',
      data: { 
        data: route.value.date,
        info: route.value.info,
        organizer: route.value.organizer,
        participants: participantsArray,
        key: route.key
       }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
