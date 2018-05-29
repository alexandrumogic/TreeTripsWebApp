import { Component, OnInit }                               from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService }                                      from '../../../services/map.service';
import { UserService }                                     from '../../../services/user.service';
import { Route }                                           from '../../../classes/route';
import { RoutePublic }                                     from '../../../classes/route-public';
import { MapCoordonates }                                  from '../../../classes/map-coordonates';
import { RoutesSavedComponent }                            from './routes-saved/routes-saved.component';
import { RoutesPublicComponent }                           from './routes-public/routes-public.component';

import 'rxjs/add/operator/first';

@Component({
  selector: 'route-controller',
  templateUrl: './route-controller.component.html',
  styleUrls: ['./route-controller.component.css']
})
export class RouteControllerComponent implements OnInit {

  private routeFormGroup: FormGroup;
  private categories: any[] = [];
  private treesCounterToVisit = [];
  private haltsCounterToVisit = [];
  private treesMarkedToVisit;
  private haltsOccurence = [];
  private isUserAuthenticated: boolean;
  private distance;
  private makeRoutePublic: boolean = false;
  private userName;

  constructor(private _formBuilder: FormBuilder, private _mapService: MapService, private _userService: UserService) {

    this._mapService.getPointsMarkedToVisit().subscribe(data => {
      this.treesMarkedToVisit = Object.keys(data).map(function(key) {
            return data[key];
      });

      var categoryOccurence = Object.keys(data).map(function(key) {
            console.log(data[key].hasOwnProperty('category'));
            return data[key].category;
      });

      this.haltsOccurence = [];

      this.haltsOccurence = Object.keys(data).map(function(key) {
            if (!data[key].hasOwnProperty('category'))
            {
              return data[key];
            }
      });

      console.log("Halt occurence:");
      console.log(this.haltsOccurence);

      var countsCategoryOccurence = {};
      var countHaltsOccurence = {};
      this.treesCounterToVisit = [];
      this.haltsCounterToVisit = [];

      // categories
      for (var i = 0; i< categoryOccurence.length; i++)
      {
        var num = categoryOccurence[i];
        countsCategoryOccurence[num] = countsCategoryOccurence[num] ? countsCategoryOccurence[num] + 1 : 1;
      }

      for (var i = 0; i < this.categories.length; i++)
      {
        var result = countsCategoryOccurence[this.categories[i]];
        if (typeof result !== "undefined")
        {
          this.treesCounterToVisit.push([this.categories[i], result]);
        }
      }

      // halts
      for (var i = 0; i< this.haltsOccurence.length; i++)
      {
        var result = this.haltsOccurence[i];
        if (typeof result !== "undefined")
        {
          this.haltsCounterToVisit.push(this.haltsOccurence[i]);
        }
      }

    });
  }

  ngOnInit() {

    this._userService.getUserName().subscribe(value => {
      this.userName = value;
    })

    this._mapService.getDistance().subscribe(distance => {
      this.distance = distance;
    });

    this._userService.checkIfUserIsAuthenticated().subscribe(value => {
      this.isUserAuthenticated = value;
    });

    this._mapService.getCategories().subscribe(data => {
      this.categories = Object.keys(data).map(function(key) {
         return data[key];
      });
    });

    this.routeFormGroup = this._formBuilder.group({
      latStr: ['', Validators.required],
      lngStr: ['', Validators.required],
      latEnd: ['', Validators.required],
      lngEnd: ['', Validators.required],
      dtPick: ['',                    ],
      infoRm: ['',                    ]
    });

  }

  private resetStartPoint(): void {
    this.routeFormGroup.controls['latStr'].reset();
    this.routeFormGroup.controls['lngStr'].reset();
  }

  private resetEndPoint(): void {
    this.routeFormGroup.controls['latEnd'].reset();
    this.routeFormGroup.controls['lngEnd'].reset();
  }

  private markStartPoint(): void {
    this._mapService.pointClickedOnMap.first().subscribe(data => {
       this.routeFormGroup.controls['latStr'].setValue(data.coords.lat);
       this.routeFormGroup.controls['lngStr'].setValue(data.coords.lng);
       this._mapService.setOrigin({lat: data.coords.lat, lng: data.coords.lng});
    })
  }

  private markEndPoint(): void {
    this._mapService.pointClickedOnMap.first().subscribe(data => {
       this.routeFormGroup.controls['latEnd'].setValue(data.coords.lat);
       this.routeFormGroup.controls['lngEnd'].setValue(data.coords.lng);
       this._mapService.setDestination({lat: data.coords.lat, lng: data.coords.lng});
    })
  }

  private generateRoute(): void {
    this._mapService.calculateRoute();
  }

  private saveRoute(): void {

    let origin: MapCoordonates = new MapCoordonates(this.routeFormGroup.controls['latStr'].value, this.routeFormGroup.controls['lngStr'].value);
    let destin = new MapCoordonates(this.routeFormGroup.controls['latEnd'].value, this.routeFormGroup.controls['lngEnd'].value);
    let waypoints = this.transformPointsToCoords();
    let currentDate = new Date();

    let dateTime = currentDate.getDate() + "/" + (currentDate.getMonth()+1) + "/" + currentDate.getFullYear() + " "
                  + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

    let route = new Route(origin, destin, waypoints, dateTime, this.treesCounterToVisit.length, this.haltsCounterToVisit.length, this.distance);

    if (this.makeRoutePublic) {
      var info = this.routeFormGroup.controls['infoRm'].value;
      var organizer = this.userName;
      var participants = [];

      let publicRoute = new RoutePublic(origin, destin, waypoints, dateTime, this.treesCounterToVisit.length,
        this.haltsCounterToVisit.length, this.distance, info, organizer, participants);

      this._userService.makeRoutePublic(publicRoute);
    }

    this._userService.saveUserRoute(route);
  }

  private transformPointsToCoords() {
    let arr = [];

    this.treesMarkedToVisit.forEach(function(data) {
      arr.push(new MapCoordonates(data.coords.lat, data.coords.lng));
    })
    return arr;
  }

}
