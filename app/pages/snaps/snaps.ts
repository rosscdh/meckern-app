import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Observable} from 'rxjs/Rx';

import {ReportService} from '../../providers/report-service/report-service';
import {SettingsService} from '../../providers/settings-service/settings-service';
import {MapsService} from '../../providers/maps-service/maps-service';


@Component({
  templateUrl: 'build/pages/snaps/snaps-list.html',
  providers: [ReportService,
              SettingsService]
})
export class SnapsPage {
  public reports: any;
  public detailPage: any;

  constructor(private navCtrl: NavController,
              public reportService: ReportService,
              public settingsService: SettingsService) {

      this.detailPage = SnapDetailPage;
      this.loadReports();
  }

    loadReports(){
      this.reportService.findMy(this.settingsService.email)
      .then(data => {
        this.reports = data;
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
              MapsService]
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

  constructor(private navCtrl: NavController,
              public params: NavParams,
              public reportService: ReportService,
              public mapsService: MapsService) {

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


      this.loadSnapDetailPageMap();
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

    this.report.email = 'sendrossemail@gmail.com';
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
