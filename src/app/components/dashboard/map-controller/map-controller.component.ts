import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreesService } from '../../../services/trees.service';
import { MapService } from '../../../services/map.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'map-controller',
  templateUrl: './map-controller.component.html',
  styleUrls: ['./map-controller.component.css']
})
export class MapControllerComponent implements OnInit {

  showTreesFromACategory = new FormControl(false);
  showAllTreesOnMap = new FormControl(true);
  showHaltsControl = new FormControl(true);
  showUserTreesControl = new FormControl(false);
  coordsFormGroup: FormGroup;
  categoryFormGroup: FormGroup;
  treeDetailsGroup: FormGroup;
  treeDescriptionFormGroup: FormGroup;
  categories: any[];
  isUserAuthenticated: boolean;
  userToken;
  selectedCategory;
  imageFile;

  constructor(private _formBuilder: FormBuilder, private treesService: TreesService, private mapService: MapService, private _userService: UserService) { }

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

    this.treesService.getCategories().subscribe(data => {
      this.categories = Object.keys(data).map(function(key) {
         return data[key];
      });
    });
  }

  detectFiles(event) {

    this.imageFile = event.target.files[0];
    console.log(this.imageFile);

  }

  submitTreeToDatabase() {
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

    this.mapService.addTree(treeData, token);
  }

  resetCoordPoint() {
    this.coordsFormGroup.reset();
  }

  succededInGettingUserLocation(pos) {
       this.treeDetailsGroup.controls['latitudine'].setValue(pos.coords.latitude);
       this.treeDetailsGroup.controls['longitudine'].setValue(pos.coords.longitude);
       // to do: store it somewhere
  }

  failedInGettingUserLocation() {
    window.alert("Nu am putut detecta locatia actuala!");
  }

  getUserLocation() {
    if(window.navigator.geolocation){
      window.navigator.geolocation.getCurrentPosition(this.succededInGettingUserLocation.bind(this), this.failedInGettingUserLocation);
    } else {
      window.alert("Nu avem permisiune de a detecta locatia.");
    }
  }

  resetUserLocation() {
    this.treeDetailsGroup.controls['latitudine'].reset();
    this.treeDetailsGroup.controls['longitudine'].reset();
  }

  showHalts() {
    if (this.showHaltsControl.value == true) {
      this.mapService.setHaltsVisibleOnMap(false);
    } else {
      this.mapService.setHaltsVisibleOnMap(true);
    }
  }

  showOnlyTreesFromACategory() {
    if (this.selectedCategory) {
      this.mapService.setMarkersCategories(this.selectedCategory);
    }

    this.showAllTreesOnMap.setValue(false);
  }

  showUserTrees() {
    if (this.showUserTreesControl.value == false) {
      this.showTreesFromACategory.setValue(false);
      this._userService.getUserTrees().subscribe(userTrees => {
        this.mapService.markers.next(userTrees);
     })
    } else {
      if (this.showTreesFromACategory.value == false) {
        this.showAllTrees();
      } else {
        this.showOnlyTreesFromACategory();
      }
    }

  }

  onSelectCategory(c: any) {
    this.selectedCategory = c;
    this.mapService.setMarkersCategories(this.selectedCategory);
  }

  onSelectCategoryToPlant(c: any) {
    console.log(c);
    this.treeDetailsGroup.controls['category'].setValue(c);

  }

  resetDescription() {
    this.treeDetailsGroup.controls['description'].reset();
  }

  showAllTrees() {
    // to do: fix toggle
    this.mapService.getAllTrees();
    if (this.showTreesFromACategory.value == true) {
      this.showTreesFromACategory.setValue(false);
    } else {
      this.showTreesFromACategory.setValue(true);
    }
  }
}
