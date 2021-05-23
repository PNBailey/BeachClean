import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AllEventsComponent } from './events/all-events/all-events.component';
import { CreateEventComponent } from './events/create-event/create-event.component';
import { ViewEventComponent } from './events/view-event/view-event.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { AuthGuard } from './guards/auth.guard';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  { path: '', component: AllEventsComponent, canActivate: [AuthGuard]},  
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'edit-profile', runGuardsAndResolvers: 'always', component: EditProfileComponent, canActivate: [AuthGuard], canDeactivate: [PreventUnsavedChangesGuard]},
  {path: 'friends', component: MemberListComponent, canActivate: [AuthGuard]},
  {path: 'friends/:username', component: MemberDetailComponent, canActivate: [AuthGuard]},
  {path: 'create-event', component: CreateEventComponent, canActivate: [AuthGuard]},
  {path: 'view-event/:id', component: ViewEventComponent, canActivate: [AuthGuard]},
  {path: 'events', component: AllEventsComponent, canActivate: [AuthGuard]},
  {path: '**', component: AllEventsComponent, canActivate: [AuthGuard], pathMatch: 'full'}
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
