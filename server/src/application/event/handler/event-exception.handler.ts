import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { UnhandledExceptionBus, UnhandledExceptionInfo } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class EventExceptionHandlerService implements OnModuleDestroy {
  private destroy$ = new Subject<void>();

  constructor(private readonly unhandledExceptionsBus: UnhandledExceptionBus) {
    this.unhandledExceptionsBus
      .pipe(takeUntil(this.destroy$))
      .subscribe((exceptionInfo: UnhandledExceptionInfo) => {
        //예외 처리 로직
        this.handleException(exceptionInfo);
      });
  }

  private handleException(exceptionInfo: UnhandledExceptionInfo) {
    //슬랙, 에러 로그 저장하는 로직 추가하기
    console.log('이벤트 에러', exceptionInfo);
  }

  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
