import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';


let data = [],
    SERVER_URL = 'http://localhost:8003',
    tokenURL = SERVER_URL + '/api/v1/token/',
    accountSettingsURL = SERVER_URL + '/api/v1/account/';

@Injectable()
export class SettingsService {
  public token: any;
  public data: any;
  public showDetails: boolean;

  public email: string;
  public first_name: string;
  public last_name: string;

  constructor(private http: Http) {
      this.http = http;
      this.showDetails = false;

      this.email = 'sendrossemail@gmail.com';
      this.first_name = 'Ross';
      this.last_name = 'C';
  }

    token_acquire(data) {
      // if (this.data) {
      //   // already loaded data
      //   return Promise.resolve(this.data);
      // }

      // don't have the data yet
      return new Promise(resolve => {
        this.http.post(tokenURL, data)
          .map(res => res.json())
          .catch(this.handleError)
          .subscribe(data => {
            this.token = data;
            resolve(this.token);
          });
      });
    }

    account() {
      // if (this.data) {
      //   // already loaded data
      //   return Promise.resolve(this.data);
      // }

      // don't have the data yet
      return new Promise(resolve => {
        this.http.get(accountSettingsURL)
          .map(res => res.json())
          .catch(this.handleError)
          .subscribe(data => {
            this.data = data.results;
            resolve(this.data);
          });
      });
    }

    handleError(error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
 
}