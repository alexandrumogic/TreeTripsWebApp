import { Injectable }                                               from '@angular/core';
import { Http, Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { BehaviorSubject }                                          from 'rxjs/BehaviorSubject';
import { MapCoordonates }                                           from '../classes/map-coordonates';
import { Route }                                                    from '../classes/route';
import { RoutePublic }                                              from '../classes/route-public';
import { Observable }                                               from 'rxjs/Observable';
import { AngularFireAuth }                                          from 'angularfire2/auth';
import { Trees, Tree }                                              from '../classes/tree';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private userNameSubject:        BehaviorSubject<string>;
  private isUserAuthenticated:    BehaviorSubject<boolean>;
  private userSavedRoutes:        BehaviorSubject<any>;
  private userTreesSubject:       BehaviorSubject<Trees[]>;
  private baseApiURL:             string;
  private userID:                 string;
  private userToken:              string;

  constructor(private http: Http, public afAuth: AngularFireAuth) {
    this.isUserAuthenticated    = new BehaviorSubject<boolean>(false);
    this.userNameSubject        = new BehaviorSubject<string>("");
    this.userSavedRoutes        = new BehaviorSubject<any>([]);
    this.userTreesSubject       = new BehaviorSubject<Trees[]>([]);
    this.baseApiURL             = 'http://localhost:3000/user';
    this.userID                 = null;
    this.userToken              = null;
  }

  public createUserAccount(name, email, password) {
    return this.http.post(this.baseApiURL, { name: name, email: email, password: password })
          .subscribe(result => { this.loginUser(email, password) });
  }

  public loginUser(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .catch(error => {
      if (error.code == "auth/user-not-found") {
        window.alert("User sau parola incorecte!");
      } else {
        window.alert("A aparut o eroare, incercati din nou!");
      }
      return "error";
    }).then(user => {
      if (user != "error") {
        this.afAuth.auth.currentUser.getIdToken().then(token => {
          this.userToken = token;
          this.userNameSubject.next(user.displayName);
          this.isUserAuthenticated.next(true);
          this.getUserSavedRoutes();
          this.getUserAddedTrees();
        })
      }
    });
  }

  public logOutUser() {
    this.afAuth.auth.signOut();
    this.userID = null;
    this.userToken = null;
    this.isUserAuthenticated.next(false);
    this.userNameSubject.next("");
  }

  public getUserID() {
    return this.userID;
  }

  public getUserName() {
    return this.userNameSubject.asObservable();
  }

  public checkIfUserIsAuthenticated() {
    return this.isUserAuthenticated.asObservable();
  }

  public saveUserRoute(route: Route) {
    var url = this.baseApiURL + "/routes";
    return new Promise((resolve, reject) => {
    return this.http.post(url, { token: this.userToken, route: route })
    .subscribe(result => {
            if (result.status == 200) {
              this.getUserSavedRoutes();
              window.alert("Traseu salvat cu success!");
            } else {
              window.alert("Traseul nu a putut fi salvat, incearca din nou.");
            }
      });
    })
  }

  public deleteUserRoute(routeKey) {
    var url = this.baseApiURL + "/routes";
    return new Promise((resolve, reject) => {
      return this.http.delete(url, { body: { token: this.userToken, routeKey: routeKey } })
        .subscribe(result => {
            if (result.status == 200) {
              this.getUserSavedRoutes();
              window.alert("Traseu sters cu success!");
            } else {
              window.alert("Eroare in stergerea traseului, incercati din nou.");
            }
        });
    });
  }

  public makeRoutePublic(route: Route) {
    var url = "http://localhost:3000/routes/public";
    return this.http.post(url, { route: route })
      .subscribe(result => {
        console.log(result);
      });
  }

  public joinPublicRoute(routeKey) {
    var url = "http://localhost:3000/routes/public/join";
    var userName;
    this.userNameSubject.subscribe(value => {
      userName = value;
    })
    return this.http.post(url, { routeKey: routeKey, userName: userName });
  }

  private getUserSavedRoutes() {
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

  public getUserTrees(): Observable<Trees[]> {
    return this.userTreesSubject.asObservable();
  }

  private getUserAddedTrees() {
      var url = this.baseApiURL + "/trees";
      this.http.get(url, { params: { token: this.userToken } }).map(res => res.json())
          .subscribe(result => {
            this.userTreesSubject.next(result);
        });
  }

}
