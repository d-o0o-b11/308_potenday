import { Controller, Res, Sse } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { AppService } from './app.service';

interface MessageEvent {
  data: string | object;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  // @Sse('event')
  // sendEvent(@Res() res: Response): Observable<MessageEvent> {
  //   return interval(1000).pipe(
  //     map((num: number) => ({
  //       data: 'hello' + num,
  //     })),
  //   );
  // }
}
