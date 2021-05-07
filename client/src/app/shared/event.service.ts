import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable } from "rxjs";
import { switchMap, switchMapTo, tap } from "rxjs/operators";
import { BeachCleanEvent } from "../models/beachCleanEvent";
import { EventParams } from "../models/eventParams";
import { Member } from "../models/member";
import { Photo } from "../models/photo";
import { MemberService } from "./member.service";
import { PaginationService } from "./pagination.service";

@Injectable({
    providedIn: 'root'
  })
export class EventService {

    constructor(private http: HttpClient, private paginationService: PaginationService, private memberService: MemberService, private route: Router, private toastr: ToastrService) {}

    private allEventsParams$: BehaviorSubject<EventParams> = new BehaviorSubject(new EventParams()); 
    private userEvent$: BehaviorSubject<EventParams> = new BehaviorSubject(new EventParams()); 
    baseUrl: string = "https://localhost:5001/api/events";
    attendeesSubject$: BehaviorSubject<string> = new BehaviorSubject("");
    attendeeUsername: string = "";

    getEventParams() {
        return this.allEventsParams$;
      }
    
      setAllEventParams(eventParams: EventParams) {
        this.allEventsParams$.next(eventParams);
      }

      allEvents$ = this.allEventsParams$.pipe(
        switchMap(eventParams => this.getAllEvents(eventParams))
      );  


      addEvent(event: BeachCleanEvent) {
        this.http.post(this.baseUrl + '/', event).pipe(tap(eventId => {
          this.route.navigate(['../edit-event/', eventId]);
          this.toastr.success("Event created");
        })).subscribe();
      }
    
      getEvent(id: Number) {
        return this.http.get<BeachCleanEvent>(`${this.baseUrl}/${id}`);
      }
    
      getAllEvents(eventParams: EventParams) {
        return this.paginationService.getPaginatedResult<Partial<BeachCleanEvent[]>>(`${this.baseUrl}/`, eventParams);
      }

      getUserEvents(eventParams: EventParams) {
        return this.paginationService.getPaginatedResult<Partial<BeachCleanEvent[]>>(`${this.baseUrl}/userEvents/${eventParams.username}`, eventParams);
      }
      
    
    
      updateEvent(updatedEvent: BeachCleanEvent) {
        return this.http.put(`${this.baseUrl}/`, updatedEvent);
      }
    
      setMainPhoto(eventId: Number, image: Photo) {
        return this.http.put(`${this.baseUrl}/set-main-photo/${eventId}`, image);
      }
    
      deletePhoto(eventId: Number, imageId: Number) {
        return this.http.delete(`${this.baseUrl}/deletePhoto/${eventId}/${imageId}`);
      }
    
      addOrganiser(eventId: Number, organiserId: Number) {
        return this.http.put(`${this.baseUrl}/add-organiser/${eventId}/${organiserId}`, {});
      }
    
      removeOrganiser(eventid: Number, organiserId: Number) {
        return this.http.delete(`${this.baseUrl}/removeOrganiser/${eventid}/${organiserId}`);
      }

      addAttendee(eventId: Number, attendeeUsername: string) {
        return this.http.put<Member>(`${this.baseUrl}/add-attendee/${eventId}/${attendeeUsername}`, {});
      }

      removeAttendee(eventId: Number, attendeeUsername: string) {
       this.http.delete(`${this.baseUrl}/removeAttendee/${eventId}/${attendeeUsername}`).pipe(tap(() => {
          this.toastr.success("Attendee Removed");
        })).subscribe();
      }



    

}