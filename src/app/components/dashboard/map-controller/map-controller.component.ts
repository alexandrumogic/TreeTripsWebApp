import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TreesService } from '../../../services/trees.service';
import { MapService } from '../../../services/map.service';

@Component({
  selector: 'map-controller',
  templateUrl: './map-controller.component.html',
  styleUrls: ['./map-controller.component.css']
})
export class MapControllerComponent implements OnInit {

  showTreesFromACategory = new FormControl(false);
  showAllTreesOnMap = new FormControl(true);
  showHaltsControl = new FormControl(true);
  categories: any[];
  selectedCategory;

  constructor(private treesService: TreesService, private mapService: MapService) { }

  ngOnInit() {
    this.treesService.getCategories().subscribe(data => {
      this.categories = Object.keys(data).map(function(key) {
         return data[key];
      });
    });
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

  onSelectCategory(c: any) {
    this.selectedCategory = c;
    this.mapService.setMarkersCategories(this.selectedCategory);
  }

  showAllTrees() {
    this.mapService.getAllTrees();
    if (this.showTreesFromACategory.value == true) {
      this.showTreesFromACategory.setValue(false);
    } else {
      this.showTreesFromACategory.setValue(true);
    }
  }
}
