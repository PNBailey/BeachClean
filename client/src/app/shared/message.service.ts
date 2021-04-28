import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Message } from "../models/message";

@Injectable({
    providedIn: 'root'
  })
export class MessageService {
    baseUrl = "https://localhost:5001/api/message";
    messages: Message[] = [];

    constructor(private http: HttpClient, private toastr: ToastrService) {}

    createMessage(recipientUsername: string, content: string) {
        this.http.post<Message>(`${this.baseUrl}`, {recipientUsername, content}).subscribe((message: Message) => {
            this.messages.push(message);
            this.toastr.success("Message sent");
        })};

    getMessageThread(recipientUsername: string) {
        this.http.get<Message[]>(`${this.baseUrl}/thread/${recipientUsername}`).subscribe(messages => this.messages = messages);
    }
}