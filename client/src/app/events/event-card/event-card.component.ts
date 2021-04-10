import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BeachCleanEvent } from 'src/app/models/beachCleanEvent';
import { faCalendar, faLocationArrow, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'src/app/shared/account.service';
import { take } from 'rxjs/operators';
import { EventService } from 'src/app/shared/event.service';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from 'src/app/shared/member.service';
import { Member } from 'src/app/models/member';


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
  subscriptions: Subscription[] = [];
  attendee$: Observable<Member>;

  constructor(private accountService: AccountService, private eventService: EventService, private toastr: ToastrService) { }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUserSource.pipe(take(1)).subscribe((user) => {
      this.currUserUsername = user.userName;
    }));


  }

  addAttendee() {
   this.subscriptions.push(this.eventService.addAttendee(this.existingEvent.id, this.currUserUsername).subscribe((member) => {
     this.existingEvent.attendees.push(member);
    this.toastr.success(`You are attending the event: ${this.existingEvent.name}`);
   }));

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

}
