import { Photo } from "./photo";

export interface Member {
         id: number,
         userName: string,
         photoUrl: string,
         name: string,
         created: Date,
         lastActive: Date,
         location: string,
         emailAddress: string,
         occupation: string,
         photo: Photo,
         

}