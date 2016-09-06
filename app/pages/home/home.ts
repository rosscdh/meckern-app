import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';

import { Camera } from 'ionic-native';
import { CameraPreview } from 'ionic-native';
import { Geolocation } from 'ionic-native';

import {ReportService} from '../../providers/report-service/report-service';
import {MapsService} from '../../providers/maps-service/maps-service';


let CPreviewOptions = {
  x: 0,
  y: 0,
  width: 640,
  height: 480,
  /**
  * Choose the camera to use (front- or back-facing).
  *  'front' for front camera
  *  'rear' for rear camera
  */
  camera: 'rear',
  /** Take photo on tap */
  tapPhoto: true,
  /** */
  previewDrag: true,
  /**  */
  toBack: false,
  /** Alpha use when toBack is set to true */
  alpha: 0
}

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [ReportService, MapsService]
})
export class HomePage {
    @ViewChild('map') mapElement: ElementRef;
    map: any;

    public reports: any;
    public geoloc: any;

    public base64Image: string;
    public showForm: boolean;
    public comment: string;

    constructor(private navCtrl: NavController, public reportService: ReportService, public mapsService: MapsService) {  
        this.showForm = false;
        this.geoloc = {};
    }

    ionViewLoaded(){

        // var options = new MyCameraOptions();
        CameraPreview.startCamera(CPreviewOptions);
        // //CameraPreview.setOnPictureTakenHandler(receivePicture);
        // CameraPreview.show();

        this.loadHomepageMap();
    }

    loadHomepageMap() {
        var self = this;

        this.mapsService.getCurrentGeoLocation().then((data) => {
          console.log('fdasd')
          console.log(data);

          self.geoloc = data;

          this.mapsService.loadMap(this.mapElement, self.geoloc.lat, self.geoloc.lon).then((map) => {
            self.map = map;
            this.loadReports(self.map, self.geoloc.lat, self.geoloc.lon);
          });

        });
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


    takePicture(){

        Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000
        }).then((imageData) => {
          // imageData is a base64 encoded string
            this.base64Image = "data:image/jpeg;base64," + imageData;
            this.showForm = true;
        }, (err) => {
            console.log(err);
        });
    }

}
