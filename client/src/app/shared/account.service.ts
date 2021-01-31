import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { LoginUser } from '../models/loginUser';
import { RegisterUser } from '../models/registerUser';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { Member } from '../models/member';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  currentUserSource = new ReplaySubject<User>(1);

  currentUser = this.currentUserSource.asObservable();

  baseUrl: string = "https://localhost:5001/api";

  getMember(userName: string) {
    return this.http.get<Member>(this.baseUrl + `/users/${userName}`);
  }

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + '/users');
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
