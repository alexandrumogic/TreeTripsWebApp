import { Route } from './route';

export class RoutePublic extends Route {

  info: string;
  organizer: string;
  participants: string[];

  constructor(origin, destination, waypoints, date, trees, halts, distance, info, organizer, participants) {
    super(origin, destination, waypoints, date, trees, halts, distance);
    this.info = info;
    this.organizer = organizer;
    this.participants = participants;
  }
}
