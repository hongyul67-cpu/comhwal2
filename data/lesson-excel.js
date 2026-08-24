/* 컴활 2급 · 설명 모드 수업자료 — 스프레드시트(엑셀) 보강판
 *
 * data/lesson.js 다음에 로드되어 'excel/*' 키에 슬라이드를 뒤에 이어 붙인다.
 * (comp/* 즉 컴퓨터 일반은 나중에 같은 방식으로 보강한다)
 *
 * 슬라이드 형식은 lesson.js와 같다.
 *   { type:'svg',   title, svg, cap }
 *   { type:'table', title, head:[...], rows:[[...]], cap }
 * 표는 7줄 이상이면 앱이 자동으로 글씨를 줄이지만(bigtbl), 한 화면에 담기게 6~7줄로 끊었다.
 *
 * lesson.js의 도우미(box/arrow/label/sheet/svg)는 그 파일 IIFE 안에만 있어서
 * 여기서 같은 모양으로 다시 정의한다. (두 파일이 서로를 몰라도 되게)
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
  // 미니 워크시트 격자. cells 키는 '행,열'(1부터), hi 는 [행, 열, 색, 표시할 글자]
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
        else if (cells && cells[j + ',' + i]) t = cells[j + ',' + i];
        if (t !== '') s += '<text x="' + (x + i * cw + cw / 2) + '" y="' + (y + j * ch + ch / 2 + 4) +
          '" text-anchor="middle" fill="' + (head ? C.tx2 : C.tx) + '" font-size="' + (head ? 10 : 11) +
          '" font-weight="' + (head ? 700 : 500) + '">' + t + '</text>';
      }
    }
    if (hi) hi.forEach(function (h) {
      s += '<rect x="' + (x + h[1] * cw) + '" y="' + (y + h[0] * ch) + '" width="' + cw + '" height="' + ch +
        '" fill="' + h[2] + '" opacity=".3" stroke="' + h[2] + '" stroke-width="2"/>';
      if (h[3]) s += '<text x="' + (x + h[1] * cw + cw / 2) + '" y="' + (y + h[0] * ch + ch / 2 + 4) +
        '" text-anchor="middle" fill="' + C.tx + '" font-size="11" font-weight="800">' + h[3] + '</text>';
    });
    return s;
  }
  // 기존 슬라이드 뒤에 이어 붙인다
  function add(key, arr) { L[key] = (L[key] || []).concat(arr); }

  /* ═══════════════ 1. 엑셀 기본과 데이터 입력 ═══════════════ */
  add('excel/basic', [
    { type: 'table', title: '입력한 데이터의 종류를 어떻게 알아보나',
      head: ['종류', '입력 예', '기본 정렬', '꼭 알아둘 것'],
      rows: [
        ['숫자', '1234 · -5 · (5) · 0 1/2', '<b>오른쪽</b>', '음수는 -나 <b>( )</b> · 분수는 <b>0 1/2</b>처럼 정수와 띄어서'],
        ['문자', '컴활 · A-1', '<b>왼쪽</b>', "숫자를 문자로 넣으려면 앞에 <b>'</b> (아포스트로피)"],
        ['날짜', '2026-08-24 · 2026/8/24', '오른쪽', '날짜도 <b>숫자</b>다 — 1900-01-01이 일련번호 1'],
        ['시간', '14:30 · 2:30 PM', '오른쪽', '<b>콜론(:)</b>으로 구분'],
        ['논리값', 'TRUE · FALSE', '<b>가운데</b>', '입력하면 자동으로 가운데 정렬'],
        ['오류값', '#DIV/0!', '가운데', '<b>#####</b>는 오류가 아니라 <b>열 너비 부족</b>'],
      ],
      cap: '⚠️ 날짜를 <b>2026.8.24</b>처럼 마침표로 넣으면 날짜가 아니라 <b>문자</b>가 되어 왼쪽 정렬됩니다' },

    { type: 'svg', title: 'Delete 키는 "내용"만 지운다',
      svg: svg('0 0 470 235',
        label(60, 26, '원래 셀', C.tx2, 12) +
        '<rect x="20" y="36" width="84" height="46" rx="6" fill="#3a2f13" stroke="' + C.gold + '" stroke-width="2"/>' +
        label(62, 64, '90점', C.gold, 15) +
        '<circle cx="98" cy="42" r="4" fill="' + C.no + '"/>' +
        label(62, 100, '노란 서식 + 값', C.tx2, 11) +
        label(62, 116, '+ 메모(빨간 점)', C.tx2, 11) +
        arrow(112, 60, 148) +
        // 결과 3가지
        box(156, 36, 96, 46, '(비어 있음)', C.no, '#141a33', 12) +
        label(204, 100, '내용 지우기', C.no, 12) +
        label(204, 116, '= <tspan font-weight="800">Delete</tspan> 키', C.tx2, 11) +
        label(204, 132, '서식·메모는 <tspan fill="' + C.warn + '">그대로</tspan>', C.tx2, 11) +
        '<rect x="264" y="36" width="96" height="46" rx="6" fill="#141a33" stroke="' + C.line + '" stroke-width="2"/>' +
        label(312, 64, '90점', C.tx, 15) +
        label(312, 100, '서식 지우기', C.pri, 12) +
        label(312, 116, '값만 남고', C.tx2, 11) +
        label(312, 132, '색·글꼴 사라짐', C.tx2, 11) +
        box(372, 36, 82, 46, '(완전 초기화)', C.ok, '#141a33', 10) +
        label(413, 100, '모두 지우기', C.ok, 12) +
        label(413, 116, '값 + 서식 + 메모', C.tx2, 11) +
        label(413, 132, '한 번에', C.tx2, 11) +
        '<line x1="20" y1="156" x2="450" y2="156" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 180, '[홈] → [지우기] 안에 <tspan fill="' + C.gold + '">모두 · 서식 · 내용 · 메모</tspan> 4가지가 따로 있다', C.tx, 13) +
        label(235, 206, '셀을 지우는 것(Delete)과 셀을 삭제하는 것(Ctrl + -)은 완전히 다르다', C.warn, 12.5) +
        label(235, 224, '삭제하면 옆·아래 셀이 밀려 올라온다', C.tx2, 11.5)),
      cap: 'Delete = <b>내용만</b> · 셀 삭제(Ctrl + -) = <b>셀 자체가 없어지고 밀림</b>' },

    { type: 'svg', title: '시트 다루기 — 삭제는 되돌릴 수 없다',
      svg: svg('0 0 470 230',
        // 시트 탭 줄
        '<rect x="18" y="30" width="434" height="34" rx="6" fill="#141a33" stroke="' + C.line + '" stroke-width="1.5"/>' +
        '<rect x="28" y="36" width="76" height="22" rx="4" fill="' + C.card + '" stroke="' + C.pri + '" stroke-width="2"/>' +
        label(66, 51, '1학기', C.tx, 11) +
        '<rect x="110" y="36" width="76" height="22" rx="4" fill="' + C.card + '" stroke="' + C.pri + '" stroke-width="2"/>' +
        label(148, 51, '2학기', C.tx, 11) +
        '<rect x="192" y="36" width="76" height="22" rx="4" fill="#141a33" stroke="' + C.line + '"/>' +
        label(230, 51, 'Sheet3', C.tx2, 11) +
        label(300, 51, '＋ 시트 삽입', C.ok, 11, 'start') +
        label(107, 82, '두 시트를 함께 선택 = <tspan fill="' + C.gold + '">[그룹]</tspan>', C.tx, 11.5) +
        label(107, 98, '입력·서식이 두 시트에 동시에', C.tx2, 10.5) +
        '<line x1="18" y1="112" x2="452" y2="112" stroke="' + C.line + '" stroke-width="1.5"/>' +
        box(20, 126, 104, 36, 'Shift + F11', C.ok, C.card, 12) +
        label(72, 176, '새 시트 삽입', C.tx2, 11) +
        box(134, 126, 104, 36, '탭을 그냥 끌기', C.pri, C.card, 11.5) +
        label(186, 176, '시트 <tspan fill="' + C.tx + '">이동</tspan>', C.tx2, 11) +
        box(248, 126, 104, 36, 'Ctrl + 끌기', C.gold, C.card, 12) +
        label(300, 176, '시트 <tspan fill="' + C.gold + '">복사</tspan>', C.tx2, 11) +
        box(362, 126, 90, 36, '시트 삭제', C.no, C.card, 12) +
        label(407, 176, '<tspan fill="' + C.no + '">되돌리기 불가</tspan>', C.tx2, 11) +
        label(235, 206, '시트 이름은 <tspan fill="' + C.gold + '">31자까지</tspan> · : \\ / ? * [ ] 는 쓸 수 없다', C.tx, 12.5)),
      cap: '시트 삭제는 <b>Ctrl+Z로 되살릴 수 없습니다</b> — 수업 중 실수 1순위' },

    { type: 'table', title: '채우기 핸들을 끌면 무엇이 나오나',
      head: ['처음 값', '끌었을 때 결과', '왜'],
      rows: [
        ['5 (한 칸)', '5, 5, 5 …', '숫자 하나는 <b>복사</b>'],
        ['5 + <b>Ctrl</b> 누르고', '5, 6, 7 …', 'Ctrl을 누르면 <b>1씩 증가</b>'],
        ['3, 6 (두 칸 선택)', '9, 12, 15 …', '두 값의 <b>차이만큼</b> 등차'],
        ['3급-1', '3급-2, 3급-3 …', '문자+숫자는 <b>숫자만</b> +1'],
        ['월', '화, 수, 목 …', '엑셀에 등록된 <b>사용자 지정 목록</b>'],
        ['2026-08-24', '08-25, 08-26 …', '날짜는 그냥 끌어도 <b>1일씩</b> 증가'],
      ],
      cap: '숫자 하나는 그냥 끌면 <b>복사</b>, 날짜 하나는 그냥 끌면 <b>증가</b> — 반대라서 자주 틀립니다' },

    { type: 'svg', title: '메모 · 셀 편집 — F2와 Shift+F2',
      svg: svg('0 0 470 225',
        sheet(20, 28, 3, 3, 74, 28, { '1,1': '이름', '1,2': '점수', '2,1': '한별', '2,2': '90' }, [[2, 2, C.gold, '90']]) +
        '<circle cx="242" cy="86" r="4.5" fill="' + C.no + '"/>' +
        '<line x1="244" y1="86" x2="286" y2="66" stroke="' + C.no + '" stroke-width="1.5" stroke-dasharray="3 3"/>' +
        '<rect x="286" y="40" width="166" height="52" rx="6" fill="#3a2f13" stroke="' + C.gold + '" stroke-width="1.5"/>' +
        label(369, 60, '재시험 응시', C.gold, 11.5) +
        label(369, 78, '← 메모(노트)', C.tx2, 10.5) +
        label(369, 108, '빨간 점 = 메모가 달린 셀', C.no, 11) +
        '<line x1="20" y1="128" x2="452" y2="128" stroke="' + C.line + '" stroke-width="1.5"/>' +
        box(24, 142, 128, 34, 'F2', C.pri, C.card, 13) +
        label(88, 192, '셀 <tspan fill="' + C.tx + '">편집 상태</tspan>로', C.tx2, 11.5) +
        label(88, 208, '(더블클릭과 같음)', C.tx2, 10.5) +
        box(168, 142, 128, 34, 'Shift + F2', C.gold, C.card, 13) +
        label(232, 192, '<tspan fill="' + C.gold + '">메모</tspan> 삽입 / 편집', C.tx2, 11.5) +
        box(312, 142, 140, 34, '페이지 설정 → 시트', C.ok, C.card, 11) +
        label(382, 192, '메모를 <tspan fill="' + C.ok + '">인쇄할지</tspan> 선택', C.tx2, 11.5) +
        label(382, 208, '(기본은 인쇄 안 함)', C.tx2, 10.5)),
      cap: '메모는 화면에 늘 보이게 할 수도 있고, 인쇄 여부도 따로 정할 수 있습니다' },
  ]);

  /* ═══════════════ 2. 셀 서식과 조건부 서식 ═══════════════ */
  add('excel/format', [
    { type: 'svg', title: '# 과 0 — 없는 자리를 지울까 채울까',
      svg: svg('0 0 470 230',
        box(20, 30, 200, 40, '#  →  없으면 안 보임', C.pri, C.card, 13.5) +
        box(250, 30, 200, 40, '0  →  없으면 0을 채움', C.ok, C.card, 13.5) +
        // 예시 표
        '<rect x="20" y="88" width="430" height="106" rx="8" fill="#141a33" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(80, 108, '입력값', C.tx2, 11.5) + label(210, 108, '표시 형식', C.tx2, 11.5) + label(360, 108, '화면에 보이는 결과', C.tx2, 11.5) +
        '<line x1="20" y1="118" x2="450" y2="118" stroke="' + C.line + '"/>' +
        label(80, 138, '0.5', C.tx, 12.5) + mono(210, 138, '#.#', C.pri, 12.5) + label(360, 138, '.5', C.gold, 13) +
        label(80, 160, '0.5', C.tx, 12.5) + mono(210, 160, '0.0', C.ok, 12.5) + label(360, 160, '0.5', C.gold, 13) +
        label(80, 182, '12345', C.tx, 12.5) + mono(210, 182, '#,##0', C.pri, 12.5) + label(360, 182, '12,345', C.gold, 13) +
        label(235, 216, '뒤에 쉼표 하나 = 천 단위 생략 →  #,##0,  은 12345를  12  로 보여준다', C.warn, 12.5)),
      cap: '보이는 것만 바뀔 뿐 <b>셀에 저장된 값은 그대로</b>입니다 (12345는 여전히 12345)' },

    { type: 'table', title: '표시 형식 — 입력 · 코드 · 결과로 외우기',
      head: ['입력값', '표시 형식 코드', '화면 결과'],
      rows: [
        ['5', '<code>0.0</code>', '5.0'],
        ['0.5', '<code>#.#</code>', '.5'],
        ['12345', '<code>#,##0</code>', '12,345'],
        ['12345', '<code>#,##0,</code>', '12'],
        ['1234567', '<code>#,##0,,</code>', '1'],
        ['홍길동', '<code>@"님"</code>', '홍길동님'],
        ['0.25', '<code>0%</code>', '25%'],
      ],
      cap: '<b>@</b> 는 문자가 들어갈 자리 · <b>"글자"</b>는 그대로 덧붙이기' },

    { type: 'svg', title: '조건부 서식 — 수식으로 "행 전체" 칠하기',
      svg: svg('0 0 470 240',
        sheet(20, 26, 4, 4, 66, 26,
          { '1,1': '이름', '1,2': '국어', '1,3': '영어', '1,4': '평균',
            '2,1': '한별', '2,2': '95', '2,3': '90', '2,4': '92.5',
            '3,1': '보람', '3,2': '70', '3,3': '75', '3,4': '72.5',
            '4,1': '하늘', '4,2': '88', '4,3': '96', '4,4': '92' }) +
        '<rect x="86" y="52" width="264" height="26" fill="' + C.ok + '" opacity=".22" stroke="' + C.ok + '" stroke-width="2"/>' +
        '<rect x="86" y="104" width="264" height="26" fill="' + C.ok + '" opacity=".22" stroke="' + C.ok + '" stroke-width="2"/>' +
        label(400, 68, '평균 90 이상 →', C.ok, 11, 'start') +
        label(400, 84, '행 전체 색칠', C.ok, 11, 'start') +
        '<rect x="20" y="150" width="430" height="44" rx="8" fill="#12162b" stroke="' + C.gold + '" stroke-width="2"/>' +
        mono(235, 178, '=$D2&gt;=90', C.gold, 19) +
        label(120, 216, '<tspan fill="' + C.gold + '">$D</tspan> — 열은 고정', C.tx2, 12.5) +
        label(300, 216, '<tspan fill="' + C.gold + '">2</tspan> — 행은 안 고정', C.tx2, 12.5)),
      cap: '열만 <b>$</b>로 고정하면 어느 열에서 봐도 D열 값을 보고 <b>행 전체</b>가 칠해집니다' },

    { type: 'svg', title: '병합 · 줄 바꿈 · 셀에 맞춤 — 셋 다 다르다',
      svg: svg('0 0 470 225',
        label(80, 26, '병합하고 가운데 맞춤', C.pri, 11.5) +
        sheet(20, 34, 3, 2, 40, 26, {}) +
        '<rect x="60" y="60" width="120" height="26" fill="' + C.pri + '" opacity=".3" stroke="' + C.pri + '" stroke-width="2"/>' +
        label(120, 79, '성적표', C.tx, 12) +
        label(100, 116, '여러 셀을 <tspan fill="' + C.tx + '">한 칸으로</tspan>', C.tx2, 11) +
        label(100, 132, '<tspan fill="' + C.no + '">왼쪽 위 값만 남고</tspan> 나머지는 사라짐', C.tx2, 10.5) +
        label(300, 26, '텍스트 줄 바꿈', C.ok, 11.5) +
        '<rect x="212" y="46" width="110" height="54" rx="4" fill="#141a33" stroke="' + C.ok + '" stroke-width="2"/>' +
        label(267, 68, '컴퓨터활용', C.tx, 11.5) + label(267, 86, '능력 2급', C.tx, 11.5) +
        label(267, 116, '<tspan fill="' + C.tx + '">행 높이가 늘어나며</tspan>', C.tx2, 11) +
        label(267, 132, '글자가 여러 줄로', C.tx2, 10.5) +
        label(410, 26, '셀에 맞춤', C.gold, 11.5) +
        '<rect x="356" y="46" width="106" height="26" rx="4" fill="#141a33" stroke="' + C.gold + '" stroke-width="2"/>' +
        '<text x="409" y="63" text-anchor="middle" fill="' + C.tx + '" font-size="8" font-weight="600">컴퓨터활용능력 2급</text>' +
        label(409, 116, '<tspan fill="' + C.tx + '">글자 크기를 줄여</tspan>', C.tx2, 11) +
        label(409, 132, '한 칸에 밀어 넣음', C.tx2, 10.5) +
        '<line x1="20" y1="152" x2="450" y2="152" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 176, 'Alt + Enter = 내가 원하는 곳에서 <tspan fill="' + C.gold + '">직접</tspan> 줄 바꾸기', C.tx, 12.5) +
        label(235, 200, '"텍스트 줄 바꿈"은 셀 너비에 맞춰 <tspan fill="' + C.ok + '">자동으로</tspan> 넘긴다 — 둘은 다른 기능', C.tx2, 12)),
      cap: '병합은 <b>가운데 정렬까지 같이</b> 되고, 되돌리면 값은 <b>왼쪽 위 셀</b>에만 남습니다' },

    { type: 'table', title: '선택하여 붙여넣기 — 무엇만 골라 붙일까',
      head: ['옵션', '무엇이 붙나'],
      rows: [
        ['<b>값</b>', '수식의 <b>결과 숫자만</b> (수식은 사라짐)'],
        ['<b>서식</b>', '글꼴·색·테두리만 (값은 그대로)'],
        ['수식', '수식만 (서식 제외)'],
        ['<b>연산</b> (더하기/빼기/곱하기)', '복사한 값을 붙일 곳의 값과 <b>계산</b>해서'],
        ['<b>행/열 바꿈</b>', '가로↔세로 뒤집어서'],
        ['<b>연결하여 붙여넣기</b>', '원본이 바뀌면 <b>같이 바뀜</b> (참조로 연결)'],
      ],
      cap: '<b>Ctrl + Alt + V</b> 로 열립니다 · 잘라내기(Ctrl+X) 뒤에는 일부 옵션이 막힙니다' },
  ]);

  /* ═══════════════ 3. 수식과 셀 참조 ═══════════════ */
  add('excel/formula', [
    { type: 'svg', title: 'F4를 누를 때마다 $ 가 돌아간다',
      svg: svg('0 0 470 200',
        box(16, 60, 92, 44, 'A1', C.line, C.card, 17) +
        arrow(112, 82, 148, C.gold) + label(130, 70, 'F4', C.gold, 11) +
        box(152, 60, 92, 44, '$A$1', C.gold, C.card, 17) +
        arrow(248, 82, 284, C.gold) + label(266, 70, 'F4', C.gold, 11) +
        box(288, 60, 84, 44, 'A$1', C.pri, C.card, 17) +
        arrow(376, 82, 412, C.gold) + label(394, 70, 'F4', C.gold, 11) +
        box(410, 60, 46, 44, '$A1', C.pri, C.card, 14) +
        '<path d="M 433 112 L 433 132 L 62 132 L 62 110" fill="none" stroke="' + C.tx2 +
        '" stroke-width="2" stroke-dasharray="5 4"/>' +
        '<polygon points="62,104 57,114 67,114" fill="' + C.tx2 + '"/>' +
        label(247, 148, '한 바퀴 돌아 다시 A1', C.tx2, 11.5) +
        label(235, 176, '<tspan fill="' + C.gold + '">$</tspan> 가 붙은 쪽은 채우기·복사해도 <tspan fill="' + C.gold + '">움직이지 않는다</tspan>', C.tx, 13)),
      cap: '순서: <b>상대 → 절대 → 행 고정 → 열 고정</b> → 다시 상대' },

    { type: 'svg', title: '혼합 참조 실전 — 구구단 표 한 방에',
      svg: svg('0 0 470 235',
        sheet(60, 26, 4, 4, 62, 26,
          { '1,2': '2', '1,3': '3', '1,4': '4',
            '2,1': '1', '3,1': '2', '4,1': '3',
            '2,2': '2', '2,3': '3', '2,4': '4',
            '3,2': '4', '3,3': '6', '3,4': '8',
            '4,2': '6', '4,3': '9', '4,4': '12' }, [[2, 2, C.gold, '2']]) +
        '<rect x="60" y="130" width="352" height="42" rx="8" fill="#12162b" stroke="' + C.gold + '" stroke-width="2"/>' +
        mono(236, 158, '=$A2 * B$1', C.gold, 20) +
        label(140, 194, '<tspan fill="' + C.gold + '">$A</tspan>2 — 세로줄(A열)은 늘 A열', C.tx2, 12, 'start') +
        label(140, 214, 'B<tspan fill="' + C.gold + '">$1</tspan> — 가로줄(1행)은 늘 1행', C.tx2, 12, 'start')),
      cap: '[B2]에 한 번만 쓰고 <b>오른쪽·아래로 끌면</b> 표 전체가 완성됩니다' },

    { type: 'table', title: '연산자 우선순위 — 위에서부터 먼저',
      head: ['순서', '연산자', '뜻'],
      rows: [
        ['1', '<code>( )</code>', '괄호 안이 무조건 먼저'],
        ['2', '<code>%</code>', '백분율'],
        ['3', '<code>^</code>', '거듭제곱'],
        ['4', '<code>*</code> <code>/</code>', '곱하기 · 나누기'],
        ['5', '<code>+</code> <code>-</code>', '더하기 · 빼기'],
        ['6', '<code>&amp;</code>', '문자 연결'],
        ['7', '<code>=</code> <code>&lt;&gt;</code> <code>&gt;=</code> <code>&lt;=</code>', '비교 (결과는 TRUE/FALSE)'],
      ],
      cap: '비교 연산자가 <b>가장 나중</b> — 그래서 <code>=A1+B1&gt;100</code> 은 더한 다음 비교합니다' },

    { type: 'svg', title: '다른 시트 · 여러 시트를 한 번에 참조하기',
      svg: svg('0 0 470 235',
        box(24, 34, 132, 40, '같은 시트', C.line, C.card, 13) +
        mono(90, 96, 'B3', C.ok, 15) +
        box(172, 34, 132, 40, '다른 시트', C.pri, C.card, 13) +
        mono(238, 96, 'Sheet2!B3', C.ok, 14) +
        box(320, 34, 132, 40, '이름에 공백이 있으면', C.gold, C.card, 11.5) +
        mono(386, 96, "'1학기 성적'!B3", C.gold, 12) +
        label(386, 116, '작은따옴표로 감싼다', C.tx2, 10.5) +
        '<line x1="20" y1="134" x2="450" y2="134" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 158, '3차원 참조 — 여러 시트의 같은 자리를 한꺼번에', C.tx, 13) +
        '<rect x="90" y="172" width="290" height="40" rx="8" fill="#12162b" stroke="' + C.ok + '" stroke-width="2"/>' +
        mono(235, 199, '=SUM(Sheet1:Sheet3!B3)', C.ok, 17) +
        label(235, 228, 'Sheet1부터 Sheet3까지 모든 [B3]을 더한다', C.tx2, 11.5)),
      cap: '시트 이름과 셀 주소 사이는 <b>느낌표(!)</b> 로 구분합니다' },

    { type: 'table', title: '이름 정의 — 되는 이름 / 안 되는 이름',
      head: ['규칙', '예'],
      rows: [
        ['첫 글자는 <b>문자 · _ · \\</b> 만', '<b>○</b> 총점, _합계 &nbsp;&nbsp; <b>×</b> 1학기'],
        ['<b>공백</b>을 쓸 수 없다', '<b>×</b> 국어 점수 → <b>○</b> 국어_점수'],
        ['<b>셀 주소</b> 모양은 안 된다', '<b>×</b> A1, B$3'],
        ['최대 <b>255자</b>', '길게 써도 되지만 짧게 쓰는 게 좋다'],
        ['<b>대·소문자를 구분하지 않는다</b>', '합계 와 합계 는 같은 이름'],
        ['같은 통합 문서에서 <b>중복 불가</b>', '이름 상자·[수식]→[이름 관리자]에서 확인'],
      ],
      cap: '이름을 정의해 두면 <code>=SUM(총점)</code> 처럼 <b>절대 참조</b>처럼 쓸 수 있습니다' },
  ]);

  /* ═══════════════ 4. 주요 함수 (실기와 직결) ═══════════════ */
  add('excel/func', [
    { type: 'svg', title: '함수는 이렇게 생겼다',
      svg: svg('0 0 470 225',
        '<rect x="30" y="40" width="410" height="52" rx="10" fill="#12162b" stroke="' + C.ok + '" stroke-width="2"/>' +
        mono(235, 76, '=SUM( B2 : B5 )', C.ok, 26) +
        down(78, 96, 122, C.gold) + label(78, 140, '반드시', C.gold, 11.5) + label(78, 156, '=로 시작', C.gold, 11.5) +
        down(152, 96, 122, C.pri) + label(152, 140, '함수 이름', C.pri, 11.5) + label(152, 156, '(대소문자 무관)', C.tx2, 10.5) +
        down(258, 96, 122, C.warn) + label(258, 140, '인수', C.warn, 11.5) + label(258, 156, '괄호 안에', C.tx2, 10.5) +
        label(400, 140, '인수가 여러 개면', C.tx2, 11) +
        label(400, 156, '<tspan fill="' + C.gold + '">쉼표(,)</tspan>로 구분', C.tx2, 11) +
        '<line x1="20" y1="176" x2="450" y2="176" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 200, '문자는 <tspan fill="' + C.gold + '">"큰따옴표"</tspan>로 · 숫자와 셀 주소는 따옴표 없이', C.tx, 13)),
      cap: '<code>B2:B5</code> 는 <b>범위</b>, <code>B2,B5</code> 는 <b>두 셀만</b> — 콜론과 쉼표를 구분하세요' },

    { type: 'table', title: '개수 세는 함수 4형제 — 같은 범위, 다른 답',
      head: ['함수', '무엇을 세나', '아래 예에서'],
      rows: [
        ['<code>COUNT</code>', '<b>숫자</b>가 든 셀', '3개'],
        ['<code>COUNTA</code>', '<b>비어 있지 않은</b> 모든 셀', '4개'],
        ['<code>COUNTBLANK</code>', '<b>비어 있는</b> 셀', '1개'],
        ['<code>COUNTIF</code>', '<b>조건에 맞는</b> 셀', '80 이상 → 2개'],
      ],
      cap: '예) 범위 = <b>90 · 결석 · 85 · (빈칸) · 70</b> — COUNT는 문자 "결석"을 세지 않습니다' },

    { type: 'svg', title: 'COUNTIF · SUMIF — 조건은 이렇게 쓴다',
      svg: svg('0 0 470 240',
        '<rect x="24" y="28" width="422" height="40" rx="8" fill="#12162b" stroke="' + C.ok + '" stroke-width="2"/>' +
        mono(235, 55, '=SUMIF( 조건범위 , "조건" , 합계범위 )', C.ok, 16) +
        label(235, 86, '조건범위와 합계범위가 같으면 <tspan fill="' + C.gold + '">합계범위를 생략</tspan>할 수 있다', C.tx2, 11.5) +
        '<line x1="20" y1="98" x2="450" y2="98" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(90, 122, '조건 쓰는 법', C.tx, 12.5) +
        mono(70, 148, '"&gt;=80"', C.gold, 14, 'start') + label(190, 148, '80 이상', C.tx2, 12, 'start') +
        mono(70, 172, '"김*"', C.gold, 14, 'start') + label(190, 172, '김으로 <tspan fill="' + C.tx + '">시작</tspan>하는 모든 것', C.tx2, 12, 'start') +
        mono(70, 196, '"?영*"', C.gold, 14, 'start') + label(190, 196, '두 번째 글자가 영', C.tx2, 12, 'start') +
        mono(70, 220, '"&gt;="&amp;E2', C.gold, 14, 'start') + label(190, 220, '셀 값을 조건으로 (&amp;로 연결)', C.tx2, 12, 'start')),
      cap: '<b>*</b> = 글자 수 상관없음 · <b>?</b> = 딱 한 글자 · 조건은 <b>따옴표 안</b>에 넣습니다' },

    { type: 'svg', title: 'RANK.EQ — 0은 1등이 큰 값, 1은 1등이 작은 값',
      svg: svg('0 0 470 235',
        '<rect x="24" y="26" width="422" height="40" rx="8" fill="#12162b" stroke="' + C.gold + '" stroke-width="2"/>' +
        mono(235, 53, '=RANK.EQ( D2 , $D$2:$D$6 , 0 )', C.gold, 17) +
        down(126, 70, 100, C.pri) + label(126, 118, '순위를 구할 값', C.pri, 11.5) +
        down(262, 70, 100, C.no) + label(262, 118, '전체 범위', C.no, 11.5) + label(262, 134, '<tspan fill="' + C.no + '">반드시 절대참조</tspan>', C.tx2, 11) +
        down(392, 70, 100, C.ok) + label(392, 118, '정렬 방법', C.ok, 11.5) +
        '<line x1="20" y1="152" x2="450" y2="152" stroke="' + C.line + '" stroke-width="1.5"/>' +
        box(40, 166, 180, 40, '0 또는 생략 → 내림차순', C.ok, C.card, 12.5) +
        label(130, 224, '점수·매출 — <tspan fill="' + C.tx + '">큰 값이 1등</tspan>', C.tx2, 11.5) +
        box(250, 166, 180, 40, '1 → 오름차순', C.warn, C.card, 12.5) +
        label(340, 224, '기록·시간 — <tspan fill="' + C.tx + '">작은 값이 1등</tspan>', C.tx2, 11.5)),
      cap: '범위를 <b>$</b>로 고정하지 않고 아래로 끌면 범위가 밀려 <b>순위가 엉킵니다</b>' },

    { type: 'table', title: '반올림 · 자르기 함수 — 결과로 비교하기',
      head: ['수식', '결과', '설명'],
      rows: [
        ['<code>=ROUND(3.567, 1)</code>', '3.6', '소수 1자리로 <b>반올림</b>'],
        ['<code>=ROUNDUP(3.512, 1)</code>', '3.6', '무조건 <b>올림</b>'],
        ['<code>=ROUNDDOWN(3.567, 1)</code>', '3.5', '무조건 <b>내림</b>'],
        ['<code>=ROUND(1234, -2)</code>', '1200', '자릿수가 <b>음수</b>면 정수 쪽으로'],
        ['<code>=INT(-3.5)</code>', '-4', '<b>작은 쪽</b> 정수로 (내림)'],
        ['<code>=MOD(7, 3)</code>', '1', '나눈 <b>나머지</b>'],
        ['<code>=ABS(-8)</code>', '8', '<b>절댓값</b>'],
      ],
      cap: '⚠️ <code>INT(-3.5)</code>는 -3이 아니라 <b>-4</b> — 음수에서 자주 틀립니다' },

    { type: 'table', title: '문자열 함수 — "한별샘 2급" 을 예로',
      head: ['수식', '결과', '설명'],
      rows: [
        ['<code>=LEFT(A1, 3)</code>', '한별샘', '왼쪽에서 3글자'],
        ['<code>=RIGHT(A1, 2)</code>', '2급', '오른쪽에서 2글자'],
        ['<code>=MID(A1, 5, 2)</code>', '2급', '5번째부터 2글자'],
        ['<code>=LEN(A1)</code>', '6', '공백 포함 <b>글자 수</b>'],
        ['<code>=A1 &amp; "님"</code>', '한별샘 2급님', '<b>&amp;</b> 로 이어 붙이기'],
        ['<code>=UPPER("exam")</code>', 'EXAM', '모두 대문자 (LOWER는 소문자)'],
        ['<code>=TRIM(" 컴활 ")</code>', '컴활', '앞뒤 <b>공백 제거</b>'],
      ],
      cap: '엑셀은 한글 한 글자도 <b>1글자</b>로 셉니다 (LEN은 바이트가 아님)' },

    { type: 'svg', title: '날짜 함수 — 날짜는 사실 숫자다',
      svg: svg('0 0 470 235',
        box(24, 28, 130, 38, 'TODAY()', C.ok, C.card, 14) + label(89, 84, '오늘 날짜', C.tx2, 11.5) +
        box(170, 28, 130, 38, 'NOW()', C.ok, C.card, 14) + label(235, 84, '오늘 날짜 + 시간', C.tx2, 11.5) +
        box(316, 28, 130, 38, 'DAYS(끝,시작)', C.pri, C.card, 12.5) + label(381, 84, '두 날짜 사이 일수', C.tx2, 11.5) +
        '<line x1="20" y1="100" x2="450" y2="100" stroke="' + C.line + '" stroke-width="1.5"/>' +
        '<rect x="60" y="116" width="350" height="38" rx="8" fill="#12162b" stroke="' + C.gold + '" stroke-width="2"/>' +
        mono(235, 142, '=YEAR(TODAY()) - YEAR(B2)', C.gold, 17) +
        label(235, 176, '올해 연도 − 태어난 해 = <tspan fill="' + C.tx + '">나이</tspan>', C.tx2, 12.5) +
        label(235, 206, 'WEEKDAY(날짜, 2) → 월요일이 1, 일요일이 7', C.tx, 12.5) +
        label(235, 226, '(옵션 1이나 생략이면 일요일이 1)', C.tx2, 11)),
      cap: 'TODAY·NOW는 <b>인수가 없어도 괄호를 반드시</b> 붙입니다 — <code>=TODAY()</code>' },
  ]);

  /* ═══════════════ 5. 데이터 관리(정렬·필터) ═══════════════ */
  add('excel/data', [
    { type: 'svg', title: '고급 필터 대화상자 — 칸 3개만 채우면 된다',
      svg: svg('0 0 470 235',
        '<rect x="70" y="24" width="330" height="150" rx="10" fill="' + C.card + '" stroke="' + C.pri + '" stroke-width="2"/>' +
        '<rect x="70" y="24" width="330" height="26" rx="10" fill="' + C.pri + '" opacity=".3"/>' +
        label(235, 42, '고급 필터', C.tx, 12) +
        label(88, 70, '○ 현재 위치에 필터', C.tx2, 11.5, 'start') +
        label(88, 90, '● 다른 장소에 복사', C.ok, 11.5, 'start') +
        label(88, 116, '목록 범위', C.tx2, 11, 'start') +
        '<rect x="160" y="104" width="228" height="20" rx="4" fill="#141a33" stroke="' + C.line + '"/>' +
        mono(170, 118, '$A$1:$D$10', C.tx, 11, 'start') +
        label(88, 142, '조건 범위', C.gold, 11, 'start') +
        '<rect x="160" y="130" width="228" height="20" rx="4" fill="#141a33" stroke="' + C.gold + '" stroke-width="1.5"/>' +
        mono(170, 144, '$F$1:$G$3', C.gold, 11, 'start') +
        label(88, 166, '복사 위치', C.ok, 11, 'start') +
        '<rect x="160" y="154" width="228" height="20" rx="4" fill="#141a33" stroke="' + C.ok + '" stroke-width="1.5"/>' +
        mono(170, 168, '$A$15', C.ok, 11, 'start') +
        label(235, 200, '조건 범위의 <tspan fill="' + C.gold + '">첫 줄에는 원본과 똑같은 필드 이름</tspan>을 써야 한다', C.tx, 12.5) +
        label(235, 222, '"다른 장소에 복사"는 <tspan fill="' + C.no + '">같은 시트</tspan>에만 가능', C.tx2, 11.5)),
      cap: '복사 위치를 셀 하나만 지정하면 <b>결과 전체</b>가 거기서부터 펼쳐집니다' },

    { type: 'table', title: '고급 필터 조건 — 이렇게 쓴다',
      head: ['조건 칸에 쓰는 것', '뜻'],
      rows: [
        ['<code>&gt;=80</code>', '80 이상'],
        ['<code>김*</code>', '김으로 시작 (성이 김씨)'],
        ['<code>*과</code>', '과로 끝남'],
        ['<code>&lt;&gt;합격</code>', '합격이 <b>아닌</b> 것'],
        ['같은 <b>행</b>에 두 조건', '두 조건을 <b>모두</b> 만족 (그리고 · AND)'],
        ['다른 <b>행</b>에 두 조건', '둘 중 <b>하나만</b> 만족해도 (또는 · OR)'],
      ],
      cap: '기억법 — <b>가로로 나란히 = 그리고</b>, <b>세로로 어긋나게 = 또는</b>' },

    { type: 'svg', title: '텍스트 나누기 — 한 칸을 여러 칸으로',
      svg: svg('0 0 470 225',
        sheet(14, 30, 1, 3, 122, 26, { '1,1': '홍길동,2학년,90', '2,1': '김한별,1학년,85', '3,1': '이보람,3학년,78' }) +
        arrow(266, 82, 296, C.gold) +
        sheet(300, 30, 3, 3, 42, 26,
          { '1,1': '홍길동', '1,2': '2학년', '1,3': '90',
            '2,1': '김한별', '2,2': '1학년', '2,3': '85',
            '3,1': '이보람', '3,2': '3학년', '3,3': '78' }) +
        '<line x1="20" y1="146" x2="450" y2="146" stroke="' + C.line + '" stroke-width="1.5"/>' +
        box(30, 158, 190, 38, '구분 기호로 분리', C.ok, C.card, 12.5) +
        label(125, 214, '쉼표 · 탭 · 세미콜론 · 공백', C.tx2, 11.5) +
        box(250, 158, 190, 38, '너비가 일정함', C.pri, C.card, 12.5) +
        label(345, 214, '글자 수를 세어 직접 선 긋기', C.tx2, 11.5)),
      cap: '[데이터] → [텍스트 나누기] · 나눈 결과가 <b>오른쪽 칸을 덮어쓰므로</b> 빈 열을 미리 만들어 두세요' },

    { type: 'table', title: '정렬 — 알아 둘 것만',
      head: ['항목', '내용'],
      rows: [
        ['정렬 기준', '최대 <b>64개</b>까지 (1차·2차·3차 …)'],
        ['기준으로 쓸 수 있는 것', '값 · <b>셀 색</b> · 글꼴 색 · 조건부 서식 아이콘'],
        ['오름차순 순서', '숫자 → 문자 → 논리값 → 오류값 → <b>빈 셀은 항상 맨 뒤</b>'],
        ['옵션 — 대/소문자', '기본은 구분 <b>안 함</b>, 켤 수 있음'],
        ['옵션 — 방향', '보통은 위→아래(행 정렬), <b>왼쪽→오른쪽</b>(열 정렬)도 가능'],
        ['사용자 지정 목록', '월·화·수, 대리·과장·부장처럼 <b>내 순서</b>로 정렬'],
      ],
      cap: '<b>빈 셀은 오름차순이든 내림차순이든 언제나 맨 마지막</b>에 놓입니다' },
  ]);

  /* ═══════════════ 6. 데이터 분석과 차트 ═══════════════ */
  add('excel/analysis', [
    { type: 'svg', title: '부분합 — 정렬을 안 하면 소용이 없다',
      svg: svg('0 0 470 225',
        box(16, 40, 122, 46, '① 정렬', C.gold, C.card, 15) +
        label(77, 106, '그룹화할 항목을', C.tx2, 11) + label(77, 122, '<tspan fill="' + C.gold + '">먼저 정렬</tspan>', C.gold, 11.5) +
        arrow(142, 63, 172, C.tx2) +
        box(176, 40, 122, 46, '② 부분합', C.pri, C.card, 15) +
        label(237, 106, '[데이터] → [부분합]', C.tx2, 11) +
        label(237, 122, '함수와 항목 고르기', C.tx2, 11) +
        arrow(302, 63, 332, C.tx2) +
        box(336, 40, 122, 46, '③ 윤곽 기호', C.ok, C.card, 14) +
        label(397, 106, '1 2 3 단추로', C.tx2, 11) +
        label(397, 122, '펼치고 접기', C.tx2, 11) +
        '<line x1="20" y1="142" x2="450" y2="142" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 168, '부서별 합계를 내려면 <tspan fill="' + C.gold + '">부서 열로 먼저 정렬</tspan>해야 한다', C.tx, 13) +
        label(235, 192, '정렬하지 않으면 같은 부서가 여기저기 흩어져 소계가 여러 번 생긴다', C.tx2, 11.5) +
        label(235, 214, '부분합을 없애려면 → [부분합] 대화상자의 <tspan fill="' + C.no + '">[모두 제거]</tspan>', C.no, 12)),
      cap: '부분합은 <b>정렬 → 부분합</b> 순서가 전부입니다' },

    { type: 'table', title: '부분합 대화상자 — 체크 하나가 결과를 바꾼다',
      head: ['항목', '뜻'],
      rows: [
        ['그룹화할 항목', '<b>정렬해 둔 그 열</b>을 고른다'],
        ['사용할 함수', '합계 · 개수 · 평균 · 최대 · 최소 · 곱 …'],
        ['부분합 계산 항목', '실제로 계산할 <b>숫자 열</b>을 체크'],
        ['<b>새로운 값으로 대치</b>', '끄면 <b>부분합을 겹쳐서(중첩)</b> 만들 수 있다'],
        ['그룹 사이에서 페이지 나누기', '그룹마다 <b>다른 페이지</b>에 인쇄'],
        ['데이터 아래에 요약 표시', '끄면 소계가 그룹 <b>위</b>에 나온다'],
      ],
      cap: '평균과 합계를 <b>둘 다</b> 보려면 두 번째 부분합에서 <b>"새로운 값으로 대치"를 끕니다</b>' },

    { type: 'svg', title: '목표값 찾기 · 시나리오 · 데이터 통합',
      svg: svg('0 0 470 240',
        box(16, 30, 138, 42, '목표값 찾기', C.gold, C.card, 14) +
        label(85, 94, '결과를 <tspan fill="' + C.tx + '">정해 놓고</tspan>', C.tx2, 11.5) +
        label(85, 112, '필요한 <tspan fill="' + C.gold + '">값 하나</tspan>를 거꾸로', C.tx2, 11.5) +
        label(85, 134, '"평균 80 만들려면', C.tx2, 10.5) +
        label(85, 149, '수학 몇 점?"', C.tx2, 10.5) +
        box(166, 30, 138, 42, '시나리오', C.pri, C.card, 14) +
        label(235, 94, '값이 <tspan fill="' + C.tx + '">여러 개</tspan> 바뀔 때', C.tx2, 11.5) +
        label(235, 112, '경우별 결과를 <tspan fill="' + C.pri + '">비교</tspan>', C.tx2, 11.5) +
        label(235, 134, '"낙관 / 보통 / 비관"', C.tx2, 10.5) +
        label(235, 149, '요약 보고서로', C.tx2, 10.5) +
        box(316, 30, 138, 42, '데이터 통합', C.ok, C.card, 14) +
        label(385, 94, '<tspan fill="' + C.tx + '">여러 표</tspan>를 하나로', C.tx2, 11.5) +
        label(385, 112, '합계·평균 내어 <tspan fill="' + C.ok + '">모으기</tspan>', C.tx2, 11.5) +
        label(385, 134, '"1월·2월·3월 시트를', C.tx2, 10.5) +
        label(385, 149, '한 표로"', C.tx2, 10.5) +
        '<line x1="20" y1="170" x2="450" y2="170" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 194, '목표값 찾기에서 바꿀 수 있는 셀은 <tspan fill="' + C.gold + '">딱 하나</tspan>', C.tx, 13) +
        label(235, 218, '그 셀에는 반드시 <tspan fill="' + C.no + '">수식이 아닌 값</tspan>이 들어 있어야 한다', C.tx2, 12)),
      cap: '셋 다 [데이터] 탭의 <b>가상 분석 / 데이터 도구</b>에 모여 있습니다' },

    { type: 'svg', title: '차트 구성 요소 이름 외우기',
      svg: svg('0 0 470 240',
        '<rect x="24" y="24" width="330" height="180" rx="8" fill="#141a33" stroke="' + C.pri + '" stroke-width="2"/>' +
        label(189, 44, '학급별 평균 점수', C.tx, 13) +
        '<rect x="70" y="56" width="266" height="112" fill="#12162b" stroke="' + C.line + '" stroke-width="1.5"/>' +
        '<line x1="70" y1="140" x2="336" y2="140" stroke="' + C.line + '" stroke-dasharray="3 3"/>' +
        '<line x1="70" y1="112" x2="336" y2="112" stroke="' + C.line + '" stroke-dasharray="3 3"/>' +
        '<line x1="70" y1="84" x2="336" y2="84" stroke="' + C.line + '" stroke-dasharray="3 3"/>' +
        '<rect x="92" y="100" width="34" height="68" fill="' + C.pri + '"/>' +
        '<rect x="146" y="76" width="34" height="92" fill="' + C.pri + '"/>' +
        '<rect x="200" y="120" width="34" height="48" fill="' + C.pri + '"/>' +
        '<text x="163" y="70" text-anchor="middle" fill="' + C.gold + '" font-size="10" font-weight="800">92</text>' +
        label(48, 116, '세<tspan x="48" dy="14">로</tspan><tspan x="48" dy="14">축</tspan>', C.ok, 10) +
        label(203, 186, '가로(항목) 축', C.ok, 10.5) +
        '<rect x="262" y="62" width="66" height="20" rx="4" fill="' + C.card + '" stroke="' + C.line + '"/>' +
        label(295, 76, '■ 평균', C.tx2, 9.5) +
        // 지시선
        label(400, 44, '← 차트 제목', C.tx, 11.5, 'start') +
        label(400, 78, '← 범례', C.tx, 11.5, 'start') +
        label(400, 110, '← 데이터 계열(막대)', C.tx, 11.5, 'start') +
        label(400, 70, '', C.tx) +
        label(360, 146, '눈금선', C.tx2, 10.5, 'start') +
        label(360, 166, '그림 영역', C.tx2, 10.5, 'start') +
        label(360, 186, '차트 영역', C.tx2, 10.5, 'start') +
        label(235, 226, '데이터 레이블 = 막대 위에 붙는 <tspan fill="' + C.gold + '">숫자(92)</tspan>', C.tx, 12.5)),
      cap: '<b>F11</b> = 새 시트에 차트 만들기 · <b>Alt+F1</b> = 지금 시트 안에 차트 만들기' },
  ]);

  /* ═══════════════ 7. 출력과 매크로 ═══════════════ */
  add('excel/print', [
    { type: 'svg', title: '페이지 설정 — 어느 탭에 무엇이 있나',
      svg: svg('0 0 470 235',
        '<rect x="20" y="24" width="430" height="30" rx="8" fill="#141a33" stroke="' + C.line + '" stroke-width="1.5"/>' +
        '<rect x="24" y="27" width="102" height="24" rx="6" fill="' + C.pri + '" opacity=".35"/>' +
        label(75, 44, '페이지', C.tx, 12) + label(182, 44, '여백', C.tx2, 12) +
        label(290, 44, '머리글/바닥글', C.tx2, 12) + label(400, 44, '시트', C.tx2, 12) +
        box(20, 68, 102, 44, '용지 방향', C.pri, C.card, 12) +
        label(71, 130, '세로 / 가로', C.tx2, 10.5) + label(71, 146, '확대·축소 배율', C.tx2, 10.5) +
        label(71, 162, '<tspan fill="' + C.gold + '">자동 맞춤</tspan>', C.gold, 10.5) +
        box(130, 68, 102, 44, '여백', C.ok, C.card, 12) +
        label(181, 130, '위·아래·좌·우', C.tx2, 10.5) +
        label(181, 146, '<tspan fill="' + C.ok + '">페이지 가운데</tspan>', C.ok, 10.5) +
        label(181, 162, '맞춤(가로/세로)', C.tx2, 10.5) +
        box(240, 68, 102, 44, '머리글/바닥글', C.warn, C.card, 10.5) +
        label(291, 130, '쪽 번호 · 날짜', C.tx2, 10.5) + label(291, 146, '파일명 · 시트명', C.tx2, 10.5) +
        label(291, 162, '왼쪽/가운데/오른쪽', C.tx2, 10.5) +
        box(350, 68, 100, 44, '시트', C.gold, C.card, 12) +
        label(400, 130, '<tspan fill="' + C.gold + '">인쇄 영역</tspan>', C.gold, 10.5) +
        label(400, 146, '<tspan fill="' + C.gold + '">반복할 행/열</tspan>', C.gold, 10.5) +
        label(400, 162, '눈금선 · 메모 · 순서', C.tx2, 10.5) +
        '<line x1="20" y1="180" x2="450" y2="180" stroke="' + C.line + '" stroke-width="1.5"/>' +
        label(235, 206, '"용지 <tspan fill="' + C.gold + '">1페이지에 맞추기</tspan>"는 [페이지] 탭 · "<tspan fill="' + C.ok + '">가운데 맞춤</tspan>"은 [여백] 탭', C.tx, 12.5) +
        label(235, 226, '어느 탭이냐를 묻는 문제가 자주 나온다', C.tx2, 11)),
      cap: '머리글·바닥글은 <b>페이지 나누기 미리 보기에서는 편집할 수 없습니다</b>' },

    { type: 'table', title: '[시트] 탭 인쇄 옵션',
      head: ['옵션', '켜면 어떻게 되나'],
      rows: [
        ['인쇄 영역', '지정한 <b>그 범위만</b> 인쇄 (여러 범위도 가능)'],
        ['<b>반복할 행</b>', '페이지마다 <b>제목 줄</b>이 위에 다시 나옴'],
        ['반복할 열', '페이지마다 왼쪽 열이 다시 나옴'],
        ['눈금선', '화면의 <b>회색 선</b>까지 같이 인쇄 (기본은 꺼짐)'],
        ['행/열 머리글', '1,2,3 과 A,B,C 도 같이 인쇄'],
        ['간단하게 인쇄', '그림·테두리 없이 <b>글자만</b> 빠르게'],
        ['메모 / 셀 오류', '메모 위치, 오류 표시를 <b>공백</b> 등으로 바꿔 인쇄'],
      ],
      cap: '<b>눈금선은 기본적으로 인쇄되지 않습니다</b> — 체크해야 나옵니다' },

    { type: 'svg', title: '반복할 행 — 2쪽에도 제목 줄이 나오게',
      svg: svg('0 0 470 230',
        label(112, 26, '1쪽', C.tx2, 12) +
        '<rect x="30" y="34" width="164" height="150" rx="6" fill="#141a33" stroke="' + C.line + '" stroke-width="1.5"/>' +
        '<rect x="38" y="42" width="148" height="22" fill="' + C.gold + '" opacity=".3" stroke="' + C.gold + '" stroke-width="1.5"/>' +
        label(112, 57, '이름 | 학년 | 점수', C.gold, 10) +
        label(112, 84, '홍길동  2  90', C.tx2, 10) + label(112, 104, '김한별  1  85', C.tx2, 10) +
        label(112, 124, '이보람  3  78', C.tx2, 10) + label(112, 144, '…', C.tx2, 10) +
        arrow(202, 108, 238, C.tx2) +
        label(320, 26, '2쪽', C.tx2, 12) +
        '<rect x="238" y="34" width="164" height="150" rx="6" fill="#141a33" stroke="' + C.line + '" stroke-width="1.5"/>' +
        '<rect x="246" y="42" width="148" height="22" fill="' + C.gold + '" opacity=".3" stroke="' + C.gold + '" stroke-width="1.5"/>' +
        label(320, 57, '이름 | 학년 | 점수', C.gold, 10) +
        label(320, 84, '박서준  2  88', C.tx2, 10) + label(320, 104, '정하늘  1  91', C.tx2, 10) +
        label(320, 124, '최민서  3  67', C.tx2, 10) + label(320, 144, '…', C.tx2, 10) +
        label(430, 57, '↖ 다시', C.gold, 10, 'start') +
        '<rect x="90" y="196" width="290" height="26" rx="6" fill="#12162b" stroke="' + C.gold + '" stroke-width="2"/>' +
        mono(235, 214, '반복할 행:  $1:$1', C.gold, 14)),
      cap: '[페이지 설정] → <b>[시트]</b> 탭 · 화면의 <b>틀 고정</b>과는 아무 상관이 없습니다' },

    { type: 'svg', title: '매크로 — 이름과 바로 가기 키 규칙',
      svg: svg('0 0 470 240',
        '<rect x="24" y="24" width="422" height="76" rx="10" fill="' + C.card + '" stroke="' + C.pri + '" stroke-width="2"/>' +
        label(235, 44, '매크로 기록', C.tx, 12) +
        label(60, 68, '매크로 이름', C.tx2, 11, 'start') +
        '<rect x="150" y="56" width="130" height="20" rx="4" fill="#141a33" stroke="' + C.ok + '" stroke-width="1.5"/>' +
        mono(160, 70, '성적정리', C.ok, 11, 'start') +
        label(300, 68, '바로 가기 키  Ctrl +', C.tx2, 11, 'start') +
        '<rect x="410" y="56" width="26" height="20" rx="4" fill="#141a33" stroke="' + C.gold + '" stroke-width="1.5"/>' +
        mono(423, 70, 'a', C.gold, 11) +
        label(235, 92, '소문자 a → Ctrl+A · <tspan fill="' + C.gold + '">대문자 A → Ctrl+Shift+A</tspan>', C.tx2, 11) +
        '<line x1="20" y1="112" x2="450" y2="112" stroke="' + C.line + '" stroke-width="1.5"/>' +
        box(24, 126, 200, 38, '○ 되는 이름', C.ok, C.card, 12.5) +
        label(124, 184, '성적정리 · 표_서식 · Macro1', C.tx2, 11) +
        box(246, 126, 200, 38, '× 안 되는 이름', C.no, C.card, 12.5) +
        label(346, 184, '1학기 (숫자 시작) · 성적 정리 (공백)', C.tx2, 10.5) +
        label(346, 200, '/ ? * [ ] 같은 기호', C.tx2, 10.5) +
        label(235, 226, '기록 중 셀을 옮기는 방식은 <tspan fill="' + C.gold + '">상대 참조로 기록</tspan> 단추로 바꾼다', C.tx, 12.5)),
      cap: '매크로 바로 가기 키는 <b>엑셀 기본 단축키보다 우선</b>합니다 (Ctrl+C를 매크로에 주면 복사가 안 됨)' },
  ]);
})();
