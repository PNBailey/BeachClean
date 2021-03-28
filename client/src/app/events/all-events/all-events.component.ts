import { Component, OnInit } from '@angular/core';
import { beachCleanEvent } from 'src/app/models/beachCleanEvent';
import { eventParams } from 'src/app/models/eventParams';
import { Pagination } from 'src/app/models/pagination';
import { AccountService } from 'src/app/shared/account.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent implements OnInit {

  constructor(private accountService: AccountService) { }
  events: beachCleanEvent[];
  eventPagination: Pagination;
  eventParams: eventParams;

  ngOnInit() {
    this.eventParams = new eventParams();
    this.getEvents();
  }

  getEvents() {
    this.accountService.getAllEvents(this.eventParams).subscribe(response => {
      this.events = response.result;
      this.eventPagination = response.pagination;
      console.log(this.events);
    });
  }

  pageChanged(event: any) {
    this.eventParams.pageNumber = event.page;
    this.accountService.setEventParams(this.eventParams);
    this.getEvents();
  }

}
