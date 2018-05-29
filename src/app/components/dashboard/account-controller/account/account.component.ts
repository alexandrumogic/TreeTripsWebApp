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

  private email:               string = null;
  private password:            string = null;
  private name:                string = null;
  private createNewAccount:    boolean = null;
  private userToken:           string = null;
  private isUserAuthenticated: boolean;
  private userSavedRoutes = [];
  private userTrees = [];

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

  private onLogin(): void {
    this._userService.loginUser(this.email, this.password);
    this.email = this.password = '';
  }

  private onLogOut(): void {
    this._userService.logOutUser();
  }

  private switchToNewAccountView(): void {
    if (this.createNewAccount)
      this.createNewAccount = false;
    else
      this.createNewAccount = true;
  }

  private onCreateAccount(): void {
    this._userService.createUserAccount(this.name, this.email, this.password);
  }

}
