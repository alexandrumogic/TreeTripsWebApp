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

  disableSelect = new FormControl(false);
  categories: any[];

  constructor(private treesService: TreesService, private mapService: MapService) { }

  ngOnInit() {
    this.treesService.getCategories().subscribe(data => {
      this.categories = Object.keys(data).map(function(key) {
         return data[key];
      });
    });
  }

  onSelectCategory(c: any) {
    this.mapService.setMarkersCategories(c);
  }



}
