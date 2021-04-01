import { HttpClient } from "@angular/common/http";
import { BeachCleanEvent } from "../models/beachCleanEvent";
import { EventParams } from "../models/eventParams";
import { Photo } from "../models/photo";
import { PaginationService } from "./pagination.service";

export class EventService {

    constructor(private http: HttpClient, private paginationService: PaginationService) {}

    eventParams: EventParams;
    baseUrl: string = "https://localhost:5001/api/events";

    getEventParams() {
        return this.eventParams;
      }
    
      setEventParams(eventParams: EventParams) {
        this.eventParams = eventParams;
      }

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

}