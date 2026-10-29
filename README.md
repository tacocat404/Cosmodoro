# Cosmodoro · 우주뽀모도로

행성으로 떠나는 우주 비행처럼 집중하는 뽀모도로 웹 서비스예요.

## 폴더 구조

```
design/            디자인 초안 (개발 코드와 분리)
  drafts/          HTML 초안. 빌드 없이 바로 열려요
    v5-main.html   메인 (타이머·할 일·캘린더·통계)
    v6-flight.html 비행 / 태양계 개선안 (?mode=atlas) — 실제 행성 지도·실제 별
    v5-flight.html 이전 비행 화면 (롤백용)
    assets/        v6가 쓰는 행성 지도·은하수·별 목록과 출처(CREDITS.md)
    cosmo-shared.js  두 페이지가 같이 쓰는 행성·카테고리 데이터
    brand/         로고·파비콘
    index.html     초안 모아 보기
    v2~v4, A~C, backup-*  이전 시안 (롤백용)
  research/        디자인 조사 보고서와 노트
docs/
  PLAN.md          개발 계획

(개발 시작 후 추가될 자리)
apps/web           웹 (Vite) — 초안을 옮겨 와요
apps/native        PC·안드로이드 앱 (Tauri 2)
server             API 서버 (Node.js + Hono + PostgreSQL + Drizzle + Better Auth)
packages/shared    웹·앱·서버 공용 타입과 동기화 로직
```

`design/`은 디자인을 고르고 다듬는 공간이고, 실제 개발 코드는 `apps/`·`server/`·`packages/`에만 둬요. 두 쪽이 섞이지 않아요.

## 초안 보기

```bash
python -m http.server 5520
```

브라우저에서 http://localhost:5520/design/drafts/v5-main.html 을 열어요.
