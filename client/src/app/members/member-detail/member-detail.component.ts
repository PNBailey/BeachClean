import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  faBriefcase,
  faLocationArrow,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { BeachCleanEvent } from 'src/app/models/beachCleanEvent';
import { EventParams } from 'src/app/models/eventParams';
import { LikesParams } from 'src/app/models/likesParams';
import { Member } from 'src/app/models/member';
import { Message } from 'src/app/models/message';
import { PaginatedResult, Pagination } from 'src/app/models/pagination';
import { EventService } from 'src/app/shared/event.service';
import { FriendsService } from 'src/app/shared/friends.service';
import { MemberService } from 'src/app/shared/member.service';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {

  obs = {
    memberObs$: <Observable<Member>>null,
    friendsObs$: <Observable<PaginatedResult<Member[]>>>null,
    messageObs$: <Observable<Message[]>>null,
    eventObs$: <Observable<PaginatedResult<BeachCleanEvent[]>>>null
  };

  icons = {
    faLocationArrow: faLocationArrow,
    faUser: faUser,
    faBriefcase: faBriefcase,
    faUsers: faUsers,
  };

  likeParams: LikesParams;
  eventParams: EventParams;
  
  pastEvents: BeachCleanEvent[] = [];
  eventsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private friendService: FriendsService,
    private memberService: MemberService,
    public messageService: MessageService,
    private eventService: EventService,
  ) {}

  ngOnInit(): void {
    this.initializeMemberDetail();
    this.route.params.subscribe((params: Params) => {
      this.memberChanged(params);
    });  
  }

  initializeMemberDetail() {

    this.likeParams = new LikesParams();
    this.eventParams = new EventParams();
    this.likeParams.userName = this.route.snapshot.paramMap.get('username');
    this.likeParams.pageSize = 4;
    this.obs.memberObs$ = this.memberService.getMember(
      this.likeParams.userName
    );
    this.obs.friendsObs$ = this.friendService.friends$;
    this.friendService.setLikeParams(this.likeParams);
    this.getMessageThread(this.likeParams.userName);
    this.eventParams.pageSize = 3;
    this.eventParams.username = this.likeParams.userName;
    this.eventParams.predicate = "userEvents";
    this.obs.eventObs$ = this.eventService.allEvents$;
    this.eventService.setAllEventParams(this.eventParams);

  }

  likeMember(member: Member) {
    this.friendService.addLike(member);
  }

  pageChangedFriends(event: any) {
    this.likeParams.pageNumber = event.page;
    this.friendService.setLikeParams(this.likeParams);
  }
  pageChangedEvents(event: any) {
    this.eventParams.pageNumber = event.page;
    this.eventService.setAllEventParams(this.eventParams);
  }

  memberChanged(params: Params) {
    this.likeParams = new LikesParams();
    this.likeParams.userName = params['username'];
    this.friendService.setLikeParams(this.likeParams);
    this.obs.memberObs$ = this.memberService.getMember(
      this.likeParams.userName
    );
    this.getMessageThread(this.likeParams.userName);
    this.eventService.setAllEventParams(this.eventParams);
  }

  getMessageThread(recipientUsername: string) {
    this.messageService.getMessageThread(recipientUsername);
  }

}
