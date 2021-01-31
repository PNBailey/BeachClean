export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}


export class PaginatedResult<T> { // Adding the <T> here means that we can use our PaginatedResult class with any of our types 
    result: T; // As we specified the <T> type above, we can use this type here to speficy results type. The result in this scenario will be a array of memebers. 
    pagination: Pagination; // We specify the type o be our Pagination interface we created above. This will be our pagination infromation that we receive back in the header from our http response 
}