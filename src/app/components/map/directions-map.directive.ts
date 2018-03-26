import { Directive, Input, HostListener } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services/google-maps-api-wrapper';
import { MapService } from '../../services/map.service';
declare var google: any;

@Directive({
  selector: 'directionsMap'
})
export class DirectionsMapDirective {
  @Input() origin;
  @Input() destination;
  @Input() waypoints;
  route;
  public estimatedTime;
  public estimatedDistance;
  public directionsService;
  public directionsDisplay;
  public directions: any = {
    directionsService: null,
    directionsDisplay: null
  }

  constructor(private _gmapsApi: GoogleMapsAPIWrapper, private mapService: MapService) {
    this.mapService.routeResult.subscribe(data => {
      this.route = data;
      this.calculateRoute();
    });
  }

  ngOnInit() {
    this.initalizeMap(this.directions);
  }

  initalizeMap(directions): void {
    this._gmapsApi.getNativeMap().then(map => {
      directions.directionsService = new google.maps.DirectionsService;
      directions.directionsDisplay = new google.maps.DirectionsRenderer;
      directions.directionsDisplay.setMap(map);

      this.displayRoute(this.origin, this.destination, this.route, directions.directionsService, directions.directionsDisplay);
    })
  }

  displayRoute(origin, destination, route, service, display): void {
    var myWaypoints = [];

    for (var i = 0; i < this.waypoints.length; i++) {
      console.log(this.waypoints[i].markerID);
      console.log(this.waypoints[i].location);
    }

    for (var i = 0; i < this.waypoints.length; i++) {
      myWaypoints.push({
        location: new google.maps.LatLng(this.waypoints[i].location),
        stopover: true
      })
    }

    // var decodedPath = google.maps.geometry.encoding.decodePath(this.route);

    console.log("DIREECTIONS:");
    console.log(origin);

      service.route({
        origin: origin,
        destination: destination,
        waypoints: myWaypoints,
        travelMode: 'WALKING',
        avoidTolls: true
      }, function(response, status) {
        if (status === 'OK') {
          console.log(response);
          console.log("Route OK.");
          display.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      });
    }


  calculateRoute(): void {
    this._gmapsApi.getNativeMap().then(map => {
      this.displayRoute(this.origin, this.destination, this.route, this.directions.directionsService, this.directions.directionsDisplay);
    });
  }

}
