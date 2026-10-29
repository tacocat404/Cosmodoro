# 에셋 출처 · Credits

`v6-flight.html`이 쓰는 실제 데이터 파일과 출처예요. 2026-10-29에 내려받았어요.
화면에 보이는 출처 표기는 설정(⋯) 패널과 태양계 화면 아래쪽에 있어요.

| 파일 | 원출처 | 라이선스 | 바꾼 점 |
|---|---|---|---|
| `earth_day_4k.jpg` | NASA Earth Observatory, Blue Marble: Next Generation (Reto Stöckli), 7월 지도. npm `astraeus@0.3.0` 사본 | NASA 이미지 이용 정책(크레딧 "NASA") | 없음 |
| `earth_night_4k.jpg` | Solar System Scope 지구 야경, three.js 저장소 `examples/textures/planets/earth_night_4096.jpg` 사본("resized and merged") | CC BY 4.0 | 없음 |
| `earth_bump_rough_clouds_4k.jpg` | Solar System Scope 지구 요철·거칠기·구름, three.js 저장소 사본(R 요철, G 바다 거칠기, B 구름) | CC BY 4.0 | 없음 |
| `moon_2k.jpg` | NASA Scientific Visualization Studio, CGI Moon Kit (LRO). npm `astraeus@0.3.0` 사본 | 공공 영역 | 없음 |
| `mercury_2k.jpg`, `venus_clouds_2k.jpg`, `uranus_2k.jpg`, `neptune_2k.jpg` | Solar System Scope (pyvista/data 사본) | CC BY 4.0 | 없음 |
| `mars_4k.jpg` | Solar System Scope `8k_mars.jpg` (fury-gl/fury-data 사본) | CC BY 4.0 | 8192×4096을 4096×2048로 줄이고 JPEG 품질 88로 다시 저장 |
| `jupiter_4k.jpg` | Solar System Scope `8k_jupiter.jpg`(실제 4096×2048) | CC BY 4.0 | 없음 |
| `saturn_4k.jpg` | Solar System Scope `8k_saturn.jpg`(실제 4096×2048) | CC BY 4.0 | 없음 |
| `saturn_ring_8k.png` | Solar System Scope `8k_saturn_ring_alpha.png` | CC BY 4.0 | 없음. 셰이더에서 안쪽 끝을 토성 반지름의 1.137배, 바깥 끝을 2.391배로 맞췄어요(카시니 간극 1.95~2.03배 기준) |
| `milkyway_gaia_4k.jpg` | Milky Way render by Kevinmloch (bsrender) from Gaia EDR3, ESA/Gaia/DPAC. 지구에서 3kpc 안쪽 별을 지운 은하수. npm `astraeus-data@0.3.0` 사본(Wikimedia Commons가 3840×1920으로 줄인 것) | CC BY-SA 4.0 | 없음. 화면에서 어둡게·저채도로 그릴 뿐 파일은 그대로예요 |
| `stars_mag75.bin` | d3-celestial `data/stars.8.json` © Olaf Frohn (XHIP: Anderson & Francis 2012 기반) | BSD-3-Clause | 7.5등급 이하 25,723개만 골라 별마다 적경·적위·등급·B−V를 16비트 정수 4개로 묶었어요 |

## 한 줄 표기

Planet textures: Solar System Scope (CC BY 4.0, Mars resized) · Earth: NASA Blue Marble NG · Moon: NASA SVS · Milky Way: Kevinmloch / ESA/Gaia/DPAC (CC BY-SA 4.0) · Stars: d3-celestial © Olaf Frohn (BSD-3), XHIP

## d3-celestial 라이선스 고지

Copyright (c) 2015, Olaf Frohn. All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

## 쓰지 않은 것

- Planet Pixel Emporium, Björn Jónsson, Steve Albers 지도: 재배포 조건이 불분명해요.
- three.js 저장소의 옛 지구 텍스처(`earth_atmos_2048` 등), three-globe 이미지: 출처가 확인되지 않아요.
- Axel Mellinger 은하수 파노라마: 저작권이 있어요.
