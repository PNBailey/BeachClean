import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { TextInputComponent } from '../text-input/text-input.component';



@NgModule({
  declarations: [ RegisterComponent, TextInputComponent ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({ // This is for user notifications
      positionClass: 'toast-bottom-right'
    }),
    
  ],
  exports: [  
    ToastrModule
  ]
})
export class RegisterModule { }
