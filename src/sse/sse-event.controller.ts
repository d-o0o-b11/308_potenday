import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('events')
export class EventsController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Sse()
  public liveQuote(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'statusUpdated').pipe(
      map((data) => {
        return { data: JSON.stringify(data) } as MessageEvent;
      }),
    );
  }

  // @Get('status-updates')
  // streamStatusUpdates(@Res() res: Response) {
  //   res.setHeader('Content-Type', 'text/event-stream');
  //   res.setHeader('Cache-Control', 'no-cache');
  //   res.setHeader('Connection', 'keep-alive');
  //   res.setHeader('Access-Control-Allow-Origin', '*');

  //   // 이벤트 리스너 등록
  //   const onStatusUpdated = (data: any) => {
  //     res.write(`event: statusUpdate\n`);
  //     res.write(`data: ${JSON.stringify(data)}\n\n`);
  //   };
  //   console.log('emfdj');

  //   // statusUpdated 이벤트 리스너 등록
  //   this.eventEmitter.on('statusUpdated', onStatusUpdated);

  //   // 연결이 종료될 때 이벤트 리스너 제거
  //   res.on('close', () => {
  //     this.eventEmitter.off('statusUpdated', onStatusUpdated);
  //   });
  // }

  // @Get('status-updates')
  // streamStatusUpdates(@Res() res: Response) {
  //   res.setHeader('Content-Type', 'text/event-stream');
  //   res.setHeader('Cache-Control', 'no-cache');
  //   res.setHeader('Connection', 'keep-alive');
  //   res.setHeader('Access-Control-Allow-Origin', '*');

  //   // SSE 스트림 생성 및 이벤트 리스너 등록
  //   const onStatusUpdated = (data: any) => {
  //     res.write(`event: statusUpdated\n`);
  //     res.write(`data: ${JSON.stringify(data)}\n\n`);
  //   };

  //   // 데이터 업데이트 이벤트 등록
  //   this.eventEmitter.on('dataUpdated', (data) => {
  //     onStatusUpdated(data);
  //   });

  //   // 연결이 종료될 때 이벤트 리스너 제거
  //   res.on('close', () => {
  //     this.eventEmitter.off('dataUpdated', onStatusUpdated);
  //   });
  // }

  // // 실제 데이터 업데이트를 발생시키는 예시 메소드
  // @Get('update-data')
  // updateData() {
  //   const newData = { message: 'New data updated!', timestamp: new Date() };
  //   // 데이터 업데이트 이벤트 발생
  //   this.eventEmitter.emit('dataUpdated', newData);
  //   return newData;
  // }
}
