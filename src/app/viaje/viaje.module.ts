import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViajeComponent } from './viaje.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    component: ViajeComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViajeComponent]
})
export class ViajeModule { }
