import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LikesParams } from '../models/likesParams';
import { Member } from '../models/member';
import { Pagination } from '../models/pagination';
import { User } from '../models/user';
import { UserParams } from '../models/userParams';
import { AccountService } from '../shared/account.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  members: Member[];
  friends: Member[];
  friendsPagination: Pagination;
  membersPagination: Pagination;
  userParams: UserParams;
  likeParams: LikesParams;
  user: User;


  constructor(public accountService: AccountService) { }

  ngOnInit() {

    this.userParams = this.accountService.getUserParams();
    this.likeParams = this.accountService.getLikeParams();
    this.loadFriends();
    this.loadMembers();
    this.accountService.userLiked.subscribe(() => {
      this.loadFriends();
    });
  }

  loadMembers() {
    this.accountService.setUserParams(this.userParams);
    this.accountService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.membersPagination = response.pagination;
    });
  }

  loadFriends() {
    this.accountService.setLikeParams(this.likeParams);
    this.accountService.getPaginatedLikes().subscribe(response => {
      this.friends = response.result;
      this.friendsPagination = response.pagination;
    
    });
  }

  getLocalUsers(usersLocation: string) {

    this.userParams.usersLocation = usersLocation;
    this.accountService.setUserParams
    this.loadMembers();
  }

  getAllUsers() {
    this.userParams.usersLocation = "allLocations";
    this.loadMembers();
  }

  pageChangedFriends(event: any) {
    this.likeParams.pageNumber = event.page;
    this.accountService.setLikeParams(this.likeParams);
    this.loadFriends();
  }

  pageChangedMembers(event: any) {
    this.userParams.pageNumber = event.page;
    this.accountService.setUserParams(this.userParams);
    this.loadMembers();
  }
}
