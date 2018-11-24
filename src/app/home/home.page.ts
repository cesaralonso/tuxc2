import { FcmService } from './../shared/services/fcm.service';
import { ViajeService } from './../shared/services/viaje.service';
import { Router } from '@angular/router';
import { Keyboard } from '@ionic-native/keyboard';
import { AppRoutingModule } from './../app-routing.module';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Searchbar } from '@ionic/angular';
import {
  ToastController,
  Platform,
  LoadingController
} from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  Geocoder,
  GeocoderResult,
  ILatLng,
  LatLng,
  Polyline
} from '@ionic-native/google-maps';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  map: GoogleMap;
  loading: any;

  elegirDestino: boolean = false;
  estado: string = '';
  destinoElegido: boolean = false;
  
  _origen: ILatLng;
  _destino: ILatLng;
  _strAddressDestino: string = '';
  _strAddressOrigen: string = '';

  location: string;
  accion: string = 'Elegir Origen';

  @ViewChild('address', { read: ElementRef}) 
  address: ElementRef<any>;


  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private router: Router,
    private platform: Platform,
    private viajeService: ViajeService,
    private fcm: FcmService) { }

  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();
    await this.loadMap();
  }

  sendNotification() {
    this.fcm.sendNotification();
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 19.7123466,
          lng: -103.4626141
        },
        zoom: 18,
        tilt: 30
      }
    });

    this.onLocalizar();
  }

  async onComenzar() {
    this.accion = 'Elegir Origen';
    this.elegirDestino = false;
    this.destinoElegido = false;
    this._strAddressOrigen = '';
    this._strAddressDestino = '';
    this._origen = null;
    this._destino = null;
    this.onLocalizar();
  }

  async onLocalizar() {
    this.map.clear();

    this.loading = await this.loadingCtrl.create({
      content: 'Localizándote...'
    });
    await this.loading.present();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      
      this.accion = 'Origen Elegido';
      this.loading.dismiss();
      console.log(JSON.stringify(location, null ,2));
      
      // latLng origen para Polyline
      this._origen =  location.latLng;

      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: this._origen,
        zoom: 17,
        tilt: 30
      });

      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: this._origen,
        zoom: 17,
        tilt: 30,
        bearing: 140,
        duration: 500
      })
      .then(() => {

        // Obtiene la información de una posición (calle, localidad, estado, etc..)
        Geocoder.geocode({
            "position": this._origen
          })
          .then((results: GeocoderResult[]) => {

            if (results.length == 0) {
              // Not found
              return null;
            }

            // Cadena con la dirección completa de origen
            this._strAddressOrigen =  [
              results[0].subThoroughfare || "",
              results[0].thoroughfare || "",
              results[0].locality || "",
              results[0].adminArea || "",
              results[0].postalCode || "",
              results[0].country || ""].join(", ");

            this.showToast(this._strAddressOrigen);

            // add a marker
            let marker: Marker = this.map.addMarkerSync({
              title: '¡Esta es mi posición!',
              snippet: '!Presiona PEDIR para que un carro llegue hasta ti!.',
              position: this._origen,
              animation: GoogleMapsAnimation.BOUNCE
            });

            // show the infoWindow
            marker.showInfoWindow();

            // If clicked it, display the alert
            marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
              this.showToast(this._strAddressOrigen);
            });
          })
          .catch(err => {
            this.showToast(err.error_message);
          });
      });
    })
    .catch(err => {
      this.loading.dismiss();
      this.showToast(err.error_message);
    });
  }

  async onPedir() {
    this.accion = 'Elige Destino';
    this.map.clear();

    this.loading = await this.loadingCtrl.create({
      content: 'Ubica tu destino...'
    });
    await this.loading.present();

    this.elegirDestino = true;
    this.loading.dismiss();
  }

  async onDestinoSeleccionado() {
    this.accion = 'Pedir Carro Ahora';

    this.loading = await this.loadingCtrl.create({
      content: 'Buscando carros dispónibles en tu área...'
    });
    await this.loading.present();
    this.destinoElegido = true;

    this.viajeService.origen = this._origen;
    this.viajeService.destino = this._destino;
    this.viajeService.strAddressOrigen = this._strAddressOrigen;
    this.viajeService.strAddressDestino = this._strAddressDestino;

    this.router.navigate(['/viaje']);
    this.loading.dismiss();
  }


  // Establece una dirección de destino despues de haber ya posicionado un origen
  async onBuscarDestino(event) {
    // Presenta loading
    this.loading = await this.loadingCtrl.create({
      content: 'Ubicando destino...'
    });
    await this.loading.present();


    // Limpia Mapa
    this.map.clear();

    // Address -> latitude, longitude
    // Toma el valor del input de la vista para sacar la información de la dirección
    Geocoder.geocode({
      "address": this.address.nativeElement.value
    })
    .then((location: GeocoderResult[]) => {

      this.accion = 'Destino Elegido';

      if (location.length == 0) {
        // Not found
        return null;
      }

      // Cierra el loading
      this.loading.dismiss();

      // latLng destino para Polyline
      this._destino = location[0].position;

      // Cadena con la dirección completa de destino
      this._strAddressDestino = [
        location[0].subThoroughfare || "",
        location[0].thoroughfare || "",
        location[0].locality || "",
        location[0].adminArea || "",
        location[0].postalCode || "",
        location[0].country || ""].join(", ");

      this.showToast(this._strAddressDestino);

      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: this._destino,
        zoom: 17,
        tilt: 30
      });

      // add a marker
      let marker: Marker = this.map.addMarkerSync({
        title: 'Dirección destino',
        snippet: '!Presiona PEDIR AHORA para que un carro llegue hasta ti!.',
        position: this._destino,
        animation: GoogleMapsAnimation.BOUNCE
      });

      // show the infoWindow
      marker.showInfoWindow();

      // If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.showToast(this._strAddressDestino);
      });
              
      // Para quitar de la vista el search input
      this.destinoElegido = true;
    })
    .catch(error => { 
      console.error(error);
      
      this.loading.dismiss();
    });
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
