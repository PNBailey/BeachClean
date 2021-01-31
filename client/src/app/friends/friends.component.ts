import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member';
import { Pagination } from '../models/pagination';
import { AccountService } from '../shared/account.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  members: Member[];
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;

  constructor(private accountService: AccountService) { }

  ngOnInit() {
  
this.loadMembers();
}

loadMembers() {
  this.accountService.getMembers(this.pageNumber, this.pageSize).subscribe(response => {
    console.log(response);
    this.members = response.result;
    this.pagination = response.pagination;
});
}

pageChanged(event: any) {
  this.pageNumber = event.page;
     this.loadMembers();
}
}
