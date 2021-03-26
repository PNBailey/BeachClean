import { Component, Input, OnInit } from '@angular/core';
import { beachCleanEvent } from 'src/app/models/beachCleanEvent';
import { faCalendar, faLocationArrow, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input() existingEvent: beachCleanEvent;
  faTrash = faTrash;
  faLocationArrow = faLocationArrow;
  faCalendar = faCalendar;

  constructor() { }

  ngOnInit(): void {
  }

}
