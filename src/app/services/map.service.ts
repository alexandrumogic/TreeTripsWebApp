import { Injectable, OnInit } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { TreesService } from './trees.service';
import { Trees, Tree } from '../classes/tree';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class MapService implements OnInit {
  markers;
  halts;
  markersCategory;
  markedToVisit;
  pointClickedOnMap;
  allowClickedMap;
  routeResult;
  originSubject;
  destinationSubject;
  origin = {lat: "", lng: ""};
  destination = {lat: "", lng: ""};
  baseApiURL = 'http://localhost:3000/trees';

  constructor(private treesService: TreesService, private http: Http, private httpClient: HttpClient) {
    this.routeResult = new Subject;
    this.markers = new BehaviorSubject<Trees[]>([]);
    this.halts = new BehaviorSubject<Object[]>([]);
    this.originSubject = new BehaviorSubject<Object>({});
    this.destinationSubject = new BehaviorSubject<Object>({});
    this.markedToVisit = new BehaviorSubject<Trees[]>([]);
    this.pointClickedOnMap = new Subject;
    this.allowClickedMap = false;

    this.getTreesByCategory().subscribe(data => {
          this.markers.next(Object.keys(data).map(function(key) {
             return data[key];
          }));
        });

    this.getHalts().subscribe(data => {
          this.halts.next(Object.keys(data).map(function(key) {
              return data[key];
          }));
        });
  }

  ngOnInit() {

  }

  addTree(treeData) {
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

    // let headers = new Headers({ 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: headers });

    return this.http.post(url, input).subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
  }

  setOrigin(coords) {
    this.origin = coords;
    this.originSubject.next(coords);
  }

  setDestination(coords) {
    this.destination = coords;
    this.destinationSubject.next(coords);
  }

  getHalts() {
    var url = 'http://localhost:3000/halts';
    console.log("map.service / getHalts() ");
    return this.http.get(url).map(res => res.json());
  }

  setHaltsVisibleOnMap(status: boolean) {
    if (status) {
      this.getHalts().subscribe(data => {
            this.halts.next(Object.keys(data).map(function(key) {
                return data[key];
            }));
          });
    } else {
      this.halts.next([]);
    }
  }


  getMarkers(): Observable<Tree[]> {
    console.log("map.service / getMarkers() ");
    return this.http.get(this.baseApiURL).map(res => <Tree[]>res.json()).do(data => this.markers.next(data));
  }

  setMarkersCategories(category: any) {
    console.log("Setting category to: " + category);
    this.markersCategory = category;
    this.getTreesByCategory().subscribe(data => {
          this.markers.next(Object.keys(data).map(function(key) {
             return data[key];
          }));
        });
  }

  getAllTrees() {
    this.getTrees().subscribe(data => {
          this.markers.next(Object.keys(data).map(function(key) {
             return data[key];
          }));
        });
  }

  getTrees() {
    console.log("map.service / getTrees() ");
    return this.http.get(this.baseApiURL).map(res => <Tree[]>res.json());
  }

  getTreesByCategory() {
    if (!this.markersCategory) {
      return this.http.get(this.baseApiURL).map(res => <Tree[]>res.json());
    } else {
      console.log("map.service.ts / getTreesByCategory: " + this.markersCategory);
      let apiURL = this.baseApiURL+'/category/'+this.markersCategory;
      return this.http.get(apiURL).map(res => res.json());
    }
  }

  getCategories() {
    let apiURL = this.baseApiURL+'/categories';
    return this.http.get(apiURL).map(res => res.json());
  }

  calculateRoute() {
    console.log("Calculating");
    var url = 'http://localhost:3000/routes';
    this.httpClient.get(url, {
      params: {
        sPtLat: this.origin.lat,
        sPtLng: this.origin.lng,
        ePtLat: this.destination.lat,
        ePtLng: this.destination.lng
      }
    }).subscribe(data => { this.routeResult.next(data); console.log(data); });
    // this.routeResult.next({});
  }

}
