import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { NavComponent } from './nav.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';



@NgModule({
  declarations: [ NavComponent ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BsDropdownModule.forRoot()
  ]
})
export class NavModule { }
