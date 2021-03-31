import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Member } from 'src/app/models/member';
import { AccountService } from 'src/app/shared/account.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member: Observable<Member>;
  // likedUsers: Member[];
  // userLiked: boolean = false;
  likedUser: Member;

  constructor(private route: ActivatedRoute, private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.member = this.accountService.getMember(this.route.snapshot.paramMap.get('username'));   
  }

  likeMember(member: Member) {
    this.accountService.addLike(member).subscribe(() => {
      this.toastr.success("Member liked");
    });
  }

  // checkedUserLike() {
  //   this.accountService.getFullLikes().subscribe((members) => {
  //     this.likedUser = members.find(member => member.id == this.member.id);
  //   });
  // }

}
