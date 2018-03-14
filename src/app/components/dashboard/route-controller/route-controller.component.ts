import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from '../../../services/map.service';

@Component({
  selector: 'route-controller',
  templateUrl: './route-controller.component.html',
  styleUrls: ['./route-controller.component.css']
})
export class RouteControllerComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  treesMarkedToVisit;

  constructor(private _formBuilder: FormBuilder, private _mapService: MapService) {

    this._mapService.markedToVisit.subscribe(data => {
      this.treesMarkedToVisit = Object.keys(data).map(function(key) {
            return data[key];
      });
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

  reset() {
    this.firstFormGroup.reset();
  }

}
