import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LikesParams } from '../models/likesParams';
import { Member } from '../models/member';
import { PaginatedResult, Pagination } from '../models/pagination';
import { User } from '../models/user';
import { MemberParams } from '../models/memberParams';
import { AccountService } from '../shared/account.service';
import { FriendsService } from '../shared/friends.service';
import { MemberService } from '../shared/member.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit, OnDestroy {

  members: Member[];
  membersPagination: Pagination;
  memberParams: MemberParams;
  likeParams: LikesParams;
  user: User;
  userLikedSub: Subscription;
  getMembersSub: Subscription;
  friendsSub$: Observable<PaginatedResult<Member[]>>;
  


  constructor(public accountService: AccountService, private friendService: FriendsService, private memberService: MemberService) { }

  ngOnInit() {
    this.friendsSub$ = this.friendService.friends$;
    this.memberParams = this.memberService.getmemberParams();
    this.likeParams = new LikesParams();
    this.loadFriends();
    this.loadMembers();
    this.userLikedSub = this.friendService.userLiked.subscribe(() => {
      this.loadFriends();
    });
  }

  loadMembers() {
    this.memberService.setMemberParams(this.memberParams);
    this.getMembersSub = this.memberService.getMembers(this.memberParams).subscribe(response => {
      this.members = response.result;
      this.membersPagination = response.pagination;
    });
  }

  loadFriends() {
    this.friendService.setLikeParams(this.likeParams);
    
  }

  getLocalUsers(usersLocation: string) {

    this.memberParams.usersLocation = usersLocation;
    this.memberService.setMemberParams(this.memberParams);
    this.loadMembers();
  }

  getAllUsers() {
    this.memberParams.usersLocation = "allLocations";
    this.loadMembers();
  }

  pageChangedFriends(event: any) {
    this.likeParams.pageNumber = event.page;
    this.friendService.setLikeParams(this.likeParams);
    this.loadFriends();
  }

  pageChangedMembers(event: any) {
    this.memberParams.pageNumber = event.page;
    this.memberService.setMemberParams(this.memberParams);
    this.loadMembers();
  }

  ngOnDestroy() {
    this.userLikedSub.unsubscribe();
    this.getMembersSub.unsubscribe();
  }
}
