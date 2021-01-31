import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Member } from "../models/member";
import { AccountService } from "../shared/account.service";


@Injectable({
    providedIn: 'root'
})

export class EditProfileResolverService implements Resolve<Member> { 

    constructor(private accountService: AccountService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const usersUserame: string = JSON.parse(localStorage.getItem('user')).userName;
         return this.accountService.getMember(usersUserame.toLowerCase());

        }
      
    }


