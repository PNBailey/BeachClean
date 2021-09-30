import { Pipe, PipeTransform } from '@angular/core';
import { BeachCleanEvent } from '../models/beachCleanEvent';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(beachCleanEvents: BeachCleanEvent[], locationFilter: string): BeachCleanEvent[] {

    if (locationFilter == '') {
      return beachCleanEvents;
    }

    const resultsArr = beachCleanEvents.filter(e => e.location == locationFilter);

    return resultsArr;

  }

}
