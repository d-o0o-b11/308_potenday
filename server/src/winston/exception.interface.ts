/**
 * @name 서버_에러_클래스_오버라이딩_메소드
 * @description HttpException 을 상속하는 클래스는 해당 메소드를 구현하여야 한다.
 */
export interface ExceptionIntf<T> {
  getExceptionResponse(): T;
}

/**
 * @name 서버_에러_반환_응답
 */
export interface ErrorResponseIntf {
  message: string;
  local_message?: string;
  status?: number;
}
