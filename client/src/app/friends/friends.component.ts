import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Member } from '../models/member';
import { Pagination } from '../models/pagination';
import { User } from '../models/user';
import { UserParams } from '../models/userParams';
import { AccountService } from '../shared/account.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;


  constructor(public accountService: AccountService) { }

  ngOnInit() {

    this.userParams = this.accountService.getUserParams();
    this.loadMembers();

  }

  loadMembers() {
    this.accountService.setUserParams(this.userParams);
    this.accountService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }

  getLocalUsers(usersLocation: string) {

    this.userParams.usersLocation = usersLocation;
    this.accountService.setUserParams
    this.loadMembers();
  }

  getAllUsers() {
    this.userParams.usersLocation = "allLocations";
    this.loadMembers();
  }


  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.accountService.setUserParams(this.userParams);
    this.loadMembers();
  }
}
