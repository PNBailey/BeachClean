import { Member } from "./member";
import { Photo } from "./photo";

export class beachCleanEvent {
    creator: {};
    name: string;
    location: string;
    mainPhotoUrl: string;
    date: Date;
    photos: Photo[];
    organisers: Member[];
    attendees: Member[];

    

}