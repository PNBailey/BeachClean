import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  faBriefcase,
  faLocationArrow,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { BeachCleanEvent } from 'src/app/models/beachCleanEvent';
import { EventParams } from 'src/app/models/eventParams';
import { LikesParams } from 'src/app/models/likesParams';
import { Member } from 'src/app/models/member';
import { Message } from 'src/app/models/message';
import { PaginatedResult, Pagination } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/shared/account.service';
import { EventService } from 'src/app/shared/event.service';
import { FriendsService } from 'src/app/shared/friends.service';
import { MemberService } from 'src/app/shared/member.service';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;

  obs = {
    memberObs$: <Observable<Member>>null,
    userObs$: <Observable<Member>>null,
    friendsObs$: <Observable<PaginatedResult<Member[]>>>null,
    messageObs$: <Observable<Message[]>>null,
    eventObs$: <Observable<PaginatedResult<BeachCleanEvent[]>>>null,
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
  currentUser: User;
  member: Member;
  activeTab: TabDirective;
  subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private friendService: FriendsService,
    private memberService: MemberService,
    public messageService: MessageService,
    private eventService: EventService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeMemberDetail();
    this.subs.push(
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => {
          this.memberChanged(this.route.snapshot.params.username);
        })
    );
  }

  initializeMemberDetail() {
    this.likeParams = new LikesParams();
    this.subs.push(this.memberService.getMember(this.route.snapshot.params.username).subscribe(member => {
      this.member = member
      this.checkIfFriend(member);
    }));
    this.obs.friendsObs$ = this.friendService.friends$;
    this.eventParams = new EventParams();
    this.eventParams.pageSize = 3;
    this.eventParams.username = this.route.snapshot.params.username;
    this.eventParams.predicate = 'userEvents';
    this.obs.eventObs$ = this.eventService.allEvents$;
    this.eventService.setAllEventParams(this.eventParams);  
  }

  toggleLike(member: Member) {
    if(member.isLiked) {
      this.subs.push(this.friendService.removeLike(member).subscribe(() => {
        this.toastr.success(`Unliked ${member.userName}`);
        this.member.isLiked = false;
      }));
    } else {
      this.friendService.addLike(member);
      this.member.isLiked = true;
    }
  }

  checkIfFriend(member: Member) {
    this.subs.push(this.friendService.getFullLikes().subscribe(usersFriends => {
      usersFriends.forEach(friend => {
        if(friend.id == member.id) {
          this.member.isLiked = true;
        }
      })
    }));
  }

  pageChangedFriends(event: any) {
    this.likeParams.pageNumber = event.page;
    this.friendService.setLikeParams(this.likeParams);
  }
  pageChangedEvents(event: any) {
    this.eventParams.pageNumber = event.page;
    this.eventService.setAllEventParams(this.eventParams);
  }

  memberChanged(username: string) {
    this.likeParams = new LikesParams();
    this.likeParams.userName = username;
    this.friendService.setLikeParams(this.likeParams);
    this.obs.memberObs$ = this.memberService.getMember(
      this.likeParams.userName
    );
    this.getMessageThread(this.likeParams.userName);
    this.eventParams.username = username;
    this.eventService.setAllEventParams(this.eventParams);
  }

  getMessageThread(recipientUsername: string) {
    this.obs.messageObs$ = this.messageService.getMessageThread(recipientUsername);
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    switch (data.heading) {
      case 'Friends': {
        this.likeParams.userName = this.route.snapshot.paramMap.get('username');
        this.likeParams.pageSize = 4;
        this.friendService.setLikeParams(this.likeParams);
        break;
      }
      case 'Messages': {
        this.getMessageThread(this.route.snapshot.paramMap.get('username'));
        break;
      }
    }
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
