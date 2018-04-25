import { Component, OnInit } from '@angular/core';
import { MapService } from '../../../../services/map.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'routes-public',
  templateUrl: './routes-public.component.html',
  styleUrls: ['./routes-public.component.css']
})
export class RoutesPublicComponent implements OnInit {

  isUserAuthenticated: boolean;
  publicRoutes = [];
  displayedColumns = ['date', 'distance', 'trees', 'halts', 'action'];
  dataSource = [];

  constructor(private _mapService: MapService) { }

  ngOnInit() {
    this._mapService.getPublicRoutes().subscribe(value => {
      this.publicRoutes = Object.keys(value).map(function(key) {
            return value[key];
      });

      this.dataSource = this.publicRoutes;

    });


  }
}
