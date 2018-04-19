import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  email: string = null;
  password: string = null;
  name: string = null;
  createNewAccount: boolean = null;
  userToken: string = null;
  isUserAuthenticated: boolean;
  userSavedRoutes = [];
  userTrees = [];

  constructor(private _userService: UserService) {
    this.createNewAccount = false;
    this.isUserAuthenticated = false;
  }

  ngOnInit() {
    this._userService.checkIfUserIsAuthenticated().subscribe(value => {
      this.isUserAuthenticated = value;
    })

    this._userService.getUserName().subscribe(value => {
      this.name = value;
    })

    this._userService.getUserRoutes().subscribe(value => {
      this.userSavedRoutes = Object.keys(value).map(function(key) {
            return value[key];
      });
    })

    this._userService.getUserTrees().subscribe(value => {
      this.userTrees = Object.keys(value).map(function(key) {
            return value[key];
      });
    })
  }

  onLogin() {
    this._userService.loginUser(this.email, this.password);
    this.email = this.password = '';
  }

  onLogOut() {
    this._userService.logOutUser();
  }

  switchToNewAccountView() {
    if (this.createNewAccount)
      this.createNewAccount = false;
    else
      this.createNewAccount = true;
  }

  onCreateAccount() {
    this._userService.createUserAccount(this.name, this.email, this.password);
  }

}
