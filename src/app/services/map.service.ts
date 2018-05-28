import { Injectable, OnInit } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Trees, Tree } from '../classes/tree';
import { Halt, Halts } from '../classes/halt';
import { MapCoordonates } from '../classes/map-coordonates';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class MapService {

  private markersSubject:         BehaviorSubject<Trees[]>;
  private haltsSubject:           BehaviorSubject<Halts[]>;
  private markedToVisitSubject:   BehaviorSubject<Trees[]>;
  private originSubject:          BehaviorSubject<MapCoordonates>;
  private destinationSubject:     BehaviorSubject<MapCoordonates>;
  private distanceSubject:        BehaviorSubject<any>;
  private wayPointsSubject:       BehaviorSubject<any>;
  public  pointClickedOnMap:      Subject<MapCoordonates>;
  private routeResult:            Subject<any>;
  private baseApiURL:             string;
  private markersCategory:        string;

  constructor(private http: Http, private httpClient: HttpClient) {
    this.routeResult          = new Subject;
    this.markersSubject       = new BehaviorSubject<Trees[]>([]);
    this.haltsSubject         = new BehaviorSubject<Halts[]>([]);
    this.originSubject        = new BehaviorSubject<MapCoordonates>(null);
    this.destinationSubject   = new BehaviorSubject<MapCoordonates>(null);
    this.wayPointsSubject     = new BehaviorSubject<any>([]);
    this.markedToVisitSubject = new BehaviorSubject<Trees[]>([]);
    this.pointClickedOnMap    = new Subject;
    this.distanceSubject      = new BehaviorSubject<any>(0);
    this.baseApiURL           = 'http://localhost:3000/trees';

    this.getTreesByCategory().subscribe(data => {
          this.markersSubject.next(Object.keys(data).map(function(key) {
             return data[key];
          }));
        });

    this.getHalts().subscribe(data => {
          this.haltsSubject.next(Object.keys(data).map(function(key) {
              return data[key];
          }));
        });
  }

  public setDistance(distance) {
    console.log("map.service | setDistance()");
    this.distanceSubject.next(distance);
  }

  public getDistance(): Observable<any> {
    return this.distanceSubject.asObservable();
  }

  public getWayPoints(): Observable<any> {
    return this.wayPointsSubject.asObservable();
  }

  public addTree(treeData, userToken) {
    var url = 'http://localhost:3000/trees';
    console.log("map.service / addTree() ");
    console.log(treeData.lat);
    console.log(treeData.lng);
    console.log(treeData.file);

    let input = new FormData();
    input.append('lat', treeData.lat);
    input.append('lng', treeData.lng);
    input.append('file', treeData.file);
    input.append('category', treeData.category);
    input.append('description', treeData.description);
    input.append('token', userToken);

    return this.http.post(url, input).subscribe(
        res => {
          window.alert("Pom adaugat cu success!");
        },
        err => {
          window.alert("Eroarea in adaugarea pomului, incearca din nou!");
        }
      );
  }

  public setOrigin(coords: MapCoordonates) {
    this.originSubject.next(coords);
  }

  public getOrigin(): Observable<MapCoordonates> {
    return this.originSubject.asObservable();
  }

  public setDestination(coords: MapCoordonates) {
    this.destinationSubject.next(coords);
  }

  public getDestination(): Observable<MapCoordonates> {
    return this.destinationSubject.asObservable();
  }

  public setWaypoints(wpts) {
    this.wayPointsSubject.next(wpts);
  }

  public getHalts() {
    var url = 'http://localhost:3000/halts';
    console.log("map.service / getHalts() ");
    return this.http.get(url).map(res => res.json());
  }

  public getHaltsAsObservable(): Observable<Halts[]> {
    return this.haltsSubject.asObservable();
  }

  public setHaltsVisibleOnMap(status: boolean) {
    if (status) {
      this.getHalts().subscribe(data => {
            this.haltsSubject.next(Object.keys(data).map(function(key) {
                return data[key];
            }));
          });
    } else {
      this.haltsSubject.next([]);
    }
  }

  public getMarkers(): Observable<Trees[]> {
    return this.markersSubject.asObservable();
  }

  public setMarkers(data) {
    this.markersSubject.next(data);
  }

  public setMarkersCategories(category: any) {
    console.log("Setting category to: " + category);
    this.markersCategory = category;
    this.getTreesByCategory().subscribe(data => {
          this.markersSubject.next(Object.keys(data).map(function(key) {
             return data[key];
          }));
        });
  }

  public notifyMarkersWithAllTrees() {
    this.getTrees().subscribe(data => {
          this.markersSubject.next(Object.keys(data).map(function(key) {
             return data[key];
          }));
        });
  }

  public getTrees(): Observable<any> {
    return this.http.get(this.baseApiURL).map(res => <Tree[]>res.json());
  }

  public getTreesByCategory() {
    if (!this.markersCategory) {
      return this.http.get(this.baseApiURL).map(res => <Tree[]>res.json());
    } else {
      console.log("map.service.ts / getTreesByCategory: " + this.markersCategory);
      let apiURL = this.baseApiURL+'/category/'+this.markersCategory;
      return this.http.get(apiURL).map(res => res.json());
    }
  }

  public getCategories() {
    let apiURL = this.baseApiURL+'/categories';
    return this.http.get(apiURL).map(res => res.json());
  }

  public calculateRoute() {
    console.log("Calculating");
    var url = 'http://localhost:3000/routes';

    this.httpClient.get(url, {
      params: {
        sPtLat: this.originSubject.getValue().lat,
        sPtLng: this.originSubject.getValue().lng,
        ePtLat: this.destinationSubject.getValue().lat,
        ePtLng: this.destinationSubject.getValue().lng
      }
    }).subscribe(data => { this.routeResult.next(data); console.log(data); });
  }

  public getPublicRoutes() {
    let url = "http://localhost:3000/routes/public";
    return this.http.get(url).map(res => res.json());
  }

  public getPointsMarkedToVisit(): Observable<any> {
    return this.markedToVisitSubject.asObservable();
  }

  public setPointsMarkedToVisit(points) {
    this.markedToVisitSubject.next(points);
  }

  public getRouteGeneratedResult(): Observable<any> {
    return this.routeResult.asObservable();
  }

}
