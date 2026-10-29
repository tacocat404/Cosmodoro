# 인수인계 · Cosmodoro (우주뽀모도로)

다른 세션에서 이어서 작업할 때 이 문서부터 읽어요. 마지막 업데이트: 2026-10-29.

## 1. 지금 어디까지 왔나

- **단계:** 디자인 초안 단계예요. 실제 개발(`apps/`, `server/`)은 아직 시작하지 않았어요.
- **사용자 결정:** 로그인·캘린더를 초안에 넣고 디자인을 다듬은 뒤 개발로 넘어가요. 계획은 [PLAN.md](PLAN.md)에 있어요.
- **레포:** https://github.com/tacocat404/Cosmodoro (`main`)
- **최신 초안:** `design/drafts/v5-main.html`(메인), `design/drafts/v5-flight.html`(비행·태양계)
- **롤백용 시안:** v2~v4, A~C, `backup-*` 폴더예요. 건드리지 않아요.

## 2. 초안 실행

```bash
python -m http.server 5520
```

- 프로젝트 루트에서 실행해요.
- 메인: http://localhost:5520/design/drafts/v5-main.html
- 태양계: http://localhost:5520/design/drafts/v5-flight.html?mode=atlas
- 비행: 메인에서 "발사"를 누르거나 `v5-flight.html?topic=code&min=25`로 열어요.
- `.claude/launch.json`에 `drafts` 설정이 있어서 Claude 브라우저 패널에서는 `preview_start {name:"drafts"}`로 띄워요.

## 3. 파일 구조와 역할

| 파일 | 역할 |
|---|---|
| `design/drafts/cosmo-shared.js` | 두 페이지가 같이 쓰는 데이터 (`window.COSMO`). module 스크립트보다 먼저 일반 `<script>`로 불러와요. |
| `design/drafts/v5-main.html` | 메인 화면 |
| `design/drafts/v5-flight.html` | 비행 화면과 태양계(atlas) 화면 |
| `design/drafts/brand/` | 로고와 파비콘 |
| `design/research/` | 디자인 조사 보고서 |

`cosmo-shared.js`에 들어 있는 것:
- **`PLANETS`:** 8개 행성의 이름, 색, 레터링, 티켓, 비행 거리, 설명, 통계(NASA NSSDC 수치)
- **`ORDER`:** 행성 순서
- **`DEFAULT_CATS`**, **`loadCats`/`saveCats`:** 카테고리 기본값과 불러오기·저장
- **`minutesFor(key)`:** 카테고리별 집중 시간
- **SVG 행성 아이콘 스프라이트:** `#pl-<planet>`
- **`icon()`:** 아이콘 HTML을 만드는 함수

**기술 스택**
- three.js r167을 importmap으로 불러와요. 빌드 도구는 없고, 파일 하나가 페이지 하나예요.
- 비행 페이지: EffectComposer + bloom + GRADE 패스, 셰이더로 만든 행성
- 메인 페이지: 직교 카메라 + 인쇄물 느낌 셰이더 행성

## 4. 데이터 (localStorage, 나중에 DB로 옮겨요)

| 키 | 내용 |
|---|---|
| `cosmodoro.cats` | 카테고리 `[{key, planet, name}]` |
| `cosmodoro.missions` | 할 일·큰 목표 `{id, t, topic, done, doneAt, date, kind:'goal'?}` |
| `cosmodoro.flights` | 비행 기록 (`topic`, `min` …) |
| `cosmodoro.user` | 로그인 (지금은 가짜) |
| `cosmodoro.swipeHint` | 밀어서 삭제 힌트를 보여 줬는지 |

**카테고리**
- 기본값: code=화성(코딩), design=금성(디자인), read=토성(독서), eng=해왕성(영어)
- 새 카테고리의 key는 행성 이름이에요. 이미 있으면 `_`를 붙여요.
- 지구는 출발 기지라서 카테고리를 붙일 수 없어요.
- 행성 하나에 카테고리 하나예요.

**할 일**
- 할 일과 캘린더가 같은 `missions` 목록을 써요. `date`가 마감일이에요.

## 5. 만들어 둔 기능

### 메인
- 행성 목록은 카테고리로 만들어져요. 태양계에서 붙인 카테고리가 바로 나타나요.
- `?topic=` 주소로 원하는 카테고리에서 시작할 수 있어요.
- 타이머 숫자는 주행거리계처럼 굴러가고, 밀리초도 움직여요.
- 상단 신호 표시는 수신 링과 행성 아이콘이에요.
- 패널
  - 로그인과 계정 (가짜)
  - 캘린더: 월 달력에 행성 아이콘, 오늘만 빛나요. 날짜를 고르면 그날 마감 목록이 나와요.
  - 할 일
    - 탭은 할 일 / 큰 목표 두 개예요.
    - 마감일 칩을 누르면 날짜를 고르는 팝오버가 열리고, 남은 날은 D-day로 표시해요.
    - 제목은 누르면 바로 고칠 수 있어요.
    - 왼쪽으로 밀면 지워요.
    - 행성을 누르면 카테고리를 바꿀 수 있어요.
    - 그룹: 지남 / 오늘 / 이번 주 / 나중 / 마감일 없음 / 완료
    - 완료한 항목은 그 주가 지나면 사라져요.
- 통계
  - 별자리 스트릭: 별은 흰색이고, 이어 가는 날만 그날 주제 색이 번져요.
  - 요일·주·월별 그래프
  - 주제별 카테고리
  - 네온 목표 바
- "새 행성"을 누르면 화면이 서서히 어두워지며 태양계로 넘어가요.

### 비행 / 태양계 (`?mode=atlas`)
- 태양계 전체를 보여 주고, 8개 행성마다 아이콘과 이름표(카테고리 이름)가 붙어요.
- 행성을 누르면 카메라가 날아가 확대해요 (`AT` 상태, `atlasCamera()`).
- 확대 화면은 SpaceX 스타일이에요.
  - 행성 탭, MISSION 줄, 큰 영문 이름, 설명
  - 통계: 거리 / 빛이 닿는 시간 / 1년 / 유형 / 집중한 시간
  - ↑↓ 버튼으로 넘기고 "N/8"로 위치를 보여 줘요.
- 확대 화면에서 카테고리를 붙이기, 이름 바꾸기, 떼기(두 번 확인) 할 수 있어요.
- "이 행성으로 집중하기"를 누르면 메인으로 가요 (`?topic=`).
- Esc는 한 단계씩 뒤로 가요. 방향키로 행성을 넘겨요.
- 비행 HUD: 유성 꼬리 진행 바, SPD/DIST 계기, 테이프

## 6. 사용자 취향 (꼭 지켜요)

- **언어:** 답은 한국어로 해요.
- **화면:** 차분한 UI로, 정보를 너무 많이 넣지 않고(TMI 금지), 우주의 웅장함은 살려요.
- **시안 먼저:** 디자인 선택지는 먼저 시각화(여러 시안)로 보여 주고, 사용자가 고르면 진행해요.
- **백업:** 큰 수정 전에는 롤백할 수 있게 백업해요. 이제는 git 커밋으로 대신해도 돼요.
- **통계 색:** 행성마다 색이 고르게 보여야 해요. 한 색(특히 주황)만 튀면 안 돼요.

## 7. 테스트 팁 (Claude 브라우저 패널)

- 패널이 숨겨져 있으면 rAF와 CSS 전환이 멈춰요.
  - 비행 페이지는 `window.cosmodoro.step(1/30)`을 반복해서 화면을 진행해요.
  - CSS 애니메이션은 `document.getAnimations().forEach(a=>{try{a.finish()}catch(e){}})`로 끝내요.
- 스크린샷이 예전 화면으로 나올 때가 많아요. 창 크기를 바꾸면(예: 1400x875 ↔ 1440x900) 새로 그려져요. 끝나면 desktop으로 되돌려요.
- 비행 페이지 디버그용으로 `window.cosmodoro`에 `AT`, `focusPlanet`, `unfocus`, `bodies`, `camera`, `step`을 열어 뒀어요.
- 콘솔에 남는 오래된 오류는 무시해도 돼요.
  - `setPointerCapture NotFoundError`는 예전 테스트 흔적이에요.
  - `Transition was skipped`는 페이지를 이동할 때 나와요.

## 8. 다음 할 일 후보

1. 사용자 피드백을 받으며 초안 디자인을 계속 다듬어요.
2. 확대 화면의 "집중한 시간"을 실제 비행 기록과 연결해요. 지금도 `minutesFor`가 `cosmodoro.flights`를 더하고 있어요.
3. 개발 시작은 [PLAN.md](PLAN.md) 순서를 따라요.
   - 루트에 `apps/web`(Vite)을 만들고 v5를 옮겨요.
   - `server`는 Hono + PostgreSQL/PGlite + Drizzle + Better Auth로 만들어요.
   - 오프라인 우선 동기화를 붙여요.
   - 앱은 Tauri로 감싸요.
   - `design/`은 그대로 두고 개발 코드와 섞지 않아요.
