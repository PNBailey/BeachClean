import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
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
  baseUrl: string = "https://localhost:5001/api";
  currentUser: User;
  eventPhotoUrl: string;

  constructor(private formBuilder: FormBuilder, private accountService: AccountService) { }

  ngOnInit() {
    this.accountService.currentUserSource.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    this.initializeUploader();
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
    console.log("submitted")
    this.accountService.addEvent(this.createEventForm.value).subscribe(eventDto => {
      console.log(eventDto);
    } );
  }

  initializeUploader() {
    this.uploader = new FileUploader({
     url: this.baseUrl + '/users/add-photo',
     authToken: 'Bearer ' + this.currentUser.token,
     isHTML5: true,
     allowedFileType: ['image'],
     removeAfterUpload: true,
     autoUpload: false,
     maxFileSize: 10 * 1024 * 1024,
     queueLimit: 1
    })
    this.uploader.onAfterAddingFile = (file) => 
    file.withCredentials = false; // If we didn't specify this, we would need to make adjustments to our CORS configuration and allow credentials to go up with our request 
    
   this.uploader.onSuccessItem = (item, response, status, headers) => {
     if (response) {
       const photo = JSON.parse(response); // This gets the photo from the JSON data that is retrieved from the response 
       this.eventPhotoUrl = photo.url;
     }
   }

 }

}
