import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LikesParams } from '../../shared/models/likesParams';
import { Member } from '../../shared/models/member';
import { PaginatedResult, Pagination } from '../../shared/models/pagination';
import { User } from '../../shared/models/user';
import { MemberParams } from '../../shared/models/memberParams';
import { AccountService } from '../../shared/services/account.service';
import { FriendsService } from '../../shared/services/friends.service';
import { MemberService } from '../../shared/services/member.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-friends',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit, OnDestroy {

  members: Member[];
  membersPagination: Pagination;
  memberParams: MemberParams;
  likeParams: LikesParams;
  user: User;
  userLikedSub: Subscription;
  membersObs$: Observable<PaginatedResult<Member[]>>;
  friendsObs$: Observable<PaginatedResult<Member[]>>;
  friendsPaginatedResult: PaginatedResult<Member[]>;
  subs: Subscription[] = [];
 
  


  constructor(public accountService: AccountService, private friendService: FriendsService, private memberService: MemberService) { }

  ngOnInit() {
    this.subs.push(this.accountService.currentUserSource.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.subs.push(this.friendService.friends$.subscribe(response => {
        console.log(response);
        response.result.forEach(friend => {
          friend.isLiked = true;
        })
        this.friendsPaginatedResult = response;
      }));
    }));
    this.membersObs$ = this.memberService.members$;
    this.memberParams = new MemberParams();
    this.likeParams = new LikesParams();
    this.loadFriends();
    this.loadMembers();
    this.subs.push(this.userLikedSub = this.friendService.likeToggled.subscribe(() => {
      this.loadFriends();
    }));
    
  }

  loadMembers() {
    this.memberService.setMemberParams(this.memberParams);
  }

  loadFriends() {
    this.friendService.setLikeParams(this.likeParams);
    
  }

  getLocalUsers(usersLocation: string) {

    this.memberParams.usersLocation = usersLocation;
    this.memberService.setMemberParams(this.memberParams);

  }

  getAllUsers() {
    this.memberParams.usersLocation = "allLocations";
    this.loadMembers();
  }

  pageChangedFriends(event: any) {
    this.likeParams.pageNumber = event.page;
    this.friendService.setLikeParams(this.likeParams);
  
  }

  pageChangedMembers(event: any) {
    this.memberParams.pageNumber = event.page;
    this.memberService.setMemberParams(this.memberParams);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }
}
