import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { User } from '../models/user';
import { map, take } from 'rxjs/operators';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from '../models/userParams';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { 
    this.currentUserSource.pipe(take(1)).subscribe(user => {
      this.userParams = new UserParams(user);
    })
  }

  currentUserSource = new ReplaySubject<User>(1);
  currentUser = this.currentUserSource.asObservable();
  baseUrl: string = "https://localhost:5001/api";
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();
  userParams: UserParams;

  getUserParams() {
    return this.userParams;
  }

  setUserParams(user: User) {
    this.userParams = new UserParams(user);
  }

  getMember(userName: string) {
    return this.http.get<Member>(this.baseUrl + `/users/${userName}`);
  }

  getMembers(userParams: UserParams) {
    let params = new HttpParams(); 

      params = params.append('pageNumber', userParams.pageNumber.toString()); 
      params = params.append('pageSize', userParams.pageSize.toString());
      params = params.append('location', userParams.usersLocation);
    
    
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

  register(user: any) {
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

  login(user: any) {
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
