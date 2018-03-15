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
  categories: any[];

  ar = "artar";

  treesMarkedToVisit;
  treesCounterToVisit;

  constructor(private _formBuilder: FormBuilder, private _mapService: MapService) {

    this.treesCounterToVisit = new Map();

    this._mapService.getCategories().subscribe(data => {
      this.categories = Object.keys(data).map(function(key) {
         return data[key];
      });

      this.createTreesCounterToVisit();
    });

    this._mapService.markedToVisit.subscribe(data => {
      this.treesMarkedToVisit = Object.keys(data).map(function(key) {
            return data[key];
      });

      this.calculateHowManyTreesWillVisit();
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

  createTreesCounterToVisit() {

    for (var i = 0; i< this.categories.length; i++)
    {
      this.treesCounterToVisit.set(this.categories[i], 0);
    }

    console.log(this.treesCounterToVisit);
  }

  calculateHowManyTreesWillVisit() {
    // if (this.treesMarkedToVisit.length > 0)
    // {
    //   this.treesMarkedToVisit.forEach(function(tree) {
    //     console.log("Tree:");
    //     console.log(tree);
    //
    //     for (var key of this.treesCounterToVisit.keys()) {
    //       if (key == tree.category) {
    //
    //       }
    //     }
    //   })
    // }
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
