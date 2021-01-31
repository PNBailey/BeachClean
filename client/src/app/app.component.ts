import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { AccountService } from './shared/account.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private accountService: AccountService) {}

  user: User;

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.accountService.currentUserSource.next(this.user);

  }


}
