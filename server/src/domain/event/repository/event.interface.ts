import { BaseEvent } from '@interface';
import { EntityManager } from 'typeorm';

//로깅 목적
export interface IEventRepository {
  /**
   * event 저장
   * @param event BaseEvent
   * @param manager EntityManager
   */
  create(event: BaseEvent, manager: EntityManager): Promise<void>;
}
