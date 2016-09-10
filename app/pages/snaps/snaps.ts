import {Component, ViewChild, ElementRef} from '@angular/core';
import {LoadingController, NavController, NavParams, List, Item} from 'ionic-angular';
import {Observable} from 'rxjs/Rx';

import {SettingsPage} from '../settings/settings';

import {ReportService} from '../../providers/report-service/report-service';
import {SettingsService} from '../../providers/settings-service/settings-service';
import {MapsService} from '../../providers/maps-service/maps-service';


@Component({
  templateUrl: 'build/pages/snaps/snaps-around-me.html',
  providers: [ReportService,
              SettingsService,
              MapsService]
})
export class SnapsAroundMePage {
  @ViewChild('map') mapElement: ElementRef;

  private map: any;
  private reports: any;
  private coordinates: any;
  private loading: any;

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private reportService: ReportService,
              private mapsService: MapsService) {

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content: 'Loading Geography...'
      });

      // Defaults
      this.coordinates = {
        'lat': 51.0718316,
        'lon': 6.4505703,
      };

      this.loadHomepageMap();
  }

  loadHomepageMap() {
      var self = this;

      this.loading.present();

      this.mapsService.getCurrentGeoLocation().then((data) => {

        this.loading.dismiss();

        self.coordinates = data;

        this.mapsService.loadMap(this.mapElement,
                                 self.coordinates.lat,
                                 self.coordinates.lon).then((map) => {
          self.map = map;
          this.loadReports(self.map, self.coordinates.lat, self.coordinates.lon);
        });

      });
  }

  doRefresh() {
    var self = this;
    this.loadReports(self.map, self.coordinates.lat, self.coordinates.lon);
  }

  loadReports(map, lat=null, lon=null){
    var self = this;

    if (lat !== null && lon !== null) {

      this.reportService.findByGeoLocation(50000, lat, lon).then(
          data => {
            self.reports = data;
            for (var i in data) {
                var item = data[i];
                this.mapsService.addMarker(map, item);
            };
          }
      );

    }else{
      // no lat or long
      this.reportService.findAll().then(
          data => {
            self.reports = data;
            for (var i in data) {
                var item = data[i];
                this.mapsService.addMarker(self.map, item);
            };
          }
      );
    }
  }

}

@Component({
  templateUrl: 'build/pages/snaps/snaps-list.html',
  providers: [ReportService,
              SettingsService]
})
export class MySnapsPage {
  private reports: any;
  private detailPage: any;
  private loading: any;

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              public reportService: ReportService,
              public settingsService: SettingsService) {

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content: 'Loading...'
      });

      this.detailPage = SnapDetailPage;
      this.loadReports();
  }

    loadReports(){
      this.loading.present();
      this.settingsService.account().then(data => {
        this.reportService.findMy(data['email']).then(data => {
          this.loading.dismiss();
          this.reports = data;
        });
      });
    }

    navigateToDetail (pk) {
      this.navCtrl.push(this.detailPage, {
        pk: pk
      })
    }
}


/*
* SnapDetailPage
* Shows a snap objects details
*
*/
@Component({
  templateUrl: 'build/pages/snaps/snaps-detail.html',
  providers: [ReportService,
              MapsService]
})
export class SnapDetailPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  public report: any;
  public pk: number;

  constructor(private navCtrl: NavController,
              public params: NavParams,
              public reportService: ReportService,
              public mapsService: MapsService) {

      this.pk = params.get('pk');
      this.loadReport(this.pk);
      this.report = {};
  }

  loadReport(pk) {
    this.reportService.find(pk)
    .then(data => {
      this.report = data;
      this.loadSnapDetailPageMap();
    });
  }

  loadSnapDetailPageMap() {
      var self = this;
      console.log('map')
      this.mapsService.loadMap(this.mapElement,
                               self.report.lat,
                               self.report.lon).then((map) => {
        self.map = map;
        self.mapsService.addMarker(self.map, self.report);
      });

  }
}


/*
* SnapDetailPage
* Shows a snap objects details
*
*/
@Component({
  templateUrl: 'build/pages/snaps/snaps-create.html',
  providers: [ReportService,
              MapsService,
              SettingsService]
})
export class SnapCreatePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  public report: any;
  public coordinates: any;
  public base64Image: number;
  public title: string;
  public comment: string;
  public report_type: number;
  public severity: number;
  public email: string;

  constructor(private navCtrl: NavController,
              private params: NavParams,
              private reportService: ReportService,
              private mapsService: MapsService,
              private settingsService: SettingsService) {

      this.coordinates = params.get('coordinates');
      this.base64Image = params.get('base64Image');
      this.report_type = 1;
      this.severity = 0;
      this.report = {
        'lat': null,
        'lon': null,
        'photo': null,
        'title': null,
        'comment': null,
        'report_type': this.report_type,
        'severity': this.severity,
        'photo_is_public': true,
      }
      this.email = null;

    this.settingsService.account().then(data => {
      console.log(data);
      if (data == null || data['email'] == null || data['email'] == '') {
        this.navCtrl.push(SettingsPage);
      } else {
        this.email = data['email'];
        this.loadSnapDetailPageMap();
      }
    });
  }

  loadSnapDetailPageMap() {
      var self = this;
      console.log('map')
      this.mapsService.loadMap(this.mapElement,
                               self.coordinates.lat,
                               self.coordinates.lon).then((map) => {
        self.map = map;

        self.mapsService.addMarker(self.map, self.report);
      });
  }

  submitReport() {

      this.report.email = this.email;
      this.report.lat = this.coordinates.lat;
      this.report.lon = this.coordinates.lon;
      this.report.photo = this.base64Image;
      this.report.title = this.title;
      this.report.comment = this.comment;
      this.report.report_type = this.report_type;
      this.report.severity = this.severity;
      this.report.photo_is_public = true;

      this.reportService.create(this.report).then(data => {
        this.report = data;
        this.navigateToDetail(this.report.id);
      });

  }

  navigateToDetail (pk) {
    this.navCtrl.push(SnapDetailPage, {
      pk: pk
    })
  }

}
