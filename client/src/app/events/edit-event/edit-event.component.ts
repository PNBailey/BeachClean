import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, take } from 'rxjs/operators';
import { beachCleanEvent } from 'src/app/models/beachCleanEvent';
import { LikesParams } from 'src/app/models/likesParams';
import { Member } from 'src/app/models/member';
import { Photo } from 'src/app/models/photo';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/shared/account.service';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';


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
  event: beachCleanEvent;
  eventId: number;
  likeParams: LikesParams;
  friends: Member[] = [];
  
  filteredOptions: Observable<Member[]>;

  constructor(private accountService: AccountService, private formBuilder: FormBuilder, private route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['id'];
    this.accountService.getEvent(this.eventId).subscribe(event => {
      this.event = event;
      this.initializeUploader();
      this.editEventForm.patchValue({ name: event.name });
      this.editEventForm.patchValue({ location: event.location });
      if (this.event.mainPhotoUrl == null) {
        this.event.mainPhotoUrl = "../../assets/images/Picture-icon.png";
      }
    });
    this.accountService.currentUserSource.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    this.minDate = new Date();
    this.initializeForm();
    this.filteredOptions = this.editEventForm.controls['organisers'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    

  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    return this.friends.filter(friend => friend.userName.toLowerCase().includes(filterValue));
  }

  getFriendsOnFocus() {
    if(this.friends.length == 0) {
      this.accountService.getFullLikes().subscribe(friends => {
        this.friends = friends;
        console.log(this.friends);
      });
    }
  }

  initializeForm() {
    this.editEventForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      Date: [''],
      id: [''],
      organisers: ['']
      // Time: ['', Validators.required],


    });
  }

  editEvent() {
    this.editEventForm.patchValue({ id: this.eventId });
    this.accountService.updateEvent(this.editEventForm.value).subscribe(() => {
      this.toastr.success("Event Successfully Updated");
      if (this.editEventForm.controls['Date'].value != "") {
        this.event.date = this.editEventForm.controls['Date'].value;
      }
      this.event.location = this.editEventForm.controls['location'].value;
      this.event.name = this.editEventForm.controls['name'].value;
    });
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
    })
    this.uploader.onAfterAddingFile = (file) =>
      file.withCredentials = false; // If we didn't specify this, we would need to make adjustments to our CORS configuration and allow credentials to go up with our request 

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response); // This gets the photo from the JSON data that is retrieved 
        this.event.photos.push(photo);
        if (this.event.mainPhotoUrl == "../../assets/images/Picture-icon.png") {
          this.event.mainPhotoUrl = photo.url;
        }
        this.toastr.success("Photo added");
      }
    }

  }

  setMainPhoto(photo: Photo) {
    const currentMainPhoto = this.event.photos.find(photo => photo.mainPhoto);
    if (currentMainPhoto) {
      currentMainPhoto.mainPhoto = false;
    }
    photo.mainPhoto = true;
    this.accountService.setMainPhoto(this.eventId, photo).subscribe(() => {
      this.event.mainPhotoUrl = photo.url;
      this.toastr.success("Main Photo Set");
    });
  }

  deletePhoto(photo: Photo) {
    this.accountService.deletePhoto(this.eventId, photo.id).subscribe(() => {
      this.toastr.success("Photo deleted");
      const photoIndex = this.event.photos.findIndex(p => p == photo);
      this.event.photos.splice(photoIndex, 1);
      if (this.event.mainPhotoUrl == photo.url) {
        this.event.mainPhotoUrl = "../../assets/images/Picture-icon.png";
      }
    });
  }

}
