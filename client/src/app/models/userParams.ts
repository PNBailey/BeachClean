import { User } from "./user";


export class UserParams {
    usersLocation: string;
    pageNumber: number = 1;
    pageSize: number = 5;

    constructor(user: User) {
        this.usersLocation = user.location;
    }
}

