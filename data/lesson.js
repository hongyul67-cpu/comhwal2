/* 컴활 2급 · 설명 모드 수업자료 (그림 도해 + 개념 정리표)
 *
 * 설명 모드에서 표지 다음에 이 자료가 먼저 나오고, 그 뒤에 개념 카드·확인 문제가 이어진다.
 *   표지 → [그림·표 설명자료] → 개념 카드 → 확인 문제 → 끝
 *
 * 슬라이드 형식
 *   { type:'svg',   title, svg, cap }                    그림 도해
 *   { type:'table', title, head:[...], rows:[[...]], cap } 개념 정리표
 *
 * 색은 CSS 변수를 그대로 써서 앱 테마(어두운 배경)에 맞춘다.
 * 키: '과목/단원id'
 */
window.COMHWAL2_LESSON = (function () {
  // 도해에서 반복되는 값
  var C = {
    card: 'var(--card2)', line: 'var(--line)', tx: 'var(--tx)', tx2: 'var(--tx2)',
    pri: 'var(--pri)', ok: 'var(--ok)', no: 'var(--no)', gold: 'var(--gold)', warn: 'var(--warn)',
  };
  // 상자 하나
  function box(x, y, w, h, label, stroke, fill, fs) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" ' +
      'fill="' + (fill || C.card) + '" stroke="' + (stroke || C.line) + '" stroke-width="2"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 5) + '" text-anchor="middle" ' +
      'fill="' + C.tx + '" font-size="' + (fs || 14) + '" font-weight="700">' + label + '</text>';
  }
  // 화살표(오른쪽)
  function arrow(x1, y, x2, col) {
    col = col || C.pri;
    return '<line x1="' + x1 + '" y1="' + y + '" x2="' + (x2 - 8) + '" y2="' + y + '" stroke="' + col +
      '" stroke-width="2.5"/><polygon points="' + x2 + ',' + y + ' ' + (x2 - 9) + ',' + (y - 5) + ' ' +
      (x2 - 9) + ',' + (y + 5) + '" fill="' + col + '"/>';
  }
  function label(x, y, t, col, fs, anchor) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" fill="' +
      (col || C.tx2) + '" font-size="' + (fs || 13) + '" font-weight="700">' + t + '</text>';
  }
  function svg(vb, inner) { return '<svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>'; }

  var L = {};

  /* ═══════════ 1과목 컴퓨터 일반 ═══════════ */

  L['comp/win'] = [
    { type: 'svg', title: 'Windows 화면은 이렇게 생겼어요',
      svg: svg('0 0 460 250',
        '<rect x="10" y="10" width="440" height="230" rx="10" fill="#141a33" stroke="' + C.line + '" stroke-width="2"/>' +
        // 바탕화면 아이콘
        '<rect x="28" y="30" width="34" height="34" rx="6" fill="' + C.card + '" stroke="' + C.pri + '" stroke-width="2"/>' +
        '<text x="45" y="52" text-anchor="middle" font-size="16">📁</text>' +
        '<text x="45" y="78" text-anchor="middle" fill="' + C.tx2 + '" font-size="10">아이콘</text>' +
        // 창
        box(120, 34, 240, 130, '', C.pri, C.card) +
        '<rect x="120" y="34" width="240" height="24" rx="8" fill="' + C.pri + '" opacity=".35"/>' +
        label(240, 51, '제목 표시줄 (잡고 흔들면 = 에어로 셰이크)', C.tx, 11) +
        label(240, 100, '창을 화면 끝으로 끌면 = 에어로 스냅', C.tx2, 12) +
        label(240, 128, '창 최대 · 최소 · 닫기 ✕', C.tx2, 11) +
        // 작업 표시줄
        '<rect x="10" y="196" width="440" height="44" rx="0" fill="' + C.card + '" stroke="' + C.line + '" stroke-width="2"/>' +
        '<text x="34" y="224" text-anchor="middle" font-size="18">⊞</text>' +
        label(34, 190, '시작', C.tx2, 10) +
        '<rect x="60" y="206" width="30" height="24" rx="5" fill="' + C.pri + '" opacity=".4"/>' +
        '<rect x="96" y="206" width="30" height="24" rx="5" fill="' + C.card + '" stroke="' + C.line + '"/>' +
        label(105, 190, '실행 중인 앱', C.tx2, 10) +
        '<rect x="330" y="206" width="86" height="24" rx="5" fill="' + C.card + '" stroke="' + C.line + '"/>' +
        label(373, 222, '🔊 📶 12:30', C.tx2, 11) +
        label(373, 190, '알림 영역', C.tx2, 10) +
        '<rect x="424" y="196" width="18" height="44" fill="' + C.gold + '" opacity=".5"/>' +
        label(400, 252, '', C.tx2, 10)),
      cap: '작업 표시줄 맨 오른쪽 끝 = <b>바탕 화면 보기</b>(에어로 피크, ■+D)' },
    { type: 'svg', title: '바로 가기 아이콘은 "연결선"일 뿐',
      svg: svg('0 0 440 190',
        box(30, 55, 130, 70, '', C.pri, C.card) +
        '<text x="95" y="88" text-anchor="middle" font-size="24">📄</text>' +
        '<text x="82" y="112" font-size="15" fill="' + C.gold + '">↗</text>' +
        label(95, 145, '바로 가기 (.LNK)', C.pri, 13) +
        label(95, 163, '왼쪽 아래 화살표', C.tx2, 11) +
        arrow(170, 90, 265) +
        label(217, 78, '가리키기만 함', C.tx2, 12) +
        box(275, 55, 130, 70, '', C.ok, C.card) +
        '<text x="340" y="95" text-anchor="middle" font-size="24">🗎</text>' +
        label(340, 145, '원본 파일', C.ok, 13) +
        label(220, 30, '바로 가기를 지워도 원본은 그대로!', C.gold, 14)),
      cap: '하나의 원본에 바로 가기를 <b>여러 개</b> 만들 수 있어요' },
    { type: 'table', title: '꼭 외우는 바로 가기 키',
      head: ['키', '기능', '키', '기능'],
      rows: [
        ['F2', '이름 바꾸기', '■ + D', '바탕 화면 보기'],
        ['F3', '파일·폴더 검색', '■ + E', '파일 탐색기'],
        ['F5', '새로 고침', '■ + L', 'PC 잠금'],
        ['Alt + F4', '창 닫기·종료', '■ + R', '실행 대화상자'],
        ['Alt + Tab', '창 전환', '■ + T', '작업 표시줄 앱 순환'],
        ['Ctrl + Esc', '시작 화면 (실행 ✕)', 'Ctrl+Shift+Esc', '작업 관리자'],
      ],
      cap: '⚠️ <b>Ctrl+Esc = 시작 화면</b>, 실행 창은 <b>■+R</b> — 자주 바꿔서 냅니다' },
  ];

  L['comp/file'] = [
    { type: 'svg', title: '드래그하면 이동? 복사? — 드라이브가 기준',
      svg: svg('0 0 460 230',
        // 같은 드라이브
        '<rect x="16" y="20" width="200" height="90" rx="10" fill="none" stroke="' + C.ok + '" stroke-width="2" stroke-dasharray="5 4"/>' +
        label(116, 40, '같은 드라이브 (C: → C:)', C.ok, 13) +
        box(34, 55, 58, 38, '폴더A', C.line, C.card, 12) +
        arrow(98, 74, 150, C.ok) +
        box(152, 55, 58, 38, '폴더B', C.line, C.card, 12) +
        label(124, 105, '기본 = 이동', C.tx, 13) +
        // 다른 드라이브
        '<rect x="240" y="20" width="204" height="90" rx="10" fill="none" stroke="' + C.warn + '" stroke-width="2" stroke-dasharray="5 4"/>' +
        label(342, 40, '다른 드라이브 (C: → D:)', C.warn, 13) +
        box(258, 55, 58, 38, 'C:', C.line, C.card, 12) +
        arrow(322, 74, 374, C.warn) +
        box(376, 55, 58, 38, 'D:', C.line, C.card, 12) +
        label(346, 105, '기본 = 복사', C.tx, 13) +
        // 보조키
        box(30, 140, 180, 34, 'Ctrl 누르고 끌기 → 복사', C.pri, C.card, 13) +
        box(250, 140, 180, 34, 'Shift 누르고 끌기 → 이동', C.pri, C.card, 13) +
        label(230, 205, 'Ctrl+Shift 누르고 끌기 → 바로 가기 만들기', C.gold, 13)),
      cap: '헷갈리면: <b>같은 드라이브는 이동</b>, 다른 드라이브는 복사가 기본' },
    { type: 'svg', title: '휴지통을 거치지 않는 삭제',
      svg: svg('0 0 460 200',
        box(20, 60, 96, 52, '파일 삭제', C.line, C.card, 13) +
        arrow(120, 86, 176, C.ok) +
        label(148, 76, 'Delete', C.ok, 11) +
        box(180, 46, 96, 80, '', C.ok, C.card) +
        '<text x="228" y="86" text-anchor="middle" font-size="26">🗑️</text>' +
        label(228, 112, '휴지통', C.ok, 13) +
        label(228, 145, '복원 가능', C.ok, 12) +
        arrow(120, 150, 176, C.no) +
        box(300, 46, 140, 80, '', C.no, C.card) +
        '<text x="370" y="82" text-anchor="middle" font-size="24">💨</text>' +
        label(370, 106, '완전 삭제', C.no, 13) +
        label(370, 124, '복원 불가', C.no, 11) +
        '<line x1="276" y1="86" x2="292" y2="86" stroke="' + C.line + '" stroke-width="2" stroke-dasharray="3 3"/>' +
        label(120, 172, 'Shift+Delete · USB·네트워크 드라이브 · 휴지통보다 큰 파일', C.no, 12, 'start')),
      cap: '휴지통 안에서는 <b>실행·이름 바꾸기 불가</b> — 복원한 뒤에 하세요' },
    { type: 'table', title: '파일 이름 규칙',
      head: ['구분', '내용'],
      rows: [
        ['길이', '최대 <b>255자</b>'],
        ['쓸 수 없는 문자', '<b>\\ / : * ? " &lt; &gt; |</b> — 9가지'],
        ['쓸 수 있는 것', '공백 · 밑줄(_) · 마침표(.) · 한글 · 숫자'],
        ['같은 폴더', '같은 이름 파일을 두 개 둘 수 없음'],
      ],
      cap: '금지 문자 9개는 <b>"역슬래시·슬래시·콜론·별표·물음표·큰따옴표·부등호·세로줄"</b>' },
  ];

  L['comp/winsys'] = [
    { type: 'svg', title: '디스크 정리 vs 조각 모음 — 목적이 다르다',
      svg: svg('0 0 460 220',
        '<rect x="14" y="16" width="210" height="188" rx="12" fill="none" stroke="' + C.ok + '" stroke-width="2"/>' +
        label(119, 40, '🧹 디스크 정리', C.ok, 15) +
        '<rect x="40" y="56" width="158" height="34" rx="6" fill="' + C.card + '" stroke="' + C.line + '"/>' +
        label(119, 78, '임시파일 · 휴지통 삭제', C.tx, 12) +
        '<rect x="40" y="102" width="158" height="26" rx="5" fill="' + C.no + '" opacity=".3"/>' +
        '<rect x="40" y="102" width="70" height="26" rx="5" fill="' + C.ok + '" opacity=".55"/>' +
        label(119, 148, '→ 빈 <b>공간</b>이 늘어남', C.ok, 14) +
        label(119, 176, '용량 ↑', C.gold, 15) +
        '<rect x="236" y="16" width="210" height="188" rx="12" fill="none" stroke="' + C.pri + '" stroke-width="2"/>' +
        label(341, 40, '🧩 조각 모음', C.pri, 15) +
        // 흩어진 블록
        '<rect x="262" y="60" width="14" height="14" fill="' + C.pri + '"/><rect x="290" y="60" width="14" height="14" fill="' + C.pri + '"/>' +
        '<rect x="330" y="60" width="14" height="14" fill="' + C.pri + '"/><rect x="386" y="60" width="14" height="14" fill="' + C.pri + '"/>' +
        '<rect x="262" y="80" width="14" height="14" fill="' + C.pri + '"/><rect x="352" y="80" width="14" height="14" fill="' + C.pri + '"/>' +
        label(341, 112, '↓ 모아서 정리', C.tx2, 12) +
        '<rect x="262" y="122" width="14" height="14" fill="' + C.pri + '"/><rect x="278" y="122" width="14" height="14" fill="' + C.pri + '"/>' +
        '<rect x="294" y="122" width="14" height="14" fill="' + C.pri + '"/><rect x="310" y="122" width="14" height="14" fill="' + C.pri + '"/>' +
        '<rect x="326" y="122" width="14" height="14" fill="' + C.pri + '"/><rect x="342" y="122" width="14" height="14" fill="' + C.pri + '"/>' +
        label(341, 162, '→ 읽는 <b>속도</b>가 빨라짐', C.pri, 14) +
        label(341, 186, '용량은 그대로', C.no, 13)),
      cap: '⚠️ 시험 단골 — 조각 모음은 <b>속도</b>, 용량이 느는 건 <b>디스크 정리</b>' },
    { type: 'svg', title: '스풀(SPOOL) — 인쇄를 디스크에 맡기고 딴 일 하기',
      svg: svg('0 0 460 180',
        box(18, 62, 96, 54, '문서', C.line, C.card, 14) +
        arrow(118, 89, 172) +
        box(176, 54, 110, 70, '', C.gold, C.card) +
        '<text x="231" y="88" text-anchor="middle" font-size="22">💾</text>' +
        label(231, 112, '하드디스크', C.gold, 12) +
        label(231, 42, '스풀 = 임시 저장', C.gold, 13) +
        arrow(290, 89, 344) +
        box(348, 54, 96, 70, '', C.line, C.card) +
        '<text x="396" y="88" text-anchor="middle" font-size="22">🖨️</text>' +
        label(396, 112, '프린터(느림)', C.tx2, 11) +
        label(231, 152, 'CPU는 기다리지 않고 다른 작업 → 하지만 전체 인쇄 시간은 오히려 늘어남', C.no, 12)),
      cap: '기본 프린터는 <b>1대만</b> 지정 · 네트워크 프린터도 가능' },
  ];

  L['comp/sys'] = [
    { type: 'svg', title: '컴퓨터의 5대 장치',
      svg: svg('0 0 470 230',
        box(14, 92, 78, 48, '입력장치', C.ok, C.card, 13) +
        arrow(96, 116, 132, C.ok) +
        '<rect x="136" y="30" width="196" height="170" rx="12" fill="none" stroke="' + C.pri + '" stroke-width="2" stroke-dasharray="6 4"/>' +
        label(234, 50, '중앙처리장치 (CPU)', C.pri, 13) +
        box(150, 62, 80, 44, '제어장치', C.pri, C.card, 12) +
        box(240, 62, 80, 44, '연산장치', C.pri, C.card, 12) +
        box(150, 130, 170, 44, '기억장치 (주기억)', C.gold, C.card, 13) +
        arrow(336, 116, 372) +
        box(376, 92, 82, 48, '출력장치', C.warn, C.card, 13) +
        label(234, 218, '보조기억장치(HDD·SSD)는 주기억을 도와 자료를 오래 보관', C.tx2, 12)),
      cap: '제어장치 = 지시·감독 / 연산장치 = 계산 — <b>둘을 합쳐 CPU</b>' },
    { type: 'svg', title: '자료의 크기 계단',
      svg: svg('0 0 470 200',
        (function () {
          var items = [['비트', '1'], ['니블', '4비트'], ['바이트', '8비트'], ['워드', 'CPU 한 번'], ['필드', ''], ['레코드', ''], ['파일', '']];
          var s = '', x = 14, y = 156, w = 60, step = 18;
          for (var i = 0; i < items.length; i++) {
            var h = 26 + i * step;
            s += '<rect x="' + x + '" y="' + (y - h + 26) + '" width="' + w + '" height="' + h + '" rx="6" fill="' +
              (i < 4 ? C.pri : C.gold) + '" opacity="' + (0.28 + i * 0.07) + '" stroke="' + (i < 4 ? C.pri : C.gold) + '" stroke-width="1.5"/>';
            s += '<text x="' + (x + w / 2) + '" y="' + (y + 44) + '" text-anchor="middle" fill="' + C.tx + '" font-size="12" font-weight="700">' + items[i][0] + '</text>';
            if (items[i][1]) s += '<text x="' + (x + w / 2) + '" y="' + (y + 60) + '" text-anchor="middle" fill="' + C.tx2 + '" font-size="10">' + items[i][1] + '</text>';
            x += w + 4;
          }
          return s;
        })() +
        label(140, 24, '물리적 단위', C.pri, 13) + label(390, 24, '논리적 단위', C.gold, 13)),
      cap: '물리: 비트&lt;니블&lt;바이트&lt;워드 · 논리: 필드&lt;레코드&lt;블록&lt;파일&lt;DB' },
    { type: 'table', title: '컴퓨터의 발전 — 세대별 소자',
      head: ['세대', '주요 소자', '특징'],
      rows: [
        ['1세대', '<b>진공관</b>', 'ENIAC · UNIVAC-1'],
        ['2세대', '<b>트랜지스터</b>', '운영체제 등장'],
        ['3세대', '<b>집적회로(IC)</b>', '시분할·다중 처리'],
        ['4세대', '<b>고밀도 집적회로(LSI)</b>', '개인용 컴퓨터'],
        ['5세대', 'VLSI', '인공지능 · 음성 인식'],
      ],
      cap: '<b>폰 노이만</b>=내장방식 제안 · <b>EDSAC</b>=최초 내장방식 · <b>UNIVAC-1</b>=최초 상업용' },
    { type: 'table', title: '문자 표현 코드 한눈에',
      head: ['코드', '비트', '표현 수', '특징'],
      rows: [
        ['BCD', '6비트', '64가지', '영문 <b>소문자 표현 불가</b>'],
        ['ASCII', '<b>7비트</b>', '128가지', 'PC·데이터 통신 표준 (존3+디지트4)'],
        ['EBCDIC', '8비트', '256가지', '<b>대형 컴퓨터</b>용'],
        ['유니코드', '<b>2바이트</b>', '65,536자', '전 세계 문자 국제 표준'],
      ],
      cap: '패리티 비트 = 오류 <b>검출</b>만 / 해밍 코드 = 검출 + <b>교정</b>' },
  ];

  L['comp/hw'] = [
    { type: 'svg', title: '기억장치 피라미드 — 위로 갈수록 빠르고 비싸다',
      svg: svg('0 0 470 250',
        (function () {
          var rows = [
            ['레지스터', 'CPU 안 · 가장 빠름', C.no, 120],
            ['캐시 메모리 (SRAM)', 'CPU ↔ 주기억 속도차 완화', C.warn, 190],
            ['주기억장치 (RAM·ROM)', '실행 중인 프로그램', C.pri, 270],
            ['보조기억장치 (HDD·SSD)', '오래 보관 · 가장 느림', C.ok, 360],
          ];
          var s = '', y = 34;
          for (var i = 0; i < rows.length; i++) {
            var w = rows[i][3], x = (470 - w) / 2;
            s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="44" rx="7" fill="' + rows[i][2] +
              '" opacity=".22" stroke="' + rows[i][2] + '" stroke-width="2"/>';
            s += '<text x="235" y="' + (y + 21) + '" text-anchor="middle" fill="' + C.tx + '" font-size="13" font-weight="800">' + rows[i][0] + '</text>';
            s += '<text x="235" y="' + (y + 37) + '" text-anchor="middle" fill="' + C.tx2 + '" font-size="10.5">' + rows[i][1] + '</text>';
            y += 50;
          }
          return s;
        })() +
        label(24, 60, '빠름', C.no, 12) + label(24, 214, '느림', C.ok, 12) +
        label(446, 60, '작음', C.no, 12) + label(446, 214, '큼', C.ok, 12) +
        label(24, 40, '속도', C.tx2, 11) + label(446, 40, '용량', C.tx2, 11)),
      cap: '<b>가상 메모리</b>는 맨 아래(보조기억) 일부를 주기억처럼 쓰는 것 — 목적은 <b>공간 확대</b>' },
    { type: 'table', title: 'ROM · RAM · SRAM · DRAM',
      head: ['구분', '전원 끄면', '특징', '쓰임'],
      rows: [
        ['<b>ROM</b>', '유지 (비휘발성)', '읽기 전용', 'BIOS · 펌웨어'],
        ['<b>RAM</b>', '사라짐 (휘발성)', '읽기·쓰기', '주기억장치'],
        ['SRAM', '사라짐', '재충전 ✕ · 빠름 · 비쌈', '<b>캐시</b>'],
        ['DRAM', '사라짐', '재충전 ○ · 느림 · 집적도↑', '<b>주기억</b>'],
        ['플래시', '유지', 'EEPROM 계열 · 블록 단위', 'USB · SSD'],
      ],
      cap: 'BIOS는 전원이 꺼져도 남아야 하니 <b>ROM</b>에 저장돼요' },
  ];

  L['comp/sw'] = [
    { type: 'svg', title: '컴파일러 vs 인터프리터',
      svg: svg('0 0 470 220',
        label(118, 26, '컴파일러', C.ok, 15) +
        box(20, 40, 84, 40, '원시 코드', C.line, C.card, 12) +
        arrow(108, 60, 146, C.ok) +
        box(150, 40, 84, 40, '전체 번역', C.ok, C.card, 12) +
        arrow(238, 60, 276, C.ok) +
        box(280, 40, 84, 40, '목적 프로그램', C.ok, C.card, 11) +
        arrow(368, 60, 400, C.ok) +
        label(430, 65, '실행', C.tx, 13) +
        label(235, 100, '번역 느림 · 실행 <b>빠름</b> · 목적 프로그램 <b>생김</b>', C.ok, 12) +
        '<line x1="20" y1="118" x2="450" y2="118" stroke="' + C.line + '" stroke-width="1" stroke-dasharray="4 4"/>' +
        label(118, 142, '인터프리터', C.warn, 15) +
        box(20, 156, 84, 40, '원시 코드', C.line, C.card, 12) +
        arrow(108, 176, 146, C.warn) +
        box(150, 156, 130, 40, '한 줄씩 번역+실행', C.warn, C.card, 11) +
        label(360, 172, '목적 프로그램', C.no, 12) +
        label(360, 190, '안 생김 ✕', C.no, 13)),
      cap: '인터프리터: APL · BASIC · LISP — 디버깅은 쉽고 실행은 느려요' },
    { type: 'table', title: '소프트웨어 구분 (저작권·버전)',
      head: ['이름', '뜻'],
      rows: [
        ['프리웨어', '무료 · <b>기간 제한 없음</b>'],
        ['셰어웨어', '기능·기간 <b>제한</b> 후 계속 쓰려면 구입'],
        ['데모 / 트라이얼', '홍보용 일부 기능 / 일정 <b>기간만</b> 체험'],
        ['알파 / 베타', '개발사 <b>내부</b> 테스트 / <b>일반인</b> 공개 테스트'],
        ['패치', '이미 배포된 것의 <b>오류 수정·보완</b>'],
        ['번들', '하드웨어·SW 구입 시 <b>끼워주는</b> 것'],
        ['펌웨어', '<b>ROM</b>에 저장돼 하드웨어를 제어'],
      ],
      cap: '⚠️ "구매 시 끼워주는 것"을 트라이얼로 착각하게 내는 문제가 자주 나옵니다' },
  ];

  L['comp/net'] = [
    { type: 'svg', title: '주소를 찾아가는 길 — DNS',
      svg: svg('0 0 470 190',
        box(14, 66, 92, 56, '', C.line, C.card) +
        '<text x="60" y="92" text-anchor="middle" font-size="20">💻</text>' +
        label(60, 112, '내 컴퓨터', C.tx2, 11) +
        arrow(110, 82, 176) + label(143, 72, 'naver.com?', C.tx2, 10) +
        box(180, 60, 100, 68, '', C.gold, C.card) +
        '<text x="230" y="88" text-anchor="middle" font-size="20">📖</text>' +
        label(230, 110, 'DNS 서버', C.gold, 12) +
        label(230, 44, '이름 → 숫자 주소', C.gold, 11) +
        '<line x1="176" y1="104" x2="112" y2="104" stroke="' + C.ok + '" stroke-width="2.5"/>' +
        '<polygon points="108,104 117,99 117,109" fill="' + C.ok + '"/>' +
        label(143, 120, '223.130.200.107', C.ok, 10) +
        arrow(284, 94, 344) +
        box(348, 66, 100, 56, '', C.pri, C.card) +
        '<text x="398" y="92" text-anchor="middle" font-size="20">🌐</text>' +
        label(398, 112, '웹 서버', C.pri, 11) +
        label(235, 172, 'IP 주소를 자동으로 나눠 주는 건 <b>DHCP</b> — DNS와 헷갈리지 않기', C.warn, 12)),
      cap: 'URL 형식 = <b>프로토콜://호스트[:포트][/경로]</b>' },
    { type: 'table', title: 'IPv4 vs IPv6 · 프로토콜',
      head: ['구분', 'IPv4', 'IPv6'],
      rows: [
        ['비트 수', '32비트', '<b>128비트</b>'],
        ['구성', '8비트 × 4', '16비트 × 8'],
        ['구분 기호', '점 <b>.</b>', '콜론 <b>:</b>'],
        ['특징', '주소 부족', '부족 해결 · 보안↑ · 호환성 우수'],
      ],
      cap: 'TCP=분할·오류검사 / IP=주소·경로 · SMTP=발송 / POP3=수신 / FTP=파일' },
    { type: 'table', title: '통신망과 무선 기술',
      head: ['이름', '내용'],
      rows: [
        ['LAN / MAN / WAN', '근거리 &lt; 도시권 &lt; <b>광역</b>'],
        ['VAN / ISDN', '부가가치통신망 / 종합정보통신망'],
        ['ADSL / VDSL', '전화선을 쓰는 초고속 인터넷 (VDSL이 더 빠름)'],
        ['와이파이 / 블루투스', '무선 랜 / <b>근거리 기기 연결</b>'],
        ['NFC / 테더링', '<b>10cm 이내</b> 접촉 통신 / 휴대폰을 모뎀처럼 공유'],
        ['빅데이터 / IoT', '방대한 데이터에서 가치 추출 / 사물이 인터넷으로 연결'],
      ],
      cap: '<b>UDP</b>=빠르지만 신뢰성↓(실시간 방송) · <b>ARP</b>=IP→물리주소 · <b>TELNET</b>=원격 접속' },
  ];

  L['comp/multi'] = [
    { type: 'svg', title: '비트맵 vs 벡터 — 확대해 보면 안다',
      svg: svg('0 0 470 220',
        label(118, 26, '비트맵 (픽셀 모음)', C.warn, 14) +
        '<circle cx="70" cy="90" r="34" fill="' + C.warn + '" opacity=".55"/>' +
        arrow(116, 90, 148, C.warn) +
        (function () {  // 계단 현상
          var s = '', px = 12;
          var cells = [[3,0],[4,0],[2,1],[3,1],[4,1],[5,1],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],
                       [1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[2,4],[3,4],[4,4],[5,4],[3,5],[4,5]];
          for (var i = 0; i < cells.length; i++)
            s += '<rect x="' + (156 + cells[i][0] * px) + '" y="' + (56 + cells[i][1] * px) + '" width="' + px + '" height="' + px +
              '" fill="' + C.warn + '" opacity=".6" stroke="' + C.no + '" stroke-width="0.7"/>';
          return s;
        })() +
        label(203, 160, '계단 현상 ✕', C.no, 12) +
        '<line x1="243" y1="30" x2="243" y2="186" stroke="' + C.line + '" stroke-width="1" stroke-dasharray="4 4"/>' +
        label(360, 26, '벡터 (수학 계산)', C.ok, 14) +
        '<circle cx="300" cy="90" r="34" fill="' + C.ok + '" opacity=".5"/>' +
        arrow(344, 90, 376, C.ok) +
        '<circle cx="412" cy="96" r="44" fill="' + C.ok + '" opacity=".5"/>' +
        label(412, 160, '매끄러움 ○', C.ok, 12) +
        label(203, 186, 'BMP·JPG·GIF·PNG', C.tx2, 11) +
        label(390, 186, 'WMF·AI·CDR', C.tx2, 11)),
      cap: '벡터는 확대해도 안 깨지고 용량이 작지만, 사진 같은 정교한 표현엔 비트맵' },
    { type: 'table', title: '그래픽 기법 · 파일 형식',
      head: ['용어', '뜻'],
      rows: [
        ['렌더링', '3D에 <b>색·명암·질감</b>을 입혀 사실감'],
        ['앤티앨리어싱', '계단 현상을 <b>부드럽게</b>'],
        ['디더링', '제한된 색을 <b>섞어</b> 다른 색 표현'],
        ['모핑', '한 이미지가 다른 이미지로 <b>서서히 변화</b>'],
        ['모델링', '3차원 형상을 <b>어떻게 표현할지 정하는</b> 과정'],
        ['GIF / JPG / PNG', '256색·애니 / 손실·사진 / 무손실·투명(<b>애니 ✕</b>)'],
        ['WAVE / MIDI', '실제 소리(큼) / 연주 정보만(<b>사람 음성 ✕</b>)'],
      ],
      cap: 'MPEG: 1=CD · 2=DVD·방송 · 4=모바일 · <b>7=내용 검색</b>' },
  ];

  L['comp/security'] = [
    { type: 'svg', title: '공개키(비대칭) 암호화',
      svg: svg('0 0 470 200',
        box(12, 68, 84, 48, '평문', C.line, C.card, 13) +
        arrow(100, 92, 138) +
        '<text x="119" y="72" text-anchor="middle" font-size="16">🔓</text>' +
        label(119, 128, '공개키', C.ok, 12) + label(119, 144, '(누구나)', C.tx2, 10) +
        box(142, 68, 96, 48, '암호문', C.pri, C.card, 13) +
        arrow(242, 92, 300) +
        label(271, 78, '전송', C.tx2, 11) +
        '<text x="330" y="72" text-anchor="middle" font-size="16">🔑</text>' +
        label(330, 128, '개인키', C.no, 12) + label(330, 144, '(나만)', C.tx2, 10) +
        arrow(304, 92, 352, C.no) +
        box(356, 68, 96, 48, '평문', C.line, C.card, 13) +
        label(235, 32, '잠글 때와 풀 때 열쇠가 다르다', C.gold, 14) +
        label(235, 178, '공개키 = 키 관리 쉬움 · 속도 느림 (RSA) ↔ 비밀키 = 빠름 · 관리 어려움', C.tx2, 11.5)),
      cap: '방화벽은 <b>외부 침입</b>만 막습니다 — 내부자 해킹은 못 막아요' },
    { type: 'table', title: '악성 프로그램 · 공격 기법',
      head: ['이름', '핵심'],
      rows: [
        ['바이러스', '다른 프로그램을 <b>감염</b>시키며 자기 복제'],
        ['웜(Worm)', '<b>숙주 없이</b> 스스로 복제·전파 (네트워크 부하)'],
        ['트로이 목마', '정상인 척 위장 · <b>자기 복제 안 함</b> · 정보 유출'],
        ['랜섬웨어', '파일을 <b>암호화</b>하고 금전 요구'],
        ['스니핑 / 스푸핑', '몰래 <b>엿봄</b> / 신뢰한 것처럼 <b>위장</b>'],
        ['피싱 / DDoS', '가짜 사이트로 유인 / 대량 접속으로 <b>마비</b>'],
      ],
      cap: '⚠️ 웜 = 복제 O · 트로이 목마 = 복제 ✕ — 가장 많이 나오는 비교' },
  ];

  /* ═══════════ 2과목 스프레드시트 일반 ═══════════ */

  // 미니 워크시트 격자 그리기 도우미
  function sheet(x, y, cols, rows, cw, ch, cells, hi) {
    var s = '', i, j;
    s += '<rect x="' + x + '" y="' + y + '" width="' + (cw * (cols + 1)) + '" height="' + (ch * (rows + 1)) +
      '" fill="#141a33" stroke="' + C.line + '" stroke-width="1.5"/>';
    for (i = 0; i <= cols; i++) {
      for (j = 0; j <= rows; j++) {
        var head = (i === 0 || j === 0);
        s += '<rect x="' + (x + i * cw) + '" y="' + (y + j * ch) + '" width="' + cw + '" height="' + ch +
          '" fill="' + (head ? 'var(--gridhead,#2a3157)' : 'none') + '" stroke="' + C.line + '" stroke-width="1"/>';
        var t = '';
        if (j === 0 && i > 0) t = String.fromCharCode(64 + i);
        else if (i === 0 && j > 0) t = j;
        else if (cells && cells[(j) + ',' + (i)]) t = cells[(j) + ',' + (i)];
        if (t !== '') s += '<text x="' + (x + i * cw + cw / 2) + '" y="' + (y + j * ch + ch / 2 + 4) +
          '" text-anchor="middle" fill="' + (head ? C.tx2 : C.tx) + '" font-size="' + (head ? 10 : 11) + '" font-weight="' + (head ? 700 : 500) + '">' + t + '</text>';
      }
    }
    if (hi) hi.forEach(function (h) {   // [row, col, color]
      s += '<rect x="' + (x + h[1] * cw) + '" y="' + (y + h[0] * ch) + '" width="' + cw + '" height="' + ch +
        '" fill="' + h[2] + '" opacity=".3" stroke="' + h[2] + '" stroke-width="2"/>';
      if (h[3]) s += '<text x="' + (x + h[1] * cw + cw / 2) + '" y="' + (y + h[0] * ch + ch / 2 + 4) +
        '" text-anchor="middle" fill="' + C.tx + '" font-size="11" font-weight="800">' + h[3] + '</text>';
    });
    return s;
  }

  L['excel/basic'] = [
    { type: 'svg', title: '엑셀 화면 구성',
      svg: svg('0 0 470 240',
        '<rect x="12" y="14" width="446" height="212" rx="8" fill="#141a33" stroke="' + C.line + '" stroke-width="2"/>' +
        '<rect x="12" y="14" width="446" height="26" fill="' + C.pri + '" opacity=".28"/>' +
        label(60, 31, '홈  삽입  수식  데이터', C.tx, 11) +
        // 이름 상자 + 수식 입력줄
        '<rect x="22" y="48" width="66" height="24" rx="4" fill="' + C.card + '" stroke="' + C.gold + '" stroke-width="2"/>' +
        label(55, 64, 'B3', C.gold, 12) +
        '<rect x="94" y="48" width="352" height="24" rx="4" fill="' + C.card + '" stroke="' + C.ok + '" stroke-width="2"/>' +
        label(104, 64, '=SUM(B1:B2)', C.ok, 12, 'start') +
        label(55, 88, '이름 상자', C.gold, 10) +
        label(150, 88, '수식 입력줄 — 실제 입력한 수식이 보임', C.ok, 10, 'start') +
        sheet(22, 96, 5, 4, 62, 22, { '1,2': '10', '2,2': '20', '3,2': '30' }, [[3, 2, C.gold, '30']]) +
        // 시트 탭
        '<rect x="22" y="200" width="70" height="20" rx="4" fill="' + C.card + '" stroke="' + C.pri + '" stroke-width="2"/>' +
        label(57, 214, 'Sheet1', C.tx, 10) +
        '<rect x="96" y="200" width="70" height="20" rx="4" fill="' + C.card + '" stroke="' + C.line + '"/>' +
        label(131, 214, 'Sheet2', C.tx2, 10) +
        label(300, 214, '시트 이름 31자 · : \\ / ? * [ ] 사용 불가', C.tx2, 10)),
      cap: '셀에 계산 <b>결과</b>가 보이고, 수식 입력줄엔 <b>수식</b>이 보입니다' },
    { type: 'svg', title: '채우기 핸들 — 복사냐 증가냐',
      svg: svg('0 0 470 220',
        label(78, 26, '숫자 1개', C.tx2, 12) +
        sheet(20, 34, 1, 3, 58, 24, { '1,1': '5', '2,1': '5', '3,1': '5' }) +
        label(78, 150, '그냥 끌기', C.tx, 12) + label(78, 168, '= 복사', C.warn, 13) +
        label(196, 26, '숫자 1개 + Ctrl', C.tx2, 12) +
        sheet(138, 34, 1, 3, 58, 24, { '1,1': '5', '2,1': '6', '3,1': '7' }) +
        label(196, 150, 'Ctrl 누르고', C.tx, 12) + label(196, 168, '= 1씩 증가', C.ok, 13) +
        label(314, 26, '숫자 2개 선택', C.tx2, 12) +
        sheet(256, 34, 1, 3, 58, 24, { '1,1': '3', '2,1': '6', '3,1': '9' }) +
        label(314, 150, '차이만큼', C.tx, 12) + label(314, 168, '= 등차 증가', C.ok, 13) +
        label(424, 26, '문자+숫자', C.tx2, 12) +
        sheet(374, 34, 1, 3, 76, 24, { '1,1': '3급-1', '2,1': '3급-2', '3,1': '3급-3' }) +
        label(424, 150, '문자는 그대로', C.tx, 11) + label(424, 168, '숫자만 +1', C.ok, 13) +
        label(235, 202, '⚠️ 숫자 하나는 "그냥 끌면 복사" — Ctrl을 눌러야 증가합니다', C.gold, 12.5)),
      cap: '날짜는 그냥 끌어도 <b>1일씩 증가</b>합니다' },
    { type: 'table', title: '입력 단축키',
      head: ['키', '기능'],
      rows: [
        ['<b>Alt + Enter</b>', '한 셀 안에서 <b>줄 바꿈</b>'],
        ['<b>Ctrl + Enter</b>', '선택한 <b>여러 셀에 같은 값</b> 한 번에'],
        ['Ctrl + ;', '오늘 날짜'],
        ['Ctrl + Shift + ;', '현재 시간'],
        ['Ctrl + 1', '셀 서식 대화상자'],
        ['Alt + ↓', '같은 열에 입력했던 값 목록'],
      ],
      cap: '숫자=오른쪽 정렬 · 문자=왼쪽 정렬 · <b>날짜/시간도 숫자</b>라 오른쪽 정렬' },
    { type: 'table', title: '셀 이동 · 선택 키 (교재 빈출)',
      head: ['키', '기능', '키', '기능'],
      rows: [
        ['<b>Ctrl + Home</b>', '[A1]로 이동', 'Home', '그 행의 <b>A열</b>로'],
        ['<b>Ctrl + End</b>', '데이터 끝(오른쪽 아래)', 'F5', '갈 셀 주소 직접 입력'],
        ['Ctrl + ↓', '마지막 행 1,048,576', 'Ctrl + →', '마지막 열 <b>XFD</b>'],
        ['<b>Shift</b> + Space', '<b>행</b> 전체 선택', '<b>Ctrl</b> + Space', '<b>열</b> 전체 선택'],
        ['Ctrl + A', '시트 전체 선택', 'Ctrl + PgUp/PgDn', '앞 / 뒤 <b>시트</b>로'],
      ],
      cap: '⚠️ 행은 <b>Shift</b>+Space, 열은 <b>Ctrl</b>+Space — 바꿔서 내는 문제가 많습니다' },
  ];

  L['excel/format'] = [
    { type: 'svg', title: '사용자 지정 표시 형식 — 세미콜론 4구역',
      svg: svg('0 0 470 200',
        box(16, 44, 100, 46, '양수', C.ok, C.card, 14) +
        label(126, 72, ';', C.gold, 24) +
        box(136, 44, 100, 46, '음수', C.no, C.card, 14) +
        label(246, 72, ';', C.gold, 24) +
        box(256, 44, 96, 46, '0(영)', C.warn, C.card, 14) +
        label(362, 72, ';', C.gold, 24) +
        box(372, 44, 84, 46, '문자', C.pri, C.card, 14) +
        label(235, 26, '순서를 절대 바꿀 수 없어요', C.gold, 14) +
        label(235, 122, '예)  [파랑]#,##0 ; [빨강](#,##0) ; "-" ; @"님"', C.tx, 14) +
        label(235, 156, '양수는 파랑, 음수는 빨강 괄호, 0은 하이픈, 문자는 뒤에 "님"', C.tx2, 12) +
        label(235, 182, '조건은 대괄호 [ ] 안에 → [>10000]', C.pri, 12)),
      cap: '⚠️ 구역 순서 <b>양수 → 음수 → 0 → 문자</b>는 반드시 외우세요' },
    { type: 'table', title: '표시 형식 코드 — 결과로 외우기',
      head: ['코드', '입력', '결과'],
      rows: [
        ['#', '012345 → <b>#,###</b>', '12,345 <span style="color:var(--tx2)">(앞의 0 사라짐)</span>'],
        ['0', '5 → <b>0.0</b>', '5.0 <span style="color:var(--tx2)">(자리를 0으로 채움)</span>'],
        ['#,##0<b>,</b>', '12345', '<b>12</b> <span style="color:var(--tx2)">(천 단위 생략)</span>'],
        ['#,###<b>,,</b>', '원 → 백만 단위', '쉼표 2개 = 백만 단위'],
        ['@', '컴활 → <b>@"짱"</b>', '컴활짱'],
        ['yy / mmm / ddd', '2015-06-25', '15 / Jun / Thu'],
      ],
      cap: '<b>#####</b>은 오류가 아니라 <b>열 너비 부족</b> — 넓히면 사라집니다' },
  ];

  L['excel/formula'] = [
    { type: 'svg', title: '상대참조 · 절대참조 · 혼합참조',
      svg: svg('0 0 470 230',
        label(80, 24, '상대참조  A1', C.warn, 13) +
        sheet(20, 32, 2, 3, 56, 24, { '1,1': '=A1', '2,1': '=A2', '3,1': '=A3' }) +
        label(80, 148, '복사하면 같이 이동', C.warn, 11) +
        label(235, 24, '절대참조  $A$1', C.ok, 13) +
        sheet(175, 32, 2, 3, 56, 24, { '1,1': '=$A$1', '2,1': '=$A$1', '3,1': '=$A$1' }) +
        label(235, 148, '언제나 고정', C.ok, 11) +
        label(390, 24, '혼합참조  $A1', C.pri, 13) +
        sheet(330, 32, 2, 3, 56, 24, { '1,1': '=$A1', '2,1': '=$A2', '3,1': '=$A3' }) +
        label(390, 148, '열만 고정 · 행은 이동', C.pri, 11) +
        '<rect x="60" y="170" width="350" height="46" rx="9" fill="' + C.card + '" stroke="' + C.gold + '" stroke-width="2"/>' +
        label(235, 190, 'F4 를 누를 때마다', C.gold, 12) +
        label(235, 208, 'A1  →  $A$1  →  A$1  →  $A1', C.tx, 14)),
      cap: '$는 <b>바로 뒤에 오는 것</b>을 고정 — $A1은 열 고정, A$1은 행 고정' },
    { type: 'table', title: '오류 메시지 — 원인으로 외우기',
      head: ['메시지', '왜 났을까?'],
      rows: [
        ['#####', '<b>오류 아님</b> · 열 너비가 좁음'],
        ['#DIV/0!', '<b>0</b>이나 빈 셀로 나눔'],
        ['#N/A', '찾는 값이 <b>없음</b>'],
        ['#NAME?', '함수 이름 오타 · <b>콜론(:) 빠짐</b>'],
        ['#VALUE!', '인수의 <b>데이터 형식</b>이 잘못됨'],
        ['#REF!', '참조하던 셀이 <b>삭제됨</b>'],
        ['#NULL!', '교차하지 않는 두 영역의 교점'],
      ],
      cap: '=SUM(A3<b>:</b>A9)에서 콜론을 빼면 → <b>#NAME?</b>' },
  ];

  L['excel/func'] = [
    { type: 'svg', title: 'VLOOKUP은 이렇게 찾아갑니다',
      svg: svg('0 0 470 230',
        label(235, 22, '=VLOOKUP( 찾을값 , 범위 , 열번호 , 0 )', C.gold, 15) +
        sheet(70, 44, 3, 4, 76, 26,
          { '0,1': '사번', '0,2': '이름', '0,3': '점수',
            '1,1': 'A01', '1,2': '김하늘', '1,3': '90',
            '2,1': 'A02', '2,2': '이바다', '2,3': '85',
            '3,1': 'A03', '3,2': '박구름', '3,3': '95' },
          [[3, 1, C.pri, 'A03'], [3, 3, C.ok, '95']]) +
        '<text x="46" y="140" text-anchor="middle" fill="' + C.pri + '" font-size="13" font-weight="800">①</text>' +
        label(46, 158, '첫 열에서', C.pri, 10) + label(46, 172, '찾는다', C.pri, 10) +
        arrow(300, 130, 340, C.ok) +
        '<text x="368" y="126" text-anchor="middle" fill="' + C.ok + '" font-size="13" font-weight="800">②</text>' +
        label(390, 146, '3번째 열의 값', C.ok, 11) +
        label(235, 196, '마지막 0(FALSE) = 정확히 일치 · 1(TRUE)/생략 = 근사값(첫 열 오름차순 필요)', C.tx2, 11.5) +
        label(235, 218, '가로로 찾을 땐 HLOOKUP — 첫 <b>행</b>에서 찾습니다', C.warn, 12)),
      cap: '열 번호는 <b>범위 안에서</b> 몇 번째 열인지 셉니다 (시트 전체 아님)' },
    { type: 'table', title: '자주 나오는 함수 총정리',
      head: ['분류', '함수', '하는 일'],
      rows: [
        ['통계', 'RANK.EQ(값,$범위$,순서)', '순위 · 0/생략=<b>내림차순</b>'],
        ['', 'LARGE / SMALL(범위,k)', 'k번째 큰 / 작은 값'],
        ['', 'COUNT / COUNTA / COUNTBLANK', '숫자 / 안 빈 셀 / 빈 셀 개수'],
        ['조건', 'COUNTIF · SUMIF · AVERAGEIF', '조건 만족 개수·합계·평균'],
        ['수학', 'ROUND / UP / DOWN(수,자릿수)', '반올림 / 올림 / 내림'],
        ['', 'INT · MOD · ABS', '정수 내림 · 나머지 · 절댓값'],
        ['문자', 'LEFT · RIGHT · MID(문자,시작,개수)', '왼쪽·오른쪽·중간 추출'],
        ['찾기', 'VLOOKUP · HLOOKUP · INDEX+MATCH', '표에서 값 찾기'],
        ['DB', 'DSUM · DAVERAGE · DCOUNT · DMAX · DMIN', '조건 범위 기준 집계'],
      ],
      cap: '<b>DCOUNT</b>는 숫자만 셉니다 — 문자 필드는 <b>DCOUNTA</b>' },
  ];

  L['excel/data'] = [
    { type: 'svg', title: '고급 필터 — 같은 행이면 그리고, 다른 행이면 또는',
      svg: svg('0 0 470 220',
        label(118, 26, 'AND (그리고)', C.ok, 15) +
        sheet(30, 38, 2, 2, 80, 26, { '0,1': '국어', '0,2': '영어', '1,1': '>=80', '1,2': '>=90' }) +
        label(118, 132, '국어 80이상 <b>이면서</b>', C.tx, 12) +
        label(118, 150, '영어 90이상', C.tx, 12) +
        label(118, 176, '조건을 한 줄에!', C.ok, 13) +
        '<line x1="240" y1="26" x2="240" y2="196" stroke="' + C.line + '" stroke-width="1" stroke-dasharray="4 4"/>' +
        label(352, 26, 'OR (또는)', C.warn, 15) +
        sheet(264, 38, 2, 3, 80, 26, { '0,1': '국어', '0,2': '영어', '1,1': '>=80', '2,2': '>=90' }) +
        label(352, 158, '국어 80이상 <b>이거나</b>', C.tx, 12) +
        label(352, 176, '영어 90이상 → 줄을 바꿔서', C.warn, 12)),
      cap: '자동 필터는 여러 필드가 <b>AND만</b> — OR로 걸려면 <b>고급 필터</b>를 씁니다' },
    { type: 'svg', title: '오름차순 정렬 순서',
      svg: svg('0 0 470 170',
        (function () {
          var items = [['숫자', C.pri], ['문자', C.ok], ['논리값', C.warn], ['오류값', C.no], ['빈 셀', C.tx2]];
          var s = '', x = 20;
          for (var i = 0; i < items.length; i++) {
            s += box(x, 56, 74, 46, items[i][0], items[i][1], C.card, 13);
            if (i < items.length - 1) s += arrow(x + 76, 79, x + 88);
            x += 90;
          }
          return s;
        })() +
        label(235, 30, '작은 것 → 큰 것', C.tx2, 13) +
        label(400, 124, '빈 셀은', C.no, 12) +
        label(400, 142, '항상 맨 뒤!', C.no, 13) +
        label(150, 134, '내림차순이면 이 순서가 거꾸로', C.tx2, 11.5)),
      cap: '⚠️ 빈 셀은 <b>오름차순·내림차순 모두</b> 마지막 · 정렬 기준은 최대 <b>64개</b>' },
    { type: 'table', title: '자동 필터 vs 고급 필터 vs 부분합',
      head: ['기능', '핵심'],
      rows: [
        ['자동 필터', '조건에 맞는 행만 표시(<b>숨김</b>) · 여러 필드는 AND'],
        ['고급 필터', '복잡한 조건 · 결과를 <b>다른 곳에 추출</b> 가능'],
        ['부분합', '반드시 <b>그룹 기준 정렬 먼저</b> · 중첩하려면 "새로운 값으로 대치" <b>해제</b>'],
        ['중복된 항목 제거', '원본에서 <b>실제로 삭제</b>됨'],
        ['텍스트 나누기', '구분 기호·너비 기준으로 <b>여러 열</b>로 분리'],
      ],
      cap: '숨겨진 행·열은 <b>정렬에 포함되지 않습니다</b>' },
  ];

  L['excel/analysis'] = [
    { type: 'svg', title: '피벗 테이블 4개 영역',
      svg: svg('0 0 470 220',
        box(20, 40, 120, 40, '필터', C.warn, C.card, 13) +
        box(20, 92, 120, 40, '행', C.pri, C.card, 13) +
        box(20, 144, 120, 40, '열', C.ok, C.card, 13) +
        box(20, 196, 120, 0, '', C.line, C.card, 13) +
        arrow(146, 112, 182) +
        '<rect x="188" y="34" width="256" height="152" rx="8" fill="#141a33" stroke="' + C.gold + '" stroke-width="2"/>' +
        label(316, 54, '요약 표', C.gold, 14) +
        sheet(206, 62, 3, 3, 72, 26,
          { '0,1': '1월', '0,2': '2월', '0,3': '합계',
            '1,1': '120', '1,2': '150', '1,3': '270',
            '2,1': '80', '2,2': '90', '2,3': '170',
            '3,1': '200', '3,2': '240', '3,3': '440' }) +
        label(316, 200, '값 영역 = 합계·평균·최대·최소', C.tx2, 11.5) +
        label(80, 200, '원본이 바뀌면 [새로 고침] 필수!', C.no, 12)),
      cap: '피벗 테이블은 <b>새 워크시트</b>에도 만들 수 있고, 삭제해도 피벗 차트는 일반 차트로 남아요' },
    { type: 'table', title: '차트 종류 · 가상 분석',
      head: ['이름', '언제 쓰나'],
      rows: [
        ['세로 막대형', '항목끼리 <b>비교</b>'],
        ['꺾은선형', '시간에 따른 <b>추세</b> (월·분기·연도)'],
        ['원형', '전체에 대한 <b>비율</b> · 계열 <b>1개</b>만 · 축 없음'],
        ['분산형', '두 값의 <b>상관관계</b>'],
        ['방사형', '여러 계열의 <b>합계 비교</b> (중심에서 뻗은 축)'],
        ['목표값 찾기', '결과를 정해 두고 <b>입력값 1개</b>를 거꾸로 찾기'],
        ['시나리오', '여러 가정의 결과 비교 · 변경 셀 최대 <b>32개</b>'],
      ],
      cap: '추세선 <b>불가</b>: 원형·도넛형·방사형·표면형·3차원 · F11=새 시트, Alt+F1=현재 시트' },
  ];

  L['excel/print'] = [
    { type: 'svg', title: '인쇄 페이지 구성',
      svg: svg('0 0 470 250',
        '<rect x="120" y="18" width="230" height="214" rx="6" fill="#141a33" stroke="' + C.line + '" stroke-width="2"/>' +
        '<rect x="140" y="36" width="190" height="22" rx="4" fill="' + C.pri + '" opacity=".3"/>' +
        label(235, 51, '머리글 (페이지 번호·날짜)', C.tx, 10) +
        '<rect x="140" y="68" width="190" height="20" rx="3" fill="' + C.gold + '" opacity=".35" stroke="' + C.gold + '" stroke-width="1.5"/>' +
        label(235, 82, '반복할 행 — 매 페이지 제목', C.tx, 10) +
        (function () {
          var s = '', y = 96;
          for (var i = 0; i < 4; i++) { s += '<rect x="140" y="' + y + '" width="190" height="16" fill="' + C.card + '" stroke="' + C.line + '" stroke-width="0.8"/>'; y += 18; }
          return s;
        })() +
        '<rect x="140" y="190" width="190" height="22" rx="4" fill="' + C.pri + '" opacity=".3"/>' +
        label(235, 205, '바닥글', C.tx, 10) +
        '<line x1="120" y1="18" x2="140" y2="36" stroke="' + C.no + '" stroke-width="1.5" stroke-dasharray="3 2"/>' +
        label(66, 30, '여백', C.no, 12) +
        label(66, 48, '[여백] 탭', C.tx2, 10) +
        label(410, 90, '[시트] 탭', C.gold, 11) +
        label(410, 108, '· 반복할 행/열', C.tx2, 10) +
        label(410, 124, '· 눈금선 인쇄', C.tx2, 10) +
        label(410, 140, '· 메모 인쇄', C.tx2, 10) +
        label(66, 150, '페이지 가운데', C.tx2, 10) +
        label(66, 166, '맞춤도 [여백]', C.tx2, 10)),
      cap: '⚠️ <b>틀 고정</b>은 화면 전용 — 인쇄에 제목을 반복하려면 <b>반복할 행</b>' },
    { type: 'svg', title: '틀 고정 vs 창 나누기',
      svg: svg('0 0 470 210',
        label(115, 26, '틀 고정', C.ok, 15) +
        sheet(24, 36, 3, 4, 60, 24, {}) +
        '<line x1="84" y1="36" x2="84" y2="156" stroke="' + C.ok + '" stroke-width="3"/>' +
        '<line x1="24" y1="84" x2="264" y2="84" stroke="' + C.ok + '" stroke-width="3"/>' +
        label(115, 176, '스크롤해도 고정 · 인쇄 ✕', C.ok, 12) +
        '<line x1="240" y1="26" x2="240" y2="190" stroke="' + C.line + '" stroke-width="1" stroke-dasharray="4 4"/>' +
        label(360, 26, '창 나누기', C.pri, 15) +
        sheet(270, 36, 3, 4, 60, 24, {}) +
        '<line x1="390" y1="36" x2="390" y2="156" stroke="' + C.pri + '" stroke-width="4"/>' +
        '<line x1="270" y1="96" x2="510" y2="96" stroke="' + C.pri + '" stroke-width="4"/>' +
        label(360, 176, '최대 4개 영역 · 선을 옮길 수 있음', C.pri, 12)),
      cap: '틀 고정선은 못 옮기고, 창 나누기 선은 <b>마우스로 옮길 수 있어요</b>' },
    { type: 'table', title: '매크로',
      head: ['항목', '규칙'],
      rows: [
        ['이름', '첫 글자는 <b>반드시 문자</b> · 공백·특수문자 ✕'],
        ['Auto_Open', '통합 문서를 <b>열 때 자동 실행</b>'],
        ['바로 가기 키', 'Ctrl+영문 · 엑셀 기본키와 겹치면 <b>매크로가 우선</b>'],
        ['기록 내용', '마우스 + <b>키보드 모두</b> 기록됨'],
        ['수정', 'Alt+F11 (VB Editor)에서 <b>편집 가능</b>'],
        ['실행', 'Alt+F8 목록 · 바로 가기 키 · <b>도형</b>에 지정'],
      ],
      cap: '저장 위치: 개인용 매크로 통합 문서 · 새 통합 문서 · 현재 통합 문서' },
  ];

  return L;
})();
