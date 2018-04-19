import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'routes-saved',
  templateUrl: './routes-saved.component.html',
  styleUrls: ['./routes-saved.component.css']
})
export class RoutesSavedComponent implements OnInit {

  isUserAuthenticated: boolean;
  userRoutes = [];
  displayedColumns = ['date', 'distance', 'trees', 'halts'];
  dataSource = [];

  constructor(private _userService: UserService) { }

  ngOnInit() {
    this._userService.checkIfUserIsAuthenticated().subscribe(value => {
      this.isUserAuthenticated = value;
    });

    this._userService.getUserRoutes().subscribe(value => {
      this.userRoutes = Object.keys(value).map(function(key) {
            return value[key];
      });

      this.dataSource = this.userRoutes;

      console.log(this.userRoutes);
    })
  }

}
