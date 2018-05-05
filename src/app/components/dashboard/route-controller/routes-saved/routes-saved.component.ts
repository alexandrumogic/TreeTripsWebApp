import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { MapService } from '../../../../services/map.service';

@Component({
  selector: 'routes-saved',
  templateUrl: './routes-saved.component.html',
  styleUrls: ['./routes-saved.component.css']
})
export class RoutesSavedComponent implements OnInit {

  isUserAuthenticated: boolean;
  userRoutes = [];
  displayedColumns = ['date', 'distance', 'trees', 'halts', 'action'];
  dataSource = [];

  constructor(private _userService: UserService, private _mapService: MapService) { }

  ngOnInit() {
    this._userService.checkIfUserIsAuthenticated().subscribe(value => {
      this.isUserAuthenticated = value;
    });

    this._userService.getUserRoutes().subscribe(value => {
      console.log(value);
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

  showRoute(element) {
    this._mapService.setOrigin(element.value.origin);
    this._mapService.setDestination(element.value.destination);
    this._mapService.setWaypoints(element.value.waypoints);
    this._mapService.calculateRoute();
  }

  deleteRoute(element) {
    console.log("deleteRoute " + element.key);
    this._userService.deleteUserRoute(element.key);
  }

}
