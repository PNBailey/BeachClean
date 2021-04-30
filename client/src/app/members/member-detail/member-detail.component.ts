import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faBriefcase, faLocationArrow, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { LikesParams } from 'src/app/models/likesParams';
import { Member } from 'src/app/models/member';
import { Message } from 'src/app/models/message';
import { PaginatedResult } from 'src/app/models/pagination';
import { EventService } from 'src/app/shared/event.service';
import { FriendsService } from 'src/app/shared/friends.service';
import { MemberService } from 'src/app/shared/member.service';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  memberObs$: Observable<Member>;
  friendsObs$: Observable<PaginatedResult<Member[]>>;
  messageObs$: Observable<Message[]>;
  faLocationArrow = faLocationArrow;
  faUser = faUser;
  faBriefcase = faBriefcase;
  faUsers = faUsers;
  likeParams: LikesParams;


  constructor(private route: ActivatedRoute, private friendService: FriendsService, private memberService: MemberService, public messageService: MessageService, private eventService: EventService) { }

  ngOnInit(): void {
    this.memberObs$ = this.memberService.getMember(this.route.snapshot.paramMap.get('username')); 
    this.likeParams = new LikesParams();
    this.likeParams.pageSize = 4;
    this.likeParams.userName = this.route.snapshot.paramMap.get('username');
    this.friendsObs$ = this.friendService.friends$;
    this.friendService.setLikeParams(this.likeParams);
    this.getMessageThread(this.likeParams.userName);  
    this.memberService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(member => console.log(member)); 
    this.eventService.getOrganisedEvents("paul").subscribe(events => console.log(events));
    
  }

  likeMember(member: Member) {
  this.friendService.addLike(member);
  }

  pageChanged(event: any) {
    this.likeParams.pageNumber = event.page;
    this.friendService.setLikeParams(this.likeParams);
  }

  getMessageThread(recipientUsername: string) {
    this.messageService.getMessageThread(recipientUsername);
  }

}
