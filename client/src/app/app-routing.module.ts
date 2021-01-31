import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditProfileResolverService } from './edit-profile/edit-profile-resolver.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  { path: '', component: HomeComponent},  
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'edit-profile', component: EditProfileComponent, canActivate: [AuthGuard], canDeactivate: [PreventUnsavedChangesGuard]},
  {path: '**', component: HomeComponent, pathMatch: 'full'}
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
