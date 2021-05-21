import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { LikesParams } from "../models/likesParams";
import { Member } from "../models/member";
import { PaginatedResult } from "../models/pagination";
import { AccountService } from "./account.service";
import { PaginationService } from "./pagination.service";


@Injectable({
    providedIn: 'root'
})
export class FriendsService {

    constructor(private accountService: AccountService, private paginationService: PaginationService, private http: HttpClient, private toastr: ToastrService) {

    }

    private friendsObs$: BehaviorSubject<LikesParams> = new BehaviorSubject(new LikesParams());
    baseUrl: string = "https://localhost:5001/api/likes";
    memberCache = new Map();
    newLike: boolean = false;
    likeToggled: Subject<Member> = new Subject();


    friends$: Observable<PaginatedResult<Member[]>> = this.friendsObs$.pipe(switchMap(likesParams => this.getPaginatedLikes(likesParams)));

    addLike(member: Member) {
        this.http.post(this.baseUrl + '/' + member.userName, {}).pipe(tap(() => {
            this.updateNewLike();
            this.likeToggled.next();
            this.toastr.success(`You have liked ${member.userName}`);
        })).subscribe();
    }

    removeLike(friend: Member) {
       return this.http.delete(`${this.baseUrl}/${friend.id}`);
    }

    updateNewLike() {
        this.newLike = true;
    }



    getFullLikes() {
        return this.http.get<Member[]>(`${this.baseUrl}/Full`);
    }

    getPaginatedLikes(likeParams: LikesParams) {
        const response = this.memberCache.get(Object.values(likeParams).join('-'));

        if (response && this.newLike == false) {
            console.log(response);
            return of(response);
            
            
        }


        let params = this.getPaginationHeaders(likeParams.pageNumber, likeParams.pageSize);

        params = params.append('predicate', likeParams.predicate);

        params = params.append('userName', likeParams.userName);

        return this.paginationService.getPaginatedResult<Partial<Member[]>>(this.baseUrl, params).pipe(map(response => {
            this.memberCache.set(Object.values(likeParams).join('-'), response);
            this.newLike = false;
            return response;
        }));
    }


    getLikeParams() {
        return this.friendsObs$;
    }

    setLikeParams(likeParams: LikesParams) {
        this.friendsObs$.next(likeParams);
    }

    private getPaginationHeaders(pageNumber: number, pageSize: number) {
        let params = new HttpParams();

        params = params.append('pageNumber', pageNumber.toString());
        params = params.append('pageSize', pageSize.toString());

        return params;

    }
}