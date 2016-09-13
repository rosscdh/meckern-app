import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';

/*
  Generated class for the ReportService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
let data = [],
    SERVER_URL = 'https://712f0f33.ngrok.io',
    reportsURL = SERVER_URL + '/api/v1/report/';

@Injectable()
export class ReportService {
  public data: any;
  public count: number;
  public next: string;
  public previous: string;

  constructor(private http: Http) {
      this.http = http;
  }
 
    findAll() {
      // if (this.data) {
      //   // already loaded data
      //   return Promise.resolve(this.data);
      // }

      // don't have the data yet
      return new Promise(resolve => {
        this.http.get(reportsURL)
          .map(res => res.json())
          //.catch(this.handleError)
          .subscribe(data => {
            this.data = data.results;
            this.count = data.count;
            this.next = data.next;
            this.previous = data.previous;

            resolve(this.data);
          });
      });
    }

    findMy(email) {
      // if (this.data) {
      //   // already loaded data
      //   return Promise.resolve(this.data);
      // }

      // don't have the data yet
      return new Promise(resolve => {
        this.http.get(reportsURL + 'my/'+ email +'/')
          .map(res => res.json())
          //.catch(this.handleError)
          .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            this.data = data.results;
            this.count = data.count;
            this.next = data.next;
            this.previous = data.previous;

            resolve(this.data);
          });
      });
    }

    findByGeoLocation(dist, lat, lon) {
      return new Promise(resolve => {
        let search = new URLSearchParams()

        search.set('dist', `${dist}`);
        search.set('point', `${lon},${lat}`);

        let options = new RequestOptions({
            method: RequestMethod.Get,
            url: reportsURL,
            search: search
        });

        this.http.request(new Request(options))
          .map(res => res.json())
          //.catch(this.handleError)
          .subscribe(data => {
            this.data = data.results;
            this.count = data.count;
            this.next = data.next;
            this.previous = data.previous;
            resolve(this.data);
          });
      });
    }

    find(id) {
      return new Promise(resolve => {
        this.http.get(reportsURL + id + '/')
          .map(res => res.json())
          .subscribe(data => {
            console.log(data)
            this.data = data;
            resolve(this.data);
          });
      });
    }

    create(data) {
      return new Promise(resolve => {
          this.http.post(reportsURL, data)
            .map(res => res.json())
            .subscribe(data => {
              resolve(data);
          });
      });
    }
 
 
    handleError(error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
 
}