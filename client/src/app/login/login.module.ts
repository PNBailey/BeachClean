import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { LoginComponent } from './login.component';
import { ToastrModule } from 'ngx-toastr';
import { TextInputComponent } from '../text-input/text-input.component';



@NgModule({
  declarations: [TextInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({ // This is for user notifications
      positionClass: 'toast-bottom-right'
    })
  ],
  exports: [    
    ToastrModule
  ]
})
export class LoginModule { }
