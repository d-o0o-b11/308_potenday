import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

@Injectable()
export class SlackService {
  private readonly slackClient: WebClient;
  private readonly conversationId: string = 'C075RB43EA1';

  constructor() {
    const token = process.env.SLACK_OAUTH_TOKEN;
    this.slackClient = new WebClient(token);
  }

  sendErrorMessage(message: string) {
    this.slackClient.chat.postMessage({
      channel: this.conversationId,
      attachments: [
        {
          fallback: 'An error occurred',
          color: '#ff0000',
          pretext: '⚠️ 서버 에러 발생',
          title: 'Error Notification',
          text: message,
        },
      ],
    });
  }
}
