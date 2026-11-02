# 초안 렌더 도구 (클라우드 세션용)

브라우저 패널이 없는 세션에서 초안 페이지를 헤드리스 Chromium으로 찍는 스크립트예요.

```bash
cd design/tools
npm i --no-save three@0.167.0 playwright iconify-icon @iconify-json/solar pretendard
node shoot.js shots-example.json out
```

- 정적 서버(5521)를 띄워 저장소 루트를 서빙하고, jsDelivr의 three.js·Pretendard·iconify 요청을 `node_modules`의 로컬 파일로 돌려요(CDN이 막힌 환경 대응).
- Chromium은 `--use-angle=swiftshader`(소프트웨어 WebGL)로 떠요. 한 장에 30~60초 걸리고, 색·밝기는 실제 GPU와 조금 달라요.
- 미리 설치된 Playwright 브라우저가 있으면 그대로 써요(`playwright install`을 따로 하지 않아요).
- 샷 항목: `name, url, w, h, frames, setup(페이지에서 실행할 JS), after(찍기 직전 JS), hideUI`.
  - 비행 페이지는 `window.cosmodoro.ready`가 true가 된 뒤 `setup`을 실행해요.
  - 전환 중간을 찍으려면 `F.m`을 매 프레임 고정해요(`shots-example.json`의 `switch_50`).
- 결과 PNG는 `out/`에 생겨요. `out/`과 `node_modules/`는 커밋하지 않아요.
