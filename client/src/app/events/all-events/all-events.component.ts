import { Component, OnInit } from '@angular/core';
import { beachCleanEvent } from 'src/app/models/beachCleanEvent';
import { AccountService } from 'src/app/shared/account.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent implements OnInit {

  constructor(private accountService: AccountService) { }
  events: beachCleanEvent[];

  ngOnInit() {
    this.accountService.getAllEvents().subscribe(events => {
      this.events = events;
      console.log(this.events);
    });
  }

}
