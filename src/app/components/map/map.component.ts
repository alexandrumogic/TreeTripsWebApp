import { Component, OnInit } from '@angular/core';
import { TreesService } from '../../services/trees.service';
import { MapService } from '../../services/map.service';
import { Trees, Tree } from '../../classes/tree';
declare var google: any;
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  lat: number = 45.807385;
  lng: number = 25.087588;
  zoom: number = 9;
  infoWindowOpened = null;
  trees;

  constructor(private treesService: TreesService, private mapService: MapService) {
    this.mapService.markers.subscribe(data => {
      this.trees = Object.keys(data).map(function(key) {
            return data[key];
      });
    });
  }

  mapClicked($event: any) {
    this.closeInfoWindow();
  }

  markerClicked(marker: Tree, index: number, infoWindow): void {
    console.log("Clicked marker at index " + index + " / "+ marker.coords.lat + " / " + marker.coords.lng);
    if (this.infoWindowOpened == infoWindow)
        return;
    this.closeInfoWindow();
    this.infoWindowOpened = infoWindow;
  }

  closeInfoWindow(): void {
    if (this.infoWindowOpened != null)
    {
        this.infoWindowOpened.close();
        console.log("Closing info opened.");
    }
  }
}
