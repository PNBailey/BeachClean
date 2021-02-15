import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, ReplaySubject, scheduled } from 'rxjs';
import { User } from '../models/user';
import { map, take } from 'rxjs/operators';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from '../models/userParams';
import { LikesParams } from '../models/likesParams';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { 
      this.userParams = new UserParams();
  }

  currentUserSource = new ReplaySubject<User>(1);
  currentUser = this.currentUserSource.asObservable();
  baseUrl: string = "https://localhost:5001/api";
  userParams: UserParams;
  memberCache = new Map();

  getUserParams() {
    return this.userParams;
  }

  setUserParams(userParams: UserParams) {
    this.userParams = userParams;
  }

  getMember(userName: string) {
    const member = [...this.memberCache.values()].
    reduce((arr, currElem) => arr.concat(currElem.result), []).
    find((member: Member) => member.userName === userName);

    if(member) {
      return of(member);
    }

    return this.http.get<Member>(`${this.baseUrl}/users/${userName}`);
  }

  getMembers(userParams: UserParams) {

    const response = this.memberCache.get(Object.values(userParams).join('-'));

    if(response) {
      return of(response);
    }

    let params = new HttpParams(); 

      params = params.append('pageNumber', userParams.pageNumber.toString()); 
      params = params.append('pageSize', userParams.pageSize.toString());
      params = params.append('usersLocation', userParams.usersLocation);
    
    
    return this.getPaginatedResult<Member[]>(`${this.baseUrl}/users`, userParams).pipe(map(response => {
      this.memberCache.set(Object.values(userParams).join('-'), response);
      return response;
    }));
  }

  register(user: any) {
    return this.http.post(`${this.baseUrl}/account/register`, user).pipe(
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
    return this.http.post(`${this.baseUrl}/account/login`, user).pipe(
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
    return this.http.put(`${this.baseUrl}/users`, member);
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    
  }

  getPaginatedResult<T>(url, params) {

    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, {observe: 'response', params}).pipe(
      map(response => {
        paginatedResult.result = response.body; 
        if(response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      }))
    
    }

    addLike(userName: string) {
      return this.http.post(this.baseUrl + '/likes/' + userName, {});
    }

    getLikes(likesParams: LikesParams) {
      let params = this.getPaginationHeaders(likesParams.pageNumber, likesParams.pageSize);

      params = params.append('predicate', likesParams.predicate);

      return this.getPaginatedResult<Partial<Member[]>>(this.baseUrl + '/likes', params);
    }

    private getPaginationHeaders(pageNumber: number, pageSize: number) {
      let params = new HttpParams();  
  
        params = params.append('pageNumber', pageNumber.toString()); 
        params = params.append('pageSize', pageSize.toString());
  
        return params;
      
    }

}
