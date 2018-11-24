import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Environment } from '@ionic-native/google-maps';
import { FcmService } from './shared/services/fcm.service';
import {
  ToastController
} from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Marker',
      url: '/marker'
    },
    {
      title: 'HtmlInfoWindow',
      url: '/html-info-window'
    },
    {
      title: 'MarkerCluster',
      url: '/marker-cluster'
    },
    {
      title: 'Polyline',
      url: '/polyline'
    },
    {
      title: 'Polygon',
      url: '/polygon'
    },
    {
      title: 'Circle',
      url: '/circle'
    },
    {
      title: 'GroundOverlay',
      url: '/ground-overlay'
    },
    {
      title: 'Geocoding',
      url: '/geocoding'
    },
    {
      title: 'TileOverlay',
      url: '/tile-overlay'
    },
    {
      title: 'KmlOverlay',
      url: '/kml-overlay'
    },
    {
      title: 'StreetView',
      url: '/street-view'
    },
    {
      title: 'BaseArrayClass',
      url: '/base-array-class'
    }
  ];

  token: string;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public toastCtrl: ToastController,
    private fcm: FcmService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      Environment.setEnv({
        // api key for server
        'API_KEY_FOR_BROWSER_RELEASE': '(YOUR_API_KEY_IS_HERE)',

        // api key for local development
        'API_KEY_FOR_BROWSER_DEBUG': ''
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.notificationSetup();
    });
  }

  async notificationSetup() {
    try {
      await this.platform.ready();

      this.fcm.subscribeToTopic('all');
      // Get a FCM token
      this.fcm.getToken()
        .then(token=>{
            console.log(token);
        });

      this.fcm.listenToNotifications()
        .subscribe((data: any) => {
          console.log("data", data);

          if(data.wasTapped){
            console.log("Received in background");
          } else {
            console.log("Received in foreground");
          };

          this.showToast(data.body);
        });

      this.fcm.onTokenRefresh();
    }
    catch(e) {
      console.log(e);
    };
  }


  /*private notificationSetup() {
    this.fcm.getToken();
    this.fcm.onTokenRefresh();
    this.fcm.onNotifications().subscribe(
      (msg) => {
        console.log('msg', msg);
        if (this.platform.is('ios')) {
          this.showToast(msg.aps.alert);
        } else {
          this.showToast(msg.body);
        }
      });
  }*/

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });

    toast.present(); 
  }

}



