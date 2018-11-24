import { Injectable } from '@angular/core';
import {
  ILatLng
} from '@ionic-native/google-maps';
import { ChoferInterface } from './../interfaces/chofer.interface';
import { CarroInterface } from './../interfaces/carro.interface';


@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  strAddressOrigen: string;
  strAddressDestino: string;
  origen: ILatLng;
  destino: ILatLng;
  chofer: ChoferInterface;
  carro: CarroInterface;

  constructor() {

    this.chofer = {
      nombre: 'César',
      telefono: '34162537263'
    }

    this.carro = {
      marca: 'Ford Tida',
      anio: 2019
    }

  }
}
