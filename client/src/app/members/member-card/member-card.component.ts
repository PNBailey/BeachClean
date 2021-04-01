import { Component, Input, OnInit } from '@angular/core';
import { faEnvelope, faHeart, faLocationArrow, faUser } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/shared/account.service';
import { FriendsService } from 'src/app/shared/friends.service';
import { Member } from '../../models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member;
  faEnvelope = faEnvelope;
  faHeart = faHeart;
  faUser = faUser;
  faLocationArrow = faLocationArrow;

  constructor(private accountService: AccountService, private toastrService: ToastrService, private friendService: FriendsService) { }

  ngOnInit() {
  }

  likeMember(member: Member) {
    this.friendService.addLike(member).subscribe(() => {
      this.toastrService.success(`You have liked ${member.userName}`);
      this.friendService.updateNewLike();
      this.friendService.userLiked.next();
    });
  }



}
