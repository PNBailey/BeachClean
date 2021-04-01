import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../models/pagination";



export class PaginationService {
    constructor(private http: HttpClient) {}

    getPaginatedResult<T>(url: string, params: any) {

        const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
        return this.http.get<T>(url, {observe: 'response', params}).pipe(
          map(response => {
            paginatedResult.result = response.body; 
            if(response.headers.get('Pagination') !== null) {
              paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
            }
            return paginatedResult;
          }))
        
        }

}