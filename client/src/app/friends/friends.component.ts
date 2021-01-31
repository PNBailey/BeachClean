import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member';
import { AccountService } from '../shared/account.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  members: Member[];

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.accountService.getMembers().subscribe(members => {
        this.members = members;
    });

}
}
