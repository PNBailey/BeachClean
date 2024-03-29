import { AfterContentInit, AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  faBan,
  faCalendar,
  faCalendarCheck,
  faLocationArrow,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { BeachCleanEvent } from 'src/app/shared/models/beachCleanEvent';
import { LikesParams } from 'src/app/shared/models/likesParams';
import { Member } from 'src/app/shared/models/member';
import { Photo } from 'src/app/shared/models/photo';
import { User } from 'src/app/shared/models/user';
import { AccountService } from 'src/app/shared/services/account.service';
import { EventService } from 'src/app/shared/services/event.service';
import { FriendsService } from 'src/app/shared/services/friends.service';
import {} from 'googlemaps';

@Component({
  selector: 'app-edit-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css'],
})
export class ViewEventComponent implements OnInit, OnDestroy {
  currentUser: User;
  editEventForm: FormGroup;
  addOrganiserForm: FormGroup;
  minDate: Date;
  uploader: FileUploader;
  baseUrl: string = 'https://localhost:5001/api';
  event: BeachCleanEvent;
  eventId: number;
  likeParams: LikesParams;
  friends: Member[] = [];
  faTrash = faTrash;
  faLocationArrow = faLocationArrow;
  faCalendar = faCalendar;
  faBan = faBan;
  faUpload = faUpload;
  faCalendarCheck = faCalendarCheck;
  filteredOptions: Observable<Member[]>;
  subs: Subscription[] = [];
  enableEditEvent = false;
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    // This allows us to show a warning message if the user tries to close a tab (or go to google for example) and asks them if they want to leave the page as any changes made to the form will be lost. The hostlistener gives us access to browser events

    if (this.editEventForm.dirty) {
      $event.returnValue = true;
    }
  }


  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private eventService: EventService,
    private friendService: FriendsService
  ) {}

  ngOnInit(): void {
    
    this.eventId = this.route.snapshot.params['id'];
    this.subs.push(
      this.eventService.getEvent(this.eventId).subscribe((event) => {
        this.event = event;
        this.initializeUploader();
        this.checkEnableEdit();
        this.editEventForm.patchValue({ name: event.name });
        this.editEventForm.patchValue({ location: event.location });
        if (this.event.mainPhotoUrl == null) {
          this.event.mainPhotoUrl = '../../assets/images/Picture-icon.png';
        }
      })
    );
    this.accountService.currentUserSource.pipe(take(1)).subscribe((user) => {
      this.currentUser = user;
    });
    this.minDate = new Date();
    this.initializeForm();
    this.filteredOptions = this.addOrganiserForm.controls[
      'organisers'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    
    
    
  }

  checkEnableEdit() {
    if(this.event.creator.userName == this.currentUser.userName) {
      this.enableEditEvent = true;
    } else if(this.event.organisers.find(organiser => organiser.userName == this.currentUser.userName)) {
      this.enableEditEvent = true;
    }
  };
  

  private _filter(value: string) {
    if(value) {
      const filterValue = value.toLowerCase();
      return this.friends.filter((friend) =>
        friend.userName.toLowerCase().includes(filterValue)
      );
    }
  }

  getFriendsOnFocus() {
    if (this.friends.length == 0) {
      this.subs.push(this.friendService.getFullLikes().subscribe((friends) => {
        this.friends = friends;
      }));
    }
  }

  initializeForm() {
    this.editEventForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      Date: [''],
      id: [''],
      // Time: ['', Validators.required],
    });
    this.addOrganiserForm = this.formBuilder.group({
      organisers: [''],
    });
  }

  editEvent() {
    this.editEventForm.patchValue({ id: this.eventId });
    this.subs.push(
      this.eventService.updateEvent(this.editEventForm.value).subscribe(() => {
        this.toastr.success('Event Successfully Updated');
        if (this.editEventForm.controls['Date'].value != '') {
          this.event.date = this.editEventForm.controls['Date'].value;
        }
        this.event.location = this.editEventForm.controls['location'].value;
        this.event.name = this.editEventForm.controls['name'].value;
        this.editEventForm.markAsPristine();
      })
    );
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
    });
    this.uploader.onAfterAddingFile = (file => {
      file.withCredentials = false;
    }); // If we didn't specify this, we would need to make adjustments to our CORS configuration and allow credentials to go up with our request
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        
        const photo = JSON.parse(response); // This gets the photo from the JSON data that is retrieved
        this.event.photos.push(photo);
        if (this.event.mainPhotoUrl == '../../assets/images/Picture-icon.png') {
          this.event.mainPhotoUrl = photo.url;
        }
        this.toastr.success('Photo added');
      }
    };
   
  }

  setMainPhoto(photo: Photo) {
    const currentMainPhoto = this.event.photos.find((photo) => photo.mainPhoto);
    if (currentMainPhoto) {
      currentMainPhoto.mainPhoto = false;
    }
    photo.mainPhoto = true;
    this.subs.push(
      this.eventService.setMainPhoto(this.eventId, photo).subscribe(() => {
        this.event.mainPhotoUrl = photo.url;
        this.toastr.success('Main Photo Set');
      })
    );
  }

  deletePhoto(photo: Photo) {
    this.subs.push(
      this.eventService.deletePhoto(this.eventId, photo.id).subscribe(() => {
        const photoIndex = this.event.photos.findIndex((p) => p == photo);
        this.event.photos.splice(photoIndex, 1);
        if (this.event.mainPhotoUrl == photo.url) {
          this.event.mainPhotoUrl = '../../assets/images/Picture-icon.png';
        }
        this.toastr.success('Photo deleted');
      })
    );
  }

  addOrganiser() {
    const friend = this.friends.find(
      (friend) =>
        friend.userName == this.addOrganiserForm.controls['organisers'].value
    );
    this.event.organisers.push(friend);
    this.subs.push(
      this.eventService.addOrganiser(this.eventId, friend.id).subscribe(() => {
        this.toastr.success('Organiser added');
        this.addOrganiserForm.reset();
      })
    );
  }

  removeOrganiser(organiserId: Number) {
    this.subs.push(
      this.eventService
        .removeOrganiser(this.eventId, organiserId)
        .subscribe(() => {
          this.event.organisers.splice(
            this.event.organisers.findIndex(
              (organiser) => organiser.id == organiserId
            ),
            1
          );
          this.toastr.success('Organiser removed');
        })
    );
  }

  removeAttendee(attendee: Member) {
    this.eventService.removeAttendee(this.eventId, attendee.userName).subscribe(() => {
      this.toastr.success("Attendee removed");
      this.event.attendees.splice(this.event.attendees.indexOf(attendee), 1);
    });
    
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
