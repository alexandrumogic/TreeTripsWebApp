import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from '../../../services/map.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'map-controller',
  templateUrl: './map-controller.component.html',
  styleUrls: ['./map-controller.component.css']
})
export class MapControllerComponent implements OnInit {

  showTreesFromACategory:         FormControl;
  showAllTreesOnMap:              FormControl;
  showHaltsControl:               FormControl;
  showUserTreesControl:           FormControl;
  coordsFormGroup:                FormGroup;
  categoryFormGroup:              FormGroup;
  treeDetailsGroup:               FormGroup;
  treeDescriptionFormGroup:       FormGroup;
  categories:                     any[];
  isUserAuthenticated:            boolean;
  userToken:                      string;
  selectedCategory:               string;
  imageFile:                      File;

  constructor(private _formBuilder: FormBuilder, private _mapService: MapService, private _userService: UserService) {

    this.showTreesFromACategory       = new FormControl(false);
    this.showAllTreesOnMap            = new FormControl(true);
    this.showHaltsControl             = new FormControl(true);
    this.showUserTreesControl         = new FormControl(false);
  }

  ngOnInit() {

    this._userService.checkIfUserIsAuthenticated().subscribe(value => {
      this.isUserAuthenticated = value;
    });

    this.treeDetailsGroup = this._formBuilder.group({
      latitudine: ['', Validators.required],
      longitudine: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      file: ['', Validators.required]
    });

    this.coordsFormGroup = this._formBuilder.group({
      latitudine: ['', Validators.required],
      longitudine: ['', Validators.required]
    });

    this.categoryFormGroup = this._formBuilder.group({
      newCategory: [''],
      treeDescription: ['']
    });

    this._mapService.getCategories().subscribe(data => {
      this.categories = Object.keys(data).map(function(key) {
         return data[key];
      });
    });
  }

  private detectFiles(event) {
    this.imageFile = event.target.files[0];
    console.log(this.imageFile);
  }

  private submitTreeToDatabase() {
    var treeData = {
      lat: null,
      lng: null,
      category: null,
      description: null,
      file: null
    }

    treeData.lat = this.treeDetailsGroup.controls['latitudine'].value;
    treeData.lng = this.treeDetailsGroup.controls['longitudine'].value;
    treeData.category = this.treeDetailsGroup.controls['category'].value
    treeData.description = this.treeDetailsGroup.controls['description'].value
    treeData.file = this.imageFile;
    var token = this._userService.getUserToken();

    this.treeDetailsGroup.reset();
    this._mapService.addTree(treeData, token);
  }

  private resetCoordPoint() {
    this.coordsFormGroup.reset();
  }

  private succededInGettingUserLocation(pos) {
       this.treeDetailsGroup.controls['latitudine'].setValue(pos.coords.latitude);
       this.treeDetailsGroup.controls['longitudine'].setValue(pos.coords.longitude);
       // to do: store it somewhere
  }

  private failedInGettingUserLocation() {
    window.alert("Nu am putut detecta locatia actuala!");
  }

  private getUserLocation() {
    if(window.navigator.geolocation){
      window.navigator.geolocation.getCurrentPosition(this.succededInGettingUserLocation.bind(this), this.failedInGettingUserLocation);
    } else {
      window.alert("Nu avem permisiune de a detecta locatia.");
    }
  }

  private resetUserLocation() {
    this.treeDetailsGroup.controls['latitudine'].reset();
    this.treeDetailsGroup.controls['longitudine'].reset();
  }

  private showHalts() {
    if (this.showHaltsControl.value == true) {
      this._mapService.setHaltsVisibleOnMap(false);
    } else {
      this._mapService.setHaltsVisibleOnMap(true);
    }
  }

  private showOnlyTreesFromACategory() {
    if (this.selectedCategory) {
      this._mapService.setMarkersCategories(this.selectedCategory);
    }

    this.showAllTreesOnMap.setValue(false);
  }

  private showUserTrees() {
    if (this.showUserTreesControl.value == false) {
      this.showTreesFromACategory.setValue(false);
      this._userService.getUserTrees().subscribe(userTrees => {
        this._mapService.setMarkers(userTrees);
     })
    } else {
      if (this.showTreesFromACategory.value == false) {
        this.showAllTrees();
      } else {
        this.showOnlyTreesFromACategory();
      }
    }
  }

  private onSelectCategory(c: any) {
    this.selectedCategory = c;
    this._mapService.setMarkersCategories(this.selectedCategory);
  }

  private onSelectCategoryToPlant(c: any) {
    console.log(c);
    this.treeDetailsGroup.controls['category'].setValue(c);
  }

  private resetDescription() {
    this.treeDetailsGroup.controls['description'].reset();
  }

  private showAllTrees() {
    // to do: fix toggle
    this._mapService.notifyMarkersWithAllTrees();
    if (this.showTreesFromACategory.value == true) {
      this.showTreesFromACategory.setValue(false);
    } else {
      this.showTreesFromACategory.setValue(true);
    }
  }
}
