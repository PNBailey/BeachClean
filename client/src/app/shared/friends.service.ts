import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { LikesParams } from "../models/likesParams";
import { Member } from "../models/member";
import { AccountService } from "./account.service";
import { PaginationService } from "./pagination.service";


@Injectable({
    providedIn: 'root'
  })
export class FriendsService {

    constructor(private accountService: AccountService, private paginationService: PaginationService, private http: HttpClient) {
        this.likeParams = new LikesParams();
     }

    baseUrl: string = "https://localhost:5001/api/likes";
    memberCache = new Map();
    newLike: boolean = false;
    likeParams: LikesParams;
    userLiked: Subject<Member> = new Subject();
    



    addLike(member: Member) {
        return this.http.post(this.baseUrl + '/' + member.userName, {});

    }

    updateNewLike() {
        this.newLike = true;
    }


    getFullLikes() {
        return this.http.get<Member[]>(`${this.baseUrl}/Full`);
    }

    getPaginatedLikes() {
        const response = this.memberCache.get(Object.values(this.likeParams).join('-'));

        if (response && this.newLike == false) {
            return of(response);
        }


        let params = this.getPaginationHeaders(this.likeParams.pageNumber, this.likeParams.pageSize);

        params = params.append('predicate', this.likeParams.predicate);

        return this.paginationService.getPaginatedResult<Partial<Member[]>>(this.baseUrl, params).pipe(map(response => {
            this.memberCache.set(Object.values(this.likeParams).join('-'), response);
            this.newLike = false;
            return response;
        }));
    }

    
  getLikeParams() {
    return this.likeParams;
  }

  setLikeParams(likeParams: LikesParams) {
    this.likeParams = likeParams;
  }

    private getPaginationHeaders(pageNumber: number, pageSize: number) {
        let params = new HttpParams();

        params = params.append('pageNumber', pageNumber.toString());
        params = params.append('pageSize', pageSize.toString());

        return params;

    }
}