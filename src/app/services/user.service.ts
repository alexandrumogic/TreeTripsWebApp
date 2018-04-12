import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private baseApiURL = 'http://localhost:3000/user';
  private userID: string = null;
  private userToken: string = null;
  private userName;
  private isUserAuthenticated;

  constructor(private http: Http) {
    this.isUserAuthenticated = new BehaviorSubject<boolean>(false);
    this.userName = new BehaviorSubject<string>("");
  }

  createUserAccount(name, email, password) {
    return this.http.post(this.baseApiURL, { name: name, email: email, password: password })
          .subscribe(result => { this.userID = result.text(); console.log(this.userID); });
  }

  loginUser(email, password) {
    var url = this.baseApiURL + "/login"
    return this.http.post(url, { email: email, password: password }).map(res => res.json())
          .subscribe(result => {
            // var resultText = result.text();
            var name = result.name;
            var token = result.token;

            if (token == "User sau parola incorecte. Incercati din nou.") {
              window.alert("User sau parola incorecte. Incercati din nou.");
            } else {
              this.userToken = token;
              this.userName.next(name);
              this.isUserAuthenticated.next(true);
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

}
