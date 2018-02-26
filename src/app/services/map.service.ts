import { Injectable } from '@angular/core';
import { TreesService } from './trees.service';

@Injectable()
export class MapService {

  constructor(private treesService: TreesService) { }

  markersCategory;

  getMarkers() {
    if (this.markersCategory == null)
      return this.treesService.getTrees();
    else
      return this.treesService.getTreesByCategory(this.markersCategory);
  }

  setMarkersCategories(category: any) {
    console.log("Setting category to: " + category);
    this.markersCategory = category;
  }

}
