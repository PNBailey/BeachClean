import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faBriefcase, faLocationArrow, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { LikesParams } from 'src/app/models/likesParams';
import { Member } from 'src/app/models/member';
import { PaginatedResult, Pagination } from 'src/app/models/pagination';
import { AccountService } from 'src/app/shared/account.service';
import { FriendsService } from 'src/app/shared/friends.service';
import { MemberService } from 'src/app/shared/member.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  memberObs$: Observable<Member>;
  friendsObs$: Observable<PaginatedResult<Member[]>>;
  // userLiked: boolean = false;
  likedUser: Member;
  addLikeSub = new Subscription();
  faLocationArrow = faLocationArrow;
  faUser = faUser;
  faBriefcase = faBriefcase;
  faUsers = faUsers;
  friendsPagination: Pagination;
  likeParams: LikesParams;

  constructor(private route: ActivatedRoute, private accountService: AccountService, private toastr: ToastrService, private friendService: FriendsService, private memberService: MemberService) { }

  ngOnInit(): void {
    this.likeParams = this.friendService.getLikeParams();
    this.memberObs$ = this.memberService.getMember(this.route.snapshot.paramMap.get('username')); 
    this.friendsObs$ = this.friendService.getPaginatedLikes();
    
  }

  likeMember(member: Member) {
  this.addLikeSub = this.friendService.addLike(member).subscribe(() => {
      this.toastr.success("Member liked");
    });
  }

  // checkedUserLike(member: Member) {
  //   this.friendService.getFullLikes().subscribe((members) => {
  //     this.likedUser = members.find(x => x.id == member.id);
  //   });
  // }

  ngOnDestroy() {
    this.addLikeSub.unsubscribe();
  }

  pageChanged(event: any) {
    this.likeParams.pageNumber = event.pageNumber;
    this.friendService.setLikeParams(this.likeParams);
  }

}
