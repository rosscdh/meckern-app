import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage, SqlStorage } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';


let STORAGE = new Storage(SqlStorage);

let data = [],
    SERVER_URL = 'http://46.101.128.117',
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
      this.data = null;
  }

  hasSpecifiedEmail() {
    return new Promise(resolve => {
      this.account().then(data => {
        resolve(data['email'] !== undefined && data['email'].indexOf('@') >= 0);
      });
    });
  }

  account() {
    return new Promise(resolve => {
      STORAGE.get('account').then((data) => {

        if (data != null) {
          this.data = JSON.parse(data);
          this.email = this.data['email'];
        } else {
          this.email = null;
          this.data = {};
        }
        resolve(this.data);
      });
    });
  }

  saveAccount(data) {
    return new Promise(resolve => {
      var stringify_data = JSON.stringify(data);
      STORAGE.set('account', stringify_data);
      resolve(data);
    });
  }

  handleError(error) {
      console.error(error);
      return Observable.throw(error.json().error || 'Server error');
  }
 
}