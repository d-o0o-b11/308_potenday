import { BaseEvent } from '@interface';
import { EntityManager } from 'typeorm';

export interface IEventRepository {
  /**
   * event 저장
   * @param event BaseEvent
   * @param manager EntityManager
   * @returns Promise<void>
   */
  create: (event: BaseEvent, manager: EntityManager) => Promise<void>;
}
