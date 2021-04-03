import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
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

    constructor(private http: HttpClient, private paginationService: PaginationService, private memberService: MemberService) {}

    private eventParams$: BehaviorSubject<EventParams> = new BehaviorSubject(new EventParams()); 
    baseUrl: string = "https://localhost:5001/api/events";
    attendeesSubject$: BehaviorSubject<string> = new BehaviorSubject("");
    attendeeUsername: string = "";

    getEventParams() {
        return this.eventParams$;
      }
    
      setEventParams(eventParams: EventParams) {
        this.eventParams$.next(eventParams);
      }

      event$ = this.eventParams$.pipe(
        switchMap(eventParams => this.getAllEvents(eventParams))
      );  

      addEvent(event: BeachCleanEvent) {
        return this.http.post(this.baseUrl + '/', event);
      }
    
      getEvent(id: Number) {
        return this.http.get<BeachCleanEvent>(`${this.baseUrl}/${id}`);
      }
    
      getAllEvents(eventParams: EventParams) {
        return this.paginationService.getPaginatedResult<Partial<BeachCleanEvent[]>>(`${this.baseUrl}/`, eventParams);
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
        // this.attendeeUsername = attendeeUsername;
        // return this.http.put<Member>(`${this.baseUrl}/add-attendee/${eventId}/${attendeeUsername}`, {}).pipe(switchMap(attendeeUsername => this.memberService.getMember(attendeeUsername)));
        return this.http.put<Member>(`${this.baseUrl}/add-attendee/${eventId}/${attendeeUsername}`, {});
      }

    

}