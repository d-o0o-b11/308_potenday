

# 🧊 멜팅포인트 (Melting Point) - 아이스브레이킹 서비스

> 협업을 위해 팀원들과 아이스브레이킹을 도와주는 실시간 게임형 서비스

팀워크 형성에 큰 영향을 주는 아이스브레이킹, 놓치면 안 되겠죠?  
**멜팅포인트**는 팀원들과 함께 즐길 수 있는 실시간 아이스브레이킹 게임 플랫폼입니다.

- **팀원 정보 파악 + 성향 유추**
- **게임 기반 아이스브레이킹**
- **진행자 없이 모두가 즐길 수 있는 시스템**

팀만의 전용 링크를 만들고
자신에게 맞는 캐릭터와 성향을 표현한 뒤,  
재미있는 게임을 통해 **협업 능력**과 **팀워크**를 함께 높여보세요!

> 멜팅포인트를 통해 우리 팀만의 ‘녹는점’을 찾아보세요 ❄️

---

## 핵심 기능 (API)

- 방 URL 발급 및 입장 관리
- 대기방 인원 수 확인
- **SSE** 기반 실시간 화면 동기화  
- 쿠키 기반 사용자 인증 (토큰)
- 닉네임 설정 + 성격유형 검사 후 입장
- 형용사 표현 전체 조회 및 선택
- URL 속 유저들의 형용사 표현 확인
- 밸런스 게임 질문 출력 / 투표 / 결과 확인
- 고통 질문(SSE 이벤트) 및 다음 단계 전송
- MBTI 추측 라운드 유저 정보 확인
- MBTI 추측 or 본인 MBTI 저장
- 전체 게임 결과 출력


---



## 시스템 설계 특징

### SSE (Server-Sent Events)
- WebSocket보다 가벼운 서버-클라이언트 단방향 통신
- 한 명이 "다음"을 누르면 **모든 사용자에게 실시간 이벤트 전송**
- 빠르고 효율적인 화면 동기화 구현

### Cookie 기반 인증
- 사용자별 토큰을 쿠키에 저장
- 프론트와의 인증 간소화 및 보안 향상

### CQRS (Command Query Responsibility Segregation)
- CUD(명령)와 R(조회)을 분리하여 **역할과 책임을 명확히 분리**
- 쓰기/읽기 성능 최적화, 유지보수 편리

### 클린 아키텍처 적용
- 기존 3-Layer 구조 → Clean Architecture로 리팩토링
- **도메인 중심 설계**로 계층 간 결합도 낮추고 확장성 확보
- 각 레이어 책임 명확화: `Domain`, `Application`, `Infrastructure`, `Interface`

### DDD (Domain-Driven Design)
- 도메인 모델을 중심으로 설계
- 각 기능의 **비즈니스 로직을 도메인 객체에 집중**
- 복잡한 요구사항도 도메인 계층에서 일관된 방식으로 처리

### CUD / R 분리 설계
- 읽기(R) 와 쓰기(CUD) 작업을 별도로 분리한 데이터 흐름
- **장점:** 성능 최적화, 각 책임 분리
- **주의점:** 데이터 일관성 보장을 위해 트랜잭션 관리 필요

---


## 사용 방법

1. `.env` 설정
   ```bash
   src/envs/development.env
   # 환경변수(.env) 작성
   ```

2. 프로젝트 실행
   ```bash
   yarn install
   source scripts/init.dev.sh
   ```
3. PostgreSQL 설정 필요 (DB 연결 정보는 .env에 입력)



### 테스트
주요 로직에 대한 단위/통합 테스트가 작성되어 있습니다.

실행 명령어
   ```bash
   yarn test
   yarn test:e2e
   ```

---


## 기술 스택

| Category        | Stack                     |
|-----------------|---------------------------|
| **Framework**   | NestJS                    |
| **Language**    | TypeScript                |
| **Database**    | PostgreSQL                |
| **Auth**        | Cookie-based Auth (Token) |
| **Realtime**    | SSE (Server-Sent Events)  |
| **Architecture**| CQRS, Clean Architecture, DDD |
| **Infra**       | Docker, Yarn              |





---

## 프로젝트 기획서
[Melting-Point-기획서.pdf](https://github.com/user-attachments/files/19726028/Melting-Point-.pdf)


<br/>
<br/>
   









