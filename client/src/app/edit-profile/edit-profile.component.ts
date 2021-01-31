import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from '../models/member';
import { Photo } from '../models/photo';
import { User } from '../models/user';
import { AccountService } from '../shared/account.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  @ViewChild('editForm') editForm: NgForm;
  member: Member;
  currentUser: User;
  uploader: FileUploader;
  baseUrl: string = "https://localhost:5001/api";
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) { // This allows us to show a warning message if the user tries to close a tab (or go to google for example) and asks them if they want to leave the page as any changes made to the form will be . The hostlistener gives us access to browser events 

    if(this.editForm.dirty) {
      $event.returnValue = true;
    }

  } 

  constructor(private accountService: AccountService, private toastrService: ToastrService) {
    
    this.accountService.currentUser.pipe(take(1)).subscribe(user => this.currentUser = user);
   }

  ngOnInit(): void {

    this.loadMember();
    this.initializeUploader();  
  }

  loadMember() {
    this.accountService.getMember(this.currentUser.userName.toLowerCase()).subscribe(member => {
      this.member = member;
    });
  }

  updateProfile() {
    console.log(this.member);
    this.accountService.updateMember(this.member).subscribe(() => {
      this.editForm.reset(this.member);
    }, () => {}, () => {
      this.toastrService.success("Profile succesfully updated");
    });
    
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
        this.member.photo = photo;
        this.currentUser.photoUrl = this.member.photo.url;
        this.accountService.setCurrentUser(this.currentUser);
      }
    }

  }

}
