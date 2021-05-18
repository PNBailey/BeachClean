import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user';
import { take } from 'rxjs/operators';
import { AccountService } from '../shared/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User;

    this.accountService.currentUser.pipe(take(1)).subscribe(user => currentUser = user);

    

    if(currentUser) { 
      request = request.clone({ // This clones the request if there is a user and this then allows us to then set the headers
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      })
    }

    return next.handle(request);
  }
}
