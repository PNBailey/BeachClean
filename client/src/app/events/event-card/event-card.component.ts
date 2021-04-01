import { Component, Input, OnInit } from '@angular/core';
import { BeachCleanEvent } from 'src/app/models/beachCleanEvent';
import { faCalendar, faLocationArrow, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input() existingEvent: BeachCleanEvent;
  faTrash = faTrash;
  faLocationArrow = faLocationArrow;
  faCalendar = faCalendar;

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  // goToCreatorsProfile(creatorId: Number) {
  //   this.route.navigate(`../friends/${creatorId}`);
  // }

}
