import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from '../../../services/map.service';
import 'rxjs/add/operator/first';

@Component({
  selector: 'route-controller',
  templateUrl: './route-controller.component.html',
  styleUrls: ['./route-controller.component.css']
})
export class RouteControllerComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  categories: any[] = [];
  treesCounterToVisit = [];
  treesMarkedToVisit;

  constructor(private _formBuilder: FormBuilder, private _mapService: MapService) {

    this._mapService.getCategories().subscribe(data => {
      this.categories = Object.keys(data).map(function(key) {
         return data[key];
      });
    });

    this._mapService.markedToVisit.subscribe(data => {
      this.treesMarkedToVisit = Object.keys(data).map(function(key) {
            return data[key];
      });

      var categoryOccurence = Object.keys(data).map(function(key) {
            console.log(data[key].hasOwnProperty('category'));
            return data[key].category;
      });

      var countsCategoryOccurence = {};
      this.treesCounterToVisit = [];

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
    });
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      latitudine: ['', Validators.required],
      longitudine: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      latitudine: ['', Validators.required],
      longitudine: ['', Validators.required]
    });
  }

  resetStartPoint() {
    this.firstFormGroup.reset();
  }

  resetEndPoint() {
    this.secondFormGroup.reset();
  }

  markStartPoint() {
    this._mapService.pointClickedOnMap.first().subscribe(data => {
       this.firstFormGroup.controls['latitudine'].setValue(data.coords.lat);
       this.firstFormGroup.controls['longitudine'].setValue(data.coords.lng);
    })
  }

  markEndPoint() {
    this._mapService.pointClickedOnMap.first().subscribe(data => {
       this.secondFormGroup.controls['latitudine'].setValue(data.coords.lat);
       this.secondFormGroup.controls['longitudine'].setValue(data.coords.lng);
    })
  }



}
