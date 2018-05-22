import { Directive, Input, HostListener } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services/google-maps-api-wrapper';
import { MapService } from '../../services/map.service';
declare var google: any;
var bounds;

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
    this.mapService.getRouteGeneratedResult().subscribe(data => {
      console.log("new route:");
      console.log(data);
      this.route = data;
      this.calculateRoute();
    });

    this.mapService.getPointsMarkedToVisit().subscribe(data => {
      this.waypoints = Object.keys(data).map(function(key) {
            return data[key].coords;
        });

        console.log("Directions.map:");
        console.log(this.waypoints);
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

      this.displayRoute(this.origin, this.destination, this.route, directions.directionsService, directions.directionsDisplay, map, this.mapService);
    })
  }

  displayRoute(origin, destination, route, service, display, map, mapService): void {
    var myWaypoints = [];

    for (var i = 0; i < this.waypoints.length; i++) {
      console.log(this.waypoints[i]);
    }

    for (var i = 0; i < this.waypoints.length; i++) {
      myWaypoints.push({
        location: new google.maps.LatLng(this.waypoints[i]),
        stopover: true
      })
    }

    // console.log("not decodePath");
    // console.log(this.route);
    // var decodedPath = google.maps.geometry.encoding.decodePath(this.route.routes[0].overview_polyline.points);
    //
    // console.log("decodedPath:");
    // this.route.routes[0]["overview_path"] = decodedPath;
    // this.route.routes[0].bounds = {
    //   b: {b: this.origin.lng,
    //       f: this.destination.lng},
    //   f: {b: this.origin.lat,
    //       f: this.destination.lat}
    // };

      service.route({
        origin: origin,
        destination: destination,
        waypoints: myWaypoints,
        travelMode: 'WALKING',
        avoidTolls: false
      }, function(response, status) {
        if (status === 'OK') {
          console.log("Route OK.");
          console.log(response);
          var totaldistance = 0;

          for (var i = 0; i < response.routes[0].legs.length; i++) {
            totaldistance += (response.routes[0].legs[i].distance.value / 1000);
          }

          console.log("Total distance: " + totaldistance + " km");
          display.setDirections(response);
          mapService.setDistance(totaldistance);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      });
      // this.route.routes[0].bounds = bounds;
      //
      //     console.log(this.route);
      //
      // display.setDirections(this.route);

    }


  calculateRoute(): void {
    this._gmapsApi.getNativeMap().then(map => {
      this.displayRoute(this.origin, this.destination, this.route, this.directions.directionsService, this.directions.directionsDisplay, map, this.mapService);
    });
  }

}
