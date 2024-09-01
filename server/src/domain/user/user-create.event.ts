import { IEvent } from '@nestjs/cqrs';

export class CreateUserInfoEvent implements IEvent {
  constructor(public readonly urlId: number) {} // 이벤트가 발생할 때 필요한 데이터를 여기에 포함
}
