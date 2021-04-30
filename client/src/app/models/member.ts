import { BeachCleanEvent } from "./beachCleanEvent";
import { Photo } from "./photo";

export interface Member {
         id: number,
         userName: string,
         photoUrl: string,
         name: string,
         created: Date,
         lastActive: Date,
         location: string,
         organisedEvents: BeachCleanEvent[],
         attendingEvents: BeachCleanEvent[],
         emailAddress: string,
         occupation: string,
         photo: Photo,
         

}