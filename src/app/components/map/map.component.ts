import { Component, OnInit, ViewChild } from '@angular/core';
import { TreesService } from '../../services/trees.service';
import { MapService } from '../../services/map.service';
import { Trees, Tree } from '../../classes/tree';
import { GoogleMapsAPIWrapper } from '@agm/core/services/google-maps-api-wrapper';
import { DirectionsMapDirective } from './directions-map.directive';
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
  pointsMarkedToVisit;
  origin: Object = { lat: 45.807385, lng: 25.087588 };
  destination: Object = { lat: 45.499460, lng: 25.583886 };
  waypoints = [];

  @ViewChild(DirectionsMapDirective) vc: DirectionsMapDirective;

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
      this.pointsMarkedToVisit = Object.keys(data).map(function(key) {
            return data[key];
      });
    });

    this.mapService.originSubject.subscribe(data => {
      console.log(data);
      this.origin = data;
    });

    this.mapService.destinationSubject.subscribe(data => {
      console.log(data);
      this.destination = data;
    });
  }

  mapClicked($event: any) {
    this.mapService.pointClickedOnMap.next($event);
    this.closeInfoWindow();
  }

  checkCoordsAndReturnPoint(coords) {
    for (var i = 0; i < this.pointsMarkedToVisit.length; i++)
      if ((this.pointsMarkedToVisit[i].coords.lat == coords.lat) && (this.pointsMarkedToVisit[i].coords.lng == coords.lng)){
        console.log(this.pointsMarkedToVisit[i]);
        return this.pointsMarkedToVisit[i];
      }
    return null;
  }

  markToVisit(marker) {
    var findIfMarked = this.checkCoordsAndReturnPoint(marker.coords);

    if (findIfMarked == null) {
      this.pointsMarkedToVisit.push(marker);
      this.mapService.markedToVisit.next(this.pointsMarkedToVisit);
      console.log("map.component / markToVisit() : Tree marked to visit;");
      console.log(this.pointsMarkedToVisit);
    } else {
      console.log("map.component / markToVisit() : Tree already marked to visit, removing;");
      var index = this.pointsMarkedToVisit.indexOf(marker);
      this.pointsMarkedToVisit.splice(index, 1);
      this.mapService.markedToVisit.next(this.pointsMarkedToVisit);
      console.log(this.pointsMarkedToVisit);
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
