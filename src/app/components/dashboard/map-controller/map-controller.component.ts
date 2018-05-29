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

  private showTreesFromACategoryControl:  FormControl;
  private showAllTreesOnMapControl:       FormControl;
  private showHaltsControl:               FormControl;
  private showUserTreesControl:           FormControl;
  private coordsFormGroup:                FormGroup;
  private categoryFormGroup:              FormGroup;
  private treeDetailsGroup:               FormGroup;
  private treeDescriptionFormGroup:       FormGroup;
  private categories:                     any[];
  private isUserAuthenticated:            boolean;
  private userToken:                      string;
  private selectedCategory:               string;
  private imageFile:                      File;

  constructor(private _formBuilder: FormBuilder, private _mapService: MapService, private _userService: UserService) {

    this.showTreesFromACategoryControl   = new FormControl(false);
    this.showAllTreesOnMapControl        = new FormControl(true);
    this.showHaltsControl                = new FormControl(true);
    this.showUserTreesControl            = new FormControl(false);
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

  private detectFiles(event): void {
    this.imageFile = event.target.files[0];
  }

  private submitTreeToDatabase(): void {
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

  private resetCoordPoint(): void {
    this.coordsFormGroup.reset();
  }

  private succededInGettingUserLocation(location): void {
       this.treeDetailsGroup.controls['latitudine'].setValue(location.coords.latitude);
       this.treeDetailsGroup.controls['longitudine'].setValue(location.coords.longitude);
       // to do: store it somewhere
  }

  private failedInGettingUserLocation(): void {
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

    this.showAllTreesOnMapControl.setValue(false);
  }

  private showUserTrees() {
    if (this.showUserTreesControl.value == false) {
      this.showTreesFromACategoryControl.setValue(false);
      this._userService.getUserTrees().subscribe(userTrees => {
        this._mapService.setMarkers(userTrees);
     })
    } else {
      if (this.showTreesFromACategoryControl.value == false) {
        this.showAllTrees();
      } else {
        this.showOnlyTreesFromACategory();
      }
    }
  }

  private onSelectCategory(category: any) {
    this.selectedCategory = category;
    this._mapService.setMarkersCategories(this.selectedCategory);
  }

  private onSelectCategoryToPlant(category: any) {
    this.treeDetailsGroup.controls['category'].setValue(category);
  }

  private resetDescription() {
    this.treeDetailsGroup.controls['description'].reset();
  }

  private showAllTrees() {
    // to do: fix toggle
    this._mapService.notifyMarkersWithAllTrees();
    if (this.showTreesFromACategoryControl.value == true) {
      this.showTreesFromACategoryControl.setValue(false);
    } else {
      this.showTreesFromACategoryControl.setValue(true);
    }
  }
}
