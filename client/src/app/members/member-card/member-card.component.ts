import { Component, Input, OnInit } from '@angular/core';
import { faEnvelope, faHeart, faLocationArrow, faUser } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { FriendsService } from 'src/app/shared/services/friends.service';
import { Member } from '../../shared/models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member;
  @Input() isLiked: boolean;
  faEnvelope = faEnvelope;
  faHeart = faHeart;
  faUser = faUser;
  faLocationArrow = faLocationArrow;

  constructor(private friendService: FriendsService, private toastr: ToastrService) { }



  ngOnInit() {
  }

  likeMember() {
    this.friendService.addLike(this.member);
  }

  unLikeMember() {
    this.friendService.removeLike(this.member).subscribe(() => {
      this.toastr.success(`Unliked ${this.member.userName}`)
      this.member.isLiked = false;
    });
  }




}
