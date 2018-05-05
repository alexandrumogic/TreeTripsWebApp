import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MapCoordonates } from '../classes/map-coordonates';
import { Route } from '../classes/route';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private baseApiURL = 'http://localhost:3000/user';
  private userID: string = null;
  private userToken: string = null;
  private userName;
  private isUserAuthenticated;
  private userSavedRoutes;
  private userTrees;

  constructor(private http: Http) {
    this.isUserAuthenticated = new BehaviorSubject<boolean>(false);
    this.userName = new BehaviorSubject<string>("");
    this.userSavedRoutes = new BehaviorSubject<any>([]);
    this.userTrees = new BehaviorSubject<any>([]);
  }

  createUserAccount(name, email, password) {
    return this.http.post(this.baseApiURL, { name: name, email: email, password: password })
          .subscribe(result => { this.userID = result.text(); console.log(this.userID); });
  }

  loginUser(email, password) {
    var url = this.baseApiURL + "/login"
    return this.http.post(url, { email: email, password: password }).map(res => res.json())
          .subscribe(result => {
            var name = result.name;
            var token = result.token;

            if (token == "User sau parola incorecte. Incercati din nou.") {
              window.alert("User sau parola incorecte. Incercati din nou.");
            } else {
              console.log("loggedin");
              this.userToken = token;
              this.userName.next(name);
              this.isUserAuthenticated.next(true);
              this._getUserSavedRoutes();
              this._getUserAddedTrees();
            }
      });
  }

  logOutUser() {
    this.userID = null;
    this.userToken = null;
    this.isUserAuthenticated.next(false);
    this.userName.next("");
  }

  getUserID() {
    return this.userID;
  }

  getUserName() {
    return this.userName.asObservable();
  }

  checkIfUserIsAuthenticated() {
    return this.isUserAuthenticated.asObservable();
  }

  saveUserRoute(route: Route) {
    var url = this.baseApiURL + "/routes";
    return this.http.post(url, { token: this.userToken, route: route });
  }

  deleteUserRoute(routeKey) {
    console.log("user.service: deleteUserRoute");
    var url = this.baseApiURL + "/routes";
    return new Promise((resolve, reject) => {
      return this.http.delete(url, { body: { token: this.userToken, routeKey: routeKey } })
          .subscribe(result => {
            if (result.status == 200) {
              this._getUserSavedRoutes();
              window.alert("Traseu sters cu success!");
            } else {
              window.alert("Eroare in stergerea traseului, incercati din nou.");
            }
          });
    })
  }

  makeRoutePublic(route: Route) {
    var url = "http://localhost:3000/routes/public";
    return this.http.post(url, { route: route })
      .subscribe(result => {
        console.log(result);
      });
  }

  private _getUserSavedRoutes() {
    var url = this.baseApiURL + "/routes";
    this.http.get(url, { params: { token: this.userToken } }).map(res => res.json())
        .subscribe(result => {
          this.userSavedRoutes.next(result);
        });
  }

  public getUserRoutes(): Observable<any> {
    return this.userSavedRoutes.asObservable();
  }

  public getUserToken() {
    return this.userToken;
  }

  public getUserTrees(): Observable<any> {
    return this.userTrees.asObservable();
  }

  private _getUserAddedTrees() {
      var url = this.baseApiURL + "/trees";
      this.http.get(url, { params: { token: this.userToken } }).map(res => res.json())
          .subscribe(result => {
            this.userTrees.next(result);
          });
  }

}
