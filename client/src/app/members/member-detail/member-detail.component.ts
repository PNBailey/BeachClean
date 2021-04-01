import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { Member } from 'src/app/models/member';
import { AccountService } from 'src/app/shared/account.service';
import { FriendsService } from 'src/app/shared/friends.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  member: Observable<Member>;
  // likedUsers: Member[];
  // userLiked: boolean = false;
  likedUser: Member;
  addLikeSub: Subscription;

  constructor(private route: ActivatedRoute, private accountService: AccountService, private toastr: ToastrService, private friendService: FriendsService) { }

  ngOnInit(): void {
    this.member = this.accountService.getMember(this.route.snapshot.paramMap.get('username'));   
  }

  likeMember(member: Member) {
  this.addLikeSub = this.friendService.addLike(member).subscribe(() => {
      this.toastr.success("Member liked");
    });
  }

  checkedUserLike(member: Member) {
    this.friendService.getFullLikes().subscribe((members) => {
      this.likedUser = members.find(x => x.id == member.id);
    });
  }

  ngOnDestroy() {
    this.addLikeSub.unsubscribe();
  }

}
