import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/shared/account.service';
import { Member } from '../../models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member;

  constructor(private accountService: AccountService, private toastrService: ToastrService) { }

  ngOnInit() {
  }

  likeMember(member: Member) {
    this.accountService.addLike(member).subscribe(() => {
      this.toastrService.success(`You have liked ${member.userName}`);
      this.accountService.userLiked.next();
    });
  }



}
