import { Component, OnInit } from '@angular/core';
import { MapService } from '../../../../services/map.service';
import { UserService } from '../../../../services/user.service';

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

  constructor(private _mapService: MapService) { }

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
    window.alert("OK");
  }
}
