import { Component, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../../services/map.service';
import { Trees, Tree } from '../../classes/tree';
import { Halt, Halts } from '../../classes/halt';
import { MapCoordonates } from '../../classes/map-coordonates';
import { GoogleMapsAPIWrapper } from '@agm/core/services/google-maps-api-wrapper';
import { DirectionsMapDirective } from './directions-map.directive';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  lat:            number;
  lng:            number;
  zoom:           number;
  trees:          Tree[];
  halts:          Halt[];
  origin:         MapCoordonates;
  destination:    MapCoordonates;
  waypoints =     [];
  infoWindowOpened;
  pointsMarkedToVisit;

  @ViewChild(DirectionsMapDirective) vc: DirectionsMapDirective;

  constructor(private mapService: MapService) {

    this.lat = 45.517284;
    this.lng = 24.423181;
    this.zoom = 11;
    this.infoWindowOpened = null;
    this.origin = new MapCoordonates(45.807385, 25.087588);
    this.destination = new MapCoordonates(45.499460, 25.583886);

    this.mapService.getHaltsAsObservable().subscribe(data => {
      this.halts = Object.keys(data).map(function(key) {
            return data[key];
      });
    });

    this.mapService.getMarkers().subscribe(data => {
      this.trees = Object.keys(data).map(function(key) {
            return data[key];
      });
    });

    this.mapService.getPointsMarkedToVisit().subscribe(data => {
      this.pointsMarkedToVisit = Object.keys(data).map(function(key) {
            return data[key];
      });
    });

    this.mapService.getOrigin().subscribe(data => {
      console.log(data);
      this.origin = data;
    });

    this.mapService.getDestination().subscribe(data => {
      console.log(data);
      this.destination = data;
    });

    this.mapService.getWayPoints().subscribe(data => {
      this.waypoints = data;
    })
  }

  private mapClicked($event: any): void {
    this.mapService.pointClickedOnMap.next($event);
    this.closeInfoWindow();
  }

  private checkCoordsAndReturnPoint(coords) {
    for (var i = 0; i < this.pointsMarkedToVisit.length; i++)
      if ((this.pointsMarkedToVisit[i].coords.lat == coords.lat) && (this.pointsMarkedToVisit[i].coords.lng == coords.lng)){
        console.log(this.pointsMarkedToVisit[i]);
        return this.pointsMarkedToVisit[i];
      }
    return null;
  }

  private markToVisit(marker, event): void {
    var findIfMarked = this.checkCoordsAndReturnPoint(marker.coords);

    if(event.srcElement.innerHTML == 'Viziteaza' ){
      event.srcElement.innerHTML = 'Nu mai vizita';
    } else if(event.srcElement.innerHTML == 'Nu mai vizita'){
      event.srcElement.innerHTML = 'Viziteaza';
    }

    if (findIfMarked == null) {
      this.pointsMarkedToVisit.push(marker);
      this.mapService.setPointsMarkedToVisit(this.pointsMarkedToVisit);
      console.log("map.component / markToVisit() : Tree marked to visit;");
      console.log(this.pointsMarkedToVisit);
    } else {
      console.log("map.component / markToVisit() : Tree already marked to visit, removing;");
      var index = this.pointsMarkedToVisit.indexOf(marker);
      this.pointsMarkedToVisit.splice(index, 1);
      this.mapService.setPointsMarkedToVisit(this.pointsMarkedToVisit);
      console.log(this.pointsMarkedToVisit);
    }
  }

  private markerClicked(marker: Tree, index: number, infoWindow): void {
    console.log("Clicked marker at index " + index + " / "+ marker.coords.lat + " / " + marker.coords.lng);
    if (this.infoWindowOpened == infoWindow)
        return;
    this.closeInfoWindow();
    this.infoWindowOpened = infoWindow;
  }

  private closeInfoWindow(): void {
    if (this.infoWindowOpened != null)
    {
        this.infoWindowOpened.close();
        console.log("Closing info opened.");
    }
  }
}
