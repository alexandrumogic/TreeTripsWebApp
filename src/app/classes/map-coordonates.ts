import { Coordonates } from '../interfaces/coordonates';

export class MapCoordonates implements Coordonates
{
	constructor(public lat: number, public lng: number) 
	{
		console.log(lat);

		this.lat = lat;
		this.lng = lng;
	}
}