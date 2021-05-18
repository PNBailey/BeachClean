import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { User } from '../shared/models/user';
import { AccountService } from '../shared/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {



  constructor(public accountService: AccountService, private route: Router) { 
  }

  ngOnInit(): void {
  }

  logout() {
    this.accountService.currentUserSource.next(null);
    localStorage.removeItem('user');
    this.route.navigate(['../']);
  }

}
