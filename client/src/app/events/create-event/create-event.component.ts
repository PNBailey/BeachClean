import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/shared/account.service';
import { EventService } from 'src/app/shared/event.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  createEventForm: FormGroup;
  minDate: Date;
  uploader: FileUploader;
  currentUser: User;
  

  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private route: Router, private eventService: EventService) { }

  ngOnInit() {
    this.accountService.currentUserSource.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    this.initializeForm();
    if (this.currentUser == null) {
      this.userNotLoggedIn();
    }
    this.minDate = new Date(); 
    
  }

  userNotLoggedIn() {
      setTimeout(() => {
        this.route.navigate(['../login']);
      }, 3000); 
  }


  initializeForm() {
    this.createEventForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      Date: ['', Validators.required],
      Time: ['', Validators.required],
      // MainPhoto: [''],
      organisers: ['']

    })
  }

  createEvent() {
    this.eventService.addEvent(this.createEventForm.value);
  }



}
