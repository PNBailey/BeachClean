import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  faBriefcase,
  faLocationArrow,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { BeachCleanEvent } from 'src/app/models/beachCleanEvent';
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
  };

  icons = {
    faLocationArrow: faLocationArrow,
    faUser: faUser,
    faBriefcase: faBriefcase,
    faUsers: faUsers,
  };

  likeParams: LikesParams;
  pastEvents: BeachCleanEvent[] = [];

  constructor(
    private route: ActivatedRoute,
    private friendService: FriendsService,
    private memberService: MemberService,
    public messageService: MessageService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.initializeMemberDetail();
    this.route.params.subscribe((params: Params) => {
      this.memberChanged(params);
    });
  }

  initializeMemberDetail() {
    this.likeParams = new LikesParams();
    this.likeParams.userName = this.route.snapshot.paramMap.get('username');
    this.likeParams.pageSize = 4;
    this.obs.memberObs$ = this.memberService.getMember(
      this.likeParams.userName
    );
    this.obs.friendsObs$ = this.friendService.friends$;
    this.friendService.setLikeParams(this.likeParams);
    this.getMessageThread(this.likeParams.userName);
    this.eventService
      .getOrganisedEvents(this.likeParams.userName)
      .subscribe((events) => {
        this.filterOrganisedEvents(events);
      });
  }

  filterOrganisedEvents(events: BeachCleanEvent[]) {
    const todaysDate = new Date();
    // Converting event dates back to official date formats which allow me to allo me to compare the dates
    events.forEach((e) => (e.date = new Date(e.date)));
    this.pastEvents = events.filter(
      (existingEvent) => existingEvent.date < todaysDate
    );
  }

  likeMember(member: Member) {
    this.friendService.addLike(member);
  }

  pageChanged(event: any) {
    this.likeParams.pageNumber = event.page;
    this.friendService.setLikeParams(this.likeParams);
  }

  memberChanged(params: Params) {
    this.likeParams = new LikesParams();
    this.likeParams.userName = params['username'];
    this.friendService.setLikeParams(this.likeParams);
    this.obs.memberObs$ = this.memberService.getMember(
      this.likeParams.userName
    );
    this.getMessageThread(this.likeParams.userName);
    this.eventService
      .getOrganisedEvents(this.likeParams.userName)
      .subscribe((events) => {
        this.filterOrganisedEvents(events);
      });
  }

  getMessageThread(recipientUsername: string) {
    this.messageService.getMessageThread(recipientUsername);
  }
}
