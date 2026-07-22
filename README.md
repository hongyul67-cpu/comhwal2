# 컴활 2급 필기 개념게임

컴퓨터활용능력 **2급 필기** 개념 학습 게임 (수업용 + 시험대비).

## 과목
- 1과목 **컴퓨터 일반** — 9단원
- 2과목 **스프레드시트 일반** — 7단원

## 모드
- 🃏 개념 카드 (플래시카드)
- ⚡ 스피드 퀴즈 (4지선다 + 타이머 + 콤보)
- ⭕ OX 퀴즈
- 🔗 용어 매칭
- 🔁 오답 복습 (틀린 문제만 다시)

진행 상황(별·XP·정답률)은 브라우저 localStorage에 저장됩니다.

## 구조
```
index.html   UI/스타일
app.js       게임 엔진
data/comp.js   1과목 데이터
data/excel.js  2과목 데이터
```
단원 데이터 구조: `cards[{t,d}]` / `quiz[{q,o,a,ex}]` / `ox[{s,a,ex}]`

## 결과 제출
교사가 `?rc=<Apps Script exec URL>` 를 붙여 배포하면 결과 제출 버튼이 나타납니다.
예: `.../comhwal2/?rc=<exec>&cls=1,2,3&max=40`

## 관련 도구
- [comhwal2-cbt](../comhwal2-cbt) — 필기 CBT 모의고사(실제 기출 포함)
- [comhwal2-excel](../comhwal2-excel) — 실기 함수 연습소
