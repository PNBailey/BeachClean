import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../shared/services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private toastrService: ToastrService, private route: Router) {}

  canActivate(): Observable<boolean> {
   return this.accountService.currentUser.pipe(
      map(user => {
        if(user) return true;
        console.log("fired")
        this.toastrService.error("You need to be logged in to go to this page!");
        this.route.navigate(['./login']);
      })
    )

  }
  x
}
