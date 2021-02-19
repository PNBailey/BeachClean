import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() minDate: Date; // This will be the earliest date tehe date picker will show. We want to restrict access to under 18's so will not allow the user to pick a date of birth which would make them under 18
  bsConfig: Partial<BsDatepickerConfig>; // When we use partial, what we are saying is that every single property inside the specified type (BsDatepickerConfig in this case) is going to be optional. We don't have to provide all of the different config options. We can only provide a few of them and this will be fine. If we didn;t use partial, we would have to use every single config option that BsDatepickerConfig uses

  constructor(@Self() public ngControl: NgControl ) {
    this.ngControl.valueAccessor = this;
    this.bsConfig = {
      containerClass: 'theme-red',
      dateInputFormat: 'DD MMMM YYYY',
      
    }
   }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
 


}
