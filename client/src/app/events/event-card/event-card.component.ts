import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BeachCleanEvent } from 'src/app/models/beachCleanEvent';
import { faCalendar, faLocationArrow, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Member } from 'src/app/models/member';
import { AccountService } from 'src/app/shared/account.service';
import { take } from 'rxjs/operators';
import { EventService } from 'src/app/shared/event.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit, OnDestroy {
  @Input() existingEvent: BeachCleanEvent;
  faTrash = faTrash;
  faLocationArrow = faLocationArrow;
  faCalendar = faCalendar;
  currUserUsername: string;
  eventServiceSub: Subscription = new Subscription();

  constructor(private accountService: AccountService, private eventService: EventService, private toastr: ToastrService) { }

  ngOnInit() {
    this.accountService.currentUserSource.pipe(take(1)).subscribe((user) => {
      this.currUserUsername = user.userName;
    })
  }

  addAttendee() {
   this.eventServiceSub = this.eventService.addAttendee(this.existingEvent.id, this.currUserUsername).subscribe(() => {
    this.toastr.success(`You are attending the event: ${this.existingEvent.name}`);
   });
  }

  ngOnDestroy() {
    this.eventServiceSub.unsubscribe();
  }

}
