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
import { FriendsComponent } from './friends/friends.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TimeagoModule } from 'ngx-timeago';
import { CreateEventComponent } from './events/create-event/create-event.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DateInputComponent } from './date-input/date-input.component';
import { EditEventComponent } from './events/edit-event/edit-event.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 


 




@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    EditProfileComponent,
    TextInputComponent,
    FriendsComponent,
    MemberCardComponent,
    MemberDetailComponent,
    CreateEventComponent,
    DateInputComponent,
    EditEventComponent
    
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
    NgxSpinnerModule,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    TimeagoModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FontAwesomeModule
    
    

 
    
  ],
  providers: [HttpClientModule, 
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
