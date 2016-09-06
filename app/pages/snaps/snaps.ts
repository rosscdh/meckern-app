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
      this.mapsService.loadMap(this.mapElement, self.report.lat, self.report.lon).then((map) => {
        self.map = map;
        self.mapsService.addMarker(self.map, self.report);
      });

  }
}
