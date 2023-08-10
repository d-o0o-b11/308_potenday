import { Controller, Get, Res } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { Response } from 'express';

@Controller('events')
export class EventsController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Get('status-updates')
  streamStatusUpdates(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // 이벤트 리스너 등록
    const onStatusUpdated = (data: any) => {
      res.write(`event: statusUpdate\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    // console.log(onStatusUpdated);
    this.eventEmitter.on('statusUpdated', onStatusUpdated);

    // 연결이 종료될 때 이벤트 리스너 제거
    res.on('close', () => {
      this.eventEmitter.off('statusUpdated', onStatusUpdated);
    });
  }
}
