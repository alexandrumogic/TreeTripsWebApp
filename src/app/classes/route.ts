import { MapCoordonates } from '../classes/map-coordonates';


export class Route {

  route: {
  	origin: MapCoordonates,
  	destination: MapCoordonates,
  	waypoints: MapCoordonates[]
  };

  info: {
  	date: String,
  	trees: Number,
  	halts: Number,
  	distance: String
  };

  constructor(origin, destination, waypoints, date, trees, halts, distance) {
  	this.route.origin = origin;
  	this.route.destination = destination;
  	this.route.waypoints = waypoints;
  	this.info.date = date;
  	this.info.trees = trees;
  	this.info.halts = halts;
  	this.info.distance = distance;
  }
}
