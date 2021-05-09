import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, of, Subject } from "rxjs";
import { filter, map, switchMap, take, takeUntil, tap } from "rxjs/operators";
import { Member } from "../models/member";
import { MemberParams } from "../models/memberParams";
import { PaginationService } from "./pagination.service";

@Injectable({
    providedIn: 'root'
  })
export class MemberService {

    constructor(private http: HttpClient, private paginationService: PaginationService, private toastr: ToastrService) {
    }

    memberParams: MemberParams;
    memberCache = new Map();
    baseUrl: string = "https://localhost:5001/api/users";
    membersObs$: BehaviorSubject<MemberParams> = new BehaviorSubject(new MemberParams());


    members$ = this.membersObs$.pipe(switchMap(memberParams => this.getMembers(memberParams)));


    
      setMemberParams(memberParams: MemberParams) {
        this.membersObs$.next(memberParams);
      }

      getMember(userName: string) {
        const member = [...this.memberCache.values()].
        reduce((arr, currElem) => arr.concat(currElem.result), []).
        find((member: Member) => member.userName === userName);
    
        if(member) {
          return of(member);
        }
    
        return this.http.get<Member>(`${this.baseUrl}/${userName}`);
      }


    
      getMembers(memberParams: MemberParams) {
    
        const response = this.memberCache.get(Object.values(memberParams).join('-'));
    
        if(response) {
          return of(response);
        }
    
        let params = new HttpParams(); 
    
          params = params.append('pageNumber', memberParams.pageNumber.toString()); 
          params = params.append('pageSize', memberParams.pageSize.toString());
          params = params.append('usersLocation', memberParams.usersLocation);
        
        
        return this.paginationService.getPaginatedResult<Member[]>(`${this.baseUrl}/`, memberParams).pipe(map(response => {
          this.memberCache.set(Object.values(memberParams).join('-'), response);
          return response;
        }));
      }

      
  updateMember(member: Member) {
    return this.http.put(`${this.baseUrl}/`, member).pipe(tap(() => {
      this.toastr.success("Profile succesfully updated"); 
    })).subscribe();
  }
}