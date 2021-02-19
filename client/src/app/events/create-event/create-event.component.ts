import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  createEventForm: FormGroup;
  minDate: Date;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
    this.minDate = new Date(); 
  }


  initializeForm() {
    this.createEventForm = this.formBuilder.group({
      eventName: ['', Validators.required],
      location: ['', Validators.required],
      eventDate: ['', Validators.required],
      eventTime: ['', Validators.required],
      organisers: [''],

    })
  }

  createEvent() {

  }

}
