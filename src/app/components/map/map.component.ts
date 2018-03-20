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

  lat: number = 45.517284;
  lng: number = 24.423181;
  zoom: number = 10;
  infoWindowOpened = null;
  trees;
  halts;
  treesMarkedToVisit;

  constructor(private treesService: TreesService, private mapService: MapService) {
    this.mapService.halts.subscribe(data => {
      this.halts = Object.keys(data).map(function(key) {
            return data[key];
      });
    });

    this.mapService.markers.subscribe(data => {
      this.trees = Object.keys(data).map(function(key) {
            return data[key];
      });
    });

    this.mapService.markedToVisit.subscribe(data => {
      this.treesMarkedToVisit = Object.keys(data).map(function(key) {
            return data[key];
      });
    });
  }

  mapClicked($event: any) {
    this.mapService.pointClickedOnMap.next($event);
    this.closeInfoWindow();
  }

  checkCoordsAndReturnTree(coords) {
    for (var i = 0; i < this.treesMarkedToVisit.length; i++)
      if ((this.treesMarkedToVisit[i].coords.lat == coords.lat) && (this.treesMarkedToVisit[i].coords.lng == coords.lng)){
        console.log("Found tree: ");
        console.log(this.treesMarkedToVisit[i]);
        return this.treesMarkedToVisit[i];
      }
    return null;
  }

  markToVisit(marker: Tree) {
    var findIfMarked = this.checkCoordsAndReturnTree(marker.coords);

    if (findIfMarked == null) {
      this.treesMarkedToVisit.push(marker);
      this.mapService.markedToVisit.next(this.treesMarkedToVisit);
      console.log("map.component / markToVisit() : Tree marked to visit;");
      console.log(this.treesMarkedToVisit);
    } else {
      console.log("map.component / markToVisit() : Tree already marked to visit, removing;");
      var index = this.treesMarkedToVisit.indexOf(marker);
      this.treesMarkedToVisit.splice(index, 1);
      this.mapService.markedToVisit.next(this.treesMarkedToVisit);
      console.log(this.treesMarkedToVisit);
    }
  }

  onMarkToVisitBtnClicked(event) {
    if(event.srcElement.innerHTML === 'Viziteaza' ){
      event.srcElement.innerHTML = 'Nu mai vizita';
    } else if(event.srcElement.innerHTML ==='Nu mai vizita'){
      event.srcElement.innerHTML = 'Viziteaza';
    }
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
