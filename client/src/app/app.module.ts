import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ErrorInterceptor } from 'Interceptors/error.interceptor';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { FileUploadModule } from 'ng2-file-upload';
import { LoadingInterceptor } from './interceptor/loading.interceptor';
import { NgxSpinnerModule } from "ngx-spinner";
import { TextInputComponent } from './text-input/text-input.component';



@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    EditProfileComponent,
    TextInputComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({ // This is for user notifications
      positionClass: 'toast-bottom-right'
    }),
    BsDropdownModule.forRoot(),
    FileUploadModule,
    NgxSpinnerModule

 
    
  ],
  providers: [HttpClientModule, 
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
