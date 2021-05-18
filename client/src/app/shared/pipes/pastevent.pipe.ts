import { Pipe, PipeTransform } from '@angular/core';
import { BeachCleanEvent } from 'src/app/models/beachCleanEvent';

@Pipe({
  name: 'pastEventPipe'
})
export class PastEventPipe implements PipeTransform {

  pastEvents: BeachCleanEvent[] = [];
  todaysDate = new Date();

  transform(events: BeachCleanEvent[]): BeachCleanEvent[] {
    if(events.length == 0) {
      return events;
    }

    events.forEach((e) => (e.date = new Date(e.date)));
    this.pastEvents = events.filter(
      (existingEvent) => existingEvent.date < this.todaysDate
    );

    return this.pastEvents;
  }

}
