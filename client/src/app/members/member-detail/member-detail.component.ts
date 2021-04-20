import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faBriefcase, faLocationArrow, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { Member } from 'src/app/models/member';
import { Pagination } from 'src/app/models/pagination';
import { AccountService } from 'src/app/shared/account.service';
import { FriendsService } from 'src/app/shared/friends.service';
import { MemberService } from 'src/app/shared/member.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  member: Observable<Member>;
  likedUsers: Observable<Pagination>;
  // userLiked: boolean = false;
  likedUser: Member;
  addLikeSub = new Subscription();
  faLocationArrow = faLocationArrow;
  faUser = faUser;
  faBriefcase = faBriefcase;
  faUsers = faUsers;

  constructor(private route: ActivatedRoute, private accountService: AccountService, private toastr: ToastrService, private friendService: FriendsService, private memberService: MemberService) { }

  ngOnInit(): void {
    
    this.member = this.memberService.getMember(this.route.snapshot.paramMap.get('username')); 
    this.likedUsers = this.friendService.getPaginatedLikes();
    
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

}
