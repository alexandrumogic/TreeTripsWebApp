import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { MapService } from '../../../../services/map.service';

@Component({
  selector: 'routes-saved',
  templateUrl: './routes-saved.component.html',
  styleUrls: ['./routes-saved.component.css']
})
export class RoutesSavedComponent implements OnInit {

  private isUserAuthenticated: boolean;
  private userRoutes = [];
  private displayedColumns = ['date', 'distance', 'trees', 'halts', 'action'];
  private dataSource = [];

  constructor(private _userService: UserService, private _mapService: MapService) { }

  ngOnInit() {
    this._userService.checkIfUserIsAuthenticated().subscribe(value => {
      this.isUserAuthenticated = value;
    });

    this._userService.getUserRoutes().subscribe(value => {
      var tempArr = [];
      Object.keys(value).map(function(key) {
        var route = { key: key, value: value[key] };
        tempArr.push(route);
      });

      this.userRoutes = tempArr;
      this.dataSource = this.userRoutes;

      console.log(this.userRoutes);
    })
  }

  private showRoute(route) {
    this._mapService.setOrigin(route.value.origin);
    this._mapService.setDestination(route.value.destination);
    this._mapService.setWaypoints(route.value.waypoints);
    this._mapService.calculateRoute();
  }

  private deleteRoute(route) {
    this._userService.deleteUserRoute(route.key);
  }

}
