import { Member } from "./member";
import { Photo } from "./photo";

export class BeachCleanEvent {
    creator: Member;
    name: string;
    id: Number;
    location: string;
    mainPhotoUrl: string;
    date: Date;
    photos: Photo[];
    organisers: Member[];
    attendees: Member[];

    

}