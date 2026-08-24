/* 컴활 2급 · 설명 모드 수업자료 — 컴퓨터 일반 보강판
 *
 * data/lesson.js 다음에 로드되어 'comp/*' 키에 슬라이드를 뒤에 이어 붙인다.
 * (스프레드시트는 data/lesson-excel.js 가 같은 방식으로 담당)
 *
 * 슬라이드 형식은 lesson.js와 같다.
 *   { type:'svg',   title, svg, cap }
 *   { type:'table', title, head:[...], rows:[[...]], cap }
 * 표는 7줄 이상이면 앱이 자동으로 글씨를 줄이지만(bigtbl), 한 화면에 담기게 6~7줄로 끊었다.
 * SVG는 viewBox 안에 그림이 다 들어가야 잘리지 않는다 — scratchpad/geo.js 로 검사할 것.
 */
(function () {
  var L = window.COMHWAL2_LESSON = window.COMHWAL2_LESSON || {};

  var C = {
    card: 'var(--card2)', line: 'var(--line)', tx: 'var(--tx)', tx2: 'var(--tx2)',
    pri: 'var(--pri)', ok: 'var(--ok)', no: 'var(--no)', gold: 'var(--gold)', warn: 'var(--warn)',
  };
  function box(x, y, w, h, label, stroke, fill, fs) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" ' +
      'fill="' + (fill || C.card) + '" stroke="' + (stroke || C.line) + '" stroke-width="2"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 5) + '" text-anchor="middle" ' +
      'fill="' + C.tx + '" font-size="' + (fs || 14) + '" font-weight="700">' + label + '</text>';
  }
  function arrow(x1, y, x2, col) {
    col = col || C.pri;
    return '<line x1="' + x1 + '" y1="' + y + '" x2="' + (x2 - 8) + '" y2="' + y + '" stroke="' + col +
      '" stroke-width="2.5"/><polygon points="' + x2 + ',' + y + ' ' + (x2 - 9) + ',' + (y - 5) + ' ' +
      (x2 - 9) + ',' + (y + 5) + '" fill="' + col + '"/>';
  }
  function down(x, y1, y2, col) {
    col = col || C.pri;
    return '<line x1="' + x + '" y1="' + y1 + '" x2="' + x + '" y2="' + (y2 - 8) + '" stroke="' + col +
      '" stroke-width="2.5"/><polygon points="' + x + ',' + y2 + ' ' + (x - 5) + ',' + (y2 - 9) + ' ' +
      (x + 5) + ',' + (y2 - 9) + '" fill="' + col + '"/>';
  }
  function label(x, y, t, col, fs, anchor) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" fill="' +
      (col || C.tx2) + '" font-size="' + (fs || 13) + '" font-weight="700">' + t + '</text>';
  }
  function mono(x, y, t, col, fs, anchor) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" fill="' +
      (col || C.ok) + '" font-size="' + (fs || 13) + '" font-weight="700" ' +
      'font-family="Consolas,D2Coding,monospace">' + t + '</text>';
  }
  function svg(vb, inner) { return '<svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>'; }
  function add(key, arr) { L[key] = (L[key] || []).concat(arr); }

  /* ═══════════════ 1. 한글 Windows 기본 ═══════════════ */
  add('comp/win', [
    { type: 'table', title: '에어로 3형제 — 이름만 바꿔서 나온다',
      head: ['이름', '무엇을 하면', '무슨 일이 일어나나'],
      rows: [
        ['<b>에어로 피크</b>', '작업 표시줄 <b>오른쪽 끝</b>에 마우스를 올리면', '열린 창이 투명해져 <b>바탕화면이 비쳐 보임</b>'],
        ['<b>에어로 스냅</b>', '창을 화면 <b>가장자리로 끌면</b>', '창 크기가 반쪽·전체로 <b>자동 조절</b>'],
        ['<b>에어로 셰이크</b>', '창 제목 표시줄을 잡고 <b>흔들면</b>', '흔든 창만 남고 <b>나머지가 최소화</b>'],
        ['가상 데스크톱', '<b>Win + Ctrl + D</b>', '바탕화면을 여러 개 만들어 <b>번갈아 사용</b>'],
      ],
      cap: '피크=<b>엿보기</b>, 스냅=<b>착 붙기</b>, 셰이크=<b>흔들기</b> — 뜻으로 외우면 안 헷갈립니다' },

    { type: 'svg', title: '작업 표시줄 뜯어보기',
      svg: svg('0 0 470 220',
        '<rect x="14" y="30" width="442" height="52" rx="8" fill="' + C.card + '" stroke="' + C.pri + '" stroke-width="2"/>' +
        '<text x="44" y="63" text-anchor="middle" font-size="20">⊞</text>' +
        '<rect x="72" y="40" width="92" height="32" rx="6" fill="#141a33" stroke="' + C.line + '"/>' +
        label(118, 61, '🔍 검색', C.tx2, 11) +
        '<rect x="174" y="40" width="34" height="32" rx="6" fill="#141a33" stroke="' + C.line + '"/>' +
        '<text x="191" y="62" text-anchor="middle" font-size="14">📁</text>' +
        '<rect x="214" y="40" width="34" height="32" rx="6" fill="#141a33" stroke="' + C.ok + '" stroke-width="2"/>' +
        '<text x="231" y="62" text-anchor="middle" font-size="14">🌐</text>' +
        label(360, 61, '🔊  📶  🔋   14:30', C.tx2, 12) +
        '<rect x="440" y="34" width="12" height="44" fill="' + C.gold + '" opacity=".45"/>' +
        // 지시선
        label(44, 100, '시작', C.tx, 11) +
        label(118, 100, '검색 상자', C.tx, 11) +
        label(210, 100, '고정된 앱 · 실행 중인 앱', C.tx, 11) +
        label(350, 100, '알림 영역(시스템 트레이)', C.tx, 11) +
        label(430, 118, '바탕화면 보기', C.gold, 11) +
        '<line x1="14" y1="136" x2="456" y2="136" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 160, '앱 아이콘을 <tspan fill="' + C.gold + '">오른쪽 클릭</tspan>하면 = 점프 목록(최근 파일)', C.tx, 13) +
        label(235, 186, '작업 표시줄은 위·아래·좌·우로 옮길 수 있고, 화면의 <tspan fill="' + C.warn + '">1/2까지</tspan> 크기를 늘릴 수 있다', C.tx2, 12) +
        label(235, 208, '자동 숨기기 · 항상 위에 표시도 설정할 수 있다', C.tx2, 11.5)),
      cap: '작업 표시줄 빈 곳 오른쪽 클릭 → <b>작업 표시줄 설정</b>' },

    { type: 'table', title: 'Windows를 설명하는 말들',
      head: ['용어', '뜻'],
      rows: [
        ['<b>GUI</b>', '아이콘·메뉴를 <b>마우스로</b> 눌러 쓰는 방식 (글자로 명령하는 CUI의 반대)'],
        ['<b>선점형 멀티태스킹</b>', '한 프로그램이 멈춰도 <b>운영체제가 강제로</b> 제어권을 뺏어 전체가 안 멈춤'],
        ['<b>플러그 앤 플레이(PnP)</b>', '새 장치를 꽂으면 <b>드라이버를 자동으로</b> 잡아 준다'],
        ['<b>핫 스와핑</b>', '<b>전원을 켠 채로</b> 장치를 꽂고 뺄 수 있다 (USB)'],
        ['64비트 지원', '더 큰 메모리를 쓸 수 있다'],
        ['OLE', '다른 프로그램에서 만든 개체를 <b>연결·삽입</b>해 함께 쓴다'],
      ],
      cap: 'PnP는 <b>장치를 알아보는 것</b>, 핫 스와핑은 <b>켠 채로 꽂는 것</b> — 다른 말입니다' },

    { type: 'svg', title: '창과 바탕화면을 다루는 키',
      svg: svg('0 0 470 225',
        box(16, 30, 136, 40, 'Alt + Tab', C.pri, C.card, 14) +
        label(84, 90, '실행 중인 창 <tspan fill="' + C.tx + '">전환</tspan>', C.tx2, 11.5) +
        box(166, 30, 136, 40, 'Win + D', C.ok, C.card, 14) +
        label(234, 90, '모든 창 최소화 →', C.tx2, 11.5) + label(234, 106, '<tspan fill="' + C.tx + '">바탕화면 보기</tspan>', C.tx2, 11.5) +
        box(316, 30, 136, 40, 'Win + ← / →', C.gold, C.card, 14) +
        label(384, 90, '창을 화면 <tspan fill="' + C.tx + '">반쪽</tspan>에', C.tx2, 11.5) +
        label(384, 106, '(= 에어로 스냅)', C.tx2, 10.5) +
        '<line x1="14" y1="124" x2="456" y2="124" stroke="' + C.line + '" stroke-width="1.5"/>' +
        box(16, 138, 136, 38, 'Alt + F4', C.no, C.card, 14) +
        label(84, 194, '창 <tspan fill="' + C.no + '">닫기</tspan>', C.tx2, 11.5) +
        label(84, 210, '(바탕화면에선 종료 창)', C.tx2, 10.5) +
        box(166, 138, 136, 38, 'Ctrl+Shift+Esc', C.warn, C.card, 12.5) +
        label(234, 194, '<tspan fill="' + C.warn + '">작업 관리자</tspan>', C.tx2, 11.5) +
        label(234, 210, '멈춘 앱 강제 종료', C.tx2, 10.5) +
        box(316, 138, 136, 38, 'Win + E', C.pri, C.card, 14) +
        label(384, 194, '<tspan fill="' + C.pri + '">파일 탐색기</tspan> 열기', C.tx2, 11.5)),
      cap: '<b>Print Screen</b> = 화면 전체 복사 · <b>Alt + Print Screen</b> = <b>활성 창만</b> 복사' },
  ]);

  /* ═══════════════ 2. 파일과 폴더 관리 ═══════════════ */
  add('comp/file', [
    { type: 'svg', title: '파일 탐색기 — 폴더를 펼치고 접는 키',
      svg: svg('0 0 470 230',
        '<rect x="14" y="26" width="200" height="176" rx="8" fill="#141a33" stroke="' + C.line + '" stroke-width="2"/>' +
        label(114, 46, '탐색 창(왼쪽)', C.tx2, 11) +
        label(40, 72, '▾ 💻 내 PC', C.tx, 12, 'start') +
        label(56, 96, '▸ 💾 로컬 디스크 (C:)', C.tx, 11.5, 'start') +
        label(56, 120, '▾ 📁 수업자료', C.gold, 11.5, 'start') +
        label(74, 144, '📁 1학기', C.tx2, 11, 'start') +
        label(74, 166, '📁 2학기', C.tx2, 11, 'start') +
        arrow(220, 110, 250) +
        '<rect x="256" y="26" width="200" height="176" rx="8" fill="#141a33" stroke="' + C.line + '" stroke-width="2"/>' +
        label(356, 46, '내용 창(오른쪽)', C.tx2, 11) +
        label(356, 80, '선택한 폴더 안의', C.tx, 12) +
        label(356, 100, '파일·폴더가 보인다', C.tx, 12) +
        label(356, 134, '보기: 큰 아이콘 · 자세히 …', C.tx2, 11) +
        label(356, 156, '정렬: 이름 · 날짜 · 크기 · 형식', C.tx2, 11) +
        '<line x1="14" y1="212" x2="456" y2="212" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(60, 226, '→ 펼치기', C.ok, 12) + label(150, 226, '← 접기', C.ok, 12) +
        label(255, 226, '* 하위 폴더 모두 펼치기', C.gold, 12) + label(400, 226, '- 접기', C.gold, 12)),
      cap: '<b>*</b> 와 <b>-</b> 는 <b>숫자 키패드</b>의 것을 씁니다 · <b>Backspace</b>는 상위 폴더로' },

    { type: 'table', title: '파일·폴더를 고르는 방법',
      head: ['이렇게 하면', '이렇게 선택된다'],
      rows: [
        ['<b>Ctrl</b> + 클릭', '<b>떨어져 있는</b> 것들을 하나씩 (비연속 선택)'],
        ['<b>Shift</b> + 클릭', '처음 것과 끝 것 <b>사이 전부</b> (연속 선택)'],
        ['<b>Ctrl + A</b>', '그 폴더 안 <b>전체</b> 선택'],
        ['마우스로 <b>드래그</b>', '사각형 범위 안에 든 것 전부'],
        ['같은 드라이브로 드래그', '<b>이동</b> (Ctrl을 누르면 복사)'],
        ['<b>다른</b> 드라이브로 드래그', '<b>복사</b> (Shift를 누르면 이동)'],
      ],
      cap: '기준은 <b>드라이브가 같은가</b>입니다. C:→C: 는 이동, C:→D: 는 복사' },

    { type: 'table', title: '파일 속성과 폴더 옵션',
      head: ['항목', '내용'],
      rows: [
        ['<b>읽기 전용</b>', '내용을 볼 수는 있지만 <b>고쳐 저장할 수 없다</b>'],
        ['<b>숨김</b>', '탐색기에서 보이지 않게 (폴더 옵션에서 보이게 할 수 있음)'],
        ['일반 정보', '파일 형식 · 위치 · <b>크기</b> · 만든 날짜 · 수정한 날짜'],
        ['폴더 옵션 — 파일 확장명', '<b>확장자를 보이게</b> 할지 (기본은 숨김)'],
        ['폴더 옵션 — 숨김 파일', '숨김 파일을 보이게 할지'],
        ['폴더 옵션 — 열기 방식', '한 번 클릭으로 열지, <b>두 번</b> 클릭으로 열지'],
      ],
      cap: '속성 보기 = 파일 선택 후 <b>Alt + Enter</b> (또는 오른쪽 클릭 → 속성)' },

    { type: 'svg', title: '압축과 라이브러리',
      svg: svg('0 0 470 230',
        box(20, 34, 110, 44, '📄 📄 📄', C.line, C.card, 16) +
        label(75, 96, '파일 여러 개', C.tx2, 11.5) +
        arrow(136, 56, 172, C.ok) + label(154, 44, '압축', C.ok, 11) +
        box(178, 34, 110, 44, '🗜️ 자료.zip', C.ok, C.card, 13) +
        label(233, 96, '용량이 줄고', C.tx2, 11.5) + label(233, 112, '한 파일로 묶인다', C.tx2, 11.5) +
        label(233, 134, '(전송·보관에 편함)', C.tx2, 10.5) +
        label(380, 44, 'ZIP · RAR · ALZ', C.tx, 12) +
        label(380, 66, '이미 압축된 사진·동영상은', C.tx2, 10.5) +
        label(380, 82, '더 줄지 않는다', C.warn, 11) +
        '<line x1="14" y1="152" x2="456" y2="152" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 176, '<tspan fill="' + C.gold + '">라이브러리</tspan> — 여기저기 흩어진 폴더를 한곳에서 보는 "모음 창"', C.tx, 13) +
        label(235, 200, '문서 · 사진 · 음악 · 비디오 · 다운로드', C.tx2, 12) +
        label(235, 222, '파일을 실제로 옮기는 게 아니라 <tspan fill="' + C.gold + '">모아서 보여 줄 뿐</tspan>이다', C.warn, 12)),
      cap: '라이브러리에서 파일을 지우면 <b>원래 위치의 파일이 지워집니다</b>' },
  ]);

  /* ═══════════════ 3. Windows 시스템 관리 ═══════════════ */
  add('comp/winsys', [
    { type: 'table', title: '시스템 관리 도구 — 무엇을 하는 도구인가',
      head: ['도구', '하는 일'],
      rows: [
        ['<b>작업 관리자</b>', '실행 중인 앱·프로세스 확인, <b>멈춘 앱 강제 종료</b> (Ctrl+Shift+Esc)'],
        ['<b>장치 관리자</b>', '하드웨어 목록 확인, <b>드라이버 업데이트</b>, 문제 있는 장치에 ! 표시'],
        ['<b>레지스트리</b>', 'Windows 설정 정보가 모여 있는 <b>데이터베이스</b> (regedit)'],
        ['<b>프로그램 및 기능</b>', '설치된 프로그램 <b>제거·변경</b>, Windows 기능 켜기/끄기'],
        ['<b>디스크 오류 검사</b>', '디스크의 <b>손상된 부분</b>을 찾아 고친다'],
        ['<b>사용자 계정</b>', '관리자 / 표준 사용자 — 표준은 <b>시스템 설정을 못 바꾼다</b>'],
      ],
      cap: '레지스트리를 함부로 고치면 <b>Windows가 시작되지 않을 수 있습니다</b>' },

    { type: 'svg', title: '인쇄는 이렇게 흘러간다 — 스풀과 기본 프린터',
      svg: svg('0 0 470 235',
        box(14, 34, 100, 42, '문서', C.line, C.card, 14) +
        arrow(120, 55, 152, C.ok) +
        box(158, 34, 118, 42, '스풀(하드디스크)', C.ok, C.card, 11.5) +
        arrow(282, 55, 314, C.ok) +
        box(320, 34, 100, 42, '🖨️ 프린터', C.pri, C.card, 13) +
        label(217, 96, '인쇄할 내용을 디스크에 <tspan fill="' + C.ok + '">먼저 저장</tspan>하고', C.tx2, 12) +
        label(217, 114, '프린터가 천천히 받아 간다', C.tx2, 12) +
        label(217, 138, '→ 인쇄하는 동안 <tspan fill="' + C.tx + '">다른 일을 할 수 있다</tspan>', C.gold, 12.5) +
        '<line x1="14" y1="156" x2="456" y2="156" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 180, '<tspan fill="' + C.gold + '">기본 프린터</tspan>는 <tspan fill="' + C.gold + '">딱 하나만</tspan> 지정할 수 있다 (네트워크 프린터도 가능)', C.tx, 12.5) +
        label(235, 204, '인쇄 대기 중인 문서는 <tspan fill="' + C.tx + '">순서를 바꾸거나 취소</tspan>할 수 있다', C.tx2, 12) +
        label(235, 226, '단, 이미 인쇄 중인 문서의 내용은 바꿀 수 없다', C.tx2, 11.5)),
      cap: '스풀은 <b>느린 프린터 때문에 컴퓨터가 기다리는 것</b>을 막아 줍니다' },

    { type: 'svg', title: '작업 관리자에서 무엇을 보나',
      svg: svg('0 0 470 230',
        '<rect x="24" y="26" width="422" height="150" rx="10" fill="' + C.card + '" stroke="' + C.pri + '" stroke-width="2"/>' +
        '<rect x="24" y="26" width="422" height="28" rx="10" fill="' + C.pri + '" opacity=".3"/>' +
        label(235, 45, '작업 관리자', C.tx, 12) +
        '<rect x="36" y="62" width="76" height="22" rx="5" fill="#141a33" stroke="' + C.ok + '" stroke-width="1.5"/>' +
        label(74, 77, '프로세스', C.ok, 10.5) +
        label(158, 77, '성능', C.tx2, 10.5) + label(228, 77, '앱 기록', C.tx2, 10.5) +
        label(300, 77, '시작 프로그램', C.tx2, 10.5) + label(400, 77, '사용자', C.tx2, 10.5) +
        label(60, 104, '한글', C.tx, 11, 'start') + label(300, 104, 'CPU 12%   메모리 340MB', C.tx2, 11) +
        label(60, 126, '크롬 (응답 없음)', C.no, 11, 'start') + label(300, 126, 'CPU 88%   메모리 1.2GB', C.no, 11) +
        label(60, 148, '엑셀', C.tx, 11, 'start') + label(300, 148, 'CPU 3%    메모리 210MB', C.tx2, 11) +
        label(235, 198, '멈춘 프로그램을 골라 <tspan fill="' + C.no + '">[작업 끝내기]</tspan> — 강제 종료', C.tx, 13) +
        label(235, 222, '[시작 프로그램] 탭에서 <tspan fill="' + C.gold + '">부팅할 때 자동 실행되는 앱</tspan>을 끌 수 있다', C.tx2, 12)),
      cap: '<b>Ctrl+Shift+Esc</b> 로 바로 열립니다 (Ctrl+Alt+Delete → 작업 관리자도 가능)' },

    { type: 'table', title: '디스크 정리 · 조각 모음 — 다시 한 번 구분',
      head: ['', '디스크 정리', '드라이브 조각 모음(최적화)'],
      rows: [
        ['목적', '<b>공간을 넓힌다</b>', '<b>속도를 빠르게</b> 한다'],
        ['하는 일', '임시 파일·휴지통·다운로드 등 <b>지운다</b>', '흩어진 조각을 <b>모아 정리</b>한다'],
        ['공간이 늘어나나', '<b>늘어난다</b>', '<b>늘어나지 않는다</b>'],
        ['안 되는 대상', '—', 'CD/DVD · <b>네트워크 드라이브</b>'],
      ],
      cap: '"조각 모음을 하면 용량이 늘어난다"는 <b>틀린 설명</b> — 시험에 자주 나옵니다' },
  ]);

  /* ═══════════════ 4. 컴퓨터 시스템과 자료 표현 ═══════════════ */
  add('comp/sys', [
    { type: 'table', title: '디지털 · 아날로그 · 하이브리드',
      head: ['', '디지털 컴퓨터', '아날로그 컴퓨터'],
      rows: [
        ['다루는 자료', '<b>숫자·문자</b> (이산적)', '<b>전류·전압·온도</b> (연속적)'],
        ['주요 회로', '<b>논리 회로</b>', '<b>증폭 회로</b>'],
        ['연산 방식', '사칙연산 · 논리연산', '미분 · 적분'],
        ['정밀도', '<b>필요한 만큼</b> 높일 수 있다', '제한적'],
        ['기억 기능', '<b>있다</b>', '없다'],
        ['프로그램', '<b>필요하다</b>', '필요 없다'],
      ],
      cap: '<b>하이브리드</b> = 둘을 합친 것 · 우리가 쓰는 컴퓨터는 모두 <b>디지털</b>입니다' },

    { type: 'svg', title: 'CPU 안에는 무엇이 들어 있나',
      svg: svg('0 0 470 240',
        '<rect x="18" y="26" width="434" height="140" rx="10" fill="#141a33" stroke="' + C.pri + '" stroke-width="2"/>' +
        label(235, 46, '중앙처리장치 (CPU)', C.pri, 13) +
        box(34, 58, 190, 96, '', C.ok, C.card) +
        label(129, 78, '제어장치 — 명령을 해석해 지시', C.ok, 11.5) +
        label(129, 102, '프로그램 카운터(PC)', C.tx, 11) +
        label(129, 122, '명령 레지스터(IR) · 명령 해독기', C.tx, 10.5) +
        label(129, 142, '부호기 · 번지 해독기', C.tx, 10.5) +
        box(246, 58, 190, 96, '', C.gold, C.card) +
        label(341, 78, '연산장치(ALU) — 실제로 계산', C.gold, 11.5) +
        label(341, 102, '누산기(AC) · 가산기', C.tx, 11) +
        label(341, 122, '보수기 · 데이터 레지스터', C.tx, 10.5) +
        label(341, 142, '상태 레지스터', C.tx, 10.5) +
        label(235, 190, '<tspan fill="' + C.ok + '">PC</tspan> = 다음에 실행할 명령의 <tspan fill="' + C.tx + '">주소</tspan>를 기억', C.tx2, 12.5) +
        label(235, 212, '<tspan fill="' + C.gold + '">누산기(AC)</tspan> = 연산 <tspan fill="' + C.tx + '">중간 결과</tspan>를 잠시 기억', C.tx2, 12.5) +
        label(235, 232, '레지스터는 CPU 안에 있어 <tspan fill="' + C.gold + '">가장 빠른</tspan> 기억 장소다', C.tx2, 11.5)),
      cap: '제어장치=<b>시키는 곳</b>, 연산장치=<b>계산하는 곳</b> — 레지스터 이름이 어느 쪽인지가 문제입니다' },

    { type: 'table', title: '문자 코드 — 비트 수로 외운다',
      head: ['코드', '비트 수', '표현 개수', '특징'],
      rows: [
        ['<b>BCD</b>', '<b>6</b>비트', '64자', '2존 + 4디지트 · <b>소문자 표현 불가</b>'],
        ['<b>ASCII</b>', '<b>7</b>비트', '128자', '3존 + 4디지트 · <b>데이터 통신용</b>, PC 표준'],
        ['<b>EBCDIC</b>', '<b>8</b>비트', '256자', '4존 + 4디지트 · 대형 컴퓨터용'],
        ['<b>유니코드</b>', '<b>16</b>비트', '65,536자', '전 세계 문자를 <b>모두 2바이트</b>로 통일'],
      ],
      cap: '순서가 <b>6 → 7 → 8 → 16</b> · 유니코드는 한글도 영어도 <b>똑같이 2바이트</b>' },

    { type: 'svg', title: '자료의 단위 — 물리적 vs 논리적',
      svg: svg('0 0 470 235',
        label(120, 26, '물리적 단위 (작은 것부터)', C.ok, 12.5) +
        box(24, 38, 190, 30, '비트 Bit — 0 또는 1', C.ok, C.card, 11.5) +
        box(24, 74, 190, 30, '니블 Nibble — 4비트', C.ok, C.card, 11.5) +
        box(24, 110, 190, 30, '바이트 Byte — 8비트', C.ok, C.card, 11.5) +
        box(24, 146, 190, 30, '워드 Word — 처리 단위', C.ok, C.card, 11.5) +
        label(352, 26, '논리적 단위 (자료를 담는 그릇)', C.gold, 12.5) +
        box(256, 38, 190, 30, '필드 Field — 자료의 최소 단위', C.gold, C.card, 10.5) +
        box(256, 74, 190, 30, '레코드 Record — 필드의 모임', C.gold, C.card, 11) +
        box(256, 110, 190, 30, '파일 File — 레코드의 모임', C.gold, C.card, 11) +
        box(256, 146, 190, 30, '데이터베이스 — 파일의 모임', C.gold, C.card, 11) +
        label(235, 200, '1바이트 = 8비트 = <tspan fill="' + C.tx + '">영문 한 글자</tspan> · 한글 한 글자 = <tspan fill="' + C.gold + '">2바이트</tspan>', C.tx, 12.5) +
        label(235, 224, 'KB → MB → GB → TB → PB 로 1,024배씩 커진다', C.tx2, 12)),
      cap: '<b>워드</b>는 컴퓨터가 <b>한 번에 처리하는 크기</b>(반워드·풀워드·더블워드)' },
  ]);

  /* ═══════════════ 5. 기억장치와 하드웨어 ═══════════════ */
  add('comp/hw', [
    { type: 'table', title: '이름이 비슷한 특수 메모리 4종',
      head: ['이름', '무엇을 하나', '핵심 한마디'],
      rows: [
        ['<b>캐시 메모리</b>', 'CPU와 주기억장치 <b>사이</b>에서 속도 차를 메움', '빠른 <b>SRAM</b>을 쓴다'],
        ['<b>가상 메모리</b>', '<b>보조기억장치</b>(하드디스크) 일부를 주기억장치처럼', '메모리가 <b>넓어 보이게</b>'],
        ['<b>연관(연상) 메모리</b>', '주소가 아니라 <b>내용</b>으로 찾아간다', '<b>내용</b>으로 검색'],
        ['<b>플래시 메모리</b>', '전원이 꺼져도 내용이 <b>남는</b> 읽고 쓰기 메모리', 'USB · SSD · SD카드'],
      ],
      cap: '캐시=<b>빠르게</b>, 가상=<b>넓게</b>, 연관=<b>내용으로</b>, 플래시=<b>꺼져도 남게</b>' },

    { type: 'svg', title: '캐시 메모리가 하는 일',
      svg: svg('0 0 470 230',
        box(18, 60, 100, 50, 'CPU', C.pri, C.card, 15) +
        label(68, 130, '엄청 빠름', C.pri, 11.5) +
        arrow(124, 85, 156, C.ok) +
        box(162, 60, 130, 50, '캐시 메모리', C.ok, C.card, 13) +
        label(227, 130, '빠름 · 작음 · 비쌈', C.ok, 11.5) +
        label(227, 148, '(SRAM)', C.tx2, 10.5) +
        arrow(298, 85, 330, C.tx2) +
        box(336, 60, 116, 50, '주기억장치', C.warn, C.card, 13) +
        label(394, 130, '느림 · 큼 · 쌈', C.warn, 11.5) +
        label(394, 148, '(DRAM)', C.tx2, 10.5) +
        label(235, 36, 'CPU는 너무 빨라서 주기억장치를 기다려야 한다', C.tx2, 12) +
        '<line x1="14" y1="168" x2="456" y2="168" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 192, '자주 쓰는 것만 <tspan fill="' + C.ok + '">가운데에 미리 담아 두어</tspan> 기다림을 줄인다', C.tx, 13) +
        label(235, 216, '캐시에서 바로 찾을 확률 = <tspan fill="' + C.gold + '">적중률(Hit Ratio)</tspan> — 높을수록 빠르다', C.tx2, 12)),
      cap: '캐시는 <b>SRAM</b>, 주기억장치는 <b>DRAM</b> — 바꿔 내는 문제가 많습니다' },

    { type: 'svg', title: '가상 메모리 — 하드디스크를 메모리인 척',
      svg: svg('0 0 470 230',
        box(30, 40, 150, 46, '주기억장치 8GB', C.warn, C.card, 12.5) +
        label(105, 106, '실제로 있는 메모리', C.tx2, 11.5) +
        label(214, 66, '+', C.tx, 22) +
        box(240, 40, 200, 46, '하드디스크의 일부(스왑 영역)', C.pri, C.card, 10.5) +
        label(340, 106, '메모리처럼 빌려 쓴다', C.tx2, 11.5) +
        down(235, 122, 152, C.ok) +
        box(120, 158, 230, 40, '프로그램이 보기엔 "큰 메모리"', C.ok, C.card, 12.5) +
        label(235, 222, '메모리보다 큰 프로그램도 <tspan fill="' + C.tx + '">실행할 수 있다</tspan> · 다만 <tspan fill="' + C.no + '">속도는 느려진다</tspan>', C.tx2, 12)),
      cap: '실제 기억 용량이 늘어나는 것이 아니라 <b>주소 공간이 넓어 보이는 것</b>입니다' },

    { type: 'table', title: '포트와 화면 용어',
      head: ['용어', '내용'],
      rows: [
        ['<b>USB</b>', '<b>127개</b>까지 연결 · <b>핫 스와핑</b>·PnP 지원 · 전원 공급도 됨'],
        ['<b>HDMI</b>', '<b>영상 + 음성</b>을 한 케이블로 보내는 디지털 단자'],
        ['<b>픽셀</b>', '화면을 이루는 <b>가장 작은 점</b>'],
        ['<b>해상도</b>', '화면에 표시되는 <b>픽셀 수</b> · 높을수록 선명하고 글씨는 작아진다'],
        ['<b>재생률(주사율)</b>', '1초에 화면을 다시 그리는 횟수 · 높을수록 <b>덜 깜빡인다</b>'],
        ['<b>점 간격(Dot Pitch)</b>', '픽셀 사이 거리 · <b>좁을수록</b> 선명하다'],
      ],
      cap: '해상도를 높이면 <b>글자와 아이콘이 작아집니다</b> (화면이 넓어지는 게 아님)' },
  ]);

  /* ═══════════════ 6. 소프트웨어와 프로그래밍 ═══════════════ */
  add('comp/sw', [
    { type: 'table', title: '사용권에 따른 소프트웨어 — 이름만 바꿔 나온다',
      head: ['이름', '무엇인가'],
      rows: [
        ['<b>상용 소프트웨어</b>', '돈을 내고 사서 쓰는 것'],
        ['<b>셰어웨어</b>', '<b>일정 기간·기능만</b> 무료로 써 보고, 계속 쓰려면 돈을 낸다'],
        ['<b>프리웨어</b>', '<b>무료</b>로 쓸 수 있다 (단, 소스는 공개 안 함 · 상업적 이용 제한)'],
        ['<b>공개 소프트웨어</b>', '<b>소스 코드까지</b> 공개해 누구나 고칠 수 있다'],
        ['<b>데모 / 트라이얼</b>', '데모=<b>기능을 보여 주려고</b> · 트라이얼=<b>기간</b>을 정해 써 보게'],
        ['<b>알파 / 베타 버전</b>', '알파=<b>회사 내부</b> 테스트 · 베타=<b>사용자에게</b> 배포해 테스트'],
        ['<b>패치 / 번들</b>', '패치=<b>오류를 고치려고</b> 나눠 주는 것 · 번들=<b>끼워서</b> 함께 주는 것'],
      ],
      cap: '프리웨어=<b>공짜</b>, 공개 소프트웨어=<b>소스까지</b> — 같은 말이 아닙니다' },

    { type: 'svg', title: '프로그램이 실행되기까지',
      svg: svg('0 0 470 235',
        box(14, 40, 96, 44, '원시 프로그램', C.tx2, C.card, 11) +
        label(62, 100, '사람이 쓴 코드', C.tx2, 10.5) +
        arrow(116, 62, 146, C.ok) + label(131, 50, '컴파일러', C.ok, 9.5) +
        box(150, 40, 96, 44, '목적 프로그램', C.ok, C.card, 11) +
        label(198, 100, '기계어', C.tx2, 10.5) +
        arrow(252, 62, 282, C.pri) + label(267, 50, '링커', C.pri, 9.5) +
        box(286, 40, 84, 44, '로드 모듈', C.pri, C.card, 11) +
        arrow(376, 62, 404, C.gold) + label(390, 50, '로더', C.gold, 9.5) +
        box(404, 40, 56, 44, '실행', C.gold, C.card, 12) +
        '<line x1="14" y1="122" x2="456" y2="122" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(120, 148, '컴파일러', C.ok, 13) +
        label(120, 172, '전체를 <tspan fill="' + C.tx + '">한꺼번에</tspan> 번역', C.tx2, 11.5) +
        label(120, 192, '목적 프로그램이 <tspan fill="' + C.ok + '">생긴다</tspan>', C.tx2, 11.5) +
        label(120, 212, '번역은 느리지만 실행은 <tspan fill="' + C.ok + '">빠름</tspan>', C.tx2, 11.5) +
        '<line x1="235" y1="136" x2="235" y2="222" stroke="' + C.line + '" stroke-dasharray="4 4"/>' +
        label(350, 148, '인터프리터', C.warn, 13) +
        label(350, 172, '<tspan fill="' + C.tx + '">한 줄씩</tspan> 번역하며 실행', C.tx2, 11.5) +
        label(350, 192, '목적 프로그램이 <tspan fill="' + C.no + '">없다</tspan>', C.tx2, 11.5) +
        label(350, 212, '번역은 빠르지만 실행은 <tspan fill="' + C.no + '">느림</tspan>', C.tx2, 11.5)),
      cap: '구분 기준은 <b>목적 프로그램이 생기느냐</b>입니다' },

    { type: 'table', title: '운영체제 — 목적 4가지와 방식',
      head: ['항목', '내용'],
      rows: [
        ['<b>처리 능력</b>', '일정 시간에 처리하는 <b>일의 양 ↑</b>'],
        ['<b>응답 시간</b>', '요청하고 결과가 나올 때까지 <b>시간 ↓</b>'],
        ['<b>신뢰도</b>', '얼마나 <b>정확하게</b> 해내는가 <b>↑</b>'],
        ['<b>사용 가능도</b>', '필요할 때 <b>바로 쓸 수 있는</b> 정도 <b>↑</b>'],
        ['일괄 처리', '모아 두었다가 <b>한꺼번에</b> (급여 계산)'],
        ['실시간 처리', '들어오는 즉시 <b>바로</b> (좌석 예약)'],
        ['시분할 / 분산 처리', '시간을 잘게 나눠 여러 명이 / 여러 컴퓨터가 <b>나눠</b> 처리'],
      ],
      cap: '<b>시간 두 개(응답 시간)만 줄이고</b> 나머지 셋은 늘리는 것이 목적입니다' },

    { type: 'table', title: '웹에서 쓰는 언어',
      head: ['언어', '무엇에 쓰나'],
      rows: [
        ['<b>HTML</b>', '웹 문서를 만드는 <b>기본</b> 언어 (하이퍼텍스트)'],
        ['<b>XML</b>', '태그를 <b>내가 만들어</b> 쓰는 확장형 — 자료 교환용'],
        ['<b>자바스크립트</b>', '웹 페이지를 <b>움직이게</b> 하는 스크립트 (브라우저에서 실행)'],
        ['<b>JAVA</b>', '운영체제에 상관없이 실행되는 <b>객체 지향</b> 언어'],
        ['<b>ASP / JSP / PHP</b>', '<b>서버</b>에서 실행되어 결과만 보내 주는 언어'],
        ['<b>VRML</b>', '웹에서 <b>3차원 가상 공간</b>을 표현'],
      ],
      cap: '객체 지향의 특징 — <b>캡슐화 · 상속 · 다형성 · 추상화</b>' },
  ]);

  /* ═══════════════ 7. 인터넷 활용 ═══════════════ */
  add('comp/net', [
    { type: 'svg', title: 'URL 뜯어보기',
      svg: svg('0 0 470 225',
        '<rect x="20" y="40" width="430" height="52" rx="10" fill="#12162b" stroke="' + C.ok + '" stroke-width="2"/>' +
        mono(235, 74, 'https://www.school.go.kr:443/notice/list.html', C.ok, 15) +
        down(66, 96, 122, C.gold) + label(66, 142, '프로토콜', C.gold, 11.5) +
        down(170, 96, 122, C.pri) + label(170, 142, '도메인 네임', C.pri, 11.5) +
        down(300, 96, 122, C.warn) + label(300, 142, '포트 번호', C.warn, 11.5) +
        label(300, 158, '(생략 가능)', C.tx2, 10) +
        down(398, 96, 122, C.tx2) + label(398, 142, '경로 · 파일 이름', C.tx2, 11.5) +
        '<line x1="14" y1="172" x2="456" y2="172" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 196, '도메인은 <tspan fill="' + C.tx + '">사람이 외우기 쉬운 문자 주소</tspan> — 실제 통신은 숫자 IP로 한다', C.tx, 12.5) +
        label(235, 218, '그 문자↔숫자를 바꿔 주는 것이 <tspan fill="' + C.gold + '">DNS</tspan>', C.gold, 12.5)),
      cap: '<b>go.kr</b>=정부, <b>ac.kr</b>=대학, <b>co.kr</b>=회사, <b>or.kr</b>=비영리 기관' },

    { type: 'table', title: '프로토콜 — 무엇을 하는 약속인가',
      head: ['프로토콜', '하는 일', '포트'],
      rows: [
        ['<b>HTTP</b>', '웹 문서를 주고받는다', '80'],
        ['<b>HTTPS</b>', 'HTTP를 <b>암호화</b>해서 안전하게', '443'],
        ['<b>FTP</b>', '파일을 <b>올리고 내린다</b>', '21'],
        ['<b>SMTP</b>', '메일을 <b>보낸다</b>', '25'],
        ['<b>POP3</b>', '메일을 <b>받아 온다</b>', '110'],
        ['<b>TELNET</b>', '멀리 있는 컴퓨터에 <b>접속</b>해 사용', '23'],
        ['<b>DHCP</b>', 'IP 주소를 <b>자동으로</b> 나눠 준다', '—'],
      ],
      cap: 'S<b>M</b>TP=보내기(Send), <b>P</b>OP3=받기(Pick up) 로 외우면 안 헷갈립니다' },

    { type: 'svg', title: '쿠키 · 캐시 · 방문 기록 — 브라우저가 남기는 것들',
      svg: svg('0 0 470 235',
        box(14, 34, 140, 44, '🍪 쿠키', C.gold, C.card, 14) +
        label(84, 100, '내가 누구인지, 무엇을', C.tx2, 11) +
        label(84, 118, '했는지 적어 둔 <tspan fill="' + C.tx + '">작은 텍스트</tspan>', C.tx2, 11) +
        label(84, 140, '로그인 유지 · 장바구니', C.gold, 10.5) +
        box(166, 34, 140, 44, '⚡ 캐시', C.ok, C.card, 14) +
        label(236, 100, '한 번 받은 <tspan fill="' + C.tx + '">그림·파일</tspan>을', C.tx2, 11) +
        label(236, 118, '내 컴퓨터에 <tspan fill="' + C.tx + '">저장</tspan>해 둔 것', C.tx2, 11) +
        label(236, 140, '다시 갈 때 <tspan fill="' + C.ok + '">빨리 열림</tspan>', C.ok, 10.5) +
        box(318, 34, 138, 44, '🕘 방문 기록', C.pri, C.card, 13) +
        label(387, 100, '내가 <tspan fill="' + C.tx + '">들른 주소</tspan> 목록', C.tx2, 11) +
        label(387, 122, '뒤로 가기 · 주소 자동완성', C.tx2, 10.5) +
        '<line x1="14" y1="160" x2="456" y2="160" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 184, '쿠키는 <tspan fill="' + C.no + '">개인 정보가 새어 나갈 수 있어</tspan> 차단·삭제할 수 있다', C.tx, 12.5) +
        label(235, 208, '공용 PC에서는 셋 다 지우고 나오는 것이 좋다', C.tx2, 12) +
        label(235, 228, '(플러그인 = 브라우저에 기능을 더해 주는 보조 프로그램)', C.tx2, 11)),
      cap: '쿠키=<b>나에 대한 기록</b>, 캐시=<b>속도를 위한 임시 저장</b>' },

    { type: 'table', title: '요즘 나오는 인터넷 용어',
      head: ['용어', '뜻'],
      rows: [
        ['<b>클라우드 컴퓨팅</b>', '내 컴퓨터가 아니라 <b>인터넷 서버</b>에 저장·처리를 맡긴다'],
        ['<b>IoT(사물 인터넷)</b>', '사물에 <b>센서와 통신</b>을 붙여 서로 정보를 주고받는다'],
        ['<b>빅데이터</b>', '너무 크고 빨라 기존 방법으로는 다루기 어려운 <b>대량의 자료</b>'],
        ['<b>미러 사이트</b>', '한곳에 몰리는 것을 막으려고 <b>똑같이 복사해 둔</b> 사이트'],
        ['<b>포털 사이트</b>', '검색·메일·뉴스를 모아 둔 <b>출입구</b> 같은 사이트'],
        ['<b>와이파이 / 블루투스</b>', '무선 랜 / <b>가까운 거리</b> 기기끼리 연결'],
      ],
      cap: '<b>테더링</b>=휴대폰을 통해 다른 기기가 인터넷을 쓰게 하는 것' },
  ]);

  /* ═══════════════ 8. 멀티미디어 ═══════════════ */
  add('comp/multi', [
    { type: 'svg', title: '그래픽 기법 4가지 — 그림으로 구분',
      svg: svg('0 0 470 235',
        label(70, 26, '앤티앨리어싱', C.ok, 12) +
        '<polygon points="26,40 26,58 44,58 44,76 62,76 62,94 80,94 80,112 114,112 114,40" fill="' + C.pri + '" opacity=".55"/>' +
        label(70, 130, '계단처럼 삐죽한 것을', C.tx2, 10) + label(70, 144, '<tspan fill="' + C.ok + '">부드럽게</tspan> 만든다', C.tx2, 10.5) +
        label(180, 26, '디더링', C.gold, 12) +
        '<rect x="136" y="40" width="88" height="72" fill="#141a33" stroke="' + C.line + '"/>' +
        '<circle cx="150" cy="54" r="3.5" fill="' + C.gold + '"/><circle cx="172" cy="54" r="3.5" fill="' + C.no + '"/>' +
        '<circle cx="194" cy="54" r="3.5" fill="' + C.gold + '"/><circle cx="216" cy="54" r="3.5" fill="' + C.no + '"/>' +
        '<circle cx="150" cy="76" r="3.5" fill="' + C.no + '"/><circle cx="172" cy="76" r="3.5" fill="' + C.gold + '"/>' +
        '<circle cx="194" cy="76" r="3.5" fill="' + C.no + '"/><circle cx="216" cy="76" r="3.5" fill="' + C.gold + '"/>' +
        '<circle cx="150" cy="98" r="3.5" fill="' + C.gold + '"/><circle cx="172" cy="98" r="3.5" fill="' + C.no + '"/>' +
        '<circle cx="194" cy="98" r="3.5" fill="' + C.gold + '"/><circle cx="216" cy="98" r="3.5" fill="' + C.no + '"/>' +
        label(180, 130, '<tspan fill="' + C.gold + '">있는 색을 섞어</tspan>', C.tx2, 10.5) + label(180, 144, '없는 색을 만들어 낸다', C.tx2, 10) +
        label(290, 26, '모핑', C.warn, 12) +
        '<circle cx="262" cy="76" r="20" fill="none" stroke="' + C.warn + '" stroke-width="2"/>' +
        arrow(288, 76, 306, C.warn) +
        '<rect x="310" y="56" width="40" height="40" rx="4" fill="none" stroke="' + C.warn + '" stroke-width="2"/>' +
        label(300, 130, '한 모양이 <tspan fill="' + C.warn + '">서서히</tspan>', C.tx2, 10.5) + label(300, 144, '다른 모양으로 변한다', C.tx2, 10) +
        label(410, 26, '렌더링', C.pri, 12) +
        '<polygon points="382,96 410,50 438,96" fill="' + C.pri + '" opacity=".5" stroke="' + C.pri + '" stroke-width="2"/>' +
        '<line x1="382" y1="96" x2="410" y2="76" stroke="' + C.pri + '" stroke-width="1.5"/>' +
        label(410, 130, '3차원 물체에', C.tx2, 10.5) + label(410, 144, '<tspan fill="' + C.pri + '">색·명암·질감</tspan>을', C.tx2, 10.5) +
        '<line x1="14" y1="162" x2="456" y2="162" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 188, '<tspan fill="' + C.ok + '">앤티앨리어싱</tspan>=계단 없애기 · <tspan fill="' + C.gold + '">디더링</tspan>=색 섞기', C.tx, 12.5) +
        label(235, 212, '<tspan fill="' + C.warn + '">모핑</tspan>=모양 바꾸기 · <tspan fill="' + C.pri + '">렌더링</tspan>=입체감 입히기', C.tx, 12.5)),
      cap: '<b>인터레이싱</b> = 그림이 <b>흐릿하게 먼저</b> 보이다가 점점 선명해지는 방식' },

    { type: 'table', title: '소리 파일 — WAVE · MIDI · MP3',
      head: ['', 'WAVE', 'MIDI', 'MP3'],
      rows: [
        ['담는 것', '<b>실제 소리 그대로</b>', '악기 <b>연주 정보</b>(악보)', '압축한 소리'],
        ['사람 목소리', '<b>가능</b>', '<b>불가능</b>', '가능'],
        ['파일 크기', '<b>매우 크다</b>', '<b>매우 작다</b>', '작다 (약 1/10)'],
        ['만들어지는 법', '아날로그 소리를 <b>표본화</b>', '악기 연주를 기록', 'MPEG-1 <b>Layer 3</b>'],
      ],
      cap: 'MIDI는 <b>악보</b>라서 사람 목소리를 담을 수 없습니다 — 자주 나오는 함정' },

    { type: 'table', title: '그림 · 동영상 파일 형식',
      head: ['형식', '특징'],
      rows: [
        ['<b>BMP</b>', '압축하지 않아 <b>파일이 크다</b> · Windows 기본'],
        ['<b>GIF</b>', '<b>256색</b> · <b>애니메이션</b>과 <b>투명</b> 가능 · 무손실'],
        ['<b>JPG(JPEG)</b>', '<b>손실</b> 압축 · 사진에 적합 · 1,600만 색'],
        ['<b>PNG</b>', '<b>무손실</b> 압축 + 투명 · GIF를 대체 (애니메이션은 안 됨)'],
        ['<b>MPEG</b>', '동영상 <b>손실</b> 압축 표준 (MPEG-4는 인터넷·모바일)'],
        ['<b>AVI</b>', 'Windows 표준 동영상'],
        ['<b>스트리밍</b>', '<b>다 받기 전에</b> 받으면서 바로 재생 (ASF·WMV·RA)'],
      ],
      cap: '<b>GIF는 애니메이션 O, PNG는 X</b> · 둘 다 투명은 됩니다' },

    { type: 'svg', title: '스트리밍은 어떻게 바로 재생되나',
      svg: svg('0 0 470 225',
        box(16, 50, 100, 46, '서버', C.pri, C.card, 14) +
        '<rect x="130" y="58" width="180" height="30" rx="6" fill="#141a33" stroke="' + C.line + '" stroke-width="1.5"/>' +
        '<rect x="130" y="58" width="112" height="30" rx="6" fill="' + C.ok + '" opacity=".45"/>' +
        label(186, 78, '받은 부분', C.tx, 11) + label(276, 78, '아직', C.tx2, 11) +
        box(324, 50, 128, 46, '▶ 바로 재생', C.ok, C.card, 13) +
        label(220, 36, '조금씩 받으면서 동시에 재생한다', C.tx2, 12) +
        '<line x1="14" y1="116" x2="456" y2="116" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 142, '<tspan fill="' + C.no + '">다운로드</tspan> — 파일을 <tspan fill="' + C.tx + '">전부 받은 뒤에야</tspan> 볼 수 있다', C.tx2, 12.5) +
        label(235, 166, '<tspan fill="' + C.ok + '">스트리밍</tspan> — 받으면서 <tspan fill="' + C.tx + '">기다리지 않고</tspan> 본다', C.tx2, 12.5) +
        label(235, 198, '유튜브 · 인터넷 방송 · 음악 감상이 모두 스트리밍', C.gold, 12.5)),
      cap: '스트리밍 형식 — <b>ASF · WMV · RAM(RA)</b>' },
  ]);

  /* ═══════════════ 9. 컴퓨터 보안과 정보 윤리 ═══════════════ */
  add('comp/security', [
    { type: 'table', title: '악성 프로그램 — 무엇이 다른가',
      head: ['이름', '어떻게 퍼지나', '결정적 차이'],
      rows: [
        ['<b>바이러스</b>', '다른 <b>프로그램에 붙어</b> 복제', '<b>숙주가 필요</b>하다'],
        ['<b>웜(Worm)</b>', '<b>스스로</b> 복제해 네트워크로 퍼진다', '숙주 <b>없이</b> 혼자 퍼진다'],
        ['<b>트로이 목마</b>', '정상 프로그램인 <b>척</b> 숨어 들어온다', '<b>자기 복제를 하지 않는다</b>'],
        ['<b>스파이웨어</b>', '몰래 설치되어 정보를 <b>훔쳐 보낸다</b>', '<b>엿보는</b> 것이 목적'],
        ['<b>랜섬웨어</b>', '파일을 <b>암호화</b>하고 돈을 요구한다', '<b>인질</b>로 잡는다'],
        ['<b>애드웨어</b>', '광고를 계속 띄운다', '광고가 목적'],
      ],
      cap: '<b>웜은 혼자, 바이러스는 붙어서, 트로이 목마는 복제 안 함</b> — 세 줄만 외우세요' },

    { type: 'svg', title: '스니핑 · 스푸핑 · 피싱 — 속임수 3종',
      svg: svg('0 0 470 240',
        label(78, 26, '스니핑 (Sniffing)', C.ok, 12.5) +
        box(20, 38, 52, 34, 'A', C.line, C.card, 13) +
        arrow(76, 55, 108, C.tx2) +
        box(112, 38, 52, 34, 'B', C.line, C.card, 13) +
        '<text x="92" y="96" text-anchor="middle" font-size="16">👂</text>' +
        label(92, 118, '<tspan fill="' + C.ok + '">몰래 엿듣기</tspan>', C.tx2, 11.5) +
        label(92, 134, '오가는 내용을 훔쳐본다', C.tx2, 10.5) +
        '<line x1="180" y1="26" x2="180" y2="146" stroke="' + C.line + '" stroke-dasharray="4 4"/>' +
        label(268, 26, '스푸핑 (Spoofing)', C.gold, 12.5) +
        box(196, 38, 60, 34, '공격자', C.no, C.card, 11) +
        arrow(260, 55, 288, C.gold) +
        box(292, 38, 60, 34, '나', C.line, C.card, 12) +
        label(274, 96, '<tspan fill="' + C.gold + '">아는 사람인 척</tspan>', C.tx2, 11.5) +
        label(274, 112, '주소·신분을 <tspan fill="' + C.tx + '">위장</tspan>한다', C.tx2, 10.5) +
        '<line x1="366" y1="26" x2="366" y2="146" stroke="' + C.line + '" stroke-dasharray="4 4"/>' +
        label(418, 26, '피싱 (Phishing)', C.no, 12.5) +
        box(382, 38, 72, 34, '가짜 사이트', C.no, C.card, 10.5) +
        label(418, 96, '<tspan fill="' + C.no + '">낚아서</tspan> 개인정보를', C.tx2, 11) +
        label(418, 112, '직접 입력하게 만든다', C.tx2, 10.5) +
        '<line x1="14" y1="158" x2="456" y2="158" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 184, '<tspan fill="' + C.warn + '">파밍(Pharming)</tspan> — 주소를 바르게 쳐도 <tspan fill="' + C.no + '">가짜 사이트로 끌려간다</tspan> (DNS 변조)', C.tx, 12.5) +
        label(235, 208, '<tspan fill="' + C.warn + '">키로거</tspan> — 키보드로 친 것을 몰래 기록해 비밀번호를 훔친다', C.tx, 12) +
        label(235, 230, '스니핑=듣기 · 스푸핑=속이기 · 피싱=낚기', C.gold, 12.5)),
      cap: '피싱은 <b>내가 직접 입력</b>하게 만들고, 파밍은 <b>주소를 제대로 쳐도</b> 당합니다' },

    { type: 'svg', title: 'DDoS — 한꺼번에 몰려가 마비시키기',
      svg: svg('0 0 470 225',
        box(16, 34, 92, 30, '좀비 PC', C.no, C.card, 11) +
        box(16, 72, 92, 30, '좀비 PC', C.no, C.card, 11) +
        box(16, 110, 92, 30, '좀비 PC', C.no, C.card, 11) +
        box(16, 148, 92, 30, '좀비 PC', C.no, C.card, 11) +
        arrow(114, 49, 210, C.no) + arrow(114, 87, 210, C.no) +
        arrow(114, 125, 210, C.no) + arrow(114, 163, 210, C.no) +
        box(216, 78, 120, 56, '🖥️ 서버', C.warn, C.card, 14) +
        label(276, 152, '요청이 넘쳐', C.no, 12) + label(276, 170, '<tspan fill="' + C.no + '">멈춰 버린다</tspan>', C.no, 12.5) +
        label(400, 60, '미리 악성코드로', C.tx2, 11) +
        label(400, 78, '감염시켜 둔 컴퓨터들을', C.tx2, 11) +
        label(400, 96, '한꺼번에 조종한다', C.tx2, 11) +
        label(400, 124, '= 분산 서비스 거부', C.gold, 11.5) +
        label(235, 202, '자료를 훔치는 것이 아니라 <tspan fill="' + C.tx + '">서비스를 못 쓰게</tspan> 만드는 공격이다', C.tx, 12.5)),
      cap: '내 컴퓨터가 나도 모르게 <b>좀비 PC</b>가 되어 공격에 쓰일 수 있습니다' },

    { type: 'table', title: '지키는 방법 — 암호화와 방화벽',
      head: ['', '비밀키(대칭) 암호화', '공개키(비대칭) 암호화'],
      rows: [
        ['키', '<b>암호화·복호화가 같은 키</b>', '<b>공개키로 잠그고 개인키로 푼다</b>'],
        ['대표', 'DES', 'RSA'],
        ['속도', '<b>빠르다</b>', '느리다'],
        ['키 개수', '사람이 많아지면 <b>키가 너무 많아진다</b>', '<b>적다</b> · 관리가 쉽다'],
        ['방화벽', '외부의 <b>불법 침입을 막고</b> 내부 정보 유출을 방지', '<b>내부에서 일어나는 공격은 못 막는다</b>'],
      ],
      cap: '방화벽이 만능이 아니라는 점 — <b>내부자 공격은 못 막습니다</b>' },
  ]);
})();
