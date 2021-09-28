import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { BeachCleanEvent } from 'src/app/shared/models/beachCleanEvent';
import { EventParams } from 'src/app/shared/models/eventParams';
import { PaginatedResult } from 'src/app/shared/models/pagination';
import { User } from 'src/app/shared/models/user';
import { AccountService } from 'src/app/shared/services/account.service';
import { EventService } from 'src/app/shared/services/event.service';
import { MemberService } from 'src/app/shared/services/member.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css'],
})
export class AllEventsComponent implements OnInit {
  constructor(private eventService: EventService, private route: Router, private accountService: AccountService, private memberService: MemberService) {}
  events$: Observable<PaginatedResult<BeachCleanEvent[]>>;
  eventParams: EventParams;
  currentUser: User;

  ngOnInit() {
    this.eventParams = new EventParams(); // The event params are created
    this.events$ = this.eventService.allEvents$; // The event$ observable from the service is assigned to a local variable
    this.getEvents();
    this.memberService.getMembersWithRoles();

  }

  getEvents() {
    this.eventService.setAllEventParams(this.eventParams); // This method is called with the eventParams above. The setAllEventParams triggers a behavior subject observable. The switchmap on the service then takes the value passed into the behavior subject, switches the observable to the getAllEvents observable and passes in the value
  }

  pageChanged(event: any) {
    this.eventParams.pageNumber = event.page;
    this.eventService.setAllEventParams(this.eventParams);
  }




}
