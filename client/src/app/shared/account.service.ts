import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, ReplaySubject } from 'rxjs';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { Member } from '../models/member';
import { MemberParams } from '../models/memberParams';
import { beachCleanEvent } from '../models/beachCleanEvent';
import { Photo } from '../models/photo';
import { eventParams } from '../models/eventParams';
import { PaginationService } from './pagination.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private paginationService: PaginationService) { 
      this.memberParams = new MemberParams();
      

  }

  currentUserSource = new ReplaySubject<User>(1);
  currentUser = this.currentUserSource.asObservable();
  baseUrl: string = "https://localhost:5001/api";
  memberParams: MemberParams;
  memberCache = new Map();
  eventParams: eventParams;

  getmemberParams() {
    return this.memberParams;
  }

  setMemberParams(memberParams: MemberParams) {
    this.memberParams = memberParams;
  }


  getEventParams() {
    return this.eventParams;
  }

  setEventParams(eventParams: eventParams) {
    this.eventParams = eventParams;
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

  getMembers(memberParams: MemberParams) {

    const response = this.memberCache.get(Object.values(memberParams).join('-'));

    if(response) {
      return of(response);
    }

    let params = new HttpParams(); 

      params = params.append('pageNumber', memberParams.pageNumber.toString()); 
      params = params.append('pageSize', memberParams.pageSize.toString());
      params = params.append('usersLocation', memberParams.usersLocation);
    
    
    return this.paginationService.getPaginatedResult<Member[]>(`${this.baseUrl}/users`, memberParams).pipe(map(response => {
      this.memberCache.set(Object.values(memberParams).join('-'), response);
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

  

   
    addEvent(event: beachCleanEvent) {
     return this.http.post(this.baseUrl + '/events', event);
    }

    getEvent(id: Number) {
      return this.http.get<beachCleanEvent>(`${this.baseUrl}/events/${id}`);
    }

    getAllEvents(eventParams: eventParams) {
      return this.paginationService.getPaginatedResult<Partial<beachCleanEvent[]>>(`${this.baseUrl}/events`, eventParams);
    }
    

    updateEvent(updatedEvent: beachCleanEvent) {
      return this.http.put(`${this.baseUrl}/events`, updatedEvent);
    }

    setMainPhoto(eventId: Number, image: Photo) {
      return this.http.put(`${this.baseUrl}/events/set-main-photo/${eventId}`, image);
    }

    deletePhoto(eventId: Number, imageId: Number) {
      return this.http.delete(`${this.baseUrl}/events/deletePhoto/${eventId}/${imageId}`);
    }

    addOrganiser(eventId: Number, organiserId: Number) {
      return this.http.put(`${this.baseUrl}/events/add-organiser/${eventId}/${organiserId}`, {});
    }

    removeOrganiser(eventid: Number, organiserId: Number) {
      return this.http.delete(`${this.baseUrl}/events/removeOrganiser/${eventid}/${organiserId}`);
    }

}
