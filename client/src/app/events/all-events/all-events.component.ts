import { Component, OnInit } from '@angular/core';
import { BeachCleanEvent } from 'src/app/models/beachCleanEvent';
import { EventParams } from 'src/app/models/eventParams';
import { Pagination } from 'src/app/models/pagination';
import { AccountService } from 'src/app/shared/account.service';
import { EventService } from 'src/app/shared/event.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent implements OnInit {

  constructor(private accountService: AccountService, private eventService: EventService) { }
  events: BeachCleanEvent[];
  eventPagination: Pagination;
  eventParams: EventParams;

  ngOnInit() {
    this.eventParams = new EventParams();
    this.getEvents();
  }

  getEvents() {
    this.eventService.getAllEvents(this.eventParams).subscribe(response => {
      this.events = response.result;
      this.eventPagination = response.pagination;
      console.log(this.events);
    });
  }

  pageChanged(event: any) {
    this.eventParams.pageNumber = event.page;
    this.eventService.setEventParams(this.eventParams);
    this.getEvents();
  }

}
