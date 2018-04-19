import { MapCoordonates } from '../classes/map-coordonates';

export class Route {
  
  origin: MapCoordonates;
  destination: MapCoordonates;
  waypoints: MapCoordonates[];
  date: string;
  trees: number;
  halts: number;
  distance: string;

  constructor(origin, destination, waypoints, date, trees, halts, distance) {
  	this.origin = origin;
  	this.destination = destination;
    this.waypoints = waypoints;
  	this.date = date;
  	this.trees = trees;
  	this.halts = halts;
  	this.distance = distance;
  }
}
