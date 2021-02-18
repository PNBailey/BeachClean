import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if(error) {
          switch(error.status) {
            case 400: 
              if(error.error.errors) {
                const modalStateErrors = [];

                for(const key in error.error.errors) {
                  if(error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key]);
                  }
                }
                throw modalStateErrors.flat();
              }
              else if(typeof(error.error) === 'object') // This checks to see whether the error.error is an object. As there are various different types of 400 errors, we need to accomodate all the different types. If it is a standard 400 error with no message, then an error object will be returned as the error 
             { 

              this.toastr.error(error.statusText, error.status); // If there is no error in the errors array that comes from our api, then the error can be handled by the toastr
            } else {
                this.toastr.error(error.statusText, error.status);
              }
              break;
              case 401: 
              this.toastr.error(error.statusText, error.status)
              break;
              case 404: 
              this.router.navigateByUrl('/not-found');
              break;
              case 500: 
              const navigationExtras: NavigationExtras = {state: {error: error.error}};
              this.router.navigateByUrl('/not-found', navigationExtras);
              break;
              default:
                this.toastr.error('something unexpected went wrong');
                console.log(error);
                break;
          }
        }

        return throwError(error);
      }) 
    );
  }
}
