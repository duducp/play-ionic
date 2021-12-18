import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CpfPipe} from './cpf.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule,
  ],
  providers: [
    HttpClient,
  ],
  declarations: [HomePage, CpfPipe]
})
export class HomePageModule {}
