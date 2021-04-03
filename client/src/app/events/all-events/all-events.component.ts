import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BeachCleanEvent } from 'src/app/models/beachCleanEvent';
import { EventParams } from 'src/app/models/eventParams';
import { PaginatedResult } from 'src/app/models/pagination';
import { EventService } from 'src/app/shared/event.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent implements OnInit {

  constructor(private eventService: EventService) {}
  events$: Observable<PaginatedResult<BeachCleanEvent[]>>;
  eventParams: EventParams;

  ngOnInit() {
    this.eventParams = new EventParams(); // The event params are created 
    this.events$ = this.eventService.event$; // The event$ observable from the service is assigned to a local variable
    this.getEvents();
  }

  getEvents() {
   this.eventService.setEventParams(this.eventParams); // This method is called with the eventParams above. The setEventParams triggers a behavior subject observable. The switchmap on the service then takes the value passed into the behavior subject, switches the observable to the getAllEvents observable and passes in the value
  }

  pageChanged(event: any) {
    this.eventParams.pageNumber = event.page;
    this.eventService.setEventParams(this.eventParams);
  }

}
