import { Injectable, OnInit } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { TreesService } from './trees.service';
import { Trees, Tree } from '../classes/tree';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class MapService implements OnInit{

  markers;
  halts;
  markersCategory;
  markedToVisit;
  pointClickedOnMap;
  allowClickedMap;
  baseApiURL = 'http://localhost:3000/trees';

  constructor(private treesService: TreesService, private http: Http) {
    this.markers = new BehaviorSubject<Trees[]>([]);
    this.halts = new BehaviorSubject<Object[]>([]);
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

}
