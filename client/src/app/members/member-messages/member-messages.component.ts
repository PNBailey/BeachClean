import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() messages: Message[];
  @Input() memberUsername: string;
  messageContent: string;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    this.messageService.createMessage(this.memberUsername, this.messageContent);
    this.messageContent = "";
  }

}
