import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import {
  ToastController
} from '@ionic/angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class FcmService {

  constructor(private firebase: Firebase,
              private afs: AngularFirestore,
              private platform: Platform,
              public toastCtrl: ToastController,
              private http: HttpClient) {}

  async getToken() {

    
    window.alert('token.. ');
    let token;

    if (this.platform.is('android')) {
      window.alert('android.. ');
    
      this.firebase.getToken().then(
        token => { 
          window.alert('this.firebase.getToken(): ' + JSON.stringify(token));
        })
        .catch(error => window.alert('error: ' + JSON.stringify(error)));
      // token = await this.firebase.getToken();
    }

    if (this.platform.is('ios')) {
      window.alert('ios.. ');
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }

    window.alert('token getToken.. ' + token);
    this.saveToken(token);
  }


  listenToNotifications() {
    return this.firebase.onNotificationOpen();
  }

  async onTokenRefresh() {
      return await this.firebase.onTokenRefresh()
        .subscribe((token: string) => {
          this.saveToken(token);
          console.log(`Got a new token ${token}`);
        });;
  }

  async subscribeToTopic(topic) {
    return await this.firebase.subscribe(topic);
  }




  private saveToken(token) {


    this.showToast('saveToken: ' + token);

    if (!token) return;

    const devicesRef = this.afs.collection('devices');

    const data = {
      token,
      userId: 'tuxcar_mapsUser'
    };

    return devicesRef.doc(token).set(data);
  }

  onNotifications() {
    this.subscribeToTopic('all'); // esto viene de la de 93-fcm
    return this.firebase.onNotificationOpen();
  } 

    //Add this function and call it where you want to send it.
  sendNotification() {   // esto viene de la de 93-fcm
  let body = {
      "notification":{
        "title":"New Notification has arrived",
        "body":"Notification Body",
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
      },
      "data":{
        "param1":"value1",
        "param2":"value2"
      },
        "to":"/topics/all",
        "priority":"high",
        "restricted_package_name":""
    }
    this.showToast(JSON.stringify(body));
    let options = new HttpHeaders().set('Content-Type','application/json');

    this.http.post("https://fcm.googleapis.com/fcm/send", body, {
      headers: options.set('Authorization', 'key=AAAANomse-4:APA91bEphhfzZJua5d_gveXLy-cFxyE79rMflmPbWzlT_i9-brWTaqmDpdbRLeg66o1jTza5FjrOAYM3i5qEjXyvwlMXmJesxy8sBirMoH3PxOcBW8QVGA5wN-UAmSTwQk5sPKXGi5Cp'),
    }).subscribe();
  }  
  
  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });

    toast.present(); 
  }

}
