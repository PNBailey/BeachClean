import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { LoginUser } from '../models/loginUser';
import { RegisterUser } from '../models/registerUser';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  currentUserSource = new ReplaySubject<User>(1);
  currentUser = this.currentUserSource.asObservable();
  baseUrl: string = "https://localhost:5001/api";
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

  getMember(userName: string) {
    return this.http.get<Member>(this.baseUrl + `/users/${userName}`);
  }

  getMembers(page?: number, itemsPerPage?: number) {
    let params = new HttpParams(); 

    if(page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page.toString()); 
      params = params.append('pageSize', itemsPerPage.toString());
    }
    
    return this.http.get<Member[]>(this.baseUrl + '/users', {observe: 'response', params}).pipe(
    map(response => {
      this.paginatedResult.result = response.body; 
      if(response.headers.get('Pagination') !== null) {
        this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return this.paginatedResult;
    })
      
    );
  }

  register(user: RegisterUser) {
    return this.http.post(this.baseUrl + '/account/register', user).pipe(
      map((user: User) => { 
        if(user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
      
    );
    
  }

  login(user: LoginUser) {
    return this.http.post(this.baseUrl + '/account/login', user).pipe(
      map((user: User) => {
        if(user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
          this.setCurrentUser(user);
        }
      }) 
    );
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + '/users', member);
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    
  }


}
