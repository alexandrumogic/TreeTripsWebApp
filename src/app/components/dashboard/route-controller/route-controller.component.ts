import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from '../../../services/map.service';
import { UserService } from '../../../services/user.service';
import 'rxjs/add/operator/first';

@Component({
  selector: 'route-controller',
  templateUrl: './route-controller.component.html',
  styleUrls: ['./route-controller.component.css']
})
export class RouteControllerComponent implements OnInit {

  isLinear = false;
  generateRouteFormGroup: FormGroup;
  categories: any[] = [];
  treesCounterToVisit = [];
  haltsCounterToVisit = [];
  treesMarkedToVisit;
  haltsOccurence = [];
  isUserAuthenticated: boolean;

  constructor(private _formBuilder: FormBuilder, private _mapService: MapService, private _userService: UserService) {

    this._mapService.markedToVisit.subscribe(data => {
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

    this._userService.checkIfUserIsAuthenticated().subscribe(value => {
      this.isUserAuthenticated = value;
    });

    this._mapService.getCategories().subscribe(data => {
      this.categories = Object.keys(data).map(function(key) {
         return data[key];
      });
    });

    this.generateRouteFormGroup = this._formBuilder.group({
      latStr: ['', Validators.required],
      lngStr: ['', Validators.required],
      latEnd: ['', Validators.required],
      lngEnd: ['', Validators.required],
      dtPick: ['',                    ]
    });

  }

  resetStartPoint() {
    this.generateRouteFormGroup.controls['latStr'].reset();
    this.generateRouteFormGroup.controls['lngStr'].reset();
  }

  resetEndPoint() {
    this.generateRouteFormGroup.controls['latEnd'].reset();
    this.generateRouteFormGroup.controls['lngEnd'].reset();
  }

  markStartPoint() {
    this._mapService.pointClickedOnMap.first().subscribe(data => {
       this.generateRouteFormGroup.controls['latStr'].setValue(data.coords.lat);
       this.generateRouteFormGroup.controls['lngStr'].setValue(data.coords.lng);
       this._mapService.setOrigin({lat: data.coords.lat, lng: data.coords.lng});
    })
  }

  markEndPoint() {
    this._mapService.pointClickedOnMap.first().subscribe(data => {
       this.generateRouteFormGroup.controls['latEnd'].setValue(data.coords.lat);
       this.generateRouteFormGroup.controls['lngEnd'].setValue(data.coords.lng);
       this._mapService.setDestination({lat: data.coords.lat, lng: data.coords.lng});
    })
  }

  generateRoute() {
    this._mapService.calculateRoute();
  }

}
