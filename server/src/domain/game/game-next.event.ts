import { BaseEvent } from '@interface';

export class GameNextEvent implements BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly urlId: number,
  ) {} // 이벤트가 발생할 때 필요한 데이터를 여기에 포함
}
