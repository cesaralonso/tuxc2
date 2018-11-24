import { HttpClientModule } from '@angular/common/http';
import { ViajeService } from './shared/services/viaje.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';
import { FcmService } from './shared/services/fcm.service';

const config = {
  apiKey: "AIzaSyDdGiBzqvzVX1FJ-1X0W_TdqtpioOIIiyM",
  authDomain: "tuxcar-fcm.firebaseapp.com",
  databaseURL: "https://tuxcar-fcm.firebaseio.com",
  projectId: "tuxcar-fcm",
  storageBucket: "tuxcar-fcm.appspot.com",
  messagingSenderId: "234238016494"
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentsModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ViajeService,
    Firebase,
    FcmService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
