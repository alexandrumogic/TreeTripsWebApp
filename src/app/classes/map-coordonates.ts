import { Coordonates } from '../interfaces/coordonates';

export class MapCoordonates implements Coordonates
{
	constructor(public lat: number, public lng: number)
	{
		console.log(this.lat);
	}
}
