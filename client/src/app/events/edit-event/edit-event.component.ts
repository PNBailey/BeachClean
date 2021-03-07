import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { beachCleanEvent } from 'src/app/models/beachCleanEvent';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/shared/account.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  currentUser: User;
  editEventForm: FormGroup;
  minDate: Date;
  uploader: FileUploader;
  baseUrl: string = "https://localhost:5001/api";
  eventPhotoUrl: string;
  event: beachCleanEvent;
  eventId: number;

  constructor(private accountService: AccountService, private formBuilder: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['id'];
    this.accountService.getEvent(this.eventId).subscribe(event => {
      this.event = event;
      this.initializeUploader();
      this.eventPhotoUrl = event.mainPhotoUrl;
      this.editEventForm.patchValue({name: event.name});
      this.editEventForm.patchValue({location: event.location});
      this.editEventForm.patchValue({Date: event.date});
      console.log(this.event);
    });
    this.accountService.currentUserSource.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    this.minDate = new Date();
    this.initializeForm();
    
   
    

  }

  initializeForm() {
    this.editEventForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      Date: ['', Validators.required],
      Time: ['', Validators.required],
      // MainPhoto: [''],
      organisers: ['']

    });
  }

    editEvent() {

    }

      initializeUploader() {
    
    this.uploader = new FileUploader({
     url: `${this.baseUrl}/events/add-photo/${this.eventId}`,
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
       if(!this.eventPhotoUrl) {
         this.eventPhotoUrl = photo.url;
       }
       }
   }

 }

}
