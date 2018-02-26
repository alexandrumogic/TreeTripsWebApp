import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class TreesService {

  baseApiURL = 'http://localhost:3000/trees';

  constructor(private http: Http) { }

  getTrees() {
    return this.http.get(this.baseApiURL).map(res => res.json());
  }

  getTreesByCategory(category: string) {
    console.log("getTreesByCategory: " + category);
    let apiURL = this.baseApiURL+'/category/'+category;
    console.log(apiURL);
    return this.http.get(apiURL).map(res => res.json());
  }

  getCategories() {
    let apiURL = this.baseApiURL+'/categories';
    return this.http.get(apiURL).map(res => res.json());
  }

}
