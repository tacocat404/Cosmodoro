# Cosmodoro · 우주뽀모도로

행성으로 떠나는 우주 비행처럼 집중하는 뽀모도로 웹 서비스예요.

## 폴더 구조

```
design/            디자인 초안 (개발 코드와 분리)
  drafts/          HTML 초안. 빌드 없이 바로 열려요
    v6-main.html   메인 (타이머·할 일·캘린더·통계) — 실제 행성 지도
    v5-main.html   이전 메인 (롤백용, v5-flight로 이어져요)
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
  CHECKLIST.md     단계별 진행 상황
apps/web/          웹 앱 (v6 초안을 옮김, 빌드 없음)
  index.html       메인 · flight.html 비행/태양계
  sync.js          이 기기 ↔ 계정 동기화
server/            서버 (Node.js + Hono + Better Auth + node:sqlite), 웹 페이지도 같이 내보내요
Dockerfile         배포용 컨테이너 하나
```

`design/`은 디자인을 고르고 다듬는 공간이고, 실제 개발 코드는 `apps/`·`server/`에만 둬요. 두 쪽이 섞이지 않아요.

## 앱 실행 (개발)

Node.js 24 이상이 필요해요.

```bash
cd server && npm install && npm run dev
```

http://localhost:8787 을 열어요. 테스트는 `cd server && npm test`예요.

## 초안 보기

```bash
python -m http.server 5520
```

브라우저에서 http://localhost:5520/design/drafts/v6-main.html 을 열어요.

온라인 최신본: https://tacocat404.github.io/Cosmodoro/ (초안 목록) · 메인 https://tacocat404.github.io/Cosmodoro/v6-main.html
`design/drafts/`가 바뀐 푸시마다 `.github/workflows/drafts-pages.yml`이 `gh-pages` 브랜치로 다시 올려요. 지금 올라간 버전은 `/version.txt`에 적혀 있어요.
