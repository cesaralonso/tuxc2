import {
  ToastController,
  Platform,
  LoadingController
} from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  ILatLng
} from '@ionic-native/google-maps';
import { ChoferInterface } from './../shared/interfaces/chofer.interface';
import { CarroInterface } from './../shared/interfaces/carro.interface';
import { ViajeService } from './../shared/services/viaje.service';


@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.component.html',
  styleUrls: ['./viaje.component.scss']
})
export class ViajeComponent implements OnInit {
  loading: any;
  origen: ILatLng;
  destino: ILatLng;
  strAddressOrigen: string;
  strAddressDestino: string;
  chofer: ChoferInterface;
  carro: CarroInterface;

  constructor(
    private viajeService: ViajeService,
    private router: Router,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
    ) { 
    this.origen = viajeService.origen; 
    this.destino = viajeService.destino; 
    this.strAddressOrigen = viajeService.strAddressOrigen;
    this.strAddressDestino = viajeService.strAddressDestino;
    this.chofer = viajeService.chofer;
    this.carro = viajeService.carro;
  }

  ngOnInit() {
  }

  async onIniciarViaje() {
    this.showToast('Viaje Iniciado, espera al carro en tu ubicación origen.');
  }

  async onCobrar() {
    this.showToast('Viaje finalizado, puede cobrar ahora.');
  }

  async onCancelar() {
    this.loading = await this.loadingCtrl.create({
      content: 'Viaje Cancelado.'
    });
    await this.loading.present();

    this.router.navigate(['/home']);
    this.loading.dismiss();
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
