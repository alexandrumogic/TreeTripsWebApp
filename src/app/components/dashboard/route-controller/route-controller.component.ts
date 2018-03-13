import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'route-controller',
  templateUrl: './route-controller.component.html',
  styleUrls: ['./route-controller.component.css']
})
export class RouteControllerComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) { }

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

}
