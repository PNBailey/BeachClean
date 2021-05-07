import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BeachCleanEvent } from 'src/app/models/beachCleanEvent';
import {
  faCalendar,
  faCheck,
  faLocationArrow,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'src/app/shared/account.service';
import { take } from 'rxjs/operators';
import { EventService } from 'src/app/shared/event.service';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/models/member';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
})
export class EventCardComponent implements OnInit, OnDestroy {
  @Input() existingEvent: BeachCleanEvent;
  faTrash = faTrash;
  faLocationArrow = faLocationArrow;
  faCalendar = faCalendar;
  faCheck = faCheck;
  currUserUsername: string;
  eventServiceSub: Subscription = new Subscription();
  subscriptions: Subscription[] = [];
  attendee$: Observable<Member>;

  constructor(
    private accountService: AccountService,
    private eventService: EventService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.accountService.currentUserSource.pipe(take(1)).subscribe((user) => {
        this.currUserUsername = user.userName;
        this.existingEvent.attendees.forEach((attendee) => {
          if (attendee.userName == this.currUserUsername) {
            this.existingEvent.isAttending = true;
          }
        });
      })
    );
  }

  addAttendee() {
    this.subscriptions.push(
      this.eventService
        .addAttendee(this.existingEvent.id, this.currUserUsername)
        .subscribe((member) => {
          this.existingEvent.attendees.push(member);
          this.toastr.success(
            `You are attending the event: ${this.existingEvent.name}`
          );
          this.existingEvent.isAttending = true;
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  unattend() {
    this.subscriptions.push(
      this.eventService
        .removeAttendee(this.existingEvent.id, this.currUserUsername)
        .subscribe(() => {
          this.toastr.success('No longer attending event');
          this.existingEvent.attendees.splice(
            this.existingEvent.attendees.indexOf(
              this.existingEvent.attendees.find(
                (attendee) => attendee.userName == this.currUserUsername
              )
            ),
            1
          );
          this.existingEvent.isAttending = false;
        })
    );
  }
}
