import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { delay, take } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/shared/account.service';

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
  

  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private route: Router) { }

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
    console.log(this.createEventForm.value);
    this.accountService.addEvent(this.createEventForm.value).subscribe(eventId => {
      this.route.navigate(['../edit-event/', eventId]);
    } );
  }



}
