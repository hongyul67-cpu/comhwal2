/* ══════════════════════════════════════════════════════════════
   컴활 2급 필기 개념게임 — 그림 모음 (보조02 · 2026-10-01)
   공용 그리기 도우미 links/fig.js 를 쓴다. index.html 이 lesson.js 보다 먼저 부른다.

   한 칸의 모양
     키: { cap:'캡션 한 줄', topics:['과목/단원id'], cards:['카드 앞면 글자'…], draw:function(){ … } }
       topics — data/*.js 의 단원 키(예 'comp/win'). 단원 화면의 「그림으로 먼저 보기」에 나온다
       cards  — 개념 카드 앞면 글자(t)와 **똑같이**. 카드를 뒤집으면 카드 아래에 이 그림이 나온다
       slide  — 같은 주제의 옛 슬라이드 도해 키(data/lesson*.js). 슬라이드는 이 그림으로 바꿔 보여 준다
     순서 = 화면에 나오는 순서.

   그림 내용은 개념 카드(data/*.js) 본문과 옛 도해(data/lesson*.js)를 옮긴 것이고,
   교재 OCR(_작업/T6추출/)로 용어를 맞췄다. 카드에 없는 수치는 넣지 않았다(예시 숫자는 캡션에 「예」).
   ══════════════════════════════════════════════════════════════ */
var FIGS = (function () {
  var F = window.FIG;
  if (!F) return {};
  var C = F.C;
  var t = F.t, box = F.box, line = F.line, arrow = F.arrow, callout = F.callout,
    poly = F.poly, path = F.path, circle = F.circle, num = F.num;
  var R = {};

  /* ── 작은 도우미 ─────────────────────────── */
  /* 글자 폭 어림 — 한글은 글자 크기만큼, 영문·숫자는 0.58배 */
  function tw(s, size) {
    size = size || 16; var w = 0;
    String(s).split('').forEach(function (ch) { w += ch.charCodeAt(0) > 255 ? size : size * 0.6; });
    return w;
  }
  /* 키보드 키 모양 */
  function key(x, y, s, o) {
    o = o || {};
    var sz = o.size || 14, w = o.w || Math.max(32, tw(s, sz) + 14);
    return box(x, y, w, o.h || 26, { fill: o.fill || '#fff', c: o.c || C.ink, w: 1.3, r: 5, label: s, size: sz, lc: o.lc || C.ink });
  }
  function keyW(s, size) { return Math.max(32, tw(s, size || 14) + 14); }
  /* 키 조합 — [Ctrl] + [Enter] (a:'m' 이면 x 가 가운데) */
  function combo(x, y, keys, o) {
    o = o || {};
    var total = 0;
    keys.forEach(function (k, i) { total += keyW(k) + (i ? 20 : 0); });
    var cx = o.a === 'm' ? x - total / 2 : x, s = '';
    keys.forEach(function (k, i) {
      if (i) { s += t(cx + 10, y + 13, '+', { a: 'm', size: 15, b: 1 }); cx += 20; }
      s += key(cx, y, k, { fill: o.fill || C.yellowL }); cx += keyW(k);
    });
    return s;
  }
  /* 창 틀 — 제목 표시줄 + ─ □ ✕ */
  function win(x, y, w, h, title, o) {
    o = o || {};
    var s = box(x, y, w, h, { fill: o.fill || '#fff', c: o.c || C.ink, w: 1.5, r: 6 });
    s += path('M' + (x + 0.75) + ',' + (y + 22) + ' V' + (y + 6) + ' Q' + (x + 0.75) + ',' + (y + 0.75) + ' ' + (x + 6) + ',' + (y + 0.75) +
      ' H' + (x + w - 6) + ' Q' + (x + w - 0.75) + ',' + (y + 0.75) + ' ' + (x + w - 0.75) + ',' + (y + 6) + ' V' + (y + 22) + ' Z',
      { fill: o.bar || C.blueL, c: 'none', w: 0 });
    s += line(x, y + 22, x + w, y + 22, { c: o.c || C.ink, w: 1 });
    if (title) s += t(x + 8, y + 11.5, title, { size: 13, b: 1, halo: false });
    if (o.btn !== false) {
      var bx = x + w - 14;
      s += t(bx, y + 11.5, '✕', { size: 12, a: 'm', halo: false, c: C.sub }) +
        box(bx - 22, y + 6, 10, 10, { fill: 'none', c: C.sub, w: 1, r: 1 }) +
        line(bx - 42, y + 12, bx - 34, y + 12, { c: C.sub, w: 1.4 });
    }
    return s;
  }
  /* 문서 아이콘(오른쪽 위 접힌 귀) */
  function doc(x, y, o) {
    o = o || {};
    var w = o.w || 30, h = o.h || 38, k = 9;
    return poly([[x, y], [x + w - k, y], [x + w, y + k], [x + w, y + h], [x, y + h]], { close: 1, fill: o.fill || '#fff', c: o.c || C.ink, w: 1.4 }) +
      poly([[x + w - k, y], [x + w - k, y + k], [x + w, y + k]], { c: o.c || C.ink, w: 1.2 }) +
      (o.lines === false ? '' : line(x + 6, y + 16, x + w - 6, y + 16, { c: C.grayM, w: 1.4 }) +
        line(x + 6, y + 23, x + w - 6, y + 23, { c: C.grayM, w: 1.4 }) + line(x + 6, y + 30, x + w - 12, y + 30, { c: C.grayM, w: 1.4 }));
  }
  /* 폴더 아이콘 */
  function folder(x, y, o) {
    o = o || {};
    var w = o.w || 40, h = o.h || 30;
    return path('M' + x + ',' + (y + 5) + ' V' + (y + h) + ' H' + (x + w) + ' V' + (y + 8) + ' H' + (x + w * 0.45) + ' L' + (x + w * 0.37) + ',' + y + ' H' + x + ' Z',
      { fill: o.fill || C.orangeL, c: o.c || C.orange, w: 1.4 });
  }
  /* 모니터 */
  function monitor(x, y, w, h, o) {
    o = o || {};
    return box(x, y, w, h, { fill: o.fill || C.grayL, c: C.ink, w: 1.6, r: 5 }) +
      line(x + w / 2, y + h, x + w / 2, y + h + 10, { w: 2 }) + line(x + w / 2 - 16, y + h + 10, x + w / 2 + 16, y + h + 10, { w: 2 });
  }
  /* 본체(타워) */
  function tower(x, y, o) {
    o = o || {};
    var w = o.w || 44, h = o.h || 74;
    return box(x, y, w, h, { fill: o.fill || C.grayL, c: C.ink, w: 1.6, r: 5 }) +
      line(x + 8, y + 14, x + w - 8, y + 14, { c: C.sub, w: 1.4 }) + line(x + 8, y + 22, x + w - 8, y + 22, { c: C.sub, w: 1.4 }) +
      circle(x + w / 2, y + h - 16, 5, { fill: o.led || '#fff', c: C.ink, w: 1.2 });
  }
  /* 서버(서랍 셋) */
  function server(x, y, o) {
    o = o || {};
    var w = o.w || 46, s = '';
    for (var i = 0; i < 3; i++) s += box(x, y + i * 17, w, 15, { fill: o.fill || C.grayL, c: C.ink, w: 1.3, r: 3 }) + F.circle(x + w - 8, y + i * 17 + 7.5, 2.2, { fill: C.green, c: C.green, w: 0.5 });
    return s;
  }
  /* 사람 */
  function person(x, y, o) {
    o = o || {};
    var c = o.c || C.ink, f = o.fill || C.grayL;
    return circle(x, y, 9, { fill: f, c: c, w: 1.5 }) + path('M' + (x - 15) + ',' + (y + 32) + ' Q' + (x - 15) + ',' + (y + 12) + ' ' + x + ',' + (y + 12) + ' Q' + (x + 15) + ',' + (y + 12) + ' ' + (x + 15) + ',' + (y + 32) + ' Z', { fill: f, c: c, w: 1.5 });
  }
  /* 마우스 포인터 */
  function pointer(x, y, o) {
    o = o || {};
    var s = o.s || 1;
    return poly([[x, y], [x, y + 18 * s], [x + 4.5 * s, y + 14 * s], [x + 8 * s, y + 21 * s], [x + 11 * s, y + 19.5 * s], [x + 7.5 * s, y + 13 * s], [x + 13 * s, y + 13 * s]],
      { close: 1, fill: o.fill || '#fff', c: C.ink, w: 1.3 });
  }
  /* 프린터 */
  function printer(x, y, o) {
    o = o || {};
    return box(x + 8, y, 34, 14, { fill: '#fff', c: C.ink, w: 1.3, r: 2 }) + box(x, y + 12, 50, 24, { fill: o.fill || C.grayL, c: C.ink, w: 1.5, r: 4 }) +
      box(x + 8, y + 30, 34, 16, { fill: '#fff', c: C.ink, w: 1.3, r: 2 }) + line(x + 13, y + 37, x + 36, y + 37, { c: C.grayM, w: 1.3 });
  }
  /* 하드디스크(원통) */
  function disk(x, y, o) {
    o = o || {};
    var w = o.w || 50, h = o.h || 36, f = o.fill || C.grayL, c = o.c || C.ink;
    return path('M' + x + ',' + (y + 7) + ' V' + (y + h - 7) + ' A' + (w / 2) + ',7 0 0 0 ' + (x + w) + ',' + (y + h - 7) + ' V' + (y + 7), { fill: f, c: c, w: 1.5 }) +
      '<ellipse cx="' + (x + w / 2) + '" cy="' + (y + 7) + '" rx="' + (w / 2) + '" ry="7" fill="' + f + '" stroke="' + c + '" stroke-width="1.5"/>';
  }
  /* 칸 나누기 점선 */
  function divider(x, y1, y2) { return line(x, y1, x, y2, { c: C.grayM, w: 1.4, dash: '6 5' }); }
  function hdiv(y, x1, x2) { return line(x1 || 16, y, x2 || 464, y, { c: C.grayM, w: 1.4, dash: '6 5' }); }
  /* 이름표 알약 */
  function pill(x, y, s, o) {
    o = o || {};
    var sz = o.size || 14, w = o.w || tw(s, sz) + 18;
    var x0 = o.a === 'm' ? x - w / 2 : x;
    return box(x0, y, w, o.h || 24, { fill: o.fill || C.blueL, c: o.c || C.blue, w: 1.2, r: (o.h || 24) / 2, label: s, size: sz, lc: o.lc || C.ink, b: o.b });
  }
  /* 엑셀 시트 — 머리글(열 문자·행 번호)까지
     o: {cols:['A','B'], cw:[60,70], rh:24, rows:[['a','b'],…], r0:1, hw:26, fill:{'r,c':색}, bold:{'r,c':1}, align:{c:'e'|'m'|'s'}, hdr:true, sel:{r,c} } */
  function sheet(x, y, o) {
    var cols = o.cols, cw = o.cw, rh = o.rh || 24, rows = o.rows || [], hw = o.hw == null ? 26 : o.hw, r0 = o.r0 || 1;
    var W = cw.reduce(function (a, b) { return a + b; }, 0), s = '', fs = o.size || 14, hdr = o.hdr !== false;
    var top = y + (hdr ? rh : 0), left = x + (hdr ? hw : 0);
    if (hdr) {
      s += box(x, y, hw + W, rh, { fill: C.grayL, c: 'none', w: 0, r: 0 }) + box(x, y, hw, rh + rows.length * rh, { fill: C.grayL, c: 'none', w: 0, r: 0 });
      var cx = left;
      cols.forEach(function (c, i) { s += t(cx + cw[i] / 2, y + rh / 2, c, { size: 13, a: 'm', c: C.sub, halo: false }); cx += cw[i]; });
      rows.forEach(function (r, i) { s += t(x + hw / 2, top + i * rh + rh / 2, String(r0 + i), { size: 13, a: 'm', c: C.sub, halo: false }); });
    }
    /* 칠한 칸 */
    rows.forEach(function (r, ri) {
      var cx = left;
      r.forEach(function (v, ci) {
        var k = ri + ',' + ci;
        if (o.fill && o.fill[k]) s += box(cx, top + ri * rh, cw[ci], rh, { fill: o.fill[k], c: 'none', w: 0, r: 0 });
        cx += cw[ci];
      });
    });
    /* 격자 */
    var gx = left;
    for (var i = 0; i <= cols.length; i++) { s += line(gx, hdr ? y : top, gx, top + rows.length * rh, { c: C.grayM, w: 1 }); if (i < cols.length) gx += cw[i]; }
    for (var j = 0; j <= rows.length; j++) s += line(hdr ? x : left, top + j * rh, left + W, top + j * rh, { c: C.grayM, w: 1 });
    if (hdr) s += line(x, y, x, top + rows.length * rh, { c: C.grayM, w: 1 }) + line(x, y, left + W, y, { c: C.grayM, w: 1 });
    /* 글자 */
    rows.forEach(function (r, ri) {
      var cx = left;
      r.forEach(function (v, ci) {
        if (v !== '' && v != null) {
          var al = (o.align && o.align[ri + ',' + ci]) || (o.align && o.align[ci]) || (typeof v === 'number' || /^-?[\d,.]+%?$/.test(String(v)) ? 'e' : 's');
          var tx = al === 'e' ? cx + cw[ci] - 6 : (al === 'm' ? cx + cw[ci] / 2 : cx + 6);
          var k = ri + ',' + ci;
          s += t(tx, top + ri * rh + rh / 2 + 0.5, String(v), { size: fs, a: al, halo: false, b: o.bold && o.bold[k], c: (o.color && o.color[k]) || C.ink, ans: o.ans && o.ans[k] });
        }
        cx += cw[ci];
      });
    });
    if (o.sel) {
      var sx = left; for (var q = 0; q < o.sel.c; q++) sx += cw[q];
      var sw = 0; for (var q2 = o.sel.c; q2 < o.sel.c + (o.sel.w || 1); q2++) sw += cw[q2];
      s += box(sx, top + o.sel.r * rh, sw, rh * (o.sel.h || 1), { fill: 'none', c: o.sel.color || C.green, w: 2.4, r: 0 });
    }
    return s;
  }
  /* 시트 칸의 가운데 좌표 */
  function cellXY(x, y, o, r, c) {
    var hw = o.hdr === false ? 0 : (o.hw == null ? 26 : o.hw), rh = o.rh || 24, cx = x + hw;
    for (var i = 0; i < c; i++) cx += o.cw[i];
    return [cx + o.cw[c] / 2, y + (o.hdr === false ? 0 : rh) + r * rh + rh / 2];
  }

  /* ════════════ 1과목 ① 한글 Windows 기본 ════════════ */
  R.gui = { topics: ['comp/win'], cards: ['GUI(그래픽 사용자 인터페이스)'], slide: ['comp/win#0'],
    cap: 'GUI — 명령어를 외워 치는 대신, 아이콘·메뉴를 마우스로 골라 조작한다',
    draw: function () {
      var s = t(118, 26, '명령어 방식', { a: 'm', b: 1, size: 17, c: C.sub }) + t(358, 26, 'GUI 방식', { a: 'm', b: 1, size: 17, c: C.blue }) + divider(240, 14, 222);
      s += box(22, 46, 194, 118, { fill: '#1f2937', c: C.ink, r: 6 });
      s += t(34, 70, 'C:\\> dir', { size: 14, c: '#e5e7eb', halo: false }) +
        t(34, 94, 'C:\\> copy a.txt d:\\', { size: 14, c: '#e5e7eb', halo: false }) +
        t(34, 118, 'C:\\> _', { size: 14, c: '#86efac', halo: false });
      s += t(118, 188, '명령어를 외워서 친다', { a: 'm', size: 15 });
      s += win(262, 46, 194, 118, '파일 탐색기');
      s += folder(270, 82) + t(290, 128, '작업일지', { a: 'm', size: 13, halo: false });
      s += doc(338, 78) + t(353, 128, '생산일보', { a: 'm', size: 13, halo: false });
      s += box(394, 92, 56, 56, { fill: '#fff', c: C.sub, w: 1, r: 3 }) +
        t(402, 104, '열기', { size: 13, halo: false }) + t(402, 121, '복사', { size: 13, halo: false }) + t(402, 138, '삭제', { size: 13, halo: false });
      s += pointer(378, 96);
      s += t(358, 188, '보고 눌러서 쓴다', { a: 'm', size: 15, b: 1, c: C.blue });
      s += t(358, 210, '아이콘 · 메뉴 · 마우스', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 228, s);
    } };

  R.multitask = { topics: ['comp/win'], cards: ['선점형 멀티태스킹'],
    cap: '선점형 멀티태스킹 — 운영체제가 CPU 시간을 조각내 나눠 준다. 한 프로그램이 멈춰도 나머지는 계속 돈다',
    draw: function () {
      var s = t(20, 26, '운영체제가 CPU 시간을 차례로 나눠 준다', { size: 16, b: 1 });
      var names = ['A 한글', 'B 엑셀', 'C 크롬'], cols = [C.blue, C.green, C.orange], fills = [C.blueL, C.greenL, C.orangeL];
      var seq = [0, 1, 2, 0, 1, 2, 0, 1, 0, 1, 0, 1], x0 = 104, sw = 29, crash = 8;
      for (var r = 0; r < 3; r++) {
        var y = 52 + r * 40;
        s += t(92, y + 13, names[r], { a: 'e', size: 15, b: 1, c: cols[r] });
        s += line(x0, y + 26, x0 + sw * seq.length, y + 26, { c: C.grayM, w: 1 });
        seq.forEach(function (o, i) { if (o === r) s += box(x0 + i * sw + 1, y, sw - 2, 24, { fill: fills[r], c: cols[r], w: 1.2, r: 3 }); });
      }
      /* C 가 멈춤 */
      s += box(x0 + crash * sw, 132, sw * (seq.length - crash), 24, { fill: C.redL, c: C.red, w: 1.4, r: 3, dash: '5 3' });
      s += t(x0 + crash * sw + sw * (seq.length - crash) / 2, 144, '응답 없음', { a: 'm', size: 14, b: 1, c: C.red, halo: false });
      s += arrow(x0, 176, x0 + sw * seq.length, 176, { c: C.sub, w: 1.4, head: 9 }) + t(x0 + sw * seq.length, 194, '시간', { a: 'e', size: 13, c: C.sub });
      s += t(240, 214, 'C가 멈춰도 운영체제가 CPU를 되찾아 A·B는 계속 돈다', { a: 'm', size: 14, b: 1, c: C.green });
      return F.svg(480, 232, s);
    } };

  R.pnphot = { topics: ['comp/win'], cards: ['플러그 앤 플레이(PnP)', '핫 스와핑(Hot Swap)'],
    cap: 'PnP 는 «꽂으면 알아서 설치», 핫 스와핑은 «전원을 켠 채 꽂고 뺀다»',
    draw: function () {
      var s = t(120, 26, '플러그 앤 플레이(PnP)', { a: 'm', b: 1, size: 16, c: C.blue }) + t(360, 26, '핫 스와핑', { a: 'm', b: 1, size: 16, c: C.orange }) + divider(240, 14, 226);
      /* 왼쪽 — 자동 인식 */
      s += tower(34, 92) + box(98, 118, 30, 16, { fill: C.blueL, c: C.blue, w: 1.4, r: 3 }) + line(128, 126, 140, 126, { c: C.blue, w: 2 });
      s += arrow(96, 126, 80, 126, { c: C.blue, w: 1.6, head: 8 });
      s += box(96, 52, 130, 50, { fill: '#fff', c: C.blue, w: 1.4, r: 8 }) + poly([[106, 102], [96, 112], [118, 102]], { close: 1, fill: '#fff', c: C.blue, w: 1.4 }) +
        line(107, 101.5, 117, 101.5, { c: '#fff', w: 2.4 }) +
        t(161, 68, '새 장치 발견', { a: 'm', size: 13, halo: false }) + t(161, 88, '드라이버 설치 ✔', { a: 'm', size: 13, b: 1, c: C.green, halo: false });
      s += t(120, 190, '꽂으면 운영체제가 알아서', { a: 'm', size: 14 }) + t(120, 210, '하드웨어·BIOS 도 지원해야', { a: 'm', size: 13, c: C.sub });
      /* 오른쪽 — 켠 채로 */
      s += tower(290, 92, { led: C.green }) + t(312, 180, '전원 켜짐', { a: 'm', size: 13, b: 1, c: C.green });
      s += box(372, 118, 34, 16, { fill: C.orangeL, c: C.orange, w: 1.4, r: 3 }) + line(406, 126, 418, 126, { c: C.orange, w: 2 });
      s += arrow(342, 126, 366, 126, { c: C.orange, w: 1.6, head: 8, both: true });
      s += t(389, 100, '꽂기 ↔ 빼기', { a: 'm', size: 14, c: C.orange, b: 1 });
      s += t(360, 204, '켠 채로 꽂고 뺀다 · USB · IEEE 1394', { a: 'm', size: 13 });
      return F.svg(480, 228, s);
    } };

  R.aero3 = { topics: ['comp/win'], cards: ['에어로 피크(Aero Peek)', '에어로 스냅(Aero Snap)', '에어로 셰이크(Aero Shake)'],
    cap: '에어로 3형제 — 올려 두면 피크, 끌면 스냅, 흔들면 셰이크',
    draw: function () {
      var s = '', X = [14, 168, 322], W = 144, H = 96, Y = 40;
      var nm = ['피크', '스냅', '셰이크'], act = ['올려 두기', '끌기', '흔들기'], res = ['창이 비쳐 바탕 화면이 보임', '최대화 · 화면 절반', '나머지 창 모두 최소화'];
      for (var i = 0; i < 3; i++) {
        s += box(X[i], Y, W, H, { fill: '#fff', c: C.ink, w: 1.6, r: 4 }) + box(X[i], Y + H - 12, W, 12, { fill: C.grayM, c: C.ink, w: 1.2, r: 0 });
        s += t(X[i] + W / 2, 24, nm[i], { a: 'm', size: 17, b: 1, c: C.blue });
        s += pill(X[i] + W / 2, Y + H + 14, act[i], { a: 'm', size: 14, b: 1 });
        s += t(X[i] + W / 2, Y + H + 58, res[i], { a: 'm', size: 13, c: C.sub });
      }
      /* 피크 — 비친 창, 오른쪽 끝 단추 */
      s += box(26, 50, 80, 50, { fill: 'none', c: C.line, w: 1.2, r: 3, dash: '4 3' }) + box(58, 62, 80, 42, { fill: 'none', c: C.line, w: 1.2, r: 3, dash: '4 3' });
      s += box(X[0] + W - 6, Y + H - 12, 6, 12, { fill: C.blue, c: C.blue, w: 1, r: 0 }) + pointer(X[0] + W - 6, Y + H - 8, { s: 0.9 });
      /* 스냅 — 왼쪽 절반 */
      s += box(X[1] + 2, Y + 2, W / 2 - 2, H - 16, { fill: C.blueL, c: C.blue, w: 1.4, r: 2 });
      s += arrow(X[1] + 116, Y + 40, X[1] + 82, Y + 40, { c: C.blue, w: 1.8, head: 9 });
      /* 셰이크 — 흔드는 창 + 작업 표시줄로 내려간 창 */
      var sx = X[2] + 42, sy = Y + 22;
      s += win(sx, sy, 60, 44, '', { btn: false });
      s += path('M' + (sx - 14) + ',' + (sy + 6) + ' l6,6 l-6,6 l6,6', { c: C.orange, w: 1.8 }) + path('M' + (sx + 74) + ',' + (sy + 6) + ' l-6,6 l6,6 l-6,6', { c: C.orange, w: 1.8 });
      s += box(X[2] + 10, Y + H - 10, 16, 8, { fill: C.blueL, c: C.blue, w: 1, r: 1 }) + box(X[2] + 30, Y + H - 10, 16, 8, { fill: C.blueL, c: C.blue, w: 1, r: 1 });
      return F.svg(480, 222, s);
    } };

  R.shortcut = { topics: ['comp/win'], cards: ['바로 가기 아이콘'], slide: ['comp/win#1'],
    cap: '바로 가기(.LNK)는 원본의 위치만 가리킨다 — 지워도 원본은 그대로, 여러 개 만들 수 있다',
    draw: function () {
      var s = '';
      /* 바로 가기 셋 */
      var ys = [36, 100, 164];
      ys.forEach(function (y, i) {
        s += doc(40, y, { fill: '#fff' }) + box(37, y + 24, 16, 16, { fill: '#fff', c: C.blue, w: 1.4, r: 2 }) +
          path('M41,' + (y + 36) + ' Q41,' + (y + 29) + ' 48,' + (y + 29), { c: C.blue, w: 1.6 }) + poly([[46, y + 26], [50, y + 29], [46, y + 32]], { close: 1, fill: C.blue, c: C.blue, w: 1 });
        s += arrow(78, y + 19, 292, 110, { c: C.blue, w: 1.4, dash: '6 4', head: 10 });
      });
      s += callout(45, 204, 96, 214, '왼쪽 아래 화살표', { c: C.blue, size: 14 });
      s += t(92, 18, '바로 가기 (.LNK)', { a: 'm', size: 15, b: 1, c: C.blue });
      /* 원본 */
      s += folder(300, 72, { w: 110, h: 84 }) + doc(338, 94, { w: 34, h: 44 });
      s += t(355, 58, '원본 파일', { a: 'm', size: 16, b: 1 });
      s += t(355, 176, '위치(경로)만 가리킨다', { a: 'm', size: 14, c: C.sub });
      s += box(236, 194, 232, 32, { fill: C.greenL, c: C.green, w: 1.2, r: 8, label: '바로 가기를 지워도 원본은 남는다', size: 14 });
      return F.svg(480, 240, s);
    } };

  R.taskbar = { topics: ['comp/win'], cards: ['작업 표시줄', '알림 영역(시스템 트레이)', '점프 목록(Jump List)'], slide: ['comp/win#4'],
    cap: '작업 표시줄 — 왼쪽 시작 단추부터 오른쪽 끝 [바탕 화면 보기]까지. 앱 아이콘을 오른쪽 단추로 누르면 점프 목록',
    draw: function () {
      var s = '', by = 150;
      /* 점프 목록 */
      s += box(110, 22, 182, 98, { fill: '#fff', c: C.blue, w: 1.6, r: 6 });
      s += t(122, 40, '점프 목록', { size: 14, b: 1, c: C.blue, halo: false }) + t(282, 40, '최근 파일', { a: 'e', size: 13, c: C.sub, halo: false });
      s += t(122, 64, '생산일보.xlsx', { size: 14, halo: false }) + t(122, 86, '설비점검표.xlsx', { size: 14, halo: false }) + t(122, 108, '📌 자재입출고.xlsx', { size: 14, halo: false });
      s += arrow(180, by - 2, 180, 124, { c: C.blue, w: 1.4, head: 8 }) + t(190, 136, '오른쪽 클릭', { size: 13, c: C.blue, b: 1 });
      /* 작업 표시줄 */
      s += box(14, by, 452, 40, { fill: C.grayL, c: C.ink, w: 1.6, r: 4 });
      s += box(22, by + 6, 28, 28, { fill: C.blue, c: C.blue, w: 1, r: 4 });
      s += line(36, by + 10, 36, by + 30, { c: '#fff', w: 2 }) + line(26, by + 20, 46, by + 20, { c: '#fff', w: 2 });
      s += box(58, by + 8, 88, 24, { fill: '#fff', c: C.grayM, w: 1, r: 12 }) + t(70, by + 20, '검색', { size: 13, c: C.sub, halo: false });
      [0, 1, 2].forEach(function (i) {
        var ax = 164 + i * 36;
        s += box(ax, by + 6, 28, 24, { fill: [C.greenL, C.blueL, C.orangeL][i], c: [C.green, C.blue, C.orange][i], w: 1.2, r: 4 }) +
          line(ax + 6, by + 35, ax + 22, by + 35, { c: C.blue, w: 3 });
      });
      s += box(334, by + 6, 104, 28, { fill: '#fff', c: C.grayM, w: 1, r: 4 }) + t(386, by + 20, '🔊 📶 14:30', { a: 'm', size: 13, halo: false });
      s += box(452, by + 3, 8, 34, { fill: C.orangeL, c: C.orange, w: 1.2, r: 2 });
      /* 이름표 */
      s += callout(36, by + 40, 36, 218, '시작', { a: 'm', size: 14 });
      s += callout(200, by + 40, 200, 218, '실행 중인 앱', { a: 'm', size: 14 });
      s += callout(386, by + 40, 360, 218, '알림 영역', { a: 'm', size: 14 });
      s += callout(456, by + 40, 456, 206, '', { a: 'e', size: 14 }) + t(460, 234, '바탕 화면 보기', { a: 'e', size: 13, c: C.orange, b: 1 });
      s += box(318, 40, 150, 62, { fill: C.yellowL, c: C.grayM, w: 1, r: 6 }) +
        t(393, 60, '상·하·좌·우로 이동', { a: 'm', size: 13, halo: false }) + t(393, 84, '화면의 50%까지', { a: 'm', size: 13, halo: false });
      return F.svg(480, 250, s);
    } };

  R.vdesk = { topics: ['comp/win'], cards: ['가상 데스크톱'],
    cap: '가상 데스크톱 — [작업 보기]에서 바탕 화면을 더 만들어 하던 일을 나눠 둔다',
    draw: function () {
      var s = '';
      function screen(x, y, lbl, wins, sel) {
        var o = box(x, y, 130, 84, { fill: '#fff', c: sel ? C.blue : C.ink, w: sel ? 2.4 : 1.6, r: 4 });
        wins.forEach(function (w, i) { o += win(x + 10 + i * 36, y + 12 + i * 14, 72, 44, w, { btn: false, bar: [C.greenL, C.blueL][i] }); });
        return o + t(x + 65, y + 102, lbl, { a: 'm', size: 14, b: 1, c: sel ? C.blue : C.ink });
      }
      s += screen(24, 30, '바탕 화면 1', ['한글', '엑셀'], true);
      s += screen(174, 30, '바탕 화면 2', ['크롬'], false);
      s += box(324, 30, 130, 84, { fill: C.grayL, c: C.sub, w: 1.4, r: 4, dash: '6 4', label: '+ 새 데스크톱', size: 14, lc: C.sub });
      /* 작업 표시줄의 [작업 보기] */
      s += box(14, 160, 452, 36, { fill: C.grayL, c: C.ink, w: 1.4, r: 4 });
      s += box(20, 165, 26, 26, { fill: C.blue, c: C.blue, w: 1, r: 4 });
      s += box(56, 165, 26, 26, { fill: '#fff', c: C.orange, w: 2, r: 4 }) + box(61, 171, 7, 14, { fill: C.orangeL, c: C.orange, w: 1, r: 1 }) + box(71, 171, 7, 14, { fill: C.orangeL, c: C.orange, w: 1, r: 1 });
      s += callout(82, 178, 110, 214, '[작업 보기] 단추', { size: 14, c: C.orange, tc: C.orange, b: 1 });
      s += arrow(69, 160, 69, 142, { c: C.orange, w: 1.6, head: 8 });
      return F.svg(480, 232, s);
    } };

  R.clipboard = { topics: ['comp/win'], cards: ['클립보드(Clipboard)'],
    cap: '클립보드 — 복사·잘라낸 내용을 잠시 담는 메모리. 새로 복사하면 바뀌고, ⊞+V 로 기록을 본다',
    draw: function () {
      var s = '';
      s += win(14, 30, 120, 90, '문서 A', { btn: false }) + box(24, 66, 100, 22, { fill: C.blueL, c: C.blue, w: 1, r: 2 }) + t(74, 77, '설비 M-07', { a: 'm', size: 14, halo: false });
      s += win(346, 30, 120, 90, '문서 B', { btn: false }) + t(356, 77, '설비 M-07', { size: 14, halo: false, c: C.blue, b: 1 });
      s += box(182, 44, 116, 62, { fill: C.yellowL, c: C.orange, w: 1.8, r: 8 }) + t(240, 64, '클립보드', { a: 'm', size: 15, b: 1, halo: false }) + t(240, 86, '(메모리)', { a: 'm', size: 13, c: C.sub, halo: false });
      s += arrow(136, 75, 180, 75, { c: C.blue }) + t(158, 58, 'Ctrl+C', { a: 'm', size: 13, b: 1, c: C.blue });
      s += arrow(300, 75, 344, 75, { c: C.green }) + t(322, 58, 'Ctrl+V', { a: 'm', size: 13, b: 1, c: C.green });
      /* 기록 */
      s += t(240, 142, '⊞ + V  클립보드 기록', { a: 'm', size: 15, b: 1 });
      var items = ['설비 M-07', '점검 완료', '2026-10-01'];
      items.forEach(function (it, i) {
        s += box(150, 158 + i * 24, 180, 22, { fill: i === 0 ? C.orangeL : '#fff', c: C.grayM, w: 1, r: 4 }) + t(162, 169 + i * 24, it, { size: 13, halo: false });
      });
      s += t(340, 169, '← 가장 최근', { size: 13, c: C.orange });
      s += t(240, 244, '다시 시작하면 사라진다', { a: 'm', size: 13, c: C.red });
      return F.svg(480, 258, s);
    } };


  /* ════════════ 1과목 ② 파일과 폴더 관리 ════════════ */
  R.explorer = { topics: ['comp/file'], cards: ['파일 탐색기', '폴더 확장/축소 키'], slide: ['comp/file#3'],
    cap: '파일 탐색기 — 왼쪽 탐색 창은 폴더 나무, 오른쪽은 그 폴더의 파일 목록. → 펼치기 · ← 접기 · * 모두 펼치기',
    draw: function () {
      var s = win(14, 14, 452, 170, '파일 탐색기');
      s += line(196, 36, 196, 184, { c: C.grayM, w: 1.4 });
      var tree = [['▾ 내 PC', 0], ['▾ 로컬 디스크 (C:)', 1], ['▾ 생산관리', 2], ['▸ 1월', 3], ['▸ 2월', 3], ['▸ 로컬 디스크 (D:)', 1]];
      tree.forEach(function (r, i) {
        var y = 52 + i * 21, sel = i === 2;
        if (sel) s += box(20, y - 10, 172, 20, { fill: C.blueL, c: 'none', w: 0, r: 3 });
        s += t(26 + r[1] * 16, y, r[0], { size: 14, halo: false, b: sel });
      });
      var files = ['생산일보.xlsx', '설비점검표.hwp', '자재입출고.xlsx'];
      files.forEach(function (f, i) { s += doc(214, 46 + i * 44, { w: 22, h: 28, lines: false }) + t(246, 60 + i * 44, f, { size: 14, halo: false }); });
      s += t(104, 202, '탐색 창(왼쪽)', { a: 'm', size: 14, b: 1, c: C.blue }) + t(330, 202, '파일 목록 창(오른쪽)', { a: 'm', size: 14, b: 1, c: C.blue });
      var kx = 24, ky = 222;
      [['→', '하위 폴더 펼치기'], ['←', '접기'], ['*', '모두 펼치기(숫자 키패드)']].forEach(function (k) {
        s += key(kx, ky, k[0], { w: 30, fill: C.yellowL }) + t(kx + 36, ky + 13, k[1], { size: 14 });
        kx += 36 + tw(k[1], 14) + 22;
      });
      return F.svg(480, 262, s);
    } };

  R.select = { topics: ['comp/file'], cards: ['연속 선택 / 비연속 선택'],
    cap: '이어진 것은 Shift+클릭(처음과 끝만 누름), 떨어진 것은 Ctrl+클릭(하나씩 누름). 전체 선택은 Ctrl+A',
    draw: function () {
      var s = t(120, 24, '연속 선택', { a: 'm', size: 17, b: 1, c: C.blue }) + t(360, 24, '비연속 선택', { a: 'm', size: 17, b: 1, c: C.orange }) + divider(240, 14, 232);
      var names = ['1월.xlsx', '2월.xlsx', '3월.xlsx', '4월.xlsx', '5월.xlsx'];
      function list(x, pick, c, fill) {
        var o = '';
        names.forEach(function (n, i) {
          var y = 44 + i * 30, on = pick.indexOf(i) >= 0;
          o += box(x, y, 130, 26, { fill: on ? fill : '#fff', c: on ? c : C.grayM, w: on ? 1.6 : 1, r: 4 });
          o += doc(x + 8, y + 4, { w: 14, h: 18, lines: false }) + t(x + 30, y + 13, n, { size: 14, halo: false });
        });
        return o;
      }
      s += list(22, [1, 2, 3], C.blue, C.blueL);
      s += t(160, 57 + 30, '① 클릭', { size: 14, b: 1, c: C.blue }) + t(160, 57 + 90, '② Shift+클릭', { size: 14, b: 1, c: C.blue });
      s += path('M156,' + (57 + 30) + ' C148,' + (57 + 50) + ' 148,' + (57 + 70) + ' 156,' + (57 + 90), { c: C.blue, w: 1.4, dash: '4 3' });
      s += list(262, [0, 2, 4], C.orange, C.orangeL);
      [0, 2, 4].forEach(function (i) { s += t(400, 57 + i * 30, 'Ctrl+클릭', { size: 14, b: 1, c: C.orange }); });
      s += t(120, 214, '처음과 끝 사이가 모두', { a: 'm', size: 14 }) + t(360, 214, '누른 것만 하나씩', { a: 'm', size: 14 });
      s += t(240, 244, '전체 선택  Ctrl + A', { a: 'm', size: 14, b: 1, c: C.sub });
      return F.svg(480, 260, s);
    } };

  R.drag = { topics: ['comp/file'], cards: ['같은 드라이브 드래그', '다른 드라이브 드래그'], slide: ['comp/file#0'],
    cap: '끌어다 놓기 — 같은 드라이브는 이동(Ctrl 누르면 복사), 다른 드라이브는 복사(Shift 누르면 이동)',
    draw: function () {
      var s = '';
      function row(y, title, a, b, move, res, alt, c, fill) {
        var o = t(20, y, title, { size: 15, b: 1 });
        o += box(20, y + 16, 92, 64, { fill: C.grayL, c: C.ink, w: 1.4, r: 6 }) + t(66, y + 30, a, { a: 'm', size: 14, b: 1, halo: false });
        o += box(206, y + 16, 92, 64, { fill: C.grayL, c: C.ink, w: 1.4, r: 6 }) + t(252, y + 30, b, { a: 'm', size: 14, b: 1, halo: false });
        o += doc(52, y + 42, { w: 22, h: 28, lines: false, c: move ? C.line : C.ink, fill: move ? C.grayL : '#fff' });
        if (move) o += line(48, y + 40, 80, y + 72, { c: C.red, w: 1.4 });
        o += doc(238, y + 42, { w: 22, h: 28, lines: false, fill: fill, c: c });
        o += arrow(116, y + 56, 202, y + 56, { c: c, w: 2 });
        o += pill(314, y + 20, res, { size: 15, b: 1, fill: fill, c: c });
        o += t(316, y + 64, alt, { size: 14, c: C.sub });
        return o;
      }
      s += row(24, '같은 드라이브 (C: → C:)', 'C: 폴더A', 'C: 폴더B', true, '기본 = 이동', 'Ctrl 누르고 끌면 → 복사', C.blue, C.blueL);
      s += hdiv(122);
      s += row(146, '다른 드라이브 (C: → D:)', 'C:', 'D: (USB)', false, '기본 = 복사', 'Shift 누르고 끌면 → 이동', C.green, C.greenL);
      return F.svg(480, 244, s);
    } };

  function trash(x, y, o) {
    o = o || {};
    var c = o.c || C.ink, f = o.fill || C.grayL;
    return box(x - 4, y, 44, 7, { fill: f, c: c, w: 1.4, r: 2 }) + box(x + 12, y - 5, 12, 5, { fill: f, c: c, w: 1.2, r: 1 }) +
      poly([[x, y + 9], [x + 36, y + 9], [x + 32, y + 50], [x + 4, y + 50]], { close: 1, fill: f, c: c, w: 1.5 }) +
      line(x + 12, y + 16, x + 13, y + 43, { c: c, w: 1.2 }) + line(x + 24, y + 16, x + 23, y + 43, { c: c, w: 1.2 });
  }
  R.recycle = { topics: ['comp/file'], cards: ['휴지통', '휴지통에 가지 않는 삭제'], slide: ['comp/file#1'],
    cap: 'Delete 로 지우면 휴지통에 잠시 보관(복원 가능). 휴지통을 거치지 않는 네 가지는 복원할 수 없다',
    draw: function () {
      var s = '';
      s += doc(20, 40) + t(35, 96, '하드디스크', { a: 'm', size: 13, c: C.sub });
      s += arrow(58, 58, 138, 58, { c: C.blue }) + key(76, 30, 'Delete', { size: 13 });
      s += trash(150, 36, { fill: C.blueL, c: C.blue }) + t(168, 104, '휴지통', { a: 'm', size: 15, b: 1, c: C.blue });
      s += F.route([[196, 44], [230, 44], [230, 20], [70, 20], [58, 32]], { c: C.green, w: 1.6, head: 9 });
      s += t(236, 30, '복원', { size: 14, b: 1, c: C.green });
      s += t(212, 70, '안에서는 실행 ·', { size: 13, c: C.sub }) + t(212, 88, '이름 바꾸기 안 됨', { size: 13, c: C.sub });
      s += hdiv(122);
      s += t(20, 144, '휴지통을 거치지 않고 바로 지워지는 경우', { size: 15, b: 1, c: C.red });
      var cases = ['Shift + Delete', 'USB · 네트워크 드라이브의 파일', '휴지통 최대 크기보다 큰 파일', '[삭제 확인 없이 바로 제거] 설정'];
      cases.forEach(function (c, i) { s += num(32, 172 + i * 26, i + 1, { c: C.red, r: 10, size: 12 }) + t(50, 172 + i * 26, c, { size: 14 }); });
      s += box(346, 170, 112, 58, { fill: C.redL, c: C.red, w: 1.4, r: 8 }) + t(402, 190, '복원 불가', { a: 'm', size: 15, b: 1, c: C.red, halo: false }) +
        t(402, 212, '바로 삭제', { a: 'm', size: 13, c: C.red, halo: false });
      return F.svg(480, 282, s);
    } };

  R.library = { topics: ['comp/file'], cards: ['라이브러리'], slide: ['comp/file#6'],
    cap: '라이브러리 — 여기저기 흩어진 폴더를 한곳에서 모아 보는 가상 폴더(파일을 옮기지 않는다)',
    draw: function () {
      var s = '', src = [['C:\\생산관리', 30], ['D:\\자료', 96], ['C:\\사용자\\문서', 162]];
      src.forEach(function (p) {
        s += folder(24, p[1], { w: 44, h: 32 }) + t(76, p[1] + 18, p[0], { size: 14 });
        s += line(190, p[1] + 16, 272, 110, { c: C.blue, w: 1.4, dash: '5 4' });
      });
      s += box(276, 40, 186, 140, { fill: C.blueL, c: C.blue, w: 1.8, r: 8, dash: '7 4' });
      s += t(369, 60, '라이브러리 [문서]', { a: 'm', size: 15, b: 1, c: C.blue, halo: false });
      ['1월 생산일보', '설비 매뉴얼', '회의록'].forEach(function (f, i) { s += doc(292, 76 + i * 32, { w: 18, h: 24, lines: false }) + t(318, 88 + i * 32, f, { size: 14, halo: false }); });
      s += t(369, 204, '모아서 보여 줄 뿐', { a: 'm', size: 14, b: 1 });
      s += t(240, 236, '기본 라이브러리: 문서 · 음악 · 비디오 · 사진', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 254, s);
    } };

  R.zip = { topics: ['comp/file'], cards: ['압축 프로그램'], slide: ['comp/file#6'],
    cap: '압축 — 여러 파일을 하나로 묶고 크기를 줄인다. 이미 압축된 사진·동영상은 거의 줄지 않는다',
    draw: function () {
      var s = '';
      s += doc(20, 30, { w: 24, h: 30 }) + doc(36, 40, { w: 24, h: 30 }) + doc(52, 50, { w: 24, h: 30 });
      s += arrow(90, 60, 170, 60, { c: C.blue }) + t(130, 44, '압축', { a: 'm', size: 14, b: 1, c: C.blue });
      s += box(184, 36, 50, 50, { fill: C.orangeL, c: C.orange, w: 1.6, r: 6, label: 'ZIP', size: 15 });
      s += t(252, 50, '한 파일로 묶이고', { size: 14 }) + t(252, 72, '크기가 줄어든다', { size: 14, b: 1, c: C.green });
      /* 크기 막대 */
      s += t(20, 118, '문서 파일', { size: 14, b: 1 });
      s += box(110, 106, 300, 22, { fill: C.grayL, c: C.ink, w: 1.2, r: 3 }) + t(420, 117, '원래', { size: 13, c: C.sub });
      s += box(110, 134, 120, 22, { fill: C.greenL, c: C.green, w: 1.2, r: 3 }) + t(240, 145, '압축 후 — 확 준다', { size: 13, c: C.green, b: 1 });
      s += t(20, 186, '사진·동영상', { size: 14, b: 1 });
      s += box(110, 174, 300, 22, { fill: C.grayL, c: C.ink, w: 1.2, r: 3 }) + t(420, 185, '원래', { size: 13, c: C.sub });
      s += box(110, 202, 290, 22, { fill: C.redL, c: C.red, w: 1.2, r: 3 }) + t(116, 213, '압축 후 — 거의 그대로', { size: 13, c: C.red, b: 1, halo: false });
      s += t(240, 246, '(이미 압축된 파일은 다시 압축해도 크기가 거의 줄지 않는다)', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 262, s);
    } };

  /* ════════════ 1과목 ③ Windows 시스템 관리 ════════════ */
  R.resolution = { topics: ['comp/winsys'], cards: ['디스플레이 해상도'],
    cap: '해상도 = 화면의 픽셀 수. 높이면 글자·아이콘이 작아지고 더 많은 내용이 보인다',
    draw: function () {
      var s = t(120, 24, '낮은 해상도', { a: 'm', size: 16, b: 1 }) + t(360, 24, '높은 해상도', { a: 'm', size: 16, b: 1, c: C.blue });
      s += monitor(30, 40, 180, 120, { fill: '#fff' }) + monitor(270, 40, 180, 120, { fill: '#fff' });
      /* 큰 아이콘 둘 */
      s += folder(48, 58, { w: 56, h: 42 }) + doc(128, 54, { w: 40, h: 50 });
      s += t(76, 118, '작업일지', { a: 'm', size: 15, halo: false }) + t(148, 118, '생산일보', { a: 'm', size: 15, halo: false });
      /* 작은 아이콘 여럿 */
      for (var r = 0; r < 3; r++) for (var c = 0; c < 6; c++) {
        var x = 284 + c * 27, y = 52 + r * 34;
        s += (c + r) % 2 ? doc(x + 4, y, { w: 13, h: 17, lines: false }) : folder(x, y + 2, { w: 20, h: 15 });
        s += line(x + 2, y + 23, x + 18, y + 23, { c: C.grayM, w: 1.4 });
      }
      s += t(120, 196, '크게 · 적게 보인다', { a: 'm', size: 14 }) + t(360, 196, '작게 · 많이 보인다', { a: 'm', size: 14, b: 1, c: C.blue });
      s += t(240, 226, '[설정] - [시스템] - [디스플레이] 에서 바꾼다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 244, s);
    } };

  R.spool = { topics: ['comp/winsys'], cards: ['기본 프린터', '스풀(SPOOL)'], slide: ['comp/winsys#1', 'comp/winsys#3'], hide: ['딱 1대'],
    cap: '스풀 — 인쇄할 내용을 하드디스크에 먼저 저장해 두고 프린터로 보낸다. 기본 프린터는 한 대만',
    draw: function () {
      var s = '';
      s += doc(22, 46) + t(37, 100, '문서', { a: 'm', size: 14 });
      s += arrow(60, 66, 140, 66, { c: C.blue, flow: true });
      s += disk(146, 44, { w: 70, h: 46, fill: C.blueL, c: C.blue }) + t(181, 108, '스풀', { a: 'm', size: 15, b: 1, c: C.blue }) + t(181, 128, '(하드디스크에 임시 저장)', { a: 'm', size: 13, c: C.sub });
      s += arrow(222, 66, 300, 66, { c: C.blue, flow: true });
      s += printer(312, 40) + t(337, 104, '프린터', { a: 'm', size: 14 }) + t(337, 124, '(느림)', { a: 'm', size: 13, c: C.sub });
      s += box(378, 30, 90, 44, { fill: C.greenL, c: C.green, w: 1.2, r: 8 }) + t(423, 44, '그동안', { a: 'm', size: 13, halo: false }) + t(423, 62, '다른 작업 OK', { a: 'm', size: 13, b: 1, c: C.green, halo: false });
      s += hdiv(150);
      s += printer(40, 170, { fill: C.greenL }) + circle(94, 172, 11, { fill: C.green, c: C.green, w: 1 }) + t(94, 172.5, '✔', { a: 'm', size: 13, c: '#fff', b: 1, halo: false });
      s += t(66, 236, '기본 프린터', { a: 'm', size: 14, b: 1, c: C.green });
      s += printer(160, 170) + t(185, 236, '프린터 2', { a: 'm', size: 13, c: C.sub });
      s += t(244, 186, '기본 프린터는 딱 1대', { size: 14, b: 1 }) + t(244, 208, '네트워크 프린터도 된다', { size: 14 }) + t(244, 230, '전체 인쇄 속도는 느려질 수 있다', { size: 13, c: C.red });
      return F.svg(480, 256, s);
    } };

  R.taskmgr = { topics: ['comp/winsys'], cards: ['작업 관리자'], slide: ['comp/winsys#4'],
    cap: '작업 관리자(Ctrl+Shift+Esc) — 응답 없는 앱을 골라 [작업 끝내기], CPU·메모리 사용량, 시작 프로그램 관리',
    draw: function () {
      var s = '', kx = 20;
      ['Ctrl', 'Shift', 'Esc'].forEach(function (k, i) { s += key(kx, 14, k, { fill: C.yellowL }); kx += keyW(k) + (i < 2 ? 16 : 0); if (i < 2) s += t(kx - 8, 27, '+', { a: 'm', size: 15, b: 1 }); });
      s += win(14, 52, 452, 196, '작업 관리자');
      var tabs = ['프로세스', '성능', '시작 프로그램'], tx = 22;
      tabs.forEach(function (tb, i) { var w = tw(tb, 14) + 18; s += box(tx, 80, w, 24, { fill: i === 0 ? C.blueL : '#fff', c: i === 0 ? C.blue : C.grayM, w: 1.2, r: 4, label: tb, size: 14 }); tx += w + 6; });
      s += t(236, 118, 'CPU', { a: 'm', size: 13, c: C.sub }) + t(356, 118, '메모리', { a: 'm', size: 13, c: C.sub });
      var rows = [['한글', 0.12, 0.3, false], ['크롬 (응답 없음)', 0.88, 0.82, true], ['엑셀', 0.05, 0.22, false]];
      rows.forEach(function (r, i) {
        var y = 126 + i * 28;
        if (r[3]) s += box(20, y - 2, 440, 26, { fill: C.redL, c: C.red, w: 1.2, r: 3 });
        s += t(30, y + 11, r[0], { size: 14, halo: false, b: r[3], c: r[3] ? C.red : C.ink });
        s += box(186, y + 5, 100, 12, { fill: '#fff', c: C.grayM, w: 1, r: 2 }) + box(186, y + 5, 100 * r[1], 12, { fill: r[3] ? C.red : C.blue, c: 'none', w: 0, r: 2 });
        s += box(306, y + 5, 100, 12, { fill: '#fff', c: C.grayM, w: 1, r: 2 }) + box(306, y + 5, 100 * r[2], 12, { fill: r[3] ? C.red : C.blue, c: 'none', w: 0, r: 2 });
      });
      s += box(362, 212, 96, 28, { fill: C.red, c: C.red, w: 1, r: 5, label: '작업 끝내기', size: 14, lc: '#fff' });
      s += t(350, 226, '멈춘 앱 강제 종료 →', { a: 'e', size: 13, b: 1, c: C.red });
      return F.svg(480, 262, s);
    } };

  R.disk3 = { topics: ['comp/winsys'], cards: ['디스크 정리', '드라이브 조각 모음(최적화)', '디스크 오류 검사'], slide: ['comp/winsys#0'], hide: ['접근 속도 ↑', '용량은 그대로'],
    cap: '디스크 정리는 공간을 늘리고, 조각 모음은 속도를 높이고(용량은 그대로), 오류 검사는 손상 영역을 배드 섹터로 표시한다',
    draw: function () {
      var s = '', X = [14, 170, 326], W = 140;
      var nm = ['디스크 정리', '조각 모음', '오류 검사'], goal = ['여유 공간 ↑', '접근 속도 ↑', '오류 찾아 복구'], gc = [C.green, C.blue, C.orange];
      for (var i = 0; i < 3; i++) {
        s += t(X[i] + W / 2, 24, nm[i], { a: 'm', size: 16, b: 1, c: gc[i] });
        s += t(X[i] + 4, 52, '전', { size: 13, c: C.sub }) + t(X[i] + 4, 136, '후', { size: 13, c: C.sub });
        s += arrow(X[i] + W / 2, 78, X[i] + W / 2, 108, { c: gc[i], w: 1.6, head: 9 });
        s += pill(X[i] + W / 2, 170, goal[i], { a: 'm', size: 14, b: 1, fill: [C.greenL, C.blueL, C.orangeL][i], c: gc[i] });
      }
      function blocks(x, y, arr) {
        var o = '';
        arr.forEach(function (b, k) {
          var fill = { A: C.blueL, B: C.greenL, C: C.orangeL, T: C.redL, _: '#fff', X: C.redL }[b], c = { A: C.blue, B: C.green, C: C.orange, T: C.red, _: C.grayM, X: C.red }[b];
          o += box(x + k * 15, y, 14, 22, { fill: fill, c: c, w: 1, r: 2 });
          if (b === 'X') o += t(x + k * 15 + 7, y + 11, '✕', { a: 'm', size: 12, b: 1, c: C.red, halo: false });
        });
        return o;
      }
      /* 정리: 임시 파일(T) 이 빠진다 */
      s += blocks(X[0] + 22, 42, ['A', 'T', 'B', 'T', 'T', 'A', 'T', 'B']);
      s += blocks(X[0] + 22, 124, ['A', 'B', 'A', 'B', '_', '_', '_', '_']);
      s += t(X[0] + W / 2, 206, '임시 파일 · 휴지통 삭제', { a: 'm', size: 13, c: C.sub });
      /* 조각 모음 */
      s += blocks(X[1] + 22, 42, ['A', 'B', 'C', 'A', '_', 'B', 'A', 'C']);
      s += blocks(X[1] + 22, 124, ['A', 'A', 'A', 'B', 'B', 'C', 'C', '_']);
      s += t(X[1] + W / 2, 206, '흩어진 조각을 모음', { a: 'm', size: 13, c: C.sub }) + t(X[1] + W / 2, 226, '용량은 그대로', { a: 'm', size: 13, b: 1, c: C.red });
      /* 오류 검사 */
      s += blocks(X[2] + 22, 42, ['A', 'B', '_', 'A', 'T', 'B', '_', 'C']);
      s += blocks(X[2] + 22, 124, ['A', 'B', '_', 'A', 'X', 'B', '_', 'C']);
      s += t(X[2] + W / 2, 206, '손상 영역 = 배드 섹터', { a: 'm', size: 13, c: C.sub }) + t(X[2] + W / 2, 226, '로 표시', { a: 'm', size: 13, c: C.sub });
      s += divider(163, 14, 236) + divider(319, 14, 236);
      return F.svg(480, 246, s);
    } };

  R.format = { topics: ['comp/winsys'], cards: ['포맷(Format)'],
    cap: '포맷 — 디스크를 초기화해 파일 시스템(NTFS 등)을 새로 만든다. 데이터는 모두 지워진다',
    draw: function () {
      var s = '';
      s += disk(24, 40, { w: 80, h: 70 });
      s += doc(40, 56, { w: 18, h: 22, lines: false }) + doc(66, 60, { w: 18, h: 22, lines: false });
      s += t(64, 128, '데이터가 든 디스크', { a: 'm', size: 13, c: C.sub });
      s += arrow(118, 76, 196, 76, { c: C.red, w: 2.2 }) + t(157, 60, '포맷', { a: 'm', size: 15, b: 1, c: C.red });
      s += disk(210, 40, { w: 80, h: 70, fill: '#fff', c: C.blue }) + t(250, 84, 'NTFS', { a: 'm', size: 14, b: 1, c: C.blue, halo: false });
      s += t(250, 128, '빈 디스크 · 새 파일 시스템', { a: 'm', size: 13, c: C.blue });
      s += box(318, 44, 146, 64, { fill: C.redL, c: C.red, w: 1.2, r: 8 }) + t(391, 64, '들어 있던 데이터', { a: 'm', size: 13, halo: false }) + t(391, 86, '모두 지워진다', { a: 'm', size: 14, b: 1, c: C.red, halo: false });
      s += hdiv(150);
      s += pill(24, 166, '일반 포맷', { size: 14, b: 1, fill: C.grayL, c: C.ink }) + t(134, 178, '불량 섹터 검사까지 한다', { size: 14 });
      s += pill(24, 200, '빠른 포맷', { size: 14, b: 1, fill: C.orangeL, c: C.orange }) + t(134, 212, '검사는 건너뛰고 파일 목록만 새로', { size: 14 });
      s += t(240, 248, '지금 쓰고 있는 Windows 드라이브(C:)는 포맷할 수 없다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 264, s);
    } };

  R.restore = { topics: ['comp/winsys'], cards: ['시스템 복원'],
    cap: '시스템 복원 — 복원 지점으로 시스템 파일·설정·설치 프로그램을 되돌린다. 개인 파일은 그대로',
    draw: function () {
      var s = '';
      s += arrow(30, 70, 450, 70, { c: C.grayM, w: 2, head: 10 }) + t(450, 90, '시간', { a: 'e', size: 13, c: C.sub });
      s += circle(90, 70, 10, { fill: C.blue, c: C.blue, w: 1 }) + t(90, 40, '복원 지점', { a: 'm', size: 15, b: 1, c: C.blue }) + t(30, 98, '잘 되던 때', { size: 13, c: C.sub });
      s += circle(360, 70, 12, { fill: C.redL, c: C.red, w: 2 }) + t(360, 70.5, '✕', { a: 'm', size: 13, b: 1, c: C.red, halo: false }) + t(360, 40, '지금 — 문제 생김', { a: 'm', size: 15, b: 1, c: C.red });
      var qp = []; for (var k = 0; k <= 16; k++) { var u = k / 16; qp.push([(1 - u) * (1 - u) * 350 + 2 * u * (1 - u) * 225 + u * u * 96, (1 - u) * (1 - u) * 90 + 2 * u * (1 - u) * 150 + u * u * 84]); }
      s += F.route(qp, { c: C.blue, w: 2 });
      s += t(225, 134, '되돌리기', { a: 'm', size: 15, b: 1, c: C.blue });
      s += box(20, 160, 214, 84, { fill: C.blueL, c: C.blue, w: 1.4, r: 8 }) + t(127, 180, '되돌아가는 것', { a: 'm', size: 15, b: 1, c: C.blue, halo: false }) +
        t(127, 206, '시스템 파일 · 설정', { a: 'm', size: 14, halo: false }) + t(127, 228, '설치한 프로그램', { a: 'm', size: 14, halo: false });
      s += box(246, 160, 214, 84, { fill: C.greenL, c: C.green, w: 1.4, r: 8 }) + t(353, 180, '그대로인 것', { a: 'm', size: 15, b: 1, c: C.green, halo: false }) +
        t(353, 206, '문서 · 사진 같은 개인 파일', { a: 'm', size: 14, halo: false }) + t(353, 228, '(지운 파일도 안 살아남)', { a: 'm', size: 13, c: C.sub, halo: false });
      return F.svg(480, 258, s);
    } };

  /* ════════════ 1과목 ④ 컴퓨터 시스템과 자료 표현 ════════════ */
  R.dac = { topics: ['comp/sys'], cards: ['디지털 컴퓨터', '아날로그 컴퓨터', '하이브리드 컴퓨터'],
    cap: '디지털은 셀 수 있는 띄엄띄엄한 값(논리 회로), 아날로그는 이어진 물리량(증폭 회로), 하이브리드는 둘을 합친 것',
    draw: function () {
      var s = '', X = [14, 170, 326], W = 140;
      var nm = ['디지털', '아날로그', '하이브리드'], c = [C.blue, C.orange, C.purple];
      for (var i = 0; i < 3; i++) {
        s += t(X[i] + W / 2, 24, nm[i], { a: 'm', size: 17, b: 1, c: c[i] });
        s += line(X[i] + 10, 150, X[i] + W - 6, 150, { c: C.ink, w: 1.4 }) + line(X[i] + 10, 150, X[i] + 10, 46, { c: C.ink, w: 1.4 });
      }
      var v = [2, 4, 5, 3, 5, 7, 6, 4];
      function bars(x0, col) { var o = ''; v.forEach(function (h, k) { o += box(x0 + 18 + k * 14, 150 - h * 12, 10, h * 12, { fill: col === C.blue ? C.blueL : C.purpleL, c: col, w: 1.2, r: 1 }); }); return o; }
      function curve(x0, col) { var d = ''; for (var k = 0; k <= 40; k++) { var x = x0 + 18 + k * 2.8, y = 104 - 38 * Math.sin(k / 40 * Math.PI * 1.6); d += (k ? ' L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); } return path(d, { c: col, w: 2.4 }); }
      s += bars(X[0], C.blue) + curve(X[1], C.orange) + bars(X[2], C.purple) + curve(X[2], C.orange);
      s += t(X[0] + W / 2, 174, '셀 수 있는 값', { a: 'm', size: 14, b: 1 }) + t(X[0] + W / 2, 196, '문자 · 숫자', { a: 'm', size: 13, c: C.sub }) + t(X[0] + W / 2, 216, '논리 회로 · 정밀', { a: 'm', size: 13, c: C.sub });
      s += t(X[1] + W / 2, 174, '이어진 물리량', { a: 'm', size: 14, b: 1 }) + t(X[1] + W / 2, 196, '전압 · 온도', { a: 'm', size: 13, c: C.sub }) + t(X[1] + W / 2, 216, '증폭 회로 · 특수 목적', { a: 'm', size: 13, c: C.sub });
      s += t(X[2] + W / 2, 174, '둘의 장점을 합침', { a: 'm', size: 14, b: 1 });
      s += divider(163, 14, 226) + divider(319, 14, 226);
      return F.svg(480, 236, s);
    } };

  R.bitunit = { topics: ['comp/sys'], cards: ['자료의 물리적 단위'], slide: ['comp/sys#1'],
    cap: '물리적 단위 — 비트(0 또는 1) < 니블(4비트) < 바이트(8비트) < 워드(CPU가 한 번에 처리하는 단위)',
    draw: function () {
      var s = '', rows = [['비트', 1, '0 또는 1'], ['니블', 4, '4비트'], ['바이트', 8, '8비트 = 문자 하나'], ['워드', 16, 'CPU가 한 번에 처리']];
      var bits = '1011001101001110';
      rows.forEach(function (r, i) {
        var y = 26 + i * 52;
        s += t(20, y + 14, r[0], { size: 16, b: 1, c: i === 3 ? C.blue : C.ink });
        for (var k = 0; k < r[1]; k++) {
          var x = 90 + k * 17;
          s += box(x, y, 15, 28, { fill: i === 3 ? C.blueL : (i === 2 ? C.greenL : C.grayL), c: i === 3 ? C.blue : C.ink, w: 1.1, r: 2 });
          s += t(x + 7.5, y + 14.5, bits[k], { a: 'm', size: 13, halo: false });
        }
        if (i === 3) s += t(90 + 16 * 17 + 4, y + 14, '…', { size: 16, b: 1, c: C.blue });
        s += t(i === 3 ? 90 : 90 + r[1] * 17 + 10, i === 3 ? y + 42 : y + 14, r[2], { size: 14, c: C.sub });
      });
      s += t(460, 240, '작다 → 크다', { a: 'e', size: 14, b: 1, c: C.sub });
      return F.svg(480, 256, s);
    } };

  R.logunit = { topics: ['comp/sys'], cards: ['자료의 논리적 단위'], slide: ['comp/sys#7'],
    cap: '논리적 단위 — 필드(항목 하나) < 레코드(한 줄) < 블록 < 파일(표 하나) < 데이터베이스(파일의 모임)',
    draw: function () {
      var s = '', o = { cols: ['날짜', '설비', '생산량'], cw: [74, 70, 74], rh: 28, hdr: false,
        rows: [['날짜', '설비', '생산량'], ['10/1', '1호기', 520], ['10/1', '2호기', 480], ['10/2', '1호기', 530], ['10/2', '2호기', 470]],
        bold: { '0,0': 1, '0,1': 1, '0,2': 1 }, fill: { '0,0': C.grayL, '0,1': C.grayL, '0,2': C.grayL, '1,0': C.greenL, '1,1': C.greenL, '1,2': C.greenL } };
      s += t(128, 22, '생산일보 (파일)', { a: 'm', size: 15, b: 1, c: C.blue });
      s += sheet(20, 36, o);
      s += box(20, 36, 218, 140, { fill: 'none', c: C.blue, w: 2.4, r: 3 });
      s += box(96, 94, 66, 26, { fill: 'none', c: C.orange, w: 2.6, r: 2 });
      s += callout(162, 107, 262, 64, '필드 — 항목 하나', { c: C.orange, tc: C.orange, b: 1, size: 14 });
      s += callout(238, 78, 262, 104, '레코드 — 한 줄', { c: C.green, tc: C.green, b: 1, size: 14 });
      s += path('M244,94 H252 V148 H244', { c: C.purple, w: 1.6 }) + callout(252, 121, 262, 144, '블록 — 레코드 몇 개', { c: C.purple, tc: C.purple, b: 1, size: 14 });
      /* 데이터베이스 */
      s += t(240, 204, '데이터베이스 = 파일의 모임', { a: 'm', size: 15, b: 1, c: C.blue });
      ['생산일보', '설비점검', '자재입출고'].forEach(function (f, i) {
        s += box(62 + i * 124, 220, 110, 30, { fill: C.blueL, c: C.blue, w: 1.2, r: 4, label: f, size: 14 });
      });
      s += box(50, 190, 380, 70, { fill: 'none', c: C.blue, w: 1.4, r: 10, dash: '6 4' });
      return F.svg(480, 272, s);
    } };

  R.codes = { topics: ['comp/sys'], cards: ['ASCII 코드', 'BCD 코드', 'EBCDIC 코드', '유니코드(Unicode)'],
    cap: '문자 코드는 비트 수로 외운다 — BCD 6비트(64가지) · ASCII 7비트(128가지) · EBCDIC 8비트(256가지) · 유니코드 16비트',
    draw: function () {
      var s = '', rows = [['BCD', 6, '64가지', '영문 소문자 ✕'], ['ASCII', 7, '128가지', '통신 · PC'], ['EBCDIC', 8, '256가지', '대형 컴퓨터'], ['유니코드', 16, '2바이트', '전 세계 문자']];
      rows.forEach(function (r, i) {
        var y = 20 + i * 56, c = [C.sub, C.blue, C.orange, C.green][i], f = [C.grayL, C.blueL, C.orangeL, C.greenL][i];
        s += t(18, y + 13, r[0], { size: 16, b: 1, c: c });
        for (var k = 0; k < r[1]; k++) s += box(100 + k * 14, y, 12, 26, { fill: f, c: c, w: 1.1, r: 2 });
        s += t(100 + r[1] * 14 + 8, y + 13, r[1] + '비트', { size: 14, b: 1, c: c });
        s += t(100, y + 42, r[2] + ' · ' + r[3], { size: 14, c: C.ink });
      });
      return F.svg(480, 244, s);
    } };

  R.cpu = { topics: ['comp/sys', 'comp/hw'], cards: ['중앙처리장치(CPU)', '제어장치의 레지스터', '연산장치(ALU)', '마이크로프로세서'], slide: ['comp/sys#5'],
    cap: 'CPU = 제어장치(명령 해석·지시) + 연산장치(계산) + 레지스터. 이것을 칩 하나에 모은 것이 마이크로프로세서',
    draw: function () {
      var s = box(12, 12, 456, 232, { fill: C.grayL, c: C.ink, w: 2, r: 12 });
      s += t(240, 32, '중앙처리장치 (CPU)', { a: 'm', size: 17, b: 1, halo: false });
      s += box(24, 48, 208, 160, { fill: '#fff', c: C.blue, w: 1.8, r: 8 }) + t(128, 66, '제어장치 — 시킨다', { a: 'm', size: 15, b: 1, c: C.blue, halo: false });
      ['프로그램 카운터(PC)', '명령 레지스터(IR)', '명령 해독기', '부호기', '번지 해독기'].forEach(function (x, i) { s += t(40, 92 + i * 23, '· ' + x, { size: 14, halo: false }); });
      s += box(248, 48, 208, 160, { fill: '#fff', c: C.orange, w: 1.8, r: 8 }) + t(352, 66, '연산장치(ALU) — 계산', { a: 'm', size: 15, b: 1, c: C.orange, halo: false });
      ['가산기', '보수기', '누산기(AC)', '데이터 레지스터', '상태 레지스터'].forEach(function (x, i) { s += t(264, 92 + i * 23, '· ' + x, { size: 14, halo: false }); });
      s += t(240, 226, 'PC = 다음 명령의 주소 · 누산기 = 연산 결과를 잠시 저장', { a: 'm', size: 13, c: C.sub, halo: false });
      s += t(240, 266, '→ 칩 하나에 모은 것 = 마이크로프로세서', { a: 'm', size: 15, b: 1, c: C.purple });
      return F.svg(480, 284, s);
    } };

  R.vonneumann = { topics: ['comp/sys'], cards: ['폰 노이만'],
    cap: '프로그램 내장 방식(폰 노이만) — 프로그램과 자료를 주기억장치에 넣어 두고 순서대로 꺼내 실행한다',
    draw: function () {
      var s = t(110, 24, '주기억장치', { a: 'm', size: 16, b: 1 });
      var cells = [['0', '명령 ①', C.blueL], ['1', '명령 ②', C.blueL], ['2', '명령 ③', C.blueL], ['3', '자료', C.greenL], ['4', '자료', C.greenL]];
      cells.forEach(function (c, i) {
        var y = 40 + i * 34;
        s += t(40, y + 15, c[0] + '번지', { a: 'e', size: 13, c: C.sub });
        s += box(48, y, 124, 30, { fill: c[2], c: C.ink, w: 1.2, r: 3, label: c[1], size: 14 });
      });
      s += box(46, 72, 128, 34, { fill: 'none', c: C.orange, w: 2.6, r: 4 });
      s += box(280, 60, 180, 110, { fill: C.grayL, c: C.ink, w: 1.8, r: 10 }) + t(370, 80, 'CPU', { a: 'm', size: 16, b: 1, halo: false });
      ['① 꺼내기', '② 해석하기', '③ 실행하기'].forEach(function (x, i) { s += t(300, 108 + i * 22, x, { size: 14, halo: false }); });
      s += arrow(176, 89, 276, 89, { c: C.orange, w: 2 }) + t(226, 76, '차례대로', { a: 'm', size: 13, b: 1, c: C.orange });
      s += F.route([[370, 172], [370, 200], [226, 200], [226, 106]], { c: C.sub, w: 1.4, head: 9 }) + t(300, 216, '다음 번지로', { a: 'm', size: 13, c: C.sub });
      s += t(240, 246, '프로그램도 자료처럼 기억장치 안에 넣어 둔다', { a: 'm', size: 14, b: 1, c: C.blue });
      return F.svg(480, 262, s);
    } };

  R.gen = { topics: ['comp/sys'], cards: ['세대별 주요 소자'],
    cap: '세대별 주요 소자 — 진공관 → 트랜지스터 → IC → LSI → VLSI. 세대가 갈수록 작고 빠르고 많이 담는다',
    draw: function () {
      var s = '', X = [48, 144, 240, 336, 432];
      var nm = ['진공관', '트랜지스터', '집적회로(IC)', '고밀도(LSI)', '초고밀도(VLSI)'];
      /* 진공관 */
      s += path('M34,100 V70 Q34,50 48,50 Q62,50 62,70 V100 Z', { fill: C.orangeL, c: C.ink, w: 1.5 }) + line(42, 100, 42, 112, { w: 1.4 }) + line(54, 100, 54, 112, { w: 1.4 }) + line(44, 76, 52, 76, { c: C.orange, w: 2 });
      /* 트랜지스터 */
      s += path('M130,64 A14,14 0 0 1 158,64 V88 H130 Z', { fill: C.grayM, c: C.ink, w: 1.5 }) + line(136, 88, 136, 112, { w: 1.4 }) + line(144, 88, 144, 112, { w: 1.4 }) + line(152, 88, 152, 112, { w: 1.4 });
      /* 칩 */
      function chip(cx, n, sz) {
        var o = box(cx - sz / 2, 82 - sz / 2, sz, sz, { fill: '#374151', c: C.ink, w: 1.4, r: 3 });
        for (var k = 0; k < 4; k++) { var p = cx - sz / 2 + 6 + k * (sz - 12) / 3; o += line(p, 82 - sz / 2 - 6, p, 82 - sz / 2, { w: 1.4 }) + line(p, 82 + sz / 2, p, 82 + sz / 2 + 6, { w: 1.4 }); }
        var g = sz - 12, st = g / n;
        for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) o += box(cx - g / 2 + i * st + 1, 82 - g / 2 + j * st + 1, st - 2, st - 2, { fill: '#9ca3af', c: 'none', w: 0, r: 0.5 });
        return o;
      }
      s += chip(240, 2, 40) + chip(336, 4, 44) + chip(432, 7, 48);
      nm.forEach(function (n, i) {
        s += t(X[i], 24, (i + 1) + '세대', { a: 'm', size: 15, b: 1, c: C.blue });
        s += t(X[i], 136, n, { a: 'm', size: i > 1 ? 13 : 14, b: 1 });
      });
      s += arrow(24, 170, 456, 170, { c: C.green, w: 2.2 }) + t(240, 192, '작게 · 빠르게 · 많이', { a: 'm', size: 15, b: 1, c: C.green });
      s += t(432, 214, '+ 인공지능', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 228, s);
    } };

  R.datainfo = { topics: ['comp/sys'], cards: ['자료(Data)와 정보(Information)'],
    cap: '자료는 가공 전의 값, 정보는 자료를 처리해 판단에 쓸 수 있게 만든 결과 — 설비 온도 예(숫자는 예)',
    draw: function () {
      var s = t(80, 26, '자료', { a: 'm', size: 17, b: 1 }) + t(240, 26, '처리', { a: 'm', size: 17, b: 1, c: C.blue }) + t(400, 26, '정보', { a: 'm', size: 17, b: 1, c: C.green });
      var o = { cols: ['설비', '온도'], cw: [60, 60], rh: 26, hdr: false, rows: [['설비', '온도'], ['1호기', '71℃'], ['2호기', '73℃'], ['3호기', '90℃'], ['4호기', '70℃']],
        bold: { '0,0': 1, '0,1': 1 }, fill: { '0,0': C.grayL, '0,1': C.grayL } };
      s += sheet(20, 44, o);
      s += arrow(146, 110, 186, 110, { c: C.blue });
      s += box(190, 70, 100, 80, { fill: C.blueL, c: C.blue, w: 1.6, r: 10 }) + t(240, 96, '평균 · 비교', { a: 'm', size: 14, b: 1, halo: false }) + t(240, 122, '(자료 처리)', { a: 'm', size: 13, c: C.sub, halo: false });
      s += arrow(294, 110, 334, 110, { c: C.green });
      s += box(338, 60, 126, 100, { fill: C.greenL, c: C.green, w: 1.6, r: 10 }) + t(401, 86, '3호기 과열', { a: 'm', size: 15, b: 1, c: C.red, halo: false }) +
        t(401, 112, '→ 점검하자', { a: 'm', size: 15, b: 1, halo: false }) + '';
      s += t(80, 200, '측정한 그대로의 값', { a: 'm', size: 13, c: C.sub }) + t(401, 200, '판단에 쓰는 결과', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 220, s);
    } };


  /* ════════════ 1과목 ⑤ 기억장치와 하드웨어 ════════════ */
  R.memtree = { topics: ['comp/hw'], cards: ['ROM', 'RAM', 'DRAM / SRAM', '플래시 메모리'],
    cap: '반도체 메모리 가계도 — ROM·플래시는 전원이 꺼져도 남고(비휘발), RAM 은 사라진다(휘발)',
    draw: function () {
      var s = box(170, 14, 140, 32, { fill: C.grayL, c: C.ink, w: 1.4, r: 6, label: '반도체 메모리', size: 15 });
      s += line(240, 46, 240, 58, { w: 1.4 }) + line(90, 58, 390, 58, { w: 1.4 });
      [90, 240, 390].forEach(function (x) { s += line(x, 58, x, 70, { w: 1.4 }); });
      s += box(30, 70, 120, 36, { fill: C.greenL, c: C.green, w: 1.6, r: 6, label: 'ROM', size: 16 });
      s += box(180, 70, 120, 36, { fill: C.redL, c: C.red, w: 1.6, r: 6, label: 'RAM', size: 16 });
      s += box(330, 70, 120, 36, { fill: C.greenL, c: C.green, w: 1.6, r: 6, label: '플래시 메모리', size: 15 });
      s += t(90, 122, '읽기 전용', { a: 'm', size: 13 }) + t(90, 140, 'BIOS 저장', { a: 'm', size: 13, c: C.sub });
      s += t(390, 122, 'EEPROM 의 일종', { a: 'm', size: 13 }) + t(390, 140, 'USB · SSD · 카메라', { a: 'm', size: 13, c: C.sub });
      s += line(240, 106, 240, 150, { w: 1.4 }) + line(160, 150, 320, 150, { w: 1.4 }) + line(160, 150, 160, 160, { w: 1.4 }) + line(320, 150, 320, 160, { w: 1.4 });
      s += box(96, 160, 128, 34, { fill: C.blueL, c: C.blue, w: 1.4, r: 6, label: 'DRAM', size: 15 });
      s += box(256, 160, 128, 34, { fill: C.orangeL, c: C.orange, w: 1.4, r: 6, label: 'SRAM', size: 15 });
      s += t(160, 210, '재충전 필요 · 느림', { a: 'm', size: 13 }) + t(160, 228, '집적도 ↑ → 주기억장치', { a: 'm', size: 13, b: 1, c: C.blue });
      s += t(320, 210, '재충전 불필요 · 빠름', { a: 'm', size: 13 }) + t(320, 228, '비쌈 → 캐시 메모리', { a: 'm', size: 13, b: 1, c: C.orange });
      s += box(24, 250, 14, 14, { fill: C.greenL, c: C.green, w: 1.2, r: 2 }) + t(44, 257, '비휘발 — 전원 꺼져도 남음', { size: 13 });
      s += box(256, 250, 14, 14, { fill: C.redL, c: C.red, w: 1.2, r: 2 }) + t(276, 257, '휘발 — 전원 끄면 사라짐', { size: 13 });
      return F.svg(480, 276, s);
    } };

  R.cache = { topics: ['comp/hw'], cards: ['캐시 메모리(Cache)'], slide: ['comp/hw#3'],
    cap: '캐시 메모리(SRAM) — 빠른 CPU 와 느린 주기억장치(DRAM) 사이에서 자주 쓰는 것을 미리 담아 기다림을 줄인다',
    draw: function () {
      var s = '';
      s += box(18, 50, 104, 80, { fill: C.grayL, c: C.ink, w: 1.8, r: 8 }) + t(70, 80, 'CPU', { a: 'm', size: 18, b: 1, halo: false }) + t(70, 106, '아주 빠름', { a: 'm', size: 13, c: C.sub, halo: false });
      s += box(188, 58, 104, 64, { fill: C.orangeL, c: C.orange, w: 1.8, r: 8 }) + t(240, 80, '캐시', { a: 'm', size: 16, b: 1, halo: false }) + t(240, 102, '(SRAM)', { a: 'm', size: 13, c: C.orange, halo: false });
      s += box(356, 40, 108, 100, { fill: C.blueL, c: C.blue, w: 1.8, r: 8 }) + t(410, 80, '주기억장치', { a: 'm', size: 15, b: 1, halo: false }) + t(410, 104, '(DRAM)', { a: 'm', size: 13, c: C.blue, halo: false });
      s += arrow(124, 90, 186, 90, { c: C.orange, w: 2.4, both: true }) + arrow(294, 90, 354, 90, { c: C.sub, w: 1.6, both: true, dash: '5 4' });
      s += t(155, 72, '빠르게', { a: 'm', size: 13, b: 1, c: C.orange });
      s += t(240, 146, '빠름 · 작음 · 비쌈', { a: 'm', size: 13 }) + t(410, 160, '느림 · 큼 · 쌈', { a: 'm', size: 13 });
      s += box(20, 180, 440, 56, { fill: C.yellowL, c: C.grayM, w: 1, r: 8 });
      s += t(240, 198, '자주 쓰는 것만 캐시에 미리 담아 둔다', { a: 'm', size: 14, b: 1, halo: false });
      s += t(240, 220, '캐시에서 바로 찾을 확률 = 적중률 (높을수록 빠르다)', { a: 'm', size: 13, c: C.sub, halo: false });
      return F.svg(480, 250, s);
    } };

  R.vmem = { topics: ['comp/hw'], cards: ['가상 메모리'], slide: ['comp/hw#4'],
    cap: '가상 메모리 — 하드디스크의 일부를 주기억장치처럼 빌려 써서, 메모리보다 큰 프로그램도 실행한다(속도는 느려짐)',
    draw: function () {
      var s = t(240, 24, '실행할 프로그램 (메모리보다 크다)', { a: 'm', size: 15, b: 1 });
      s += box(40, 38, 400, 30, { fill: C.purpleL, c: C.purple, w: 1.6, r: 4 });
      for (var i = 1; i < 8; i++) s += line(40 + i * 50, 38, 40 + i * 50, 68, { c: C.purple, w: 1 });
      s += arrow(140, 72, 140, 104, { c: C.blue }) + arrow(340, 72, 340, 104, { c: C.orange });
      s += box(40, 108, 200, 70, { fill: C.blueL, c: C.blue, w: 1.8, r: 6 }) + t(140, 132, '주기억장치 (RAM)', { a: 'm', size: 15, b: 1, halo: false }) + t(140, 156, '실제로 있는 메모리', { a: 'm', size: 13, c: C.sub, halo: false });
      s += box(240, 108, 200, 70, { fill: C.orangeL, c: C.orange, w: 1.8, r: 6, dash: '6 4' }) + t(340, 132, '하드디스크의 일부', { a: 'm', size: 15, b: 1, halo: false }) + t(340, 156, 'RAM 처럼 빌려 씀', { a: 'm', size: 13, c: C.sub, halo: false });
      s += path('M40,190 V200 H440 V190', { c: C.ink, w: 1.4 }) + t(240, 218, '프로그램이 보기에는 하나의 큰 메모리', { a: 'm', size: 14, b: 1, c: C.purple });
      s += t(240, 244, '목적 = 공간 확대 · 대신 속도는 느려진다', { a: 'm', size: 13, c: C.red });
      return F.svg(480, 260, s);
    } };

  R.assoc = { topics: ['comp/hw'], cards: ['연관(연상) 메모리'],
    cap: '보통 메모리는 주소(번지)로 찾고, 연관 메모리는 저장된 내용의 일부로 찾아간다',
    draw: function () {
      var s = t(120, 24, '보통 메모리', { a: 'm', size: 16, b: 1 }) + t(360, 24, '연관 메모리', { a: 'm', size: 16, b: 1, c: C.blue }) + divider(240, 14, 232);
      var data = ['2호기 · 480', '1호기 · 520', '3호기 · 505', '1호기 · 530'];
      function mem(x, hi, c, f, addr) {
        var o = '';
        data.forEach(function (d, i) {
          var y = 96 + i * 30, on = hi.indexOf(i) >= 0;
          if (addr) o += t(x - 6, y + 13, i + '번지', { a: 'e', size: 13, c: C.sub });
          o += box(x, y, 124, 26, { fill: on ? f : '#fff', c: on ? c : C.grayM, w: on ? 2 : 1, r: 3, label: d, size: 14, b: on });
        });
        return o;
      }
      s += box(40, 42, 160, 34, { fill: C.yellowL, c: C.grayM, w: 1, r: 17, label: '"2번지를 주세요"', size: 14 });
      s += mem(76, [2], C.orange, C.orangeL, true) + F.route([[200, 60], [214, 60], [214, 169], [204, 169]], { c: C.orange, w: 1.6, head: 9 });
      s += box(282, 42, 156, 34, { fill: C.yellowL, c: C.grayM, w: 1, r: 17, label: '"1호기가 든 칸?"', size: 14 });
      s += mem(298, [1, 3], C.blue, C.blueL, false);
      s += t(120, 228, '주소로 찾는다', { a: 'm', size: 14 }) + t(360, 228, '내용으로 찾는다', { a: 'm', size: 14, b: 1, c: C.blue });
      return F.svg(480, 244, s);
    } };

  R.ssd = { topics: ['comp/hw'], cards: ['SSD'],
    cap: 'HDD 는 원판이 돌고 헤드가 움직인다. SSD 는 움직이는 부품 없이 반도체 칩에 저장한다',
    draw: function () {
      var s = t(120, 24, 'HDD (하드디스크)', { a: 'm', size: 16, b: 1 }) + t(360, 24, 'SSD', { a: 'm', size: 16, b: 1, c: C.blue }) + divider(240, 14, 240);
      s += box(40, 40, 160, 120, { fill: C.grayL, c: C.ink, w: 1.6, r: 8 });
      s += circle(106, 100, 48, { fill: '#e5e7eb', c: C.ink, w: 1.4 }) + circle(106, 100, 8, { fill: C.grayM, c: C.ink, w: 1.2 });
      s += path('M84,64 A40,40 0 0 1 140,72', { c: C.sub, w: 1.4 }) + poly([[140, 72], [132, 66], [134, 76]], { close: 1, fill: C.sub, c: C.sub, w: 1 });
      s += line(182, 146, 132, 88, { c: C.ink, w: 4 }) + circle(182, 146, 6, { fill: C.grayM, c: C.ink, w: 1.2 });
      s += callout(132, 88, 150, 52, '헤드', { size: 13 });
      s += t(120, 182, '원판 회전 · 헤드 이동', { a: 'm', size: 14 });
      s += box(280, 56, 160, 90, { fill: C.greenL, c: C.green, w: 1.6, r: 6 });
      for (var i = 0; i < 4; i++) s += box(292 + i * 36, 70, 28, 36, { fill: '#374151', c: C.ink, w: 1, r: 2 });
      s += box(292, 116, 48, 20, { fill: '#6b7280', c: C.ink, w: 1, r: 2 }) + box(428, 90, 12, 34, { fill: '#fde68a', c: C.orange, w: 1, r: 1 });
      s += callout(320, 88, 350, 166, '반도체 칩', { size: 13, a: 's' });
      s += t(360, 196, '빠르다 · 소음·발열 적다', { a: 'm', size: 14, b: 1, c: C.blue }) + t(360, 218, '충격에 강하다', { a: 'm', size: 14, b: 1, c: C.blue });
      s += t(120, 218, '움직이는 부품이 있다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 250, s);
    } };

  R.boot = { topics: ['comp/hw'], cards: ['바이오스(BIOS)', 'CMOS'],
    cap: '부팅 — 전원을 켜면 ROM 의 BIOS 가 하드웨어를 점검(POST)하고, CMOS 에 저장된 설정대로 운영체제를 불러온다',
    draw: function () {
      var s = '', Y = 44;
      s += circle(46, Y + 30, 26, { fill: '#fff', c: C.green, w: 2 }) + path('M38,' + (Y + 20) + ' A14,14 0 1 0 54,' + (Y + 20), { c: C.green, w: 2.4 }) + line(46, Y + 12, 46, Y + 30, { c: C.green, w: 2.4 });
      s += t(46, Y + 76, '전원 켜기', { a: 'm', size: 14, b: 1 });
      s += arrow(76, Y + 30, 112, Y + 30);
      s += box(116, Y, 128, 60, { fill: C.greenL, c: C.green, w: 1.8, r: 8 }) + t(180, Y + 20, 'BIOS (ROM)', { a: 'm', size: 15, b: 1, halo: false }) + t(180, Y + 42, 'POST 하드웨어 점검', { a: 'm', size: 13, halo: false });
      s += arrow(248, Y + 30, 290, Y + 30);
      s += disk(296, Y + 4, { w: 70, h: 52, fill: C.blueL, c: C.blue }) + t(331, Y + 76, '운영체제', { a: 'm', size: 14, b: 1 }) + t(331, Y + 94, '불러오기', { a: 'm', size: 13, c: C.sub });
      s += arrow(370, Y + 30, 404, Y + 30);
      s += monitor(408, Y + 6, 56, 40, { fill: C.blueL }) + t(436, Y + 76, '부팅 끝', { a: 'm', size: 13, c: C.sub });
      /* CMOS */
      s += box(116, 150, 200, 84, { fill: C.orangeL, c: C.orange, w: 1.8, r: 8 });
      s += t(216, 170, 'CMOS — 설정값 저장', { a: 'm', size: 15, b: 1, halo: false });
      s += t(216, 194, '날짜·시간 · 부팅 순서', { a: 'm', size: 13, halo: false }) + t(216, 214, '하드 디스크 정보', { a: 'm', size: 13, halo: false });
      s += F.route([[216, 150], [216, 128], [180, 128], [180, Y + 64]], { c: C.orange, w: 1.6, head: 9 }) + t(224, 132, '읽어 온다', { size: 13, c: C.orange, b: 1 });
      s += circle(356, 192, 24, { fill: '#e5e7eb', c: C.ink, w: 1.6 }) + t(356, 192.5, '+ 3V', { a: 'm', size: 13, b: 1, halo: false });
      s += line(318, 192, 332, 192, { c: C.ink, w: 1.4 }) + t(392, 180, '메인보드', { size: 13 }) + t(392, 198, '배터리로 유지', { size: 13 });
      s += t(240, 256, '부팅할 때 Delete · F2 → CMOS 설정 화면', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 272, s);
    } };

  R.ports = { topics: ['comp/hw'], cards: ['USB 포트', 'HDMI', 'SATA'],
    cap: 'USB 는 최대 127개 장치(PnP·핫 플러그인), HDMI 는 영상과 음성을 한 줄로, SATA 는 디스크를 직렬로 잇는다',
    draw: function () {
      var s = '', X = [14, 170, 326], W = 140;
      ['USB', 'HDMI', 'SATA'].forEach(function (n, i) { s += t(X[i] + W / 2, 24, n, { a: 'm', size: 17, b: 1, c: [C.blue, C.orange, C.green][i] }); });
      /* USB 나무 */
      s += tower(24, 50, { w: 34, h: 56 });
      s += line(58, 78, 76, 78, { c: C.blue, w: 2 }) + box(76, 68, 30, 20, { fill: C.blueL, c: C.blue, w: 1.3, r: 3, label: '허브', size: 11 });
      [48, 78, 108].forEach(function (y) { s += line(106, 78, 122, y, { c: C.blue, w: 1.4 }) + box(122, y - 8, 22, 16, { fill: '#fff', c: C.blue, w: 1.2, r: 3 }); });
      s += t(84, 144, '최대 127개', { a: 'm', size: 15, b: 1, c: C.blue }) + t(84, 166, '직렬 · PnP', { a: 'm', size: 13, c: C.sub }) + t(84, 184, '핫 플러그인', { a: 'm', size: 13, c: C.sub });
      /* HDMI */
      s += tower(180, 50, { w: 30, h: 56 }) + monitor(262, 52, 44, 34, { fill: C.orangeL });
      s += line(210, 72, 262, 72, { c: C.orange, w: 2.2 }) + line(210, 80, 262, 80, { c: C.purple, w: 2.2 });
      s += t(236, 60, '영상', { a: 'm', size: 12, c: C.orange, b: 1 }) + t(236, 96, '음성', { a: 'm', size: 12, c: C.purple, b: 1 });
      s += t(240, 144, '케이블 하나로', { a: 'm', size: 15, b: 1, c: C.orange }) + t(240, 166, '고화질 영상 +', { a: 'm', size: 13, c: C.sub }) + t(240, 184, '다채널 음성', { a: 'm', size: 13, c: C.sub });
      /* SATA */
      s += box(336, 56, 46, 50, { fill: C.greenL, c: C.green, w: 1.4, r: 4, label: '보드', size: 12 }) + disk(418, 58, { w: 40, h: 44 });
      s += line(382, 80, 418, 80, { c: C.green, w: 2 });
      s += t(404, 144, '얇은 직렬 케이블', { a: 'm', size: 15, b: 1, c: C.green }) + t(404, 166, 'PATA(병렬)보다 빠름', { a: 'm', size: 13, c: C.sub }) + t(404, 184, '핫 플러그', { a: 'm', size: 13, c: C.sub });
      s += divider(163, 14, 196) + divider(319, 14, 196);
      return F.svg(480, 206, s);
    } };

  R.pixel = { topics: ['comp/hw'], cards: ['픽셀·해상도·재생률'],
    cap: '픽셀은 화면의 가장 작은 점, 해상도는 픽셀 수(선명도), 재생률은 1초에 화면을 다시 그리는 횟수(Hz)',
    draw: function () {
      var s = t(80, 24, '픽셀', { a: 'm', size: 16, b: 1, c: C.blue }) + t(240, 24, '해상도', { a: 'm', size: 16, b: 1, c: C.green }) + t(400, 24, '재생률', { a: 'm', size: 16, b: 1, c: C.orange });
      var shape = ['00111100', '01111110', '11011011', '11111111', '11111111', '11011011', '01100110', '00111100'];
      shape.forEach(function (r, i) { r.split('').forEach(function (b, j) { s += box(24 + j * 14, 40 + i * 14, 13, 13, { fill: b === '1' ? C.blue : '#fff', c: C.grayM, w: 0.6, r: 0 }); }); });
      s += box(24 + 6 * 14, 40 + 1 * 14, 13, 13, { fill: 'none', c: C.orange, w: 2.4, r: 0 });
      s += t(80, 172, '가장 작은 점 하나', { a: 'm', size: 13 });
      /* 해상도 */
      s += box(176, 44, 128, 80, { fill: '#fff', c: C.ink, w: 1.4, r: 2 });
      for (var i = 1; i < 16; i++) s += line(176 + i * 8, 44, 176 + i * 8, 124, { c: C.grayM, w: 0.6 });
      for (var j = 1; j < 10; j++) s += line(176, 44 + j * 8, 304, 44 + j * 8, { c: C.grayM, w: 0.6 });
      s += F.dim(176, 132, 304, 132, '가로 픽셀 수', { size: 13, side: -1, off: 0 });
      s += t(240, 172, '가로 × 세로 픽셀 수', { a: 'm', size: 13 }) + t(240, 192, '많을수록 선명', { a: 'm', size: 13, b: 1, c: C.green });
      /* 재생률 */
      for (var k = 0; k < 4; k++) s += box(348 + k * 10, 46 + k * 10, 74, 54, { fill: k === 3 ? C.orangeL : '#fff', c: C.orange, w: 1.3, r: 2 });
      s += t(400, 172, '1초에 다시 그리는', { a: 'm', size: 13 }) + t(400, 192, '횟수 (Hz)', { a: 'm', size: 13, b: 1, c: C.orange });
      s += divider(160, 14, 200) + divider(320, 14, 200);
      return F.svg(480, 210, s);
    } };

  R.clock = { topics: ['comp/hw'], cards: ['클럭 주파수(Hz)'],
    cap: '클럭 주파수 — CPU 가 1초에 몇 번 박자를 맞춰 동작하는지(Hz). 높을수록 처리 속도가 빠르다',
    draw: function () {
      var s = '';
      function wave(y, n, c) {
        var d = 'M100,' + (y + 30), w = 320 / n;
        for (var i = 0; i < n; i++) { var x = 100 + i * w; d += ' L' + x + ',' + y + ' L' + (x + w / 2) + ',' + y + ' L' + (x + w / 2) + ',' + (y + 30) + ' L' + (x + w) + ',' + (y + 30); }
        return path(d, { c: c, w: 2.2 });
      }
      s += t(20, 60, '낮은 클럭', { size: 15, b: 1 }) + wave(46, 4, C.sub);
      s += t(20, 132, '높은 클럭', { size: 15, b: 1, c: C.blue }) + wave(118, 12, C.blue);
      s += line(100, 170, 100, 182, { w: 1.4 }) + line(420, 170, 420, 182, { w: 1.4 }) + arrow(100, 176, 420, 176, { both: true, w: 1.2, head: 9 }) + t(260, 194, '1초', { a: 'm', size: 14, b: 1 });
      s += t(432, 62, '느림', { size: 14, c: C.sub }) + t(432, 134, '빠름', { size: 14, b: 1, c: C.blue });
      s += t(240, 226, '1초에 몇 번 똑딱이나 = 헤르츠(Hz)', { a: 'm', size: 15, b: 1 });
      return F.svg(480, 244, s);
    } };

  R.mainboard = { topics: ['comp/hw'], cards: ['메인보드(마더보드)'],
    cap: '메인보드 — CPU·메모리·그래픽 카드를 꽂아 잇는 기판. 칩셋이 데이터 흐름을 조절한다',
    draw: function () {
      var s = box(110, 20, 250, 226, { fill: C.greenL, c: C.green, w: 2, r: 6 });
      s += box(122, 32, 26, 70, { fill: '#d1d5db', c: C.ink, w: 1.2, r: 2 });
      s += box(170, 40, 70, 70, { fill: '#e5e7eb', c: C.ink, w: 1.6, r: 3 }) + box(182, 52, 46, 46, { fill: '#374151', c: C.ink, w: 1, r: 2 });
      s += t(205, 124, 'CPU 소켓', { a: 'm', size: 14, b: 1 });
      for (var i = 0; i < 4; i++) s += box(264 + i * 16, 34, 9, 96, { fill: C.blueL, c: C.blue, w: 1.2, r: 1 });
      s += box(130, 160, 120, 12, { fill: '#374151', c: C.ink, w: 1, r: 1 }) + box(130, 186, 120, 12, { fill: '#374151', c: C.ink, w: 1, r: 1 });
      s += box(270, 150, 50, 40, { fill: '#6b7280', c: C.ink, w: 1.2, r: 3 });
      s += box(300, 204, 26, 18, { fill: '#fde68a', c: C.orange, w: 1.2, r: 2 }) + circle(254, 222, 12, { fill: '#e5e7eb', c: C.ink, w: 1.4 });
      s += callout(122, 60, 96, 60, '포트', { size: 14, a: 'e' });
      s += callout(130, 180, 96, 180, '확장 슬롯', { size: 14, a: 'e' });
      s += callout(318, 60, 372, 60, '메모리 슬롯', { size: 14 });
      s += callout(320, 170, 372, 150, '칩셋', { size: 14, b: 1, c: C.purple, tc: C.purple });
      s += callout(326, 213, 372, 196, 'BIOS 칩', { size: 14 });
      s += callout(254, 234, 372, 236, 'CMOS 배터리', { size: 14 });
      return F.svg(480, 262, s);
    } };

  R.scanner = { topics: ['comp/hw'], cards: ['스캐너'],
    cap: '스캐너 — 종이를 읽어 디지털 이미지로 바꾼다(정밀도 DPI). OCR 을 쓰면 이미지에서 글자를 뽑아낸다',
    draw: function () {
      var s = '';
      s += doc(16, 50, { w: 50, h: 64 }) + t(41, 134, '종이 문서', { a: 'm', size: 13 });
      s += arrow(72, 82, 100, 82);
      s += box(104, 64, 100, 40, { fill: C.grayL, c: C.ink, w: 1.6, r: 5 }) + box(112, 70, 84, 14, { fill: '#fff', c: C.grayM, w: 1, r: 2 }) + line(150, 72, 150, 98, { c: C.blue, w: 3 });
      s += t(154, 124, '스캐너', { a: 'm', size: 14, b: 1 }) + t(154, 142, '정밀도 = DPI', { a: 'm', size: 13, c: C.sub });
      s += arrow(208, 82, 236, 82);
      s += box(240, 50, 70, 64, { fill: '#fff', c: C.ink, w: 1.4, r: 2 });
      for (var i = 0; i < 6; i++) for (var j = 0; j < 5; j++) if ((i * 7 + j * 3) % 4) s += box(248 + i * 9, 58 + j * 10, 8, 8, { fill: C.grayM, c: 'none', w: 0, r: 0 });
      s += t(275, 134, '이미지(그림)', { a: 'm', size: 13 });
      s += arrow(314, 82, 350, 82, { c: C.purple }) + t(332, 66, 'OCR', { a: 'm', size: 14, b: 1, c: C.purple });
      s += box(354, 50, 110, 64, { fill: C.purpleL, c: C.purple, w: 1.4, r: 4 }) + t(409, 72, '생산일보', { a: 'm', size: 15, b: 1, halo: false }) + t(409, 94, '고칠 수 있는 글자', { a: 'm', size: 12, c: C.sub, halo: false });
      s += t(409, 134, '글자(텍스트)', { a: 'm', size: 13 });
      s += t(240, 182, '입력 장치 — 읽기만 하면 그림, OCR 까지 하면 글자', { a: 'm', size: 14, b: 1 });
      return F.svg(480, 204, s);
    } };

  R.optical = { topics: ['comp/hw'], cards: ['블루레이 디스크(Blu-ray)'],
    cap: '광 디스크 — 레이저 파장이 짧을수록 점을 작게 찍어 촘촘하게 기록한다. 블루레이는 청자색 레이저, 한 층 25GB',
    draw: function () {
      var s = '', X = [80, 240, 400], nm = ['CD', 'DVD', '블루레이'], gap = [18, 12, 7], c = [C.red, C.red, C.purple];
      for (var i = 0; i < 3; i++) {
        s += t(X[i], 24, nm[i], { a: 'm', size: 17, b: 1, c: i === 2 ? C.purple : C.ink });
        s += box(X[i] - 60, 40, 120, 90, { fill: C.grayL, c: C.ink, w: 1.4, r: 4 });
        for (var r = 0; r * gap[i] < 76; r++) for (var k = 0; k * gap[i] * 1.6 < 104; k++) {
          var w = gap[i] * 0.9;
          s += box(X[i] - 54 + k * gap[i] * 1.6, 46 + r * gap[i], w, gap[i] * 0.45, { fill: '#6b7280', c: 'none', w: 0, r: 1 });
        }
        s += poly([[X[i] - 3 - gap[i] * 0.3, 190], [X[i] + 3 + gap[i] * 0.3, 190], [X[i] + gap[i] * 0.25, 134], [X[i] - gap[i] * 0.25, 134]], { close: 1, fill: i === 2 ? C.purpleL : C.redL, c: c[i], w: 1.4 });
      }
      s += t(80, 212, '파장 길다', { a: 'm', size: 13, c: C.sub }) + t(400, 212, '청자색 · 파장 짧다', { a: 'm', size: 13, b: 1, c: C.purple });
      s += arrow(130, 234, 350, 234, { c: C.purple, w: 1.8 }) + t(240, 222, '점이 작아져 더 촘촘히', { a: 'm', size: 13, b: 1, c: C.purple });
      s += t(400, 256, '한 층 25GB · HD 영상', { a: 'm', size: 14, b: 1 });
      return F.svg(480, 272, s);
    } };

  R.printers = { topics: ['comp/hw'], cards: ['레이저·잉크젯·도트 프린터'],
    cap: '레이저는 드럼·토너로 한 페이지씩(PPM), 잉크젯은 잉크를 뿌리고(IPM), 도트는 핀이 리본을 때린다(충격식·CPS)',
    draw: function () {
      var s = '', X = [14, 170, 326], W = 140;
      ['레이저', '잉크젯', '도트 매트릭스'].forEach(function (n, i) { s += t(X[i] + W / 2, 24, n, { a: 'm', size: 16, b: 1, c: [C.blue, C.green, C.orange][i] }); });
      /* 레이저: 드럼 + 토너 */
      s += circle(84, 84, 30, { fill: C.blueL, c: C.blue, w: 1.8 }) + t(84, 84, '드럼', { a: 'm', size: 13, b: 1, halo: false });
      s += box(24, 44, 34, 26, { fill: '#374151', c: C.ink, w: 1.2, r: 3 }) + t(41, 36, '토너', { a: 'm', size: 12, c: C.sub });
      s += line(30, 120, 140, 120, { c: C.ink, w: 2 });
      /* 잉크젯 */
      s += box(212, 46, 56, 30, { fill: C.greenL, c: C.green, w: 1.6, r: 4, label: '헤드', size: 12 });
      [[224, 90], [240, 98], [256, 90], [232, 106], [248, 110]].forEach(function (p) { s += circle(p[0], p[1], 3.5, { fill: C.green, c: C.green, w: 0.5 }); });
      s += line(186, 120, 294, 120, { c: C.ink, w: 2 });
      /* 도트: 핀 + 리본 */
      s += box(364, 44, 64, 28, { fill: C.orangeL, c: C.orange, w: 1.6, r: 4 });
      for (var p = 0; p < 5; p++) s += line(372 + p * 12, 72, 372 + p * 12, 100, { c: C.ink, w: 1.8 });
      s += box(350, 102, 92, 8, { fill: '#374151', c: C.ink, w: 1, r: 1 }) + line(342, 120, 450, 120, { c: C.ink, w: 2 });
      s += t(454, 88, '탁!', { a: 'e', size: 13, b: 1, c: C.red });
      var d = [['한 페이지씩', 'PPM', '분당 페이지'], ['잉크를 뿌림', 'IPM', '분당 이미지'], ['충격식 · 소음 큼', 'CPS', '초당 글자']];
      d.forEach(function (r, i) {
        s += t(X[i] + W / 2, 148, r[0], { a: 'm', size: 14 });
        s += pill(X[i] + W / 2, 162, r[1], { a: 'm', size: 14, b: 1, fill: [C.blueL, C.greenL, C.orangeL][i], c: [C.blue, C.green, C.orange][i] });
        s += t(X[i] + W / 2, 202, r[2], { a: 'm', size: 13, c: C.sub });
      });
      s += divider(163, 14, 212) + divider(319, 14, 212);
      return F.svg(480, 222, s);
    } };

  /* ════════════ 1과목 ⑥ 소프트웨어와 프로그래밍 ════════════ */
  R.swtree = { topics: ['comp/sw'], cards: ['시스템 소프트웨어', '응용 소프트웨어', '유틸리티 프로그램', '제어 프로그램', '처리 프로그램'],
    cap: '소프트웨어 가계도 — 시스템 소프트웨어(운영체제 = 제어 프로그램 + 처리 프로그램)와 응용 소프트웨어',
    draw: function () {
      var s = box(180, 12, 120, 30, { fill: C.grayL, c: C.ink, w: 1.4, r: 6, label: '소프트웨어', size: 15 });
      s += line(240, 42, 240, 52, { w: 1.4 }) + line(130, 52, 390, 52, { w: 1.4 }) + line(130, 52, 130, 62, { w: 1.4 }) + line(390, 52, 390, 62, { w: 1.4 });
      s += box(50, 62, 160, 34, { fill: C.blueL, c: C.blue, w: 1.6, r: 6, label: '시스템 소프트웨어', size: 15 });
      s += box(320, 62, 140, 34, { fill: C.greenL, c: C.green, w: 1.6, r: 6, label: '응용 소프트웨어', size: 15 });
      s += t(390, 114, '특정 업무용', { a: 'm', size: 13 }) + t(390, 134, '워드프로세서', { a: 'm', size: 13, c: C.sub }) + t(390, 152, '스프레드시트', { a: 'm', size: 13, c: C.sub }) + t(390, 170, '프레젠테이션', { a: 'm', size: 13, c: C.sub });
      s += line(130, 96, 130, 122, { w: 1.4 });
      s += box(70, 122, 120, 30, { fill: '#fff', c: C.blue, w: 1.6, r: 6, label: '운영체제', size: 15 });
      s += line(130, 152, 130, 162, { w: 1.4 }) + line(70, 162, 200, 162, { w: 1.4 }) + line(70, 162, 70, 172, { w: 1.4 }) + line(200, 162, 200, 172, { w: 1.4 });
      s += box(14, 172, 116, 30, { fill: C.orangeL, c: C.orange, w: 1.4, r: 6, label: '제어 프로그램', size: 14 });
      s += box(142, 172, 116, 30, { fill: C.purpleL, c: C.purple, w: 1.4, r: 6, label: '처리 프로그램', size: 14 });
      s += t(72, 216, '감시', { a: 'm', size: 13 }) + t(72, 234, '작업 관리', { a: 'm', size: 13 }) + t(72, 252, '데이터 관리', { a: 'm', size: 13 });
      s += t(200, 216, '언어 번역', { a: 'm', size: 13 }) + t(200, 234, '서비스(유틸리티)', { a: 'm', size: 13 }) + t(200, 252, '문제 처리', { a: 'm', size: 13 });
      s += box(282, 196, 186, 60, { fill: C.yellowL, c: C.grayM, w: 1, r: 8 }) + t(375, 214, '유틸리티 = 보조 프로그램', { a: 'm', size: 13, b: 1, halo: false }) + t(375, 236, '압축 · 백신 · 디스크 관리', { a: 'm', size: 13, halo: false });
      return F.svg(480, 270, s);
    } };

  R.license = { topics: ['comp/sw'], cards: ['프리웨어 / 셰어웨어', '데모 / 트라이얼 버전'],
    cap: '사용권으로 나눈 소프트웨어 — 기능이 온전한가, 기간이 정해졌는가로 구분한다',
    draw: function () {
      var s = t(210, 24, '기능', { a: 'm', size: 15, b: 1 }) + t(380, 24, '기간', { a: 'm', size: 15, b: 1 });
      var rows = [['프리웨어', 1, 1, '무료로 계속'], ['셰어웨어', 0.55, 0.55, '제한 → 계속 쓰려면 구입'], ['데모', 0.4, 1, '일부 기능만 소개'], ['트라이얼', 1, 0.35, '일정 기간만']];
      rows.forEach(function (r, i) {
        var y = 42 + i * 52, c = [C.green, C.orange, C.blue, C.purple][i], f = [C.greenL, C.orangeL, C.blueL, C.purpleL][i];
        s += t(16, y + 12, r[0], { size: 15, b: 1, c: c });
        s += box(140, y, 140, 22, { fill: '#fff', c: C.grayM, w: 1, r: 3 }) + box(140, y, 140 * r[1], 22, { fill: f, c: c, w: 1.4, r: 3 });
        s += box(310, y, 140, 22, { fill: '#fff', c: C.grayM, w: 1, r: 3 }) + box(310, y, 140 * r[2], 22, { fill: f, c: c, w: 1.4, r: 3 });
        if (r[2] === 1) s += t(440, y + 11, '∞', { a: 'e', size: 15, b: 1, c: c, halo: false });
        s += t(140, y + 36, r[3], { size: 13, c: C.sub });
      });
      s += t(460, 248, '셰어웨어는 기능이나 기간 중 제한', { a: 'e', size: 12, c: C.sub });
      return F.svg(480, 260, s);
    } };

  R.release = { topics: ['comp/sw'], cards: ['알파 / 베타 버전', '패치 프로그램'],
    cap: '출시 순서 — 알파(개발사 안에서 시험) → 베타(일반 사용자에게 시험 배포) → 정식 → 패치(오류 수정·기능 보완)',
    draw: function () {
      var s = '', X = [60, 180, 300, 420], nm = ['알파', '베타', '정식 출시', '패치'], c = [C.sub, C.blue, C.green, C.orange];
      s += arrow(20, 100, 460, 100, { c: C.grayM, w: 2, head: 10 });
      nm.forEach(function (n, i) { s += circle(X[i], 100, 9, { fill: c[i], c: c[i], w: 1 }) + t(X[i], 30, n, { a: 'm', size: 16, b: 1, c: c[i] }); });
      /* 알파: 회사 안 */
      s += box(30, 44, 60, 40, { fill: C.grayL, c: C.sub, w: 1.4, r: 4 }) + person(48, 54, { fill: '#fff' }) + person(72, 54, { fill: '#fff' });
      /* 베타: 사용자 */
      s += person(160, 54, { fill: C.blueL, c: C.blue }) + person(182, 54, { fill: C.blueL, c: C.blue }) + person(204, 54, { fill: C.blueL, c: C.blue });
      /* 정식 */
      s += box(280, 46, 40, 40, { fill: C.greenL, c: C.green, w: 1.6, r: 6, label: '1.0', size: 15 });
      /* 패치: 조각 */
      s += box(394, 46, 52, 40, { fill: '#fff', c: C.orange, w: 1.6, r: 6 }) + box(412, 56, 18, 20, { fill: C.orange, c: C.orange, w: 1, r: 2 });
      var d = [['개발사 내부', '테스트'], ['출시 전 사용자', '테스트'], ['판매 · 배포', ''], ['일부만 고쳐', '오류 수정']];
      d.forEach(function (r, i) { s += t(X[i], 128, r[0], { a: 'm', size: 13 }) + t(X[i], 146, r[1], { a: 'm', size: 13, c: C.sub }); });
      return F.svg(480, 164, s);
    } };

  R.compile = { topics: ['comp/sw'], cards: ['컴파일러 / 인터프리터'], slide: ['comp/sw#0'],
    cap: '컴파일러는 전체를 한 번에 번역해 목적 프로그램을 만들고(실행 빠름), 인터프리터는 한 줄씩 번역·실행한다(목적 프로그램 없음)',
    draw: function () {
      var s = t(20, 26, '컴파일러', { size: 16, b: 1, c: C.blue });
      s += doc(24, 40, { w: 40, h: 50 }) + t(44, 106, '원시 프로그램', { a: 'm', size: 12, c: C.sub });
      s += arrow(70, 64, 120, 64, { c: C.blue });
      s += box(124, 44, 96, 40, { fill: C.blueL, c: C.blue, w: 1.6, r: 6, label: '전체 번역', size: 14 });
      s += arrow(224, 64, 262, 64, { c: C.blue });
      s += doc(266, 40, { w: 40, h: 50, fill: C.blueL, c: C.blue }) + t(286, 106, '목적 프로그램', { a: 'm', size: 12, b: 1, c: C.blue });
      s += arrow(312, 64, 350, 64, { c: C.blue }) + box(354, 44, 60, 40, { fill: C.greenL, c: C.green, w: 1.4, r: 6, label: '실행', size: 14 });
      s += t(460, 64, '빠름', { a: 'e', size: 14, b: 1, c: C.green });
      s += hdiv(122);
      s += t(20, 146, '인터프리터', { size: 16, b: 1, c: C.orange });
      ['1줄', '2줄', '3줄'].forEach(function (l, i) {
        var y = 162 + i * 30;
        s += box(24, y, 50, 24, { fill: '#fff', c: C.ink, w: 1.2, r: 3, label: l, size: 13 });
        s += arrow(78, y + 12, 118, y + 12, { c: C.orange, w: 1.6, head: 8 });
        s += box(122, y, 120, 24, { fill: C.orangeL, c: C.orange, w: 1.2, r: 3, label: '번역 → 바로 실행', size: 13 });
      });
      s += t(270, 178, '목적 프로그램이', { size: 14 }) + t(270, 200, '생기지 않는다 ✕', { size: 14, b: 1, c: C.red });
      s += t(270, 228, '실행은 느림', { size: 13, c: C.sub });
      return F.svg(480, 262, s);
    } };

  R.oop = { topics: ['comp/sw'], cards: ['객체 지향 프로그래밍'],
    cap: '객체 지향 — 데이터와 동작을 하나의 객체로 묶고(캡슐화), 부모의 것을 물려받는다(상속). 설비를 예로',
    draw: function () {
      var s = box(150, 16, 180, 96, { fill: C.blueL, c: C.blue, w: 1.8, r: 8 });
      s += t(240, 34, '설비', { a: 'm', size: 16, b: 1, halo: false }) + line(150, 46, 330, 46, { c: C.blue, w: 1 });
      s += t(162, 62, '데이터  번호 · 온도', { size: 14, halo: false }) + line(150, 76, 330, 76, { c: C.blue, w: 1 }) + t(162, 94, '동작  가동() · 정지()', { size: 14, halo: false });
      s += callout(330, 70, 372, 70, '캡슐화', { size: 14, b: 1, c: C.blue, tc: C.blue }) + t(378, 90, '(묶는다)', { size: 13, c: C.sub });
      s += box(40, 164, 160, 56, { fill: C.greenL, c: C.green, w: 1.6, r: 8 }) + t(120, 182, '로봇', { a: 'm', size: 15, b: 1, halo: false }) + t(120, 204, '+ 용접()', { a: 'm', size: 14, halo: false });
      s += box(280, 164, 160, 56, { fill: C.greenL, c: C.green, w: 1.6, r: 8 }) + t(360, 182, '컨베이어', { a: 'm', size: 15, b: 1, halo: false }) + t(360, 204, '+ 속도조절()', { a: 'm', size: 14, halo: false });
      s += arrow(120, 162, 200, 116, { c: C.green, w: 1.8 }) + arrow(360, 162, 280, 116, { c: C.green, w: 1.8 });
      s += t(240, 146, '상속', { a: 'm', size: 15, b: 1, c: C.green });
      s += t(240, 246, 'C++ · Java · Python', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 262, s);
    } };

  R.web = { topics: ['comp/sw'], cards: ['웹 프로그래밍 언어', 'ASP / PHP / JSP'],
    cap: '브라우저 쪽은 HTML(구조)·CSS(디자인)·JavaScript(동작), 서버 쪽은 ASP·PHP·JSP 가 실행되어 웹 페이지를 만들어 보낸다',
    draw: function () {
      var s = t(110, 24, '내 브라우저', { a: 'm', size: 16, b: 1 }) + t(380, 24, '서버', { a: 'm', size: 16, b: 1, c: C.purple });
      s += win(14, 38, 200, 170, '');
      var L = [['HTML', '문서 구조(뼈대)', C.blue, C.blueL], ['CSS', '디자인(모양)', C.green, C.greenL], ['JavaScript', '동작', C.orange, C.orangeL]];
      L.forEach(function (l, i) { var y = 70 + i * 44; s += box(26, y, 176, 36, { fill: l[3], c: l[2], w: 1.4, r: 6 }) + t(36, y + 18, l[0], { size: 14, b: 1, c: l[2], halo: false }) + t(194, y + 18, l[1], { a: 'e', size: 13, halo: false }); });
      s += server(356, 56, { w: 50 }) + box(300, 120, 160, 86, { fill: C.purpleL, c: C.purple, w: 1.4, r: 8 });
      s += t(380, 138, '서버에서 실행', { a: 'm', size: 13, b: 1, halo: false });
      s += t(312, 162, 'ASP — Windows', { size: 13, halo: false }) + t(312, 180, 'PHP — 여러 OS', { size: 13, halo: false }) + t(312, 198, 'JSP — 자바 기반', { size: 13, halo: false });
      s += arrow(296, 150, 218, 150, { c: C.purple, w: 1.8 }) + t(257, 136, 'HTML', { a: 'm', size: 12, b: 1, c: C.purple });
      s += arrow(218, 90, 296, 90, { c: C.sub, w: 1.4, dash: '5 4' }) + t(257, 78, '요청', { a: 'm', size: 12, c: C.sub });
      s += t(240, 232, 'XML — 데이터 구조를 정의하는 언어', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 248, s);
    } };

  R.osmode = { topics: ['comp/sw'], cards: ['운영체제 운영 방식'],
    cap: '운영 방식 — 일괄(모아서 한 번에) · 실시간(즉시) · 시분할(CPU 시간을 나눠) · 분산(여러 컴퓨터가 나눠)',
    draw: function () {
      var s = '', rows = ['일괄 처리', '실시간 처리', '시분할', '분산 처리'], c = [C.sub, C.red, C.blue, C.green];
      rows.forEach(function (r, i) { s += t(16, 36 + i * 56, r, { size: 15, b: 1, c: c[i] }); });
      /* 일괄 */
      for (var k = 0; k < 5; k++) s += doc(120 + k * 10, 18 - k * 2 + 6, { w: 20, h: 24, lines: false });
      s += arrow(186, 36, 236, 36) + box(240, 22, 70, 28, { fill: C.grayL, c: C.ink, w: 1.2, r: 4, label: '한 번에', size: 13 });
      s += t(324, 36, '모아서 한꺼번에', { size: 13, c: C.sub });
      /* 실시간 */
      s += doc(120, 78, { w: 20, h: 24, lines: false }) + arrow(146, 92, 236, 92, { c: C.red }) + box(240, 78, 70, 28, { fill: C.redL, c: C.red, w: 1.2, r: 4, label: '즉시', size: 13 });
      s += t(324, 92, '들어오는 즉시', { size: 13, c: C.sub });
      /* 시분할 */
      var seq = ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'];
      seq.forEach(function (q, k) { var f = { A: C.blueL, B: C.greenL, C: C.orangeL }[q]; s += box(120 + k * 22, 134, 20, 28, { fill: f, c: C.blue, w: 1, r: 2, label: q, size: 12 }); });
      s += t(324, 148, '조금씩 번갈아', { size: 13, c: C.sub });
      /* 분산 */
      [0, 1, 2].forEach(function (k) { s += monitor(120 + k * 56, 186, 40, 26, { fill: C.greenL }); });
      s += line(140, 222, 252, 222, { c: C.green, w: 1.6 });
      s += t(324, 204, '여러 대가 나눠', { size: 13, c: C.sub });
      return F.svg(480, 236, s);
    } };

  R.deadlock = { topics: ['comp/sw'], cards: ['교착 상태(Deadlock)'],
    cap: '교착 상태 — 두 프로세스가 서로 상대가 쥔 자원을 기다리며 무한정 멈춘다',
    draw: function () {
      var s = '';
      s += circle(110, 70, 36, { fill: C.blueL, c: C.blue, w: 2, label: '프로세스\nA', size: 14 });
      s += circle(370, 190, 36, { fill: C.orangeL, c: C.orange, w: 2, label: '프로세스\nB', size: 14 });
      s += box(320, 40, 100, 50, { fill: C.grayL, c: C.ink, w: 1.6, r: 6, label: '자원 1', size: 15 });
      s += box(60, 160, 100, 50, { fill: C.grayL, c: C.ink, w: 1.6, r: 6, label: '자원 2', size: 15 });
      s += arrow(318, 64, 150, 64, { c: C.green, w: 2.4 }) + t(234, 50, 'A 가 쥐고 있음', { a: 'm', size: 13, b: 1, c: C.green });
      s += arrow(110, 108, 110, 156, { c: C.red, w: 2, dash: '6 4' }) + t(122, 132, 'A 가 기다림', { size: 13, b: 1, c: C.red });
      s += arrow(162, 196, 330, 196, { c: C.green, w: 2.4 }) + t(246, 212, 'B 가 쥐고 있음', { a: 'm', size: 13, b: 1, c: C.green });
      s += arrow(370, 152, 370, 94, { c: C.red, w: 2, dash: '6 4' }) + t(358, 124, 'B 가 기다림', { a: 'e', size: 13, b: 1, c: C.red });
      s += t(240, 132, '↻', { a: 'm', size: 30, b: 1, c: C.red });
      s += t(240, 244, '서로 놓지 않고 기다리기만 → 둘 다 멈춤', { a: 'm', size: 14, b: 1 });
      return F.svg(480, 260, s);
    } };

  R.build = { topics: ['comp/sw'], cards: ['링커 / 로더'], slide: ['comp/sw#3'],
    cap: '실행되기까지 — 컴파일러가 목적 프로그램을, 링커가 실행 파일을 만들고, 로더가 주기억장치에 올려 실행한다',
    draw: function () {
      var s = '';
      function node(x, y, w, lbl, sub, f, c) { return box(x, y, w, 50, { fill: f || '#fff', c: c || C.ink, w: 1.5, r: 6 }) + t(x + w / 2, y + 19, lbl, { a: 'm', size: 14, b: 1, halo: false }) + (sub ? t(x + w / 2, y + 37, sub, { a: 'm', size: 12, c: C.sub, halo: false }) : ''); }
      function tool(x, y, lbl, c, f) { return box(x, y, 84, 30, { fill: f, c: c, w: 1.6, r: 15, label: lbl, size: 14, b: 1 }); }
      s += node(14, 30, 108, '원시 프로그램', '사람이 쓴 코드');
      s += arrow(124, 55, 146, 55) + tool(148, 40, '컴파일러', C.blue, C.blueL) + arrow(234, 55, 256, 55);
      s += node(258, 30, 108, '목적 프로그램', '기계어');
      s += F.route([[368, 55], [440, 55], [440, 125], [388, 125]], { c: C.ink, w: 2.2 });
      s += tool(300, 110, '링커', C.orange, C.orangeL) + t(342, 158, '+ 라이브러리', { a: 'm', size: 12, c: C.orange });
      s += arrow(298, 125, 268, 125);
      s += node(156, 100, 110, '실행 파일', '(로드 모듈)', C.greenL, C.green);
      s += arrow(154, 125, 126, 125) + tool(40, 110, '로더', C.purple, C.purpleL);
      s += arrow(82, 142, 82, 180);
      s += box(30, 184, 180, 44, { fill: C.grayL, c: C.ink, w: 1.6, r: 6, label: '주기억장치에 올려 실행', size: 14 });
      s += box(240, 184, 226, 44, { fill: C.yellowL, c: C.grayM, w: 1, r: 8 });
      s += t(353, 198, '링커 = 연결해 실행 파일로', { a: 'm', size: 13, halo: false }) + t(353, 216, '로더 = 메모리에 올린다', { a: 'm', size: 13, halo: false });
      return F.svg(480, 244, s);
    } };


  /* ════════════ 1과목 ⑦ 인터넷 활용 ════════════ */
  function cloud(cx, cy, w, h, o) {
    o = o || {};
    var x = cx - w / 2, y = cy - h / 2;
    var d = 'M' + (x + w * 0.2) + ',' + (y + h) + ' Q' + x + ',' + (y + h) + ' ' + x + ',' + (y + h * 0.7) + ' Q' + x + ',' + (y + h * 0.4) + ' ' + (x + w * 0.2) + ',' + (y + h * 0.42) +
      ' Q' + (x + w * 0.25) + ',' + y + ' ' + (x + w * 0.5) + ',' + (y + h * 0.1) + ' Q' + (x + w * 0.75) + ',' + (y - h * 0.05) + ' ' + (x + w * 0.8) + ',' + (y + h * 0.4) +
      ' Q' + (x + w) + ',' + (y + h * 0.4) + ' ' + (x + w) + ',' + (y + h * 0.7) + ' Q' + (x + w) + ',' + (y + h) + ' ' + (x + w * 0.8) + ',' + (y + h) + ' Z';
    return path(d, { fill: o.fill || C.blueL, c: o.c || C.blue, w: 1.6 }) + (o.label ? t(cx, cy + h * 0.12, o.label, { a: 'm', size: o.size || 15, b: 1, halo: false }) : '');
  }
  function packet(x, y, lbl, o) {
    o = o || {};
    return box(x, y, o.w || 30, 20, { fill: o.fill || C.orangeL, c: o.c || C.orange, w: 1.3, r: 3, label: lbl, size: 12 });
  }
  function router(cx, cy, o) {
    o = o || {};
    return circle(cx, cy, o.r || 14, { fill: o.fill || '#fff', c: o.c || C.ink, w: 1.6 }) +
      line(cx - 7, cy, cx + 7, cy, { c: o.c || C.ink, w: 1.4 }) + line(cx, cy - 7, cx, cy + 7, { c: o.c || C.ink, w: 1.4 });
  }
  function phone(x, y, o) {
    o = o || {};
    return box(x, y, o.w || 26, o.h || 44, { fill: o.fill || '#fff', c: C.ink, w: 1.6, r: 5 }) + box(x + 3, y + 5, (o.w || 26) - 6, (o.h || 44) - 13, { fill: o.scr || C.blueL, c: 'none', w: 0, r: 2 });
  }

  R.tcpip = { topics: ['comp/net'], cards: ['TCP/IP'],
    cap: 'TCP 는 자료를 패킷으로 나누고 오류를 검사하며, IP 는 패킷에 주소를 붙여 길을 찾아 보낸다',
    draw: function () {
      var s = '';
      s += doc(16, 40, { w: 36, h: 46 }) + t(34, 102, '보낼 자료', { a: 'm', size: 13 });
      s += arrow(58, 64, 88, 64);
      [0, 1, 2].forEach(function (i) { s += packet(94, 38 + i * 24, (i + 1) + '', { w: 34 }); });
      s += t(111, 128, 'TCP', { a: 'm', size: 15, b: 1, c: C.orange }) + t(111, 146, '나누고 번호', { a: 'm', size: 12, c: C.sub }) + t(111, 162, '오류 검사', { a: 'm', size: 12, c: C.sub });
      /* 길 */
      var R1 = [210, 44], R2 = [210, 120], R3 = [300, 82];
      s += line(132, 64, R1[0], R1[1], { c: C.grayM, w: 1.6 }) + line(132, 64, R2[0], R2[1], { c: C.grayM, w: 1.6 }) + line(R1[0], R1[1], R3[0], R3[1], { c: C.grayM, w: 1.6 }) +
        line(R2[0], R2[1], R3[0], R3[1], { c: C.grayM, w: 1.6 }) + line(R3[0], R3[1], 372, 82, { c: C.grayM, w: 1.6 });
      s += router(R1[0], R1[1]) + router(R2[0], R2[1]) + router(R3[0], R3[1]);
      s += packet(150, 30, '1', { w: 24, fill: C.blueL, c: C.blue }) + packet(160, 106, '2', { w: 24, fill: C.blueL, c: C.blue }) + packet(240, 44, '3', { w: 24, fill: C.blueL, c: C.blue });
      s += t(250, 160, 'IP — 받는 곳 주소를 붙여', { a: 'm', size: 14, b: 1, c: C.blue }) + t(250, 180, '패킷마다 길을 찾아 보낸다', { a: 'm', size: 13, c: C.sub });
      [0, 1, 2].forEach(function (i) { s += packet(378, 58 + i * 0, '', { w: 0 }); });
      s += box(376, 46, 90, 72, { fill: C.greenL, c: C.green, w: 1.6, r: 8 });
      [0, 1, 2].forEach(function (i) { s += packet(386 + i * 24, 58, (i + 1) + '', { w: 22, fill: '#fff', c: C.green }); });
      s += t(421, 100, '다시 조립', { a: 'm', size: 13, b: 1, c: C.green, halo: false });
      s += t(421, 138, '받는 컴퓨터', { a: 'm', size: 13 });
      return F.svg(480, 196, s);
    } };

  R.ip46 = { topics: ['comp/net'], cards: ['IPv4 / IPv6'],
    cap: 'IPv4 는 32비트를 8비트씩 4부분(점으로 구분), IPv6 는 128비트를 16비트씩 8부분(콜론으로 구분) — 주소 숫자는 예',
    draw: function () {
      var s = t(20, 28, 'IPv4', { size: 17, b: 1, c: C.blue }) + t(88, 28, '32비트 = 8비트 × 4', { size: 14, c: C.sub });
      ['192', '168', '0', '25'].forEach(function (v, i) {
        s += box(24 + i * 104, 44, 80, 34, { fill: C.blueL, c: C.blue, w: 1.4, r: 4, label: v, size: 16 });
        if (i < 3) s += t(24 + i * 104 + 92, 62, '.', { a: 'm', size: 24, b: 1, c: C.blue });
      });
      s += t(20, 118, 'IPv6', { size: 17, b: 1, c: C.green }) + t(88, 118, '128비트 = 16비트 × 8', { size: 14, c: C.sub });
      ['2001', '0db8', '85a3', '0000', '0000', '8a2e', '0370', '7334'].forEach(function (v, i) {
        s += box(20 + i * 56, 134, 46, 30, { fill: C.greenL, c: C.green, w: 1.3, r: 4, label: v, size: 13 });
        if (i < 7) s += t(20 + i * 56 + 51, 149, ':', { a: 'm', size: 18, b: 1, c: C.green });
      });
      s += t(240, 196, 'IPv6 — 주소 부족 문제를 해결', { a: 'm', size: 14, b: 1 });
      return F.svg(480, 214, s);
    } };

  R.dns = { topics: ['comp/net'], cards: ['도메인 네임', 'DNS(Domain Name System)'], slide: ['comp/net#0'],
    cap: 'DNS — 사람이 외우기 쉬운 도메인 네임을 컴퓨터가 쓰는 숫자 IP 주소로 바꿔 준다(숫자는 예)',
    draw: function () {
      var s = '';
      s += monitor(20, 70, 76, 54, { fill: C.blueL }) + t(58, 152, '내 컴퓨터', { a: 'm', size: 14, b: 1 });
      s += server(214, 20, { w: 52 }) + t(240, 90, 'DNS 서버', { a: 'm', size: 15, b: 1, c: C.purple });
      s += server(392, 90, { w: 52 }) + t(418, 160, '웹 서버', { a: 'm', size: 14, b: 1 });
      s += arrow(96, 76, 206, 40, { c: C.blue, w: 1.8 });
      s += box(70, 22, 128, 26, { fill: '#fff', c: C.blue, w: 1.2, r: 13, label: 'www.school.go.kr ?', size: 13 });
      s += arrow(210, 64, 102, 96, { c: C.purple, w: 1.8 });
      s += box(118, 98, 108, 26, { fill: C.purpleL, c: C.purple, w: 1.2, r: 13, label: '203.0.113.7', size: 13 });
      s += arrow(100, 132, 386, 118, { c: C.green, w: 2.2 }) + t(254, 142, '숫자 주소로 접속', { a: 'm', size: 13, b: 1, c: C.green });
      s += box(20, 180, 440, 50, { fill: C.yellowL, c: C.grayM, w: 1, r: 8 });
      s += t(240, 196, '도메인 네임 = 숫자 IP 를 문자로 표현한 것', { a: 'm', size: 14, b: 1, halo: false }) + t(240, 216, 'DNS = 문자 → 숫자로 바꿔 주는 시스템', { a: 'm', size: 13, halo: false });
      return F.svg(480, 244, s);
    } };

  R.url = { topics: ['comp/net'], cards: ['URL'], slide: ['comp/net#3'],
    cap: 'URL 뜯어보기 — 프로토콜://호스트 주소[:포트 번호][/경로/파일 이름]',
    draw: function () {
      var parts = [['https://', '프로토콜', C.blue, C.blueL], ['www.school.go.kr', '호스트(도메인)', C.green, C.greenL], [':443', '포트', C.orange, C.orangeL], ['/notice/list.html', '경로 · 파일', C.purple, C.purpleL]];
      var s = '', x = 14;
      parts.forEach(function (p, i) {
        var w = tw(p[0], 15) + 12;
        s += box(x, 44, w, 36, { fill: p[3], c: p[2], w: 1.6, r: 4, label: p[0], size: 15 });
        s += path('M' + (x + 2) + ',86 V92 H' + (x + w - 2) + ' V86', { c: p[2], w: 1.4 });
        s += t(x + w / 2, i % 2 ? 132 : 110, p[1], { a: 'm', size: 14, b: 1, c: p[2] });
        s += line(x + w / 2, 92, x + w / 2, i % 2 ? 122 : 100, { c: p[2], w: 1.2 });
        x += w + 2;
      });
      s += t(354, 150, '(생략 가능)', { a: 'm', size: 13, c: C.orange });
      s += t(240, 180, '[ ] 안은 생략할 수 있다', { a: 'm', size: 13, c: C.sub });
      s += t(240, 22, '주소 예', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 198, s);
    } };

  R.mail = { topics: ['comp/net'], cards: ['HTTP / FTP / SMTP / POP3'],
    cap: '프로토콜 — HTTP 는 웹 문서, FTP 는 파일, SMTP 는 메일 보내기, POP3 는 메일 받기',
    draw: function () {
      var s = t(20, 24, '메일', { size: 15, b: 1 });
      s += monitor(20, 40, 60, 42, { fill: C.orangeL }) + t(50, 108, '보내는 사람', { a: 'm', size: 13 });
      s += server(214, 36, { w: 52 }) + t(240, 108, '메일 서버', { a: 'm', size: 13 });
      s += monitor(400, 40, 60, 42, { fill: C.greenL }) + t(430, 108, '받는 사람', { a: 'm', size: 13 });
      s += arrow(84, 62, 206, 62, { c: C.orange, w: 2 }) + pill(145, 36, 'SMTP 보내기', { a: 'm', size: 13, b: 1, fill: C.orangeL, c: C.orange });
      s += arrow(272, 62, 396, 62, { c: C.green, w: 2 }) + pill(334, 36, 'POP3 받기', { a: 'm', size: 13, b: 1, fill: C.greenL, c: C.green });
      s += hdiv(126);
      s += t(20, 150, '웹', { size: 15, b: 1 }) + monitor(20, 162, 52, 36, { fill: C.blueL }) + arrow(78, 180, 146, 180, { c: C.blue, both: true, w: 1.8 }) + server(152, 162, { w: 40 });
      s += pill(112, 222, 'HTTP — 웹 문서', { a: 'm', size: 13, b: 1, fill: C.blueL, c: C.blue });
      s += t(252, 150, '파일', { size: 15, b: 1 }) + monitor(252, 162, 52, 36, { fill: C.purpleL }) + arrow(310, 180, 378, 180, { c: C.purple, both: true, w: 1.8 }) + server(384, 162, { w: 40 });
      s += pill(344, 222, 'FTP — 파일 송수신', { a: 'm', size: 13, b: 1, fill: C.purpleL, c: C.purple });
      return F.svg(480, 256, s);
    } };

  R.cookie = { topics: ['comp/net'], cards: ['쿠키(Cookie)', '웹 브라우저 캐시'], slide: ['comp/net#5'],
    cap: '쿠키는 «나에 대한 방문 정보», 캐시는 «열어 본 페이지를 저장해 다음에 빨리 열기» — 둘 다 내 컴퓨터에 남는다',
    draw: function () {
      var s = server(410, 60, { w: 50 }) + t(435, 130, '웹 사이트', { a: 'm', size: 13 });
      s += box(14, 30, 300, 190, { fill: C.grayL, c: C.ink, w: 1.4, r: 8 }) + t(30, 48, '내 컴퓨터', { size: 14, b: 1, halo: false });
      s += box(28, 64, 132, 140, { fill: C.orangeL, c: C.orange, w: 1.6, r: 8 });
      s += t(94, 84, '쿠키', { a: 'm', size: 16, b: 1, c: C.orange, halo: false });
      s += t(94, 110, '방문 정보 파일', { a: 'm', size: 13, halo: false }) + t(94, 134, '로그인 유지', { a: 'm', size: 13, c: C.sub, halo: false }) + t(94, 154, '장바구니', { a: 'm', size: 13, c: C.sub, halo: false });
      s += t(94, 184, '개인 정보 유출 우려', { a: 'm', size: 12, b: 1, c: C.red, halo: false });
      s += box(170, 64, 132, 140, { fill: C.blueL, c: C.blue, w: 1.6, r: 8 });
      s += t(236, 84, '캐시', { a: 'm', size: 16, b: 1, c: C.blue, halo: false });
      s += t(236, 110, '열어 본 페이지', { a: 'm', size: 13, halo: false }) + t(236, 130, '그림 · 파일 저장', { a: 'm', size: 13, halo: false });
      s += t(236, 160, '다시 가면', { a: 'm', size: 13, c: C.sub, halo: false }) + t(236, 180, '빨리 열린다', { a: 'm', size: 13, b: 1, c: C.green, halo: false });
      s += arrow(404, 84, 318, 84, { c: C.sub, w: 1.6 });
      s += t(240, 244, '둘 다 [삭제]할 수 있다 — 공용 PC 에서는 지우고 나오기', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 260, s);
    } };

  R.iotcloud = { topics: ['comp/net'], cards: ['클라우드 컴퓨팅', 'IoT(사물 인터넷)'],
    cap: '사물 인터넷(IoT)은 설비의 센서가 인터넷으로 데이터를 보내고, 클라우드는 그 데이터·프로그램을 인터넷 서버에 두고 어디서나 쓴다',
    draw: function () {
      var s = t(96, 24, 'IoT — 공장 설비', { a: 'm', size: 15, b: 1, c: C.orange });
      [0, 1].forEach(function (i) {
        var y = 44 + i * 78;
        s += box(24, y, 110, 56, { fill: C.grayL, c: C.ink, w: 1.6, r: 6 }) + t(79, y + 28, (i + 1) + '호기', { a: 'm', size: 14, b: 1, halo: false });
        s += circle(126, y + 10, 8, { fill: C.orange, c: C.orange, w: 1 }) + t(126, y + 10.5, 'S', { a: 'm', size: 10, b: 1, c: '#fff', halo: false });
        s += arrow(138, y + 22, 202, 96, { c: C.orange, w: 1.6, dash: '5 4', head: 9 });
      });
      s += t(79, 196, 'S = 센서(온도·진동)', { a: 'm', size: 13, c: C.sub });
      s += cloud(262, 92, 120, 80, { label: '클라우드' }) + t(262, 150, '인터넷 서버에', { a: 'm', size: 13 }) + t(262, 168, '데이터·프로그램', { a: 'm', size: 13 });
      s += arrow(322, 80, 386, 56, { c: C.blue, w: 1.6 }) + arrow(322, 110, 386, 132, { c: C.blue, w: 1.6 });
      s += monitor(392, 30, 56, 40, { fill: C.blueL }) + t(420, 96, '사무실', { a: 'm', size: 13 });
      s += phone(406, 116) + t(420, 178, '휴대폰', { a: 'm', size: 13 });
      s += t(262, 214, '어디서나 꺼내 쓴다', { a: 'm', size: 14, b: 1, c: C.blue });
      return F.svg(480, 232, s);
    } };

  R.udp = { topics: ['comp/net'], cards: ['UDP'],
    cap: 'TCP 는 받았는지 확인하며 보내 믿을 만하고, UDP 는 확인 없이 빠르게 보내 실시간 방송·스트리밍에 쓴다',
    draw: function () {
      var s = t(20, 26, 'TCP', { size: 17, b: 1, c: C.blue }) + t(70, 26, '— 확인하며 보낸다 (신뢰성 ↑)', { size: 14, c: C.sub });
      s += monitor(20, 40, 50, 34) + monitor(410, 40, 50, 34);
      s += arrow(76, 50, 404, 50, { c: C.blue, w: 1.8 }) + packet(200, 38, '1', { fill: C.blueL, c: C.blue });
      s += arrow(404, 76, 76, 76, { c: C.green, w: 1.6, dash: '5 4' }) + t(240, 92, '"1번 받았어"', { a: 'm', size: 13, b: 1, c: C.green });
      s += hdiv(114);
      s += t(20, 140, 'UDP', { size: 17, b: 1, c: C.orange }) + t(70, 140, '— 확인 없이 계속 보낸다 (속도 ↑)', { size: 14, c: C.sub });
      s += monitor(20, 156, 50, 34) + monitor(410, 156, 50, 34);
      s += arrow(76, 172, 404, 172, { c: C.orange, w: 1.8 });
      [1, 2, 3, 4].forEach(function (k, i) { s += packet(110 + i * 64, 160, k + '', {}); });
      s += t(247, 196, '✕', { a: 'm', size: 15, b: 1, c: C.red });
      s += t(240, 222, '하나쯤 빠져도 그냥 간다 → 실시간 방송 · 스트리밍', { a: 'm', size: 13, b: 1 });
      return F.svg(480, 240, s);
    } };

  R.proxy = { topics: ['comp/net'], cards: ['프록시 서버'],
    cap: '프록시 서버 — 내부 컴퓨터 대신 밖에 접속해 준다. 방화벽 기능과 캐시(자주 쓰는 자료 보관) 기능을 한다',
    draw: function () {
      var s = t(70, 24, '내부', { a: 'm', size: 15, b: 1 });
      [0, 1, 2].forEach(function (i) { s += monitor(40, 38 + i * 56, 60, 36, { fill: C.blueL }) + arrow(104, 56 + i * 56, 178, 112, { c: C.blue, w: 1.4, head: 8 }); });
      s += box(184, 70, 120, 90, { fill: C.orangeL, c: C.orange, w: 1.8, r: 8 });
      s += t(244, 90, '프록시 서버', { a: 'm', size: 15, b: 1, halo: false }) + t(244, 116, '방화벽', { a: 'm', size: 13, halo: false }) + t(244, 136, '캐시(자료 보관)', { a: 'm', size: 13, halo: false });
      s += arrow(306, 115, 350, 115, { c: C.orange, w: 2, both: true });
      s += cloud(410, 115, 100, 70, { label: '인터넷', fill: C.grayL, c: C.sub });
      s += t(244, 190, '대신 접속해 준다', { a: 'm', size: 14, b: 1, c: C.orange });
      return F.svg(480, 212, s);
    } };

  R.lanwan = { topics: ['comp/net'], cards: ['통신망 종류'],
    cap: '통신망의 범위 — LAN(근거리) < MAN(도시권) < WAN(광역)',
    draw: function () {
      var s = '';
      s += box(14, 14, 452, 200, { fill: C.blueL, c: C.blue, w: 1.6, r: 18 }) + t(30, 36, 'WAN — 광역 (나라 · 세계)', { size: 15, b: 1, c: C.blue, halo: false });
      s += box(40, 52, 262, 146, { fill: C.greenL, c: C.green, w: 1.6, r: 16 }) + t(56, 74, 'MAN — 도시권', { size: 15, b: 1, c: C.green, halo: false });
      s += box(66, 92, 170, 90, { fill: C.orangeL, c: C.orange, w: 1.6, r: 14 }) + t(82, 112, 'LAN — 근거리', { size: 15, b: 1, c: C.orange, halo: false });
      s += t(82, 138, '학교 · 공장 건물 안', { size: 13, halo: false });
      s += monitor(90, 150, 28, 18) + monitor(134, 150, 28, 18) + monitor(178, 150, 28, 18);
      s += t(316, 80, 'VAN 부가가치통신망', { size: 13, halo: false }) + t(316, 104, 'ISDN 종합정보통신망', { size: 13, halo: false }) + t(316, 128, 'ADSL · VDSL', { size: 13, halo: false }) + t(316, 148, '= 초고속 인터넷', { size: 13, c: C.sub, halo: false });
      return F.svg(480, 228, s);
    } };

  R.wireless = { topics: ['comp/net'], cards: ['무선 연결 기술'],
    cap: '무선 연결 — 와이파이(무선 랜), 블루투스(가까운 기기), NFC(10cm 이내 접촉), 테더링(휴대폰을 모뎀처럼)',
    draw: function () {
      var s = '', P = [[14, 14], [246, 14], [14, 130], [246, 130]], W = 220, H = 108;
      var nm = ['와이파이', '블루투스', 'NFC', '테더링'], c = [C.blue, C.purple, C.orange, C.green];
      P.forEach(function (p, i) { s += box(p[0], p[1], W, H, { fill: '#fff', c: C.grayM, w: 1.2, r: 8 }) + t(p[0] + 12, p[1] + 20, nm[i], { size: 15, b: 1, c: c[i] }); });
      function waves(x, y, c) { return path('M' + x + ',' + (y - 8) + ' Q' + (x + 8) + ',' + y + ' ' + x + ',' + (y + 8), { c: c, w: 1.6 }) + path('M' + (x + 7) + ',' + (y - 14) + ' Q' + (x + 20) + ',' + y + ' ' + (x + 7) + ',' + (y + 14), { c: c, w: 1.6 }); }
      /* 와이파이 */
      s += box(34, 64, 50, 24, { fill: C.blueL, c: C.blue, w: 1.4, r: 4, label: '공유기', size: 11 }) + waves(90, 76, C.blue) + monitor(140, 56, 50, 32) + t(170, 34, '무선 랜', { a: 'm', size: 13, c: C.sub });
      /* 블루투스 */
      s += phone(270, 50) + waves(302, 72, C.purple) + circle(350, 64, 9, { fill: C.purpleL, c: C.purple, w: 1.4 }) + circle(372, 78, 9, { fill: C.purpleL, c: C.purple, w: 1.4 });
      s += t(404, 34, '가까운 기기', { a: 'm', size: 13, c: C.sub });
      /* NFC */
      s += phone(60, 160) + box(96, 170, 60, 38, { fill: C.orangeL, c: C.orange, w: 1.4, r: 4, label: '카드', size: 12 });
      s += t(170, 188, '10cm 이내', { size: 13, b: 1, c: C.orange }) + t(170, 208, '갖다 댄다', { size: 13, c: C.sub });
      /* 테더링 */
      s += phone(270, 162, { scr: C.greenL }) + waves(302, 184, C.green) + monitor(350, 168, 60, 36) + t(404, 148, '휴대폰 = 모뎀', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 252, s);
    } };

  function wave(x, y, w, amp, c, n) {
    var d = ''; n = n || 3;
    for (var k = 0; k <= 60; k++) { var xx = x + w * k / 60, yy = y - amp * Math.sin(k / 60 * Math.PI * 2 * n); d += (k ? ' L' : 'M') + xx.toFixed(1) + ',' + yy.toFixed(1); }
    return path(d, { c: c, w: 2 });
  }
  R.repbridge = { topics: ['comp/net'], cards: ['리피터(Repeater)', '브리지(Bridge)'],
    cap: '리피터는 약해진 신호를 다시 키워 보내고(목적지는 안 고름), 브리지는 같은 프로토콜의 두 LAN 을 이어 필요한 데이터만 건너보낸다',
    draw: function () {
      var s = t(20, 24, '리피터', { size: 16, b: 1, c: C.blue });
      s += wave(20, 72, 120, 22, C.blue, 3) + wave(140, 72, 50, 7, C.grayM, 1.3);
      s += box(196, 52, 76, 40, { fill: C.blueL, c: C.blue, w: 1.6, r: 6, label: '리피터', size: 14 });
      s += wave(280, 72, 180, 22, C.blue, 4.5);
      s += t(165, 104, '약해짐', { a: 'm', size: 13, c: C.sub }) + t(370, 110, '다시 증폭', { a: 'm', size: 13, b: 1, c: C.blue });
      s += hdiv(128);
      s += t(20, 152, '브리지', { size: 16, b: 1, c: C.green });
      function lan(x, lbl) {
        var o = line(x, 210, x + 160, 210, { c: C.ink, w: 2 });
        [0, 1, 2].forEach(function (k) { o += monitor(x + 8 + k * 54, 166, 38, 24) + line(x + 27 + k * 54, 200, x + 27 + k * 54, 210, { w: 1.4 }); });
        return o + t(x + 80, 230, lbl, { a: 'm', size: 13, c: C.sub });
      }
      s += lan(10, 'LAN A') + lan(310, 'LAN B');
      s += box(196, 194, 88, 32, { fill: C.greenL, c: C.green, w: 1.6, r: 6, label: '브리지', size: 14 });
      s += line(170, 210, 196, 210, { w: 2 }) + line(284, 210, 310, 210, { w: 2 });
      s += t(240, 176, '필요한 것만 건너감', { a: 'm', size: 13, b: 1, c: C.green });
      return F.svg(480, 246, s);
    } };

  R.routergw = { topics: ['comp/net'], cards: ['라우터(Router)', '게이트웨이(Gateway)'],
    cap: '라우터는 목적지 주소를 보고 가장 알맞은 경로를 고르고, 게이트웨이는 프로토콜이 다른 네트워크를 잇는 출입구다',
    draw: function () {
      var s = t(20, 24, '라우터', { size: 16, b: 1, c: C.orange });
      var N = { a: [60, 76], b: [160, 44], c: [160, 110], d: [270, 76], e: [370, 76] };
      s += line(N.a[0], N.a[1], N.c[0], N.c[1], { c: C.grayM, w: 2 }) + line(N.c[0], N.c[1], N.d[0], N.d[1], { c: C.grayM, w: 2 });
      s += line(N.a[0], N.a[1], N.b[0], N.b[1], { c: C.orange, w: 3.2 }) + line(N.b[0], N.b[1], N.d[0], N.d[1], { c: C.orange, w: 3.2 }) + line(N.d[0], N.d[1], N.e[0], N.e[1], { c: C.orange, w: 3.2 });
      ['a', 'b', 'c', 'd'].forEach(function (k) { s += router(N[k][0], N[k][1], { c: C.orange }); });
      s += monitor(390, 58, 60, 36) + t(420, 118, '목적지', { a: 'm', size: 13 });
      s += t(320, 124, '가장 알맞은 길을 골라 보낸다', { a: 'm', size: 13, b: 1, c: C.orange });
      s += hdiv(146);
      s += t(20, 170, '게이트웨이', { size: 16, b: 1, c: C.purple });
      s += box(20, 186, 150, 50, { fill: C.blueL, c: C.blue, w: 1.6, r: 8 }) + t(95, 204, '네트워크 A', { a: 'm', size: 14, b: 1, halo: false }) + t(95, 224, '프로토콜 ㉮', { a: 'm', size: 13, c: C.sub, halo: false });
      s += box(310, 186, 150, 50, { fill: C.greenL, c: C.green, w: 1.6, r: 8 }) + t(385, 204, '네트워크 B', { a: 'm', size: 14, b: 1, halo: false }) + t(385, 224, '프로토콜 ㉯', { a: 'm', size: 13, c: C.sub, halo: false });
      s += box(190, 190, 100, 42, { fill: C.purpleL, c: C.purple, w: 1.8, r: 6, label: '게이트웨이', size: 14 });
      s += arrow(172, 211, 188, 211, { c: C.purple, w: 1.6, head: 8 }) + arrow(292, 211, 308, 211, { c: C.purple, w: 1.6, head: 8 });
      s += t(240, 252, '서로 다른 프로토콜을 잇는 출입구', { a: 'm', size: 13, b: 1, c: C.purple });
      return F.svg(480, 266, s);
    } };

  R.topology = { topics: ['comp/net'], cards: ['성형(Star)과 버스형'],
    cap: '성형은 중앙 컴퓨터에 1:1 로 이어 중앙이 고장 나면 전체가 멈추고, 버스형은 한 줄 회선에 매달아 하나가 고장 나도 나머지는 돈다',
    draw: function () {
      var s = t(120, 24, '성형 (Star)', { a: 'm', size: 16, b: 1, c: C.blue }) + t(360, 24, '버스형 (Bus)', { a: 'm', size: 16, b: 1, c: C.green }) + divider(240, 14, 222);
      var cx = 120, cy = 110;
      for (var i = 0; i < 6; i++) {
        var a = i / 6 * Math.PI * 2 - Math.PI / 2, x = cx + 72 * Math.cos(a), y = cy + 62 * Math.sin(a);
        s += line(cx, cy, x, y, { c: C.blue, w: 1.6 }) + box(x - 13, y - 10, 26, 20, { fill: '#fff', c: C.ink, w: 1.3, r: 3 });
      }
      s += box(cx - 24, cy - 18, 48, 36, { fill: C.blueL, c: C.blue, w: 1.8, r: 5, label: '중앙', size: 13 });
      s += t(120, 196, '중앙 고장 → 전체 멈춤', { a: 'm', size: 13, b: 1, c: C.red }) + t(120, 214, '1:1 연결', { a: 'm', size: 13, c: C.sub });
      s += line(262, 110, 462, 110, { c: C.green, w: 3 });
      [280, 330, 380, 430].forEach(function (x, k) {
        var up = k % 2 === 0, y = up ? 60 : 146;
        s += line(x, 110, x, up ? 80 : 146, { c: C.green, w: 1.6 }) + box(x - 13, up ? 60 : 146, 26, 20, { fill: k === 1 ? C.redL : '#fff', c: k === 1 ? C.red : C.ink, w: 1.3, r: 3 });
        if (k === 1) s += t(x, 156.5, '✕', { a: 'm', size: 13, b: 1, c: C.red, halo: false });
      });
      s += t(360, 196, '하나 고장 → 나머지는 동작', { a: 'm', size: 13, b: 1, c: C.green }) + t(360, 214, '설치가 쉽다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 230, s);
    } };

  R.osi = { topics: ['comp/net'], cards: ['OSI 7계층'],
    cap: 'OSI 7계층 — 국제표준화기구(ISO)가 정한 통신 단계. 아래(1)부터 물리 · 데이터 링크 · 네트워크 · 전송 · 세션 · 표현 · 응용',
    draw: function () {
      var s = '', L = ['물리', '데이터 링크', '네트워크', '전송', '세션', '표현', '응용'];
      L.forEach(function (n, i) {
        var y = 212 - i * 30, k = i + 1, f = i < 3 ? C.blueL : (i < 4 ? C.greenL : C.orangeL), c = i < 3 ? C.blue : (i < 4 ? C.green : C.orange);
        s += box(120, y, 200, 26, { fill: f, c: c, w: 1.4, r: 4, label: n + ' 계층', size: 15 });
        s += num(100, y + 13, k, { c: c, r: 11 });
        s += t(336, y + 13, n.charAt(0), { size: 15, b: 1, c: c });
      });
      s += arrow(440, 236, 440, 30, { c: C.sub, w: 1.6 }) + t(432, 236, '아래부터', { a: 'e', size: 13, c: C.sub });
      s += t(220, 256, '앞 글자로: 물 데 네 전 세 표 응', { a: 'm', size: 13, b: 1 });
      return F.svg(480, 272, s);
    } };

  R.ipconfig = { topics: ['comp/net'], cards: ['ipconfig'],
    cap: 'ipconfig — 명령 프롬프트에서 내 IP 주소·서브넷 마스크·기본 게이트웨이를 확인한다(숫자는 예)',
    draw: function () {
      var s = box(14, 14, 452, 170, { fill: '#1f2937', c: C.ink, w: 1.6, r: 6 });
      var ln = [['C:\\> ipconfig', '#86efac'], ['IPv4 주소 . . . . : 192.168.0.25', '#e5e7eb'], ['서브넷 마스크 . . : 255.255.255.0', '#e5e7eb'], ['기본 게이트웨이 . : 192.168.0.1', '#e5e7eb']];
      ln.forEach(function (l, i) { s += t(30, 40 + i * 32, l[0], { size: 15, c: l[1], halo: false }); });
      s += t(30, 170, 'C:\\> _', { size: 15, c: '#86efac', halo: false });
      s += box(14, 196, 452, 44, { fill: C.yellowL, c: C.grayM, w: 1, r: 8 });
      s += t(240, 218, 'ipconfig /all → 물리 주소(MAC) · DNS 서버까지', { a: 'm', size: 14, b: 1, halo: false });
      return F.svg(480, 254, s);
    } };

  R.intra = { topics: ['comp/net'], cards: ['인트라넷 / 엑스트라넷'],
    cap: '인트라넷은 인터넷 기술을 회사 안 업무망에 쓴 것, 엑스트라넷은 그것을 거래처·협력 업체까지 넓힌 것',
    draw: function () {
      var s = box(14, 14, 452, 206, { fill: C.grayL, c: C.sub, w: 1.4, r: 18 }) + t(30, 36, '인터넷', { size: 15, b: 1, c: C.sub, halo: false });
      s += box(40, 50, 400, 156, { fill: C.greenL, c: C.green, w: 1.6, r: 16 }) + t(56, 72, '엑스트라넷 — 거래처 · 협력 업체까지', { size: 15, b: 1, c: C.green, halo: false });
      s += box(66, 90, 210, 100, { fill: C.blueL, c: C.blue, w: 1.6, r: 14 }) + t(82, 110, '인트라넷 — 회사 안', { size: 15, b: 1, c: C.blue, halo: false });
      s += t(82, 138, '전자 결재', { size: 13, halo: false }) + t(82, 160, '사내 게시판', { size: 13, halo: false });
      s += box(300, 100, 120, 36, { fill: '#fff', c: C.green, w: 1.4, r: 6, label: '부품 협력사', size: 13 }) + box(300, 146, 120, 36, { fill: '#fff', c: C.green, w: 1.4, r: 6, label: '거래처', size: 13 });
      return F.svg(480, 234, s);
    } };

  R.voip = { topics: ['comp/net'], cards: ['VoIP(인터넷 전화)'],
    cap: 'VoIP — 음성을 패킷으로 바꿔 인터넷(IP) 망으로 주고받는 전화. 일반 전화보다 요금이 싸다',
    draw: function () {
      var s = '';
      s += phone(16, 50, { h: 50 }) + wave(50, 76, 60, 14, C.blue, 2);
      s += arrow(114, 76, 134, 76, { w: 1.6, head: 8 });
      [0, 1, 2].forEach(function (i) { s += packet(140 + i * 0, 44 + i * 24, (i + 1) + '', { w: 30 }); });
      s += cloud(254, 76, 110, 72, { label: 'IP 망', fill: C.grayL, c: C.sub });
      s += arrow(176, 76, 196, 76, { w: 1.6, head: 8 }) + arrow(312, 76, 332, 76, { w: 1.6, head: 8 });
      [0, 1, 2].forEach(function (i) { s += packet(338, 44 + i * 24, (i + 1) + '', { w: 30 }); });
      s += arrow(372, 76, 386, 76, { w: 1.6, head: 8 }) + wave(390, 76, 50, 14, C.blue, 1.7) + phone(446, 50, { h: 50, w: 22 });
      s += t(60, 134, '음성', { a: 'm', size: 13 }) + t(155, 134, '패킷으로', { a: 'm', size: 13 }) + t(354, 134, '다시 음성', { a: 'm', size: 13 });
      s += t(240, 170, '요금이 싸다', { a: 'm', size: 15, b: 1, c: C.green });
      return F.svg(480, 190, s);
    } };

  /* ════════════ 1과목 ⑧ 멀티미디어 ════════════ */
  R.bitvec = { topics: ['comp/multi'], cards: ['비트맵(Bitmap)', '벡터(Vector)'], slide: ['comp/multi#0'],
    cap: '비트맵은 픽셀로 그려 확대하면 계단이 생기고 용량이 크다. 벡터는 수학 계산으로 그려 확대해도 매끈하고 용량이 작다',
    draw: function () {
      var s = t(120, 24, '비트맵 (픽셀)', { a: 'm', size: 16, b: 1, c: C.orange }) + t(360, 24, '벡터 (수학 계산)', { a: 'm', size: 16, b: 1, c: C.blue }) + divider(240, 14, 236);
      var cx = 120, cy = 104, r = 56, g = 12;
      for (var i = -6; i < 6; i++) for (var j = -6; j < 6; j++) {
        var x = cx + i * g, y = cy + j * g, dx = x + g / 2 - cx, dy = y + g / 2 - cy;
        if (dx * dx + dy * dy <= r * r) s += box(x, y, g, g, { fill: C.orangeL, c: C.orange, w: 0.8, r: 0 });
      }
      s += t(120, 186, '확대하면 계단 현상', { a: 'm', size: 14, b: 1, c: C.red }) + t(120, 206, '사진처럼 정교 · 용량 큼', { a: 'm', size: 13, c: C.sub });
      s += t(120, 228, 'BMP · JPG · GIF · PNG', { a: 'm', size: 13 });
      s += circle(360, 104, 56, { fill: C.blueL, c: C.blue, w: 2.4 });
      [[360, 48], [416, 104], [360, 160], [304, 104]].forEach(function (p) { s += box(p[0] - 4, p[1] - 4, 8, 8, { fill: '#fff', c: C.blue, w: 1.4, r: 0 }); });
      s += t(360, 186, '확대해도 매끈', { a: 'm', size: 14, b: 1, c: C.green }) + t(360, 206, '용량 작음', { a: 'm', size: 13, c: C.sub });
      s += t(360, 228, 'WMF · AI · DXF', { a: 'm', size: 13 });
      return F.svg(480, 244, s);
    } };

  R.gfx4 = { topics: ['comp/multi'], cards: ['앤티앨리어싱', '디더링(Dithering)', '모핑(Morphing)', '렌더링(Rendering)'], slide: ['comp/multi#2'],
    cap: '그래픽 기법 — 앤티앨리어싱(계단 없애기) · 디더링(색 섞기) · 모핑(모양 바꾸기) · 렌더링(입체감 입히기)',
    draw: function () {
      var s = '', P = [[14, 14], [246, 14], [14, 138], [246, 138]], W = 220, H = 116;
      var nm = ['앤티앨리어싱', '디더링', '모핑', '렌더링'], sub = ['계단 → 부드럽게', '있는 색을 섞어 없는 색', 'A 모양 → B 모양', '색 · 명암 · 질감'];
      P.forEach(function (p, i) { s += box(p[0], p[1], W, H, { fill: '#fff', c: C.grayM, w: 1.2, r: 8 }) + t(p[0] + 12, p[1] + 20, nm[i], { size: 15, b: 1, c: C.blue }) + t(p[0] + W - 10, p[1] + 20, sub[i], { a: 'e', size: 12, c: C.sub }); });
      /* 앤티앨리어싱: 계단 대각선 두 개 */
      var st = [[0, 4], [1, 3], [2, 2], [3, 1], [4, 0]];
      st.forEach(function (q) { s += box(34 + q[0] * 12, 44 + q[1] * 12, 12, 12, { fill: C.ink, c: 'none', w: 0, r: 0 }); });
      st.forEach(function (q) {
        s += box(134 + q[0] * 12, 44 + q[1] * 12, 12, 12, { fill: C.ink, c: 'none', w: 0, r: 0 });
        if (q[0] < 4) s += box(134 + (q[0] + 1) * 12, 44 + q[1] * 12, 12, 12, { fill: '#9ca3af', c: 'none', w: 0, r: 0 });
        if (q[1] < 4) s += box(134 + q[0] * 12, 44 + (q[1] + 1) * 12, 12, 12, { fill: '#d1d5db', c: 'none', w: 0, r: 0 });
      });
      s += arrow(100, 74, 126, 74, { w: 1.4, head: 8 });
      /* 디더링 */
      for (var i = 0; i < 8; i++) for (var j = 0; j < 5; j++) s += box(262 + i * 10, 44 + j * 10, 10, 10, { fill: (i + j) % 2 ? C.red : C.blue, c: 'none', w: 0, r: 0 });
      s += t(350, 70, '→', { a: 'm', size: 18, b: 1 }) + box(368, 44, 50, 50, { fill: '#7c3aed', c: 'none', w: 0, r: 2 }) + t(393, 108, '보라처럼', { a: 'm', size: 12, c: C.sub });
      /* 모핑 */
      [0, 1, 2, 3].forEach(function (k) { var rr = 22 * (1 - k / 3) + 2; s += box(30 + k * 48, 172, 40, 40, { fill: C.orangeL, c: C.orange, w: 1.6, r: rr }); });
      /* 렌더링: 선 입체 → 칠한 입체 */
      function cube(x, y, fill) {
        var a = [[x, y + 16], [x + 30, y], [x + 60, y + 16], [x + 30, y + 32]], b = [[x, y + 16], [x + 30, y + 32], [x + 30, y + 70], [x, y + 54]], c = [[x + 30, y + 32], [x + 60, y + 16], [x + 60, y + 54], [x + 30, y + 70]];
        return poly(a, { close: 1, fill: fill ? '#bfdbfe' : 'none', c: C.ink, w: 1.4 }) + poly(b, { close: 1, fill: fill ? '#60a5fa' : 'none', c: C.ink, w: 1.4 }) + poly(c, { close: 1, fill: fill ? '#1d4ed8' : 'none', c: C.ink, w: 1.4 });
      }
      s += cube(266, 164, false) + arrow(334, 200, 360, 200, { w: 1.4, head: 8 }) + cube(372, 164, true);
      return F.svg(480, 268, s);
    } };

  R.sound = { topics: ['comp/multi'], cards: ['WAVE / MIDI', 'MP3'],
    cap: 'WAVE 는 실제 소리를 그대로 저장해 크고, MIDI 는 연주 정보만 저장해 작다(사람 목소리 ✕). MP3 는 원음을 1/10 이하로 압축',
    draw: function () {
      var s = t(20, 26, 'WAVE', { size: 16, b: 1, c: C.blue }) + t(90, 26, '실제 소리 그대로', { size: 13, c: C.sub });
      var d = ''; for (var k = 0; k <= 120; k++) { var x = 20 + k * 1.8, y = 64 - 20 * Math.sin(k * 0.45) * Math.sin(k * 0.06 + 0.4); d += (k ? ' L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); }
      s += path(d, { c: C.blue, w: 1.6 });
      s += t(260, 26, 'MIDI', { size: 16, b: 1, c: C.purple }) + t(318, 26, '연주 정보(악보)', { size: 13, c: C.sub });
      [0, 1, 2, 3, 4].forEach(function (k) { s += line(260, 52 + k * 9, 460, 52 + k * 9, { c: C.grayM, w: 1 }); });
      [[280, 88], [310, 79], [340, 70], [370, 79], [400, 61], [430, 70]].forEach(function (p) { s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="6" ry="4.5" fill="' + C.purple + '"/>' + line(p[0] + 6, p[1], p[0] + 6, p[1] - 18, { c: C.purple, w: 1.4 }); });
      s += t(360, 104, '사람 목소리는 표현 ✕', { a: 'm', size: 13, b: 1, c: C.red });
      s += hdiv(122);
      s += t(20, 146, '같은 곡의 파일 크기', { size: 15, b: 1 });
      var B = [['WAVE', 360, C.blue, C.blueL], ['MP3', 36, C.green, C.greenL], ['MIDI', 8, C.purple, C.purpleL]];
      B.forEach(function (b, i) {
        var y = 162 + i * 30;
        s += t(20, y + 11, b[0], { size: 14, b: 1, c: b[2] }) + box(80, y, b[1], 22, { fill: b[3], c: b[2], w: 1.2, r: 3 });
      });
      s += t(126, 203, '1/10 이하 (MPEG 오디오 압축)', { size: 13, b: 1, c: C.green }) + t(98, 233, '가장 작다', { size: 13, c: C.sub });
      return F.svg(480, 256, s);
    } };

  R.stream = { topics: ['comp/multi'], cards: ['스트리밍(Streaming)'], slide: ['comp/multi#5'],
    cap: '다운로드는 파일을 다 받은 뒤에 재생하고, 스트리밍은 받으면서 바로 재생한다',
    draw: function () {
      var s = t(20, 26, '다운로드', { size: 16, b: 1 });
      s += box(20, 40, 300, 24, { fill: '#fff', c: C.grayM, w: 1.2, r: 4 }) + box(20, 40, 210, 24, { fill: C.grayM, c: 'none', w: 0, r: 4 });
      s += t(240, 80, '다 받을 때까지 기다린다', { a: 'm', size: 13, c: C.sub }) + circle(380, 52, 18, { fill: C.grayL, c: C.sub, w: 1.6 }) + t(380, 52.5, '⏳', { a: 'm', size: 14, halo: false });
      s += hdiv(100);
      s += t(20, 126, '스트리밍', { size: 16, b: 1, c: C.blue });
      s += box(20, 140, 300, 24, { fill: '#fff', c: C.grayM, w: 1.2, r: 4 }) + box(20, 140, 90, 24, { fill: C.blueL, c: C.blue, w: 1.2, r: 4 });
      s += poly([[80, 170], [86, 180], [74, 180]], { close: 1, fill: C.blue, c: C.blue, w: 1 }) + t(80, 194, '지금 재생 중', { a: 'm', size: 13, b: 1, c: C.blue });
      s += t(210, 180, '받는 중 →', { a: 'm', size: 13, c: C.sub });
      s += circle(380, 152, 18, { fill: C.blue, c: C.blue, w: 1 }) + poly([[374, 142], [374, 162], [390, 152]], { close: 1, fill: '#fff', c: '#fff', w: 1 });
      s += t(240, 226, '형식 예: ASF · WMV · RAM', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 242, s);
    } };

  R.pcm = { topics: ['comp/multi'], cards: ['PCM(펄스 부호 변조)'],
    cap: 'PCM — 아날로그 소리를 표본화(일정 간격으로 재기) → 양자화(정해진 눈금에 맞추기) → 부호화(2진수로) 순서로 디지털로 바꾼다',
    draw: function () {
      var s = '', X = [14, 170, 326], W = 140;
      ['① 표본화', '② 양자화', '③ 부호화'].forEach(function (n, i) { s += t(X[i] + W / 2, 24, n, { a: 'm', size: 16, b: 1, c: [C.blue, C.orange, C.green][i] }); });
      var pts = []; for (var k = 0; k < 8; k++) pts.push(3.5 + 3 * Math.sin(k / 7 * Math.PI * 1.6));
      function curve(x0) { var d = ''; for (var k = 0; k <= 70; k++) { var v = 3.5 + 3 * Math.sin(k / 70 * Math.PI * 1.6); d += (k ? ' L' : 'M') + (x0 + 10 + k * 1.72).toFixed(1) + ',' + (150 - v * 14).toFixed(1); } return path(d, { c: C.grayM, w: 1.6 }); }
      for (var i = 0; i < 3; i++) s += line(X[i] + 10, 150, X[i] + W - 6, 150, { w: 1.2 });
      s += curve(X[0]) + curve(X[1]);
      pts.forEach(function (v, k) {
        var x = X[0] + 10 + k * 17.2;
        s += line(x, 150, x, 150 - v * 14, { c: C.blue, w: 1.6 }) + circle(x, 150 - v * 14, 3, { fill: C.blue, c: C.blue, w: 1 });
      });
      for (var q = 0; q <= 7; q++) s += line(X[1] + 10, 150 - q * 14, X[1] + W - 6, 150 - q * 14, { c: '#e5e7eb', w: 1 });
      pts.forEach(function (v, k) { var x = X[1] + 10 + k * 17.2, qv = Math.round(v); s += box(x - 5, 150 - qv * 14 - 5, 10, 10, { fill: C.orange, c: C.orange, w: 1, r: 1 }); });
      pts.forEach(function (v, k) {
        var qv = Math.round(v), b = ('000' + qv.toString(2)).slice(-3);
        s += t(X[2] + 30 + (k % 2) * 66, 50 + Math.floor(k / 2) * 26, b, { size: 15, b: 1, c: C.green });
      });
      s += t(X[0] + W / 2, 176, '일정 간격으로 잰다', { a: 'm', size: 13 }) + t(X[1] + W / 2, 176, '눈금에 맞춘다', { a: 'm', size: 13 }) + t(X[2] + W / 2, 176, '2진수로 바꾼다', { a: 'm', size: 13 });
      s += divider(163, 14, 186) + divider(319, 14, 186);
      s += t(240, 208, 'WAV 파일이 이 방식으로 소리를 저장한다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 224, s);
    } };

  R.vrar = { topics: ['comp/multi'], cards: ['가상 현실(VR)'],
    cap: '가상 현실(VR)은 컴퓨터가 만든 3차원 공간을 실제처럼 체험하고, 증강 현실(AR)은 현실 화면 위에 정보를 겹쳐 보여 준다',
    draw: function () {
      var s = t(120, 24, '가상 현실 (VR)', { a: 'm', size: 16, b: 1, c: C.purple }) + t(360, 24, '증강 현실 (AR)', { a: 'm', size: 16, b: 1, c: C.orange }) + divider(240, 14, 222);
      s += box(26, 40, 188, 130, { fill: C.purpleL, c: C.purple, w: 1.4, r: 8 });
      for (var i = 0; i < 5; i++) s += line(26 + i * 47, 170, 120, 90, { c: '#c4b5fd', w: 1 });
      s += line(26, 130, 214, 130, { c: '#c4b5fd', w: 1 });
      s += person(120, 96, { fill: '#fff', c: C.purple }) + box(106, 90, 28, 12, { fill: C.purple, c: C.purple, w: 1, r: 3 });
      s += t(120, 196, '온통 가상 공간 안으로', { a: 'm', size: 14, b: 1 });
      s += box(266, 60, 120, 80, { fill: C.grayL, c: C.ink, w: 1.6, r: 3 }) + t(326, 100, '설비', { a: 'm', size: 15, b: 1, halo: false, c: C.sub });
      s += box(290, 40, 170, 120, { fill: 'none', c: C.ink, w: 3, r: 10 });
      s += box(346, 70, 104, 46, { fill: '#fff', c: C.orange, w: 1.6, r: 6 }) + t(398, 86, '온도 72℃', { a: 'm', size: 13, b: 1, halo: false }) + t(398, 104, '점검 D-3', { a: 'm', size: 13, c: C.orange, b: 1, halo: false });
      s += t(360, 186, '현실 화면 위에 정보를 겹친다', { a: 'm', size: 14, b: 1 }) + t(360, 206, '(글자는 예)', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 230, s);
    } };

  /* ════════════ 1과목 ⑨ 컴퓨터 보안과 정보 윤리 ════════════ */
  function keyIcon(x, y, c, s) {
    s = s || 1;
    return circle(x, y, 8 * s, { fill: '#fff', c: c, w: 2.2 }) + line(x + 8 * s, y, x + 30 * s, y, { c: c, w: 2.6 }) + line(x + 24 * s, y, x + 24 * s, y + 7 * s, { c: c, w: 2.4 }) + line(x + 30 * s, y, x + 30 * s, y + 7 * s, { c: c, w: 2.4 });
  }
  function lock(x, y, c, open) {
    return path('M' + (x + 5) + ',' + (y + 12) + ' V' + (y + 6) + ' A7,7 0 0 1 ' + (x + 19) + ',' + (y + 6) + (open ? ' V' + (y + 2) : ' V' + (y + 12)), { c: c, w: 2.2 }) +
      box(x, y + 12, 24, 18, { fill: c, c: c, w: 1, r: 3 });
  }
  function bug(x, y, c) {
    c = c || C.red;
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="7" ry="9" fill="' + c + '"/>' + circle(x, y - 11, 4, { fill: c, c: c, w: 1 }) +
      line(x - 7, y - 3, x - 13, y - 7, { c: c, w: 1.6 }) + line(x + 7, y - 3, x + 13, y - 7, { c: c, w: 1.6 }) + line(x - 7, y + 4, x - 13, y + 8, { c: c, w: 1.6 }) + line(x + 7, y + 4, x + 13, y + 8, { c: c, w: 1.6 });
  }

  R.malware3 = { topics: ['comp/security'], cards: ['컴퓨터 바이러스', '웜(Worm)', '트로이 목마'],
    cap: '바이러스는 다른 파일에 붙어 감염시키고, 웜은 숙주 없이 네트워크로 스스로 퍼지고, 트로이 목마는 정상 프로그램인 척 숨어 정보를 빼낸다(복제 ✕)',
    draw: function () {
      var s = '', X = [14, 170, 326], W = 140;
      ['바이러스', '웜', '트로이 목마'].forEach(function (n, i) { s += t(X[i] + W / 2, 24, n, { a: 'm', size: 16, b: 1, c: C.red }); });
      /* 바이러스: 파일에 붙음 */
      s += doc(40, 50, { w: 40, h: 52 }) + bug(82, 86) + doc(104, 70, { w: 28, h: 36 }) + bug(130, 98);
      s += t(84, 138, '파일에 붙어 감염', { a: 'm', size: 13, b: 1 }) + t(84, 158, '자기 복제', { a: 'm', size: 13, c: C.sub });
      /* 웜: PC 에서 PC 로 */
      s += monitor(186, 48, 40, 28) + monitor(270, 48, 40, 28) + monitor(228, 96, 40, 28);
      s += arrow(228, 62, 266, 62, { c: C.red, w: 1.6, head: 8 }) + arrow(284, 80, 262, 96, { c: C.red, w: 1.6, head: 8 });
      s += t(240, 150, '네트워크로 스스로 퍼짐', { a: 'm', size: 13, b: 1 }) + t(240, 170, '숙주 파일 필요 없음', { a: 'm', size: 13, c: C.sub });
      /* 트로이 목마: 선물 상자 */
      s += box(366, 58, 60, 48, { fill: C.greenL, c: C.green, w: 1.6, r: 3 }) + box(360, 48, 72, 14, { fill: C.greenL, c: C.green, w: 1.6, r: 2 });
      s += line(396, 48, 396, 106, { c: C.orange, w: 3 }) + bug(410, 86, C.red);
      s += t(396, 126, '"정상 프로그램"', { a: 'm', size: 13, c: C.green, b: 1 }) + t(396, 150, '위장해 정보를 빼냄', { a: 'm', size: 13, b: 1 }) + t(396, 170, '자기 복제 ✕', { a: 'm', size: 13, c: C.sub });
      s += divider(163, 14, 180) + divider(319, 14, 180);
      return F.svg(480, 190, s);
    } };

  R.ransom = { topics: ['comp/security'], cards: ['스파이웨어', '랜섬웨어'],
    cap: '스파이웨어는 몰래 설치되어 개인 정보를 모아 보내고, 랜섬웨어는 파일을 암호화해 잠근 뒤 돈을 요구한다',
    draw: function () {
      var s = t(120, 24, '스파이웨어', { a: 'm', size: 16, b: 1, c: C.red }) + t(360, 24, '랜섬웨어', { a: 'm', size: 16, b: 1, c: C.red }) + divider(240, 14, 200);
      s += monitor(30, 50, 110, 76, { fill: C.blueL });
      s += '<ellipse cx="85" cy="88" rx="22" ry="12" fill="#fff" stroke="' + C.red + '" stroke-width="2"/>' + circle(85, 88, 6, { fill: C.red, c: C.red, w: 1 });
      s += arrow(142, 88, 196, 88, { c: C.red, w: 1.8, dash: '5 4' }) + person(210, 60, { fill: C.redL, c: C.red });
      s += t(120, 160, '몰래 설치 → 정보 수집·전송', { a: 'm', size: 13, b: 1 });
      [0, 1, 2].forEach(function (i) { s += doc(262 + i * 40, 52, { w: 32, h: 42, fill: C.grayL }) + lock(266 + i * 40, 76, C.red); });
      s += box(390, 52, 78, 60, { fill: C.yellowL, c: C.red, w: 1.6, r: 6 }) + t(429, 72, '돈을 내면', { a: 'm', size: 12, halo: false }) + t(429, 94, '풀어 준다', { a: 'm', size: 13, b: 1, c: C.red, halo: false });
      s += t(360, 160, '파일을 암호화해 잠근다', { a: 'm', size: 13, b: 1 }) + t(360, 180, '→ 금전 요구', { a: 'm', size: 13, c: C.red });
      return F.svg(480, 206, s);
    } };

  R.sniffspoof = { topics: ['comp/security'], cards: ['스니핑(Sniffing)', '스푸핑(Spoofing)'], slide: ['comp/security#3'],
    cap: '스니핑은 오가는 데이터를 몰래 엿보고, 스푸핑은 믿을 만한 사람·사이트인 척 위장해 정보를 빼낸다',
    draw: function () {
      var s = t(120, 24, '스니핑 — 엿보기', { a: 'm', size: 16, b: 1, c: C.red }) + t(360, 24, '스푸핑 — 위장', { a: 'm', size: 16, b: 1, c: C.red }) + divider(240, 14, 206);
      s += monitor(18, 50, 50, 34) + t(43, 108, 'A', { a: 'm', size: 14, b: 1 }) + monitor(172, 50, 50, 34) + t(197, 108, 'B', { a: 'm', size: 14, b: 1 });
      s += arrow(72, 66, 168, 66, { c: C.blue, w: 1.8 }) + packet(104, 56, '자료', { w: 34, fill: C.blueL, c: C.blue });
      s += person(120, 132, { fill: C.redL, c: C.red }) + arrow(120, 120, 120, 80, { c: C.red, w: 1.4, dash: '4 3', head: 8 });
      s += t(120, 184, '가운데서 몰래 훔쳐본다', { a: 'm', size: 13, b: 1 });
      s += person(300, 70, { fill: C.redL, c: C.red });
      s += box(270, 110, 60, 22, { fill: C.greenL, c: C.green, w: 1.2, r: 4, label: '가면', size: 12 });
      s += box(330, 40, 132, 38, { fill: '#fff', c: C.green, w: 1.4, r: 16, label: '"나는 은행 서버야"', size: 12 });
      s += arrow(332, 96, 400, 110, { c: C.red, w: 1.6 }) + person(420, 106, { fill: C.blueL, c: C.blue });
      s += t(360, 164, '믿을 만한 쪽인 척', { a: 'm', size: 13, b: 1 }) + t(360, 184, '주소·신분을 속인다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 212, s);
    } };

  R.phishpharm = { topics: ['comp/security'], cards: ['피싱(Phishing)', '파밍(Pharming)'],
    cap: '피싱은 가짜 메일·링크로 유인해 직접 입력하게 만들고, 파밍은 주소를 정확히 쳐도 가짜 사이트로 몰래 연결된다',
    draw: function () {
      var s = t(20, 26, '피싱', { size: 16, b: 1, c: C.red });
      s += box(20, 40, 130, 56, { fill: C.yellowL, c: C.orange, w: 1.4, r: 4 }) + t(85, 58, '📧 당첨 안내', { a: 'm', size: 13, b: 1, halo: false }) + t(85, 80, '여기를 누르세요', { a: 'm', size: 12, c: C.blue, halo: false });
      s += arrow(154, 68, 200, 68, { c: C.red, w: 1.8 }) + t(177, 54, '클릭', { a: 'm', size: 12, c: C.red, b: 1 });
      s += win(206, 38, 120, 62, '가짜 사이트', { bar: C.redL, btn: false }) + box(218, 68, 96, 20, { fill: '#fff', c: C.grayM, w: 1, r: 3, label: '계좌·비밀번호', size: 11 });
      s += arrow(330, 68, 384, 68, { c: C.red, w: 1.8, dash: '5 4' }) + person(410, 48, { fill: C.redL, c: C.red });
      s += t(240, 116, '내가 직접 입력하게 만든다', { a: 'm', size: 13, b: 1 });
      s += hdiv(132);
      s += t(20, 156, '파밍', { size: 16, b: 1, c: C.red }) + t(70, 156, '— 피싱보다 알아채기 어렵다', { size: 13, c: C.sub });
      s += box(20, 172, 150, 30, { fill: '#fff', c: C.green, w: 1.6, r: 15, label: 'www.bank.co.kr ✔', size: 13 });
      s += t(95, 218, '주소를 정확히 쳤는데', { a: 'm', size: 12, c: C.sub });
      s += arrow(174, 187, 218, 187, { c: C.red, w: 1.8 });
      s += box(222, 170, 90, 34, { fill: C.redL, c: C.red, w: 1.4, r: 6, label: 'DNS 변조', size: 13 });
      s += arrow(316, 187, 350, 187, { c: C.red, w: 1.8 }) + win(354, 164, 110, 50, '가짜 사이트', { bar: C.redL, btn: false });
      s += t(240, 240, '몰래 가짜로 연결된다', { a: 'm', size: 13, b: 1 });
      return F.svg(480, 256, s);
    } };

  R.ddos = { topics: ['comp/security'], cards: ['분산 서비스 거부(DDoS)'], slide: ['comp/security#4'],
    cap: 'DDoS — 악성코드로 감염시켜 둔 여러 대의 컴퓨터(좀비 PC)로 한꺼번에 접속을 몰아 서버를 마비시킨다',
    draw: function () {
      var s = person(40, 94, { fill: C.redL, c: C.red }) + t(40, 150, '공격자', { a: 'm', size: 13, b: 1, c: C.red });
      var Y = [30, 74, 118, 162];
      Y.forEach(function (y) {
        s += arrow(58, 110, 116, y + 14, { c: C.red, w: 1.2, dash: '4 3', head: 7 });
        s += monitor(120, y, 44, 26, { fill: C.redL });
        for (var k = 0; k < 3; k++) s += arrow(168, y + 12, 330, 100 + (k - 1) * 10, { c: C.orange, w: 1.2, head: 7 });
      });
      s += t(142, 214, '좀비 PC', { a: 'm', size: 13, b: 1, c: C.orange });
      s += server(340, 76, { w: 60 }) + t(370, 146, '서버', { a: 'm', size: 15, b: 1 });
      s += t(420, 70, '✕', { a: 'm', size: 22, b: 1, c: C.red }) + t(370, 170, '요청이 넘쳐 멈춤', { a: 'm', size: 13, b: 1, c: C.red });
      s += t(370, 200, '자료를 훔치는 게 아니라', { a: 'm', size: 12, c: C.sub }) + t(370, 216, '서비스를 못 쓰게 만든다', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 234, s);
    } };

  R.firewall = { topics: ['comp/security'], cards: ['방화벽(Firewall)'],
    cap: '방화벽 — 외부의 불법 침입으로부터 내부 네트워크를 지킨다. 내부에서 일어나는 해킹은 막지 못한다',
    draw: function () {
      var s = cloud(80, 110, 120, 90, { label: '외부', fill: C.grayL, c: C.sub });
      for (var r = 0; r < 7; r++) for (var c = 0; c < 2; c++) s += box(206 + c * 22 + (r % 2 ? 11 : 0) - (r % 2 && c === 1 ? 0 : 0), 28 + r * 26, 22, 24, { fill: C.orangeL, c: C.orange, w: 1.2, r: 1 });
      s += t(228, 222, '방화벽', { a: 'm', size: 15, b: 1, c: C.orange });
      s += arrow(130, 64, 200, 64, { c: C.red, w: 2 }) + t(186, 46, '✕', { a: 'm', size: 18, b: 1, c: C.red }) + t(96, 46, '불법 침입', { a: 'm', size: 13, b: 1, c: C.red });
      s += arrow(130, 150, 330, 150, { c: C.green, w: 2 }) + t(178, 168, '허용된 통신 ✔', { a: 'm', size: 13, b: 1, c: C.green });
      s += box(270, 30, 196, 170, { fill: C.blueL, c: C.blue, w: 1.6, r: 10 }) + t(368, 50, '내부 네트워크', { a: 'm', size: 15, b: 1, halo: false });
      s += monitor(290, 70, 40, 26) + monitor(346, 70, 40, 26) + monitor(402, 70, 40, 26);
      s += person(420, 136, { fill: C.redL, c: C.red }) + t(368, 186, '내부 해킹은 못 막음', { a: 'm', size: 13, b: 1, c: C.red, halo: false });
      return F.svg(480, 238, s);
    } };

  R.crypto = { topics: ['comp/security'], cards: ['비밀키 / 공개키 암호화'], slide: ['comp/security#0'], hide: ['잠그는 키 = 여는 키', '잠그는 키 ≠ 여는 키'],
    cap: '비밀키(대칭)는 잠그고 여는 키가 같아 빠르지만 관리가 어렵고, 공개키(비대칭·RSA)는 공개키로 잠그고 개인키로 열어 관리가 쉽지만 느리다',
    draw: function () {
      var s = t(20, 24, '비밀키 (대칭)', { size: 16, b: 1, c: C.blue }) + t(170, 24, '잠그는 키 = 여는 키', { size: 13, c: C.sub });
      s += doc(20, 40, { w: 30, h: 38 }) + keyIcon(62, 58, C.blue) + arrow(100, 58, 142, 58, { w: 1.6, head: 8 });
      s += doc(148, 40, { w: 30, h: 38, fill: C.grayL }) + lock(152, 48, C.sub);
      s += arrow(186, 58, 262, 58, { w: 1.6, head: 8, dash: '5 4' }) + t(224, 44, '전송', { a: 'm', size: 12, c: C.sub });
      s += keyIcon(274, 58, C.blue) + arrow(310, 58, 344, 58, { w: 1.6, head: 8 }) + doc(350, 40, { w: 30, h: 38 });
      s += t(400, 52, '빠름', { size: 13, b: 1, c: C.green }) + t(400, 72, '관리 어려움', { size: 13, b: 1, c: C.red });
      s += hdiv(100);
      s += t(20, 124, '공개키 (비대칭 · RSA)', { size: 16, b: 1, c: C.orange }) + t(220, 124, '잠그는 키 ≠ 여는 키', { size: 13, c: C.sub });
      s += doc(20, 140, { w: 30, h: 38 }) + keyIcon(62, 158, C.green) + arrow(100, 158, 142, 158, { w: 1.6, head: 8 });
      s += doc(148, 140, { w: 30, h: 38, fill: C.grayL }) + lock(152, 148, C.sub);
      s += arrow(186, 158, 262, 158, { w: 1.6, head: 8, dash: '5 4' });
      s += keyIcon(274, 158, C.red) + arrow(310, 158, 344, 158, { w: 1.6, head: 8 }) + doc(350, 140, { w: 30, h: 38 });
      s += t(76, 196, '공개키(누구나)', { a: 'm', size: 12, b: 1, c: C.green }) + t(290, 196, '개인키(나만)', { a: 'm', size: 12, b: 1, c: C.red });
      s += t(400, 152, '관리 쉬움', { size: 13, b: 1, c: C.green }) + t(400, 172, '느림', { size: 13, b: 1, c: C.red });
      return F.svg(480, 214, s);
    } };

  R.sign = { topics: ['comp/security'], cards: ['전자 서명'],
    cap: '전자 서명 — 보내는 사람이 자기 개인키로 서명하고, 받는 사람은 보낸 사람의 공개키로 확인한다',
    draw: function () {
      var s = t(80, 24, '보내는 사람', { a: 'm', size: 15, b: 1 }) + t(400, 24, '받는 사람', { a: 'm', size: 15, b: 1 });
      s += doc(56, 40, { w: 48, h: 60 }) + path('M64,90 q6,-10 12,0 t12,0 t12,0', { c: C.blue, w: 2 });
      s += keyIcon(40, 124, C.red) + t(80, 150, '내 개인키로 서명', { a: 'm', size: 13, b: 1, c: C.red });
      s += arrow(120, 70, 350, 70, { c: C.blue, w: 2 }) + t(235, 56, '문서 + 서명', { a: 'm', size: 13, b: 1, c: C.blue });
      s += doc(376, 40, { w: 48, h: 60 }) + path('M384,90 q6,-10 12,0 t12,0 t12,0', { c: C.blue, w: 2 });
      s += keyIcon(360, 124, C.green) + t(376, 150, '보낸 사람의 공개키로 확인', { a: 'm', size: 13, b: 1, c: C.green });
      s += box(96, 172, 288, 54, { fill: C.greenL, c: C.green, w: 1.4, r: 8 });
      s += t(240, 190, '✔ 본인이 보낸 것이 맞다', { a: 'm', size: 14, b: 1, halo: false }) + t(240, 212, '✔ 내용이 바뀌지 않았다', { a: 'm', size: 14, b: 1, halo: false });
      return F.svg(480, 240, s);
    } };

  R.threat4 = { topics: ['comp/security'], cards: ['정보 보안 요소', '가로막기(Interruption)', '가로채기(Interception)'],
    cap: '보안을 해치는 네 가지 — 가로막기(가용성) · 가로채기(기밀성) · 수정(무결성) · 위조(인증)',
    draw: function () {
      var s = '', P = [[14, 14], [246, 14], [14, 132], [246, 132]], W = 220, H = 110;
      var nm = ['가로막기', '가로채기', '수정', '위조'], hurt = ['가용성', '기밀성', '무결성', '인증'];
      P.forEach(function (p, i) {
        var x = p[0], y = p[1];
        s += box(x, y, W, H, { fill: '#fff', c: C.grayM, w: 1.2, r: 8 });
        s += t(x + 12, y + 20, nm[i], { size: 15, b: 1, c: C.red }) + pill(x + W - 10 - tw('→ ' + hurt[i] + ' 해침', 12) - 18, y + 8, '→ ' + hurt[i] + ' 해침', { size: 12, b: 1, fill: C.redL, c: C.red, h: 22 });
        var sx = x + 30, rx = x + W - 30, my = y + 58, ay = y + 94;
        s += circle(sx, my, 13, { fill: C.blueL, c: C.blue, w: 1.4, label: '보', size: 12 }) + circle(rx, my, 13, { fill: C.greenL, c: C.green, w: 1.4, label: '받', size: 12 });
        s += circle(x + W / 2, ay, 11, { fill: C.redL, c: C.red, w: 1.4, label: '공', size: 11 });
        if (i === 0) s += line(sx + 14, my, x + W / 2 - 4, my, { c: C.blue, w: 1.8 }) + t(x + W / 2 + 4, my, '✕', { a: 'm', size: 16, b: 1, c: C.red }) + line(x + W / 2, ay - 11, x + W / 2, my + 10, { c: C.red, w: 1.4, dash: '4 3' });
        if (i === 1) s += arrow(sx + 14, my, rx - 15, my, { c: C.blue, w: 1.8, head: 8 }) + arrow(x + W / 2, my + 2, x + W / 2, ay - 12, { c: C.red, w: 1.4, dash: '4 3', head: 7 });
        if (i === 2) s += arrow(sx + 12, my + 6, x + W / 2 - 10, ay - 6, { c: C.blue, w: 1.6, head: 7 }) + arrow(x + W / 2 + 10, ay - 6, rx - 12, my + 6, { c: C.red, w: 1.6, head: 7 }) + t(x + W / 2 + 36, ay + 4, '바꿔서', { size: 11, c: C.red });
        if (i === 3) s += arrow(x + W / 2 + 10, ay - 6, rx - 12, my + 6, { c: C.red, w: 1.6, head: 7 }) + t(x + W / 2 - 18, ay + 2, '보낸 척', { a: 'e', size: 11, c: C.red });
      });
      s += t(240, 262, '보 = 보내는 쪽 · 받 = 받는 쪽 · 공 = 공격자', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 276, s);
    } };


  /* ════════════ 2과목 ① 엑셀 기본과 데이터 입력 ════════════ */
  R.xlscreen = { topics: ['excel/basic'], cards: ['통합 문서 / 워크시트', '이름 상자 / 수식 입력줄', '셀 주소'], slide: ['excel/basic#0'],
    cap: '엑셀 화면 — 이름 상자에는 셀 주소, 수식 입력줄에는 실제 입력한 수식. 셀 주소 = 열 문자 + 행 번호',
    draw: function () {
      var s = t(50, 20, '이름 상자', { a: 'm', size: 13, b: 1, c: C.blue }) + t(118, 20, '수식 입력줄 — 입력한 수식이 보인다', { size: 13, b: 1, c: C.orange });
      s += box(20, 32, 60, 28, { fill: '#fff', c: C.blue, w: 1.8, r: 3, label: 'B3', size: 15 });
      s += t(96, 46, 'fx', { size: 14, c: C.sub, b: 1 }) + box(118, 32, 342, 28, { fill: '#fff', c: C.orange, w: 1.8, r: 3 }) + t(128, 46, '=SUM(B1:B2)', { size: 15, halo: false });
      var o = { cols: ['A', 'B', 'C', 'D'], cw: [64, 64, 64, 64], rh: 26, rows: [['생산량', 10, '', ''], ['', 20, '', ''], ['', 30, '', ''], ['', '', '', '']], sel: { r: 2, c: 1 } };
      s += sheet(20, 76, o);
      s += box(92, 214, 66, 24, { fill: '#fff', c: C.green, w: 1.6, r: 3, label: 'Sheet1', size: 13 }) + box(160, 214, 66, 24, { fill: C.grayL, c: C.grayM, w: 1, r: 3, label: 'Sheet2', size: 13 }) + t(238, 226, '+', { size: 16, b: 1, c: C.sub });
      s += callout(206, 89, 318, 96, '열 머리글 A, B, C…', { size: 13 });
      s += callout(174, 167, 318, 150, '[B3] = B열 + 3행', { size: 13, b: 1, c: C.green, tc: C.green });
      s += t(324, 172, '셀에는 결과 30', { size: 12, c: C.sub });
      s += callout(33, 180, 40, 262, '행 머리글 1, 2, 3…', { size: 13 });
      s += callout(190, 238, 220, 262, '시트 탭 = 워크시트', { size: 13 });
      s += t(460, 290, '통합 문서(파일) 안에 워크시트 여러 개 · 최대 1,048,576행 × 16,384열', { a: 'e', size: 12, c: C.sub });
      return F.svg(480, 304, s);
    } };

  R.dtype = { topics: ['excel/basic'], cards: ['숫자 데이터', '문자 데이터', '날짜/시간 입력'],
    cap: '숫자·날짜·시간은 오른쪽, 문자는 왼쪽으로 붙는다. 숫자 앞에 작은따옴표(\')를 치면 문자가 된다',
    draw: function () {
      var s = t(96, 22, '이렇게 치면', { a: 'm', size: 14, b: 1, c: C.sub }) + t(290, 22, '셀에는', { a: 'm', size: 14, b: 1, c: C.sub });
      var rows = [['1250', '1250', 'e', C.blue, '숫자'], ['생산일보', '생산일보', 's', C.orange, '문자'], ["'0012", '0012', 's', C.orange, '문자'], ['2026-10-01', '2026-10-01', 'e', C.blue, '날짜'], ['14:30', '14:30', 'e', C.blue, '시간'], ['0 1/2', '1/2', 'e', C.blue, '분수']];
      rows.forEach(function (r, i) {
        var y = 36 + i * 32;
        s += box(30, y, 132, 26, { fill: C.grayL, c: C.grayM, w: 1, r: 3 }) + t(40, y + 13, r[0], { size: 14, halo: false });
        s += arrow(168, y + 13, 206, y + 13, { w: 1.4, head: 8, c: C.sub });
        s += box(212, y, 150, 26, { fill: '#fff', c: C.ink, w: 1.2, r: 0 });
        s += t(r[2] === 'e' ? 356 : 218, y + 13, r[1], { a: r[2], size: 14, halo: false, b: 1, c: r[3] });
        s += t(376, y + 13, r[4], { size: 13, c: r[3], b: 1 });
      });
      s += t(240, 244, '오늘 날짜 Ctrl+;   ·   현재 시간 Ctrl+Shift+;', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 260, s);
    } };

  R.enter2 = { topics: ['excel/basic'], cards: ['한 셀에서 줄 바꾸기', '여러 셀에 같은 값 입력'],
    cap: 'Alt+Enter 는 한 셀 안에서 줄을 바꾸고, Ctrl+Enter 는 고른 범위에 같은 값을 한꺼번에 넣는다',
    draw: function () {
      var s = t(120, 24, '한 셀 · 여러 줄', { a: 'm', size: 16, b: 1, c: C.blue }) + t(360, 24, '여러 셀 · 같은 값', { a: 'm', size: 16, b: 1, c: C.green }) + divider(240, 14, 222);
      s += sheet(40, 40, { cols: ['A', 'B'], cw: [90, 60], rh: 26, rows: [['', ''], ['', ''], ['', '']], hw: 24 });
      s += box(64, 66, 90, 52, { fill: '#fff', c: C.blue, w: 2.4, r: 0 }) + t(72, 82, '설비', { size: 14, halo: false }) + t(72, 104, '점검표', { size: 14, halo: false });
      s += combo(120, 148, ['Alt', 'Enter'], { a: 'm' });
      s += t(120, 200, '원하는 곳에서 줄 바꿈', { a: 'm', size: 13 });
      var o = { cols: ['A', 'B'], cw: [90, 60], rh: 24, hw: 24, rows: [['완료', ''], ['완료', ''], ['완료', ''], ['완료', '']], fill: { '0,0': C.greenL, '1,0': C.greenL, '2,0': C.greenL, '3,0': C.greenL }, color: { '0,0': C.green, '1,0': C.green, '2,0': C.green, '3,0': C.green }, bold: { '0,0': 1, '1,0': 1, '2,0': 1, '3,0': 1 }, sel: { r: 0, c: 0, h: 4 } };
      s += sheet(284, 34, o);
      s += combo(360, 168, ['Ctrl', 'Enter'], { a: 'm' });
      s += t(360, 210, '범위를 고르고 한 번 입력', { a: 'm', size: 13 });
      return F.svg(480, 230, s);
    } };

  R.fill = { topics: ['excel/basic'], cards: ['자동 채우기(채우기 핸들)', '문자+숫자 채우기'], slide: ['excel/basic#1'], hide: ['복사', '1씩 증가', '차이만큼 증가', '숫자만 +1'],
    cap: '채우기 핸들을 끌면 — 숫자 1개는 복사, Ctrl 을 누르면 1씩 증가, 숫자 2개는 차이만큼 증가, 문자+숫자는 숫자만 1씩 증가',
    draw: function () {
      var s = '', X = [20, 136, 252, 368], W = 92;
      var cols = [[5, 5, 5, 5], [5, 6, 7, 8], [3, 6, 9, 12], ['1급-1', '1급-2', '1급-3', '1급-4']], given = [1, 1, 2, 1];
      var nm = ['숫자 1개', '숫자 1개 + Ctrl', '숫자 2개', '문자+숫자'], res = ['복사', '1씩 증가', '차이만큼 증가', '숫자만 +1'];
      var c = [C.sub, C.blue, C.green, C.orange];
      cols.forEach(function (col, i) {
        s += t(X[i] + W / 2, 22, nm[i], { a: 'm', size: 14, b: 1 });
        col.forEach(function (v, k) {
          var y = 38 + k * 30, g = k < given[i];
          s += box(X[i], y, W, 30, { fill: g ? C.blueL : '#fff', c: C.grayM, w: 1, r: 0 });
          s += t(typeof v === 'number' ? X[i] + W - 8 : X[i] + 8, y + 15, String(v), { a: typeof v === 'number' ? 'e' : 's', size: 15, b: !g, c: g ? C.ink : c[i], halo: false, ans: !g });
        });
        s += box(X[i], 38, W, 30 * given[i], { fill: 'none', c: C.green, w: 2.4, r: 0 }) + box(X[i] + W - 5, 38 + 30 * given[i] - 5, 9, 9, { fill: C.green, c: '#fff', w: 1, r: 0 });
        s += arrow(X[i] + W + 8, 38 + 30 * given[i], X[i] + W + 8, 152, { c: c[i], w: 1.6, head: 8 });
        s += pill(X[i] + W / 2, 168, res[i], { a: 'm', size: 13, b: 1, fill: '#fff', c: c[i] });
      });
      s += t(240, 216, '숫자 하나는 그냥 끌면 복사 — Ctrl 을 눌러야 증가한다', { a: 'm', size: 13, b: 1, c: C.red });
      return F.svg(480, 232, s);
    } };

  R.memo = { topics: ['excel/basic'], cards: ['메모(노트)', '윗주'],
    cap: '메모는 셀에 다는 설명(빨간 표식, Shift+F2). 윗주는 셀 위에 다는 작은 글씨로 문자 데이터에만 달 수 있다',
    draw: function () {
      var s = t(120, 24, '메모 (노트)', { a: 'm', size: 16, b: 1, c: C.red }) + t(360, 24, '윗주', { a: 'm', size: 16, b: 1, c: C.purple }) + divider(240, 14, 228);
      s += box(30, 90, 90, 34, { fill: '#fff', c: C.ink, w: 1.4, r: 0 }) + t(112, 107, '92', { a: 'e', size: 15, halo: false });
      s += poly([[110, 90], [120, 90], [120, 100]], { close: 1, fill: C.red, c: C.red, w: 1 });
      s += box(136, 50, 96, 56, { fill: C.yellowL, c: C.orange, w: 1.4, r: 3 }) + t(144, 68, '재측정', { size: 13, halo: false }) + t(144, 90, '필요', { size: 13, halo: false });
      s += line(120, 94, 136, 78, { c: C.orange, w: 1.2 });
      s += callout(116, 94, 160, 140, '빨간 표식', { size: 13, c: C.red, tc: C.red, a: 'm' });
      s += combo(120, 176, ['Shift', 'F2'], { a: 'm' });
      s += t(120, 222, '인쇄할지도 정할 수 있다', { a: 'm', size: 12, c: C.sub });
      s += box(300, 70, 120, 54, { fill: '#fff', c: C.ink, w: 1.4, r: 0 });
      s += t(360, 84, '가공 1반', { a: 'm', size: 13, c: C.purple, b: 1, halo: false }) + t(360, 108, '선반', { a: 'm', size: 17, b: 1, halo: false });
      s += callout(392, 84, 440, 56, '윗주', { size: 13, c: C.purple, tc: C.purple, b: 1 });
      s += t(360, 150, '문자에만 (숫자 ✕)', { a: 'm', size: 13, b: 1 }) + t(360, 172, '[윗주 필드 표시]로 보이기', { a: 'm', size: 12, c: C.sub }) + t(360, 194, '데이터를 지우면 함께 지워짐', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 236, s);
    } };

  R.group = { topics: ['excel/basic'], cards: ['시트 그룹'],
    cap: '시트 그룹 — 시트 여러 개를 함께 고르면 제목 표시줄에 [그룹]이 뜨고, 입력·서식이 고른 시트 모두에 들어간다',
    draw: function () {
      var s = box(20, 16, 440, 28, { fill: C.blueL, c: C.blue, w: 1.4, r: 4 }) + t(240, 30, '생산일보.xlsx  [그룹]', { a: 'm', size: 15, b: 1, halo: false });
      s += box(40, 60, 200, 110, { fill: '#fff', c: C.ink, w: 1.4, r: 0 }) + box(56, 72, 200, 110, { fill: '#fff', c: C.ink, w: 1.4, r: 0 });
      s += t(66, 94, '1월 시트', { size: 13, c: C.sub, halo: false }) + box(66, 110, 120, 26, { fill: C.greenL, c: C.green, w: 1.4, r: 0 }) + t(74, 123, '합계', { size: 14, b: 1, halo: false });
      s += t(280, 104, '한 번 입력하면', { size: 14 }) + arrow(280, 124, 420, 124, { c: C.green, w: 1.8 });
      s += box(330, 60, 120, 40, { fill: 'none', c: 'none', w: 0 });
      s += box(300, 140, 150, 40, { fill: C.greenL, c: C.green, w: 1.4, r: 6 }) + t(375, 160, '2월 · 3월에도 합계', { a: 'm', size: 13, b: 1, halo: false });
      var tabs = [['1월', 1], ['2월', 1], ['3월', 1], ['4월', 0]];
      tabs.forEach(function (tb, i) { s += box(40 + i * 62, 196, 58, 24, { fill: tb[1] ? '#fff' : C.grayL, c: tb[1] ? C.green : C.grayM, w: tb[1] ? 1.8 : 1, r: 3, label: tb[0], size: 13, b: tb[1] }); });
      s += t(300, 208, 'Shift·Ctrl + 탭 클릭', { size: 13, c: C.sub });
      return F.svg(480, 234, s);
    } };

  R.nav = { topics: ['excel/basic'], cards: ['셀 이동 키'],
    cap: 'Ctrl+Home 은 [A1]로, Ctrl+End 는 데이터가 있는 마지막 셀로, Ctrl+↓ 는 마지막 행(1,048,576)으로 간다',
    draw: function () {
      var rows = [], fill = {};
      for (var r = 0; r < 6; r++) { rows.push(['', '', '', '', '']); for (var c = 0; c < 4; c++) if (r < 5) fill[r + ',' + c] = C.blueL; }
      var o = { cols: ['A', 'B', 'C', 'D', 'E'], cw: [48, 48, 48, 48, 48], rh: 26, rows: rows, fill: fill };
      var s = sheet(20, 20, o);
      var a1 = cellXY(20, 20, o, 0, 0), cur = cellXY(20, 20, o, 2, 1), end = cellXY(20, 20, o, 4, 3);
      s += box(cur[0] - 24, cur[1] - 13, 48, 26, { fill: 'none', c: C.green, w: 2.6, r: 0 }) + t(cur[0], cur[1], '지금', { a: 'm', size: 12, b: 1, c: C.green, halo: false });
      s += arrow(cur[0] - 10, cur[1] - 10, a1[0] + 8, a1[1] + 6, { c: C.blue, w: 2, head: 9 }) + t(a1[0], a1[1], 'A1', { a: 'm', size: 13, b: 1, c: C.blue, halo: false });
      s += arrow(cur[0] + 12, cur[1] + 8, end[0] - 8, end[1] - 4, { c: C.orange, w: 2, head: 9 }) + box(end[0] - 24, end[1] - 13, 48, 26, { fill: 'none', c: C.orange, w: 2.4, r: 0 });
      s += arrow(cur[0] + 30, cur[1] + 16, cur[0] + 30, 236, { c: C.purple, w: 2, head: 9, dash: '6 4' });
      s += t(300, 44, 'Ctrl + Home', { size: 15, b: 1, c: C.blue }) + t(300, 64, '→ [A1]', { size: 13 });
      s += t(300, 100, 'Ctrl + End', { size: 15, b: 1, c: C.orange }) + t(300, 120, '→ 데이터 있는 마지막 셀', { size: 13 });
      s += t(300, 156, 'Ctrl + ↓', { size: 15, b: 1, c: C.purple }) + t(300, 176, '→ 마지막 행(1,048,576)', { size: 13 });
      s += t(300, 212, 'F5 → 갈 주소를 직접 입력', { size: 13, c: C.sub });
      return F.svg(480, 250, s);
    } };

  R.rowcol = { topics: ['excel/basic'], cards: ['행·열 전체 선택'],
    cap: 'Shift+Space Bar 는 행 전체, Ctrl+Space Bar 는 열 전체, Ctrl+A 는 워크시트 전체를 고른다',
    draw: function () {
      var s = t(120, 22, '행 전체', { a: 'm', size: 16, b: 1, c: C.blue }) + t(360, 22, '열 전체', { a: 'm', size: 16, b: 1, c: C.green }) + divider(240, 12, 214);
      function g(x, fillFn) { var rows = [], f = {}; for (var r = 0; r < 5; r++) { rows.push(['', '', '', '']); for (var c = 0; c < 4; c++) if (fillFn(r, c)) f[r + ',' + c] = fillFn(r, c); } return sheet(x, 36, { cols: ['A', 'B', 'C', 'D'], cw: [44, 44, 44, 44], rh: 22, rows: rows, fill: f, hw: 24 }); }
      s += g(20, function (r) { return r === 2 ? C.blueL : null; }) + box(20, 36 + 22 * 3, 200, 22, { fill: 'none', c: C.blue, w: 2.4, r: 0 });
      s += g(260, function (r, c) { return c === 1 ? C.greenL : null; }) + box(328, 36, 44, 22 * 6, { fill: 'none', c: C.green, w: 2.4, r: 0 });
      s += combo(120, 178, ['Shift', 'Space'], { a: 'm' }) + combo(360, 178, ['Ctrl', 'Space'], { a: 'm' });
      s += t(240, 232, '워크시트 전체는 Ctrl + A', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 246, s);
    } };

  R.insdel = { topics: ['excel/basic'], cards: ['셀 삽입·삭제'],
    cap: '셀 삽입(Ctrl++)은 기존 셀을 오른쪽이나 아래로 밀고, 셀 삭제(Ctrl+-)는 왼쪽이나 위로 당긴다',
    draw: function () {
      var s = t(120, 22, '삽입  Ctrl + +', { a: 'm', size: 16, b: 1, c: C.blue }) + t(360, 22, '삭제  Ctrl + -', { a: 'm', size: 16, b: 1, c: C.red }) + divider(240, 12, 196);
      var o1 = { cols: ['A', 'B', 'C', 'D'], cw: [44, 44, 44, 44], rh: 26, hw: 24, rows: [['가', '나', '다', ''], ['라', '', '마', '바'], ['사', '아', '자', '']], fill: { '1,1': C.blueL } };
      s += sheet(20, 38, o1) + arrow(128, 103, 240 - 18, 103, { c: C.blue, w: 1.6, head: 8 });
      s += t(120, 150, '새 빈칸이 생기고', { a: 'm', size: 13 }) + t(120, 170, '오른쪽 / 아래로 민다', { a: 'm', size: 13, b: 1, c: C.blue });
      var o2 = { cols: ['A', 'B', 'C', 'D'], cw: [44, 44, 44, 44], rh: 26, hw: 24, rows: [['가', '나', '다', ''], ['라', '마', '바', ''], ['사', '아', '자', '']], fill: { '1,3': C.redL } };
      s += sheet(260, 38, o2) + arrow(420, 103, 330, 103, { c: C.red, w: 1.6, head: 8 });
      s += t(360, 150, '셀이 없어지고', { a: 'm', size: 13 }) + t(360, 170, '왼쪽 / 위로 당긴다', { a: 'm', size: 13, b: 1, c: C.red });
      s += t(240, 214, '(Delete 키는 내용만 지우고 셀은 그대로)', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 228, s);
    } };

  /* ════════════ 2과목 ② 셀 서식과 조건부 서식 ════════════ */
  R.sections = { topics: ['excel/format'], cards: ['사용자 지정 표시 형식 구역'], slide: ['excel/format#0'],
    cap: '사용자 지정 표시 형식은 세미콜론(;)으로 나눈 네 구역 — 양수 ; 음수 ; 0 ; 문자 순서',
    draw: function () {
      var s = '', nm = ['양수', '음수', '0', '문자'], c = [C.blue, C.red, C.sub, C.green], f = [C.blueL, C.redL, C.grayL, C.greenL];
      var code = ['#,##0', '[빨강]-#,##0', '"-"', '@"님"'], inp = ['1500', '-300', '0', '김반장'], out = ['1,500', '-300', '-', '김반장님'];
      nm.forEach(function (n, i) {
        var x = 16 + i * 116;
        s += box(x, 20, 100, 40, { fill: f[i], c: c[i], w: 1.8, r: 6, label: n, size: 17 });
        if (i < 3) s += t(x + 108, 40, ';', { a: 'm', size: 24, b: 1 });
        s += t(x + 50, 80, code[i], { a: 'm', size: 13, b: 1, c: c[i] });
        s += box(x + 6, 100, 88, 24, { fill: C.grayL, c: C.grayM, w: 1, r: 3, label: inp[i], size: 13 });
        s += arrow(x + 50, 128, x + 50, 146, { w: 1.4, head: 7, c: C.sub });
        s += box(x + 6, 150, 88, 26, { fill: '#fff', c: C.ink, w: 1.2, r: 0 }) + t(x + (i === 3 ? 12 : 88), 163, out[i], { a: i === 3 ? 's' : 'e', size: 14, b: 1, c: i === 1 ? C.red : C.ink, halo: false });
      });
      s += t(16, 100 + 12, '', {});
      s += t(240, 202, '순서는 바꿀 수 없다 · 조건은 [ ] 안에 → [>=1000]', { a: 'm', size: 13, c: C.sub });
      s += t(240, 224, '(입력·결과는 예)', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 238, s);
    } };

  function fmtTable(rows, o) {
    o = o || {};
    var s = t(80, 22, '입력', { a: 'm', size: 14, b: 1, c: C.sub }) + t(220, 22, '표시 형식', { a: 'm', size: 14, b: 1, c: C.sub }) + t(380, 22, '보이는 결과', { a: 'm', size: 14, b: 1, c: C.sub });
    rows.forEach(function (r, i) {
      var y = 36 + i * 38;
      s += box(30, y, 100, 28, { fill: C.grayL, c: C.grayM, w: 1, r: 3 }) + t(122, y + 14, r[0], { a: 'e', size: 15, halo: false });
      s += box(160, y, 120, 28, { fill: '#fff', c: r[3] || C.blue, w: 1.6, r: 14, label: r[1], size: 15 });
      s += arrow(286, y + 14, 318, y + 14, { w: 1.4, head: 8, c: C.sub });
      s += box(322, y, 120, 28, { fill: '#fff', c: C.ink, w: 1.3, r: 0 }) + t(r[4] === 's' ? 330 : 434, y + 14, r[2], { a: r[4] || 'e', size: 15, b: 1, c: r[3] || C.blue, halo: false });
    });
    return s;
  }
  R.hash0 = { topics: ['excel/format'], cards: ['# 과 0'], slide: ['excel/format#2'],
    cap: '# 은 의미 없는 0 을 표시하지 않고, 0 은 자릿수만큼 0 을 채운다 — 보이는 모양만 바뀌고 저장된 값은 그대로',
    draw: function () {
      var s = fmtTable([['0.5', '#.#', '.5', C.orange], ['0.5', '0.0', '0.5', C.blue], ['5', '0.0', '5.0', C.blue], ['5', '#.#', '5.', C.orange]]);
      s += box(30, 194, 200, 30, { fill: C.orangeL, c: C.orange, w: 1.2, r: 6, label: '#  없는 자리는 안 보임', size: 13 });
      s += box(250, 194, 200, 30, { fill: C.blueL, c: C.blue, w: 1.2, r: 6, label: '0  없는 자리를 0 으로', size: 13 });
      return F.svg(480, 238, s);
    } };

  R.numfmt = { topics: ['excel/format'], cards: ['천 단위 구분과 축약', '@ 기호'],
    cap: '#,##0 은 천 단위 콤마, 끝에 콤마를 하나 더 붙이면 천 단위를 생략한다. @ 는 입력한 문자가 들어갈 자리',
    draw: function () {
      var s = fmtTable([['12345', '#,##0', '12,345', C.blue], ['12345', '#,##0,', '12', C.orange], ['볼트', '"제품-"@', '제품-볼트', C.green, 's']]);
      s += t(240, 164, '끝의 콤마 하나 = 천 단위씩 생략', { a: 'm', size: 13, b: 1, c: C.orange });
      s += t(240, 186, '@ = 입력한 문자가 들어갈 자리', { a: 'm', size: 13, b: 1, c: C.green });
      return F.svg(480, 204, s);
    } };

  R.merge3 = { topics: ['excel/format'], cards: ['셀 병합하고 가운데 맞춤', '텍스트 줄 바꿈 / 셀에 맞춤'], slide: ['excel/format#5'],
    cap: '병합은 여러 셀을 하나로(왼쪽 위 값만 남음), 줄 바꿈은 열 너비에 맞춰 여러 줄로, 셀에 맞춤은 글자를 줄여 한 줄에',
    draw: function () {
      var s = '', X = [14, 170, 326], W = 140;
      ['병합 · 가운데', '텍스트 줄 바꿈', '셀에 맞춤'].forEach(function (n, i) { s += t(X[i] + W / 2, 22, n, { a: 'm', size: 15, b: 1, c: [C.blue, C.green, C.orange][i] }); });
      /* 병합 */
      [0, 1, 2].forEach(function (k) { s += box(24 + k * 40, 42, 40, 28, { fill: '#fff', c: C.grayM, w: 1, r: 0 }); });
      s += t(30, 56, '성적', { size: 13, halo: false }) + t(70, 56, '표', { size: 13, halo: false, c: C.line });
      s += arrow(84, 76, 84, 96, { w: 1.4, head: 7, c: C.sub });
      s += box(24, 100, 120, 30, { fill: C.blueL, c: C.blue, w: 1.8, r: 0 }) + t(84, 115, '성적', { a: 'm', size: 14, b: 1, halo: false });
      s += t(84, 152, '왼쪽 위 값만 남는다', { a: 'm', size: 12, c: C.sub });
      /* 줄 바꿈 */
      s += box(200, 42, 80, 28, { fill: '#fff', c: C.grayM, w: 1, r: 0 }) + t(206, 56, '컴퓨터활용…', { size: 13, halo: false, c: C.sub });
      s += arrow(240, 76, 240, 96, { w: 1.4, head: 7, c: C.sub });
      s += box(200, 100, 80, 46, { fill: C.greenL, c: C.green, w: 1.8, r: 0 }) + t(206, 114, '컴퓨터활용', { size: 13, halo: false }) + t(206, 134, '능력 2급', { size: 13, halo: false });
      s += t(240, 168, '행 높이가 늘어난다', { a: 'm', size: 12, c: C.sub });
      /* 셀에 맞춤 */
      s += box(356, 42, 80, 28, { fill: '#fff', c: C.grayM, w: 1, r: 0 }) + t(362, 56, '컴퓨터활용…', { size: 13, halo: false, c: C.sub });
      s += arrow(396, 76, 396, 96, { w: 1.4, head: 7, c: C.sub });
      s += box(356, 100, 80, 30, { fill: C.orangeL, c: C.orange, w: 1.8, r: 0 }) + t(396, 115, '컴퓨터활용능력 2급', { a: 'm', size: 8, halo: false });
      s += t(396, 152, '글자 크기를 줄인다', { a: 'm', size: 12, c: C.sub });
      s += divider(163, 14, 180) + divider(319, 14, 180);
      s += t(240, 200, 'Alt+Enter 는 내가 원하는 곳에서 직접 줄 바꾸기', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 214, s);
    } };

  R.cf = { topics: ['excel/format'], cards: ['조건부 서식'],
    cap: '조건부 서식 — 조건에 맞는 셀에만 서식이 자동으로 붙는다. 셀 강조 규칙 · 데이터 막대 · 색조 · 아이콘 집합',
    draw: function () {
      var s = '', X = [14, 130, 246, 362], W = 104, v = [92, 65, 78, 40, 85];
      ['셀 강조', '데이터 막대', '색조', '아이콘'].forEach(function (n, i) { s += t(X[i] + W / 2, 22, n, { a: 'm', size: 14, b: 1, c: C.blue }); });
      var scale = ['#bbf7d0', '#fef08a', '#fed7aa', '#fecaca', '#d9f99d'];
      var sc2 = function (x) { return x >= 85 ? '#86efac' : (x >= 70 ? '#fef08a' : (x >= 50 ? '#fed7aa' : '#fca5a5')); };
      v.forEach(function (x, k) {
        var y = 38 + k * 28;
        for (var i = 0; i < 4; i++) {
          var f = '#fff';
          if (i === 0 && x >= 85) f = C.redL;
          if (i === 2) f = sc2(x);
          s += box(X[i], y, W, 28, { fill: f, c: C.grayM, w: 1, r: 0 });
          if (i === 1) s += box(X[i] + 3, y + 5, (W - 6) * x / 100, 18, { fill: '#93c5fd', c: 'none', w: 0, r: 1 });
          if (i === 3) {
            var ic = x >= 85 ? C.green : (x >= 60 ? C.orange : C.red);
            s += circle(X[i] + 16, y + 14, 7, { fill: ic, c: ic, w: 1 });
          }
          s += t(X[i] + W - 8, y + 14, String(x), { a: 'e', size: 14, halo: false, b: i === 0 && x >= 85, c: i === 0 && x >= 85 ? C.red : C.ink });
        }
      });
      s += t(X[0] + W / 2, 196, '85 이상만 빨강', { a: 'm', size: 12, c: C.sub }) + t(X[1] + W / 2, 196, '값만큼 막대', { a: 'm', size: 12, c: C.sub }) +
        t(X[2] + W / 2, 196, '값에 따라 색', { a: 'm', size: 12, c: C.sub }) + t(X[3] + W / 2, 196, '값에 따라 아이콘', { a: 'm', size: 12, c: C.sub });
      s += t(240, 222, '여러 규칙이 겹치면 위쪽 규칙이 먼저 · 숫자는 예', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 236, s);
    } };

  R.cfrow = { topics: ['excel/format'], cards: ['수식을 이용한 조건부 서식'], slide: ['excel/format#4'],
    cap: '수식으로 행 전체 칠하기 — =$D2>=90 처럼 열만 $ 로 고정하면 어느 열에서나 D열 값을 보고 판단한다(숫자는 예)',
    draw: function () {
      var hl = C.yellowL, f = {};
      [0, 2].forEach(function (r) { for (var c = 0; c < 4; c++) f[(r + 1) + ',' + c] = hl; });
      var o = { cols: ['A', 'B', 'C', 'D'], cw: [70, 60, 60, 70], rh: 28, rows: [['설비', '오전', '오후', '평균'], ['1호기', 95, 90, 92.5], ['2호기', 70, 75, 72.5], ['3호기', 88, 96, 92]], fill: f, bold: { '0,0': 1, '0,1': 1, '0,2': 1, '0,3': 1 } };
      var s = sheet(16, 18, o);
      s += box(42, 18 + 28 * 2, 260, 28, { fill: 'none', c: C.orange, w: 2.2, r: 0 }) + box(42, 18 + 28 * 4, 260, 28, { fill: 'none', c: C.orange, w: 2.2, r: 0 });
      s += t(316, 60, '평균 90 이상 →', { size: 13 }) + t(316, 80, '행 전체 색칠', { size: 14, b: 1, c: C.orange });
      s += box(60, 176, 200, 38, { fill: '#fff', c: C.blue, w: 1.8, r: 6 }) + t(160, 195, '= $D2 >= 90', { a: 'm', size: 18, b: 1, halo: false });
      s += callout(108, 206, 108, 242, '$D — 열은 고정', { size: 13, b: 1, c: C.blue, tc: C.blue, a: 'm' });
      s += callout(134, 184, 300, 176, '2 — 행은 따라 내려감', { size: 13, b: 1, c: C.green, tc: C.green });
      s += t(300, 200, '결과가 TRUE 인 행만 칠한다', { size: 12, c: C.sub });
      return F.svg(480, 258, s);
    } };

  R.wildcard = { topics: ['excel/format'], cards: ['찾기와 바꾸기'],
    cap: '찾기(Ctrl+F)·바꾸기(Ctrl+H)의 만능 문자 — * 는 여러 글자, ? 는 한 글자를 대신한다',
    draw: function () {
      var s = t(90, 24, '셀 값', { a: 'm', size: 14, b: 1, c: C.sub });
      s += box(200, 12, 100, 28, { fill: C.blueL, c: C.blue, w: 1.6, r: 14, label: '생*', size: 16 }) + box(330, 12, 100, 28, { fill: C.orangeL, c: C.orange, w: 1.6, r: 14, label: '생?', size: 16 });
      var w = [['생산', 1, 1], ['생산일보', 1, 0], ['생산량', 1, 0], ['발생', 0, 0]];
      w.forEach(function (r, i) {
        var y = 52 + i * 34;
        s += box(40, y, 100, 28, { fill: '#fff', c: C.grayM, w: 1, r: 0 }) + t(48, y + 14, r[0], { size: 15, halo: false });
        s += t(250, y + 14, r[1] ? '✔' : '—', { a: 'm', size: 17, b: 1, c: r[1] ? C.blue : C.line });
        s += t(380, y + 14, r[2] ? '✔' : '—', { a: 'm', size: 17, b: 1, c: r[2] ? C.orange : C.line });
      });
      s += t(250, 200, '"생" 다음 몇 글자든', { a: 'm', size: 13 }) + t(380, 200, '"생" 다음 딱 한 글자', { a: 'm', size: 13 });
      s += t(240, 230, 'Ctrl + F 찾기  ·  Ctrl + H 바꾸기', { a: 'm', size: 13, b: 1, c: C.sub });
      return F.svg(480, 246, s);
    } };

  R.paste = { topics: ['excel/format'], cards: ['선택하여 붙여넣기'],
    cap: '선택하여 붙여넣기 — 복사한 것에서 값·서식·수식 등 원하는 것만 붙이거나, 행/열을 바꾸어(전치) 붙인다',
    draw: function () {
      var s = t(20, 22, '값만 붙이기', { size: 15, b: 1, c: C.blue });
      s += box(20, 34, 130, 30, { fill: C.yellowL, c: C.ink, w: 1.3, r: 0 }) + t(142, 49, '1,500', { a: 'e', size: 15, b: 1, halo: false });
      s += t(20, 80, '=B2*C2 · 노란 칠', { size: 12, c: C.sub });
      s += arrow(160, 49, 214, 49, { c: C.blue }) + box(220, 34, 130, 30, { fill: '#fff', c: C.ink, w: 1.3, r: 0 }) + t(342, 49, '1500', { a: 'e', size: 15, b: 1, halo: false });
      s += t(220, 80, '수식·서식 없이 값만', { size: 12, c: C.sub });
      s += hdiv(100);
      s += t(20, 124, '행/열 바꿈 (전치)', { size: 15, b: 1, c: C.green });
      ['1월', '2월', '3월'].forEach(function (m, i) { s += box(20 + i * 50, 140, 50, 28, { fill: C.greenL, c: C.grayM, w: 1, r: 0, label: m, size: 13 }); });
      s += arrow(176, 154, 250, 154, { c: C.green });
      ['1월', '2월', '3월'].forEach(function (m, i) { s += box(270, 134 + i * 28, 60, 28, { fill: C.greenL, c: C.grayM, w: 1, r: 0, label: m, size: 13 }); });
      s += t(346, 160, '가로 → 세로', { size: 13, b: 1, c: C.green });
      s += t(240, 238, '그 밖에: 서식만 · 수식만 · 열 너비 …', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 252, s);
    } };

  /* ════════════ 2과목 ③ 수식과 셀 참조 ════════════ */
  R.ref3 = { topics: ['excel/formula'], cards: ['상대 참조', '절대 참조'], slide: ['excel/formula#0'],
    cap: '수식을 아래로 복사하면 — 상대 참조는 따라 움직이고, 절대 참조($A$1)는 그대로, 혼합 참조는 $ 붙은 쪽만 고정',
    draw: function () {
      var s = '', X = [20, 176, 332], W = 128;
      var nm = ['상대 참조', '절대 참조', '혼합 참조'], code = [['=A1', '=A2', '=A3'], ['=$A$1', '=$A$1', '=$A$1'], ['=$A1', '=$A2', '=$A3']], c = [C.blue, C.red, C.purple];
      var sub = ['같이 이동', '언제나 고정', '열만 고정 · 행은 이동'];
      nm.forEach(function (n, i) {
        s += t(X[i] + W / 2, 22, n, { a: 'm', size: 16, b: 1, c: c[i] });
        code[i].forEach(function (cd, k) {
          var y = 40 + k * 34;
          s += box(X[i], y, W, 34, { fill: k === 0 ? C.grayL : '#fff', c: C.grayM, w: 1, r: 0 }) + t(X[i] + 10, y + 17, cd, { size: 16, b: 1, c: k === 0 ? C.ink : c[i], halo: false });
        });
        s += arrow(X[i] + W - 12, 58, X[i] + W - 12, 140, { c: c[i], w: 1.4, head: 8, dash: '5 4' });
        s += t(X[i] + W / 2, 164, sub[i], { a: 'm', size: 13, b: 1 });
      });
      s += t(240, 196, '$ 는 바로 뒤에 오는 것을 고정한다 — $A = 열 고정, $1 = 행 고정', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 212, s);
    } };

  R.f4 = { topics: ['excel/formula'], cards: ['혼합 참조'], slide: ['excel/formula#2'],
    cap: 'F4 를 누를 때마다 A1 → $A$1 → A$1 → $A1 → 다시 A1 순서로 바뀐다',
    draw: function () {
      var s = '', P = [[240, 44], [390, 120], [240, 196], [90, 120]];
      var L = [['A1', '상대'], ['$A$1', '절대'], ['A$1', '행 고정'], ['$A1', '열 고정']], c = [C.sub, C.red, C.orange, C.purple], f = [C.grayL, C.redL, C.orangeL, C.purpleL];
      for (var i = 0; i < 4; i++) {
        var a = P[i], b = P[(i + 1) % 4];
        var ax = a[0] + (b[0] - a[0]) * 0.3, ay = a[1] + (b[1] - a[1]) * 0.3, bx = a[0] + (b[0] - a[0]) * 0.7, by = a[1] + (b[1] - a[1]) * 0.7;
        s += arrow(ax, ay, bx, by, { c: C.blue, w: 1.8 }) + t((ax + bx) / 2 + (i < 2 ? 18 : -18), (ay + by) / 2 + (i === 0 || i === 3 ? -12 : 12), 'F4', { a: 'm', size: 13, b: 1, c: C.blue });
      }
      P.forEach(function (p, i) { s += box(p[0] - 50, p[1] - 22, 100, 44, { fill: f[i], c: c[i], w: 1.8, r: 8 }) + t(p[0], p[1] - 6, L[i][0], { a: 'm', size: 17, b: 1, halo: false }) + t(p[0], p[1] + 13, L[i][1], { a: 'm', size: 12, c: c[i], halo: false }); });
      return F.svg(480, 234, s);
    } };

  R.gugu = { topics: ['excel/formula'], cards: [], slide: ['excel/formula#3'],
    cap: '혼합 참조 실전 — [B2]에 =$A2*B$1 을 한 번 쓰고 오른쪽·아래로 끌면 곱셈표가 완성된다',
    draw: function () {
      var o = { cols: ['A', 'B', 'C', 'D'], cw: [50, 60, 60, 60], rh: 30, rows: [['', 2, 3, 4], [1, 2, 3, 4], [2, 4, 6, 8], [3, 6, 9, 12]],
        fill: { '0,1': C.orangeL, '0,2': C.orangeL, '0,3': C.orangeL, '1,0': C.blueL, '2,0': C.blueL, '3,0': C.blueL, '1,1': C.yellowL }, bold: { '1,1': 1 }, sel: { r: 1, c: 1 } };
      var s = sheet(20, 20, o);
      s += box(290, 30, 170, 40, { fill: '#fff', c: C.green, w: 1.8, r: 6 }) + t(375, 50, '= $A2 * B$1', { a: 'm', size: 17, b: 1, halo: false });
      s += callout(160, 80, 290, 50, '', { c: C.green });
      s += box(290, 96, 170, 44, { fill: C.blueL, c: C.blue, w: 1.2, r: 6 }) + t(375, 110, '$A2', { a: 'm', size: 14, b: 1, c: C.blue, halo: false }) + t(375, 128, '늘 A열(세로 머리)', { a: 'm', size: 12, halo: false });
      s += box(290, 150, 170, 44, { fill: C.orangeL, c: C.orange, w: 1.2, r: 6 }) + t(375, 164, 'B$1', { a: 'm', size: 14, b: 1, c: C.orange, halo: false }) + t(375, 182, '늘 1행(가로 머리)', { a: 'm', size: 12, halo: false });
      s += arrow(156, 186, 260, 186, { c: C.green, w: 1.4, head: 8, dash: '5 4' }) + arrow(126, 176, 126, 206, { c: C.green, w: 1.4, head: 8, dash: '5 4' });
      s += t(126, 222, '끌어 채우기', { a: 'm', size: 12, c: C.green });
      return F.svg(480, 236, s);
    } };

  R.sheetref = { topics: ['excel/formula'], cards: ['다른 시트 참조', '3차원 참조'], slide: ['excel/formula#5'],
    cap: '다른 시트는 시트이름!셀주소(공백이 있으면 작은따옴표), 3차원 참조는 여러 시트의 같은 셀을 한 번에',
    draw: function () {
      var s = t(20, 24, '다른 시트 참조', { size: 15, b: 1, c: C.blue });
      s += box(20, 38, 230, 30, { fill: '#fff', c: C.blue, w: 1.8, r: 6 }) + t(135, 53, "='1월 매출'!B3", { a: 'm', size: 16, b: 1, halo: false });
      s += callout(50, 68, 70, 92, '작은따옴표 (시트 이름에 공백)', { size: 12, c: C.sub });
      s += callout(250, 53, 276, 53, '느낌표 = 시트와 셀 사이', { size: 12, b: 1, c: C.blue, tc: C.blue });
      s += hdiv(110);
      s += t(20, 134, '3차원 참조', { size: 15, b: 1, c: C.green });
      ['Sheet3', 'Sheet2', 'Sheet1'].forEach(function (n, i) {
        var x = 60 - i * 14 + 28, y = 150 + i * 14;
        s += box(x, y, 120, 70, { fill: '#fff', c: C.ink, w: 1.3, r: 2 }) + t(x + 6, y + 12, n, { size: 11, c: C.sub, halo: false });
        s += box(x + 10, y + 22, 36, 20, { fill: C.greenL, c: C.green, w: 1.4, r: 0, label: 'A1', size: 11 });
      });
      s += arrow(190, 200, 236, 200, { c: C.green });
      s += box(242, 180, 222, 40, { fill: '#fff', c: C.green, w: 1.8, r: 6 }) + t(353, 200, '=SUM(Sheet1:Sheet3!A1)', { a: 'm', size: 14, b: 1, halo: false });
      s += t(353, 238, '세 시트의 [A1]을 모두 더한다', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 256, s);
    } };

  R.name = { topics: ['excel/formula'], cards: ['이름 정의'],
    cap: '이름 정의 — 범위에 이름을 붙여 수식에서 주소 대신 쓴다. 첫 글자는 문자·밑줄(_)·\\, 공백과 셀 주소 모양은 안 된다',
    draw: function () {
      var s = box(20, 16, 90, 28, { fill: '#fff', c: C.orange, w: 2, r: 3, label: '생산량', size: 14 }) + callout(110, 30, 140, 30, '이름 상자에 이름을 친다', { size: 12, c: C.orange, tc: C.orange });
      var o = { cols: ['A', 'B'], cw: [70, 70], rh: 26, rows: [['설비', '생산량'], ['1호기', 520], ['2호기', 480], ['3호기', 530]], fill: { '1,1': C.orangeL, '2,1': C.orangeL, '3,1': C.orangeL }, bold: { '0,0': 1, '0,1': 1 }, sel: { r: 1, c: 1, h: 3, color: C.orange } };
      s += sheet(20, 56, o);
      s += arrow(196, 130, 240, 130, { c: C.blue }) + box(246, 112, 214, 36, { fill: '#fff', c: C.blue, w: 1.8, r: 6 }) + t(353, 130, '=SUM(생산량)', { a: 'm', size: 17, b: 1, halo: false });
      s += t(353, 168, '= SUM(B2:B4) 와 같다', { a: 'm', size: 12, c: C.sub });
      s += box(20, 200, 440, 50, { fill: C.yellowL, c: C.grayM, w: 1, r: 8 });
      s += t(240, 216, '되는 이름: 생산량 · _합계 · \\단가', { a: 'm', size: 13, b: 1, c: C.green, halo: false });
      s += t(240, 236, '안 되는 이름: 1월 · 생산 량(공백) · A1(주소 모양)', { a: 'm', size: 13, b: 1, c: C.red, halo: false });
      return F.svg(480, 264, s);
    } };

  R.precedence = { topics: ['excel/formula'], cards: ['연산자 우선순위'],
    cap: '연산자 우선순위 — 참조 → % → ^ → * / → + - → & → 비교. 같은 순위는 왼쪽부터',
    draw: function () {
      var s = t(110, 22, '먼저 계산', { a: 'm', size: 14, b: 1, c: C.red });
      var L = [['참조', ':  ,  공백'], ['백분율', '%'], ['거듭제곱', '^'], ['곱·나눗셈', '*   /'], ['덧·뺄셈', '+   -'], ['문자 연결', '&'], ['비교', '=  <  >  <=  >=  <>']];
      L.forEach(function (r, i) {
        var y = 34 + i * 29, w = 190;
        s += box(20, y, w, 25, { fill: i < 3 ? C.redL : (i < 5 ? C.orangeL : C.grayL), c: C.grayM, w: 1, r: 4 });
        s += num(34, y + 12.5, i + 1, { r: 10, size: 12, c: i < 3 ? C.red : (i < 5 ? C.orange : C.sub) });
        s += t(52, y + 12.5, r[0], { size: 13, halo: false }) + t(202, y + 12.5, r[1], { a: 'e', size: 14, b: 1, halo: false });
      });
      s += t(110, 250, '나중 계산', { a: 'm', size: 14, b: 1, c: C.sub });
      s += t(350, 40, '예) = 2 + 3 * 2 ^ 2', { a: 'm', size: 16, b: 1 });
      var st = [['2 ^ 2 = 4', '① 거듭제곱'], ['3 * 4 = 12', '② 곱셈'], ['2 + 12 = 14', '③ 덧셈']];
      st.forEach(function (r, i) {
        var y = 70 + i * 56;
        s += box(260, y, 180, 36, { fill: '#fff', c: C.blue, w: 1.4, r: 6 }) + t(350, y + 18, r[0], { a: 'm', size: 16, b: 1, halo: false });
        s += t(386, y + 45, r[1], { a: 'm', size: 12, c: C.sub });
        if (i < 2) s += arrow(300, y + 36, 300, y + 55, { w: 1.2, head: 6, c: C.blue });
      });
      s += t(350, 238, '답 14', { a: 'm', size: 16, b: 1, c: C.green });
      return F.svg(480, 264, s);
    } };

  R.errs = { topics: ['excel/formula'], cards: ['#DIV/0! / #N/A', '#NAME? / #VALUE!', '#REF! / #NUM! / #NULL!'],
    cap: '오류 값은 원인으로 외운다 — 이런 수식에서 이런 값이 나온다(수식은 예)',
    draw: function () {
      var s = t(90, 20, '수식', { a: 'm', size: 13, b: 1, c: C.sub }) + t(236, 20, '결과', { a: 'm', size: 13, b: 1, c: C.sub }) + t(380, 20, '원인', { a: 'm', size: 13, b: 1, c: C.sub });
      var R7 = [['=10/0', '#DIV/0!', '0 으로 나눔'], ['=VLOOKUP("9호기",…)', '#N/A', '찾는 값이 없음'], ['=SUMM(A1:A3)', '#NAME?', '함수·이름 오타'], ['="가"+1', '#VALUE!', '자료 형식이 안 맞음'], ['=A1+B1 (B열 삭제)', '#REF!', '참조한 셀이 없어짐'], ['=10^400', '#NUM!', '숫자 범위를 넘음'], ['=SUM(A1:A3 C1:C3)', '#NULL!', '교차하지 않는 두 영역']];
      R7.forEach(function (r, i) {
        var y = 32 + i * 30;
        s += box(14, y, 162, 26, { fill: C.grayL, c: C.grayM, w: 1, r: 3 }) + t(20, y + 13, r[0], { size: 12, halo: false });
        s += box(186, y, 100, 26, { fill: '#fff', c: C.red, w: 1.4, r: 3 }) + t(236, y + 13, r[1], { a: 'm', size: 14, b: 1, c: C.red, halo: false });
        s += t(296, y + 13, r[2], { size: 13 });
      });
      return F.svg(480, 250, s);
    } };

  R.hashes = { topics: ['excel/formula'], cards: ['##### 표시'],
    cap: '##### 는 오류가 아니다 — 열 너비가 좁아 숫자를 다 못 보여 줄 때 나타나고, 열을 넓히면 사라진다',
    draw: function () {
      var s = box(30, 30, 30, 26, { fill: C.grayL, c: C.grayM, w: 1, r: 0, label: 'B', size: 13 }) + box(30, 56, 30, 34, { fill: '#fff', c: C.ink, w: 1.4, r: 0 }) + t(45, 73, '####', { a: 'm', size: 11, b: 1, c: C.red, halo: false });
      s += t(45, 112, '좁은 열', { a: 'm', size: 13, c: C.sub });
      s += arrow(80, 72, 170, 72, { c: C.blue, w: 2 }) + t(125, 52, '열 경계를 끌어', { a: 'm', size: 12, b: 1, c: C.blue }) + t(125, 92, '넓힌다', { a: 'm', size: 12, b: 1, c: C.blue });
      s += box(190, 30, 150, 26, { fill: C.grayL, c: C.grayM, w: 1, r: 0, label: 'B', size: 13 }) + box(190, 56, 150, 34, { fill: '#fff', c: C.ink, w: 1.4, r: 0 }) + t(332, 73, '1,250,000', { a: 'e', size: 16, b: 1, halo: false });
      s += line(340, 24, 340, 96, { c: C.blue, w: 2.4 }) + t(265, 112, '숫자가 보인다', { a: 'm', size: 13, b: 1, c: C.green });
      s += box(360, 40, 104, 60, { fill: C.greenL, c: C.green, w: 1.2, r: 8 }) + t(412, 60, '오류가', { a: 'm', size: 14, b: 1, halo: false }) + t(412, 82, '아니다', { a: 'm', size: 14, b: 1, halo: false });
      return F.svg(480, 132, s);
    } };

  R.circular = { topics: ['excel/formula'], cards: ['순환 참조'],
    cap: '순환 참조 — 수식이 자기 자신이 있는 셀을 직접·간접으로 참조하면 경고가 뜬다',
    draw: function () {
      var s = box(40, 40, 130, 26, { fill: C.grayL, c: C.grayM, w: 1, r: 0, label: 'A', size: 13 }) + box(40, 66, 130, 40, { fill: '#fff', c: C.red, w: 2.2, r: 0 }) + t(52, 86, '=A1+1', { size: 17, b: 1, halo: false });
      s += t(28, 86, '1', { a: 'm', size: 13, c: C.sub });
      s += path('M170,78 C230,40 230,130 170,96', { c: C.red, w: 2 }) + poly([[170, 96], [182, 92], [178, 104]], { close: 1, fill: C.red, c: C.red, w: 1 });
      s += t(240, 86, '나 자신을 다시 부른다', { size: 14, b: 1, c: C.red });
      s += box(60, 136, 360, 52, { fill: C.yellowL, c: C.orange, w: 1.6, r: 8 }) + t(80, 162, '⚠', { size: 20, c: C.orange, halo: false }) + t(108, 154, '순환 참조 경고', { size: 15, b: 1, halo: false }) + t(108, 174, '[A1]의 수식이 [A1] 자신을 참조합니다', { size: 12, c: C.sub, halo: false });
      return F.svg(480, 204, s);
    } };

  R.showf = { topics: ['excel/formula'], cards: ['수식 표시(Ctrl+`)'],
    cap: 'Ctrl+` (또는 [수식] 탭-[수식 표시])를 누르면 셀에 결과 대신 입력한 수식이 그대로 보인다',
    draw: function () {
      var s = t(110, 22, '평소 — 결과', { a: 'm', size: 15, b: 1 }) + t(360, 22, '수식 표시', { a: 'm', size: 15, b: 1, c: C.blue });
      var o1 = { cols: ['A', 'B'], cw: [70, 80], rh: 28, rows: [['오전', 520], ['오후', 480], ['합계', 1000]], bold: { '2,1': 1 } };
      s += sheet(20, 36, o1);
      var o2 = { cols: ['A', 'B'], cw: [70, 130], rh: 28, rows: [['오전', '520'], ['오후', '480'], ['합계', '=SUM(B1:B2)']], bold: { '2,1': 1 }, color: { '2,1': C.blue }, align: { 1: 's' } };
      s += sheet(250, 36, o2);
      s += arrow(200, 110, 244, 110, { c: C.blue, w: 1.8, both: true });
      s += combo(240, 146, ['Ctrl', '`'], { a: 'm' });
      s += t(240, 196, '한 번 더 누르면 원래대로', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 210, s);
    } };


  /* ════════════ 2과목 ④ 주요 함수 ════════════ */
  function fbox(x, y, w, s, o) {
    o = o || {};
    return box(x, y, w, o.h || 32, { fill: '#fff', c: o.c || C.blue, w: 1.8, r: 6 }) + t(x + (o.a === 's' ? 10 : w / 2), y + (o.h || 32) / 2, s, { a: o.a || 'm', size: o.size || 15, b: 1, halo: false });
  }
  function res(x, y, v, o) {
    o = o || {};
    return box(x, y, o.w || 64, o.h || 32, { fill: o.fill || C.greenL, c: o.c || C.green, w: 1.8, r: 6, label: v, size: o.size || 16, b: 1 });
  }

  R.largesmall = { topics: ['excel/func'], cards: ['MAX / MIN / LARGE / SMALL'],
    cap: 'MAX·MIN 은 가장 큰·작은 값, LARGE(범위,k)는 k번째로 큰 값, SMALL(범위,k)는 k번째로 작은 값(숫자는 예)',
    draw: function () {
      var s = t(20, 22, '생산량을 큰 순서로 세우면', { size: 14, b: 1, c: C.sub });
      var v = [530, 520, 505, 480, 470], lab = ['MAX', 'LARGE(범위, 2)', '', 'SMALL(범위, 2)', 'MIN'], c = [C.red, C.orange, C.sub, C.blue, C.purple];
      v.forEach(function (x, i) {
        var y = 36 + i * 36, w = (x - 400) * 1.7;
        s += box(20, y, w, 28, { fill: i === 2 ? C.grayL : [C.redL, C.orangeL, '', C.blueL, C.purpleL][i], c: c[i], w: 1.4, r: 3 });
        s += t(28 + w, y + 14, String(x), { size: 15, b: 1, c: c[i] });
        if (lab[i]) s += arrow(330, y + 14, 290, y + 14, { c: c[i], w: 1.4, head: 8 }) + t(336, y + 14, lab[i], { size: 14, b: 1, c: c[i] });
      });
      return F.svg(480, 222, s);
    } };

  R.count3 = { topics: ['excel/func'], cards: ['COUNT / COUNTA / COUNTBLANK'],
    cap: '같은 범위라도 COUNT 는 숫자 셀, COUNTA 는 비어 있지 않은 셀, COUNTBLANK 는 빈 셀의 개수를 센다',
    draw: function () {
      var vals = [520, '정비', '', 480, 530, ''], s = '';
      var o = { cols: ['A'], cw: [100], rh: 30, rows: vals.map(function (v) { return [v]; }), fill: {} };
      vals.forEach(function (v, i) { o.fill[i + ',0'] = typeof v === 'number' ? C.blueL : (v ? C.orangeL : C.grayL); });
      s += sheet(20, 18, o);
      s += box(180, 40, 280, 44, { fill: C.blueL, c: C.blue, w: 1.4, r: 8 }) + t(196, 62, '=COUNT(A1:A6)', { size: 15, b: 1, halo: false }) + t(446, 62, '3', { a: 'e', size: 20, b: 1, c: C.blue, halo: false });
      s += box(180, 96, 280, 44, { fill: C.orangeL, c: C.orange, w: 1.4, r: 8 }) + t(196, 118, '=COUNTA(A1:A6)', { size: 15, b: 1, halo: false }) + t(446, 118, '4', { a: 'e', size: 20, b: 1, c: C.orange, halo: false });
      s += box(180, 152, 280, 44, { fill: C.grayL, c: C.sub, w: 1.4, r: 8 }) + t(196, 174, '=COUNTBLANK(A1:A6)', { size: 15, b: 1, halo: false }) + t(446, 174, '2', { a: 'e', size: 20, b: 1, c: C.sub, halo: false });
      s += t(240, 224, '숫자만 · 비어 있지 않은 것 모두 · 빈 칸만', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 240, s);
    } };

  R.countif = { topics: ['excel/func'], cards: ['COUNTIF / SUMIF / AVERAGEIF'], slide: ['excel/func#4'],
    cap: 'COUNTIF(범위, 조건)는 조건에 맞는 개수, SUMIF(조건 범위, 조건, 합계 범위)는 조건에 맞는 합계(숫자는 예)',
    draw: function () {
      var f = {};
      [0, 2].forEach(function (r) { for (var c = 0; c < 3; c++) f[(r + 1) + ',' + c] = C.yellowL; });
      var o = { cols: ['A', 'B', 'C'], cw: [70, 56, 76], rh: 28, rows: [['설비', '라인', '생산량'], ['1호기', 'A', 520], ['2호기', 'B', 480], ['3호기', 'A', 530], ['4호기', 'B', 470]], fill: f, bold: { '0,0': 1, '0,1': 1, '0,2': 1 } };
      var s = sheet(16, 16, o);
      s += box(112, 72, 56, 112, { fill: 'none', c: C.orange, w: 2.4, r: 0 }) + box(168, 72, 76, 112, { fill: 'none', c: C.green, w: 2.4, r: 0 });
      s += t(140, 202, '조건 범위', { a: 'm', size: 13, b: 1, c: C.orange }) + t(206, 220, '합계 범위', { a: 'm', size: 13, b: 1, c: C.green });
      s += fbox(262, 30, 204, '=COUNTIF(B2:B5,"A")', { size: 13, a: 's' }) + t(364, 80, '→ 2  (A 라인 개수)', { a: 'm', size: 14, b: 1, c: C.blue });
      s += fbox(262, 104, 204, '=SUMIF(B2:B5,"A",C2:C5)', { size: 12, a: 's', c: C.green }) + t(364, 154, '→ 1050  (A 라인 합계)', { a: 'm', size: 14, b: 1, c: C.green });
      s += t(364, 196, '조건은 따옴표 안에: ">=500"', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 236, s);
    } };

  R.iffn = { topics: ['excel/func'], cards: ['IF 함수', 'IFERROR(값, 오류일 때 값)'],
    cap: 'IF(조건, 참일 때 값, 거짓일 때 값)는 갈림길, IFERROR(값, 오류일 때 값)는 오류가 나면 대신 보여 줄 값(숫자는 예)',
    draw: function () {
      var s = t(20, 22, '=IF(C2<=2, "합격", "재검사")', { size: 15, b: 1, c: C.blue });
      s += poly([[120, 44], [196, 76], [120, 108], [44, 76]], { close: 1, fill: C.blueL, c: C.blue, w: 1.8 }) + t(120, 76, '불량률 ≤ 2', { a: 'm', size: 13, b: 1, halo: false });
      s += arrow(196, 76, 262, 60, { c: C.green, w: 1.8 }) + t(226, 56, '참', { a: 'm', size: 13, b: 1, c: C.green });
      s += arrow(196, 76, 262, 100, { c: C.red, w: 1.8 }) + t(226, 104, '거짓', { a: 'm', size: 13, b: 1, c: C.red });
      s += res(266, 44, '합격', { w: 80, h: 30 }) + res(266, 86, '재검사', { w: 80, h: 30, fill: C.redL, c: C.red });
      s += t(420, 70, '조건이', { a: 'm', size: 12, c: C.sub }) + t(420, 88, '여러 개면', { a: 'm', size: 12, c: C.sub }) + t(420, 106, 'IF 중첩·IFS', { a: 'm', size: 12, b: 1, c: C.sub });
      s += hdiv(132);
      s += t(20, 156, '=IFERROR(A2/B2, 0)', { size: 15, b: 1, c: C.orange });
      s += box(44, 176, 120, 36, { fill: '#fff', c: C.orange, w: 1.6, r: 6, label: 'A2 / B2 계산', size: 13 });
      s += arrow(166, 194, 232, 180, { c: C.green, w: 1.6 }) + t(198, 172, '정상', { a: 'm', size: 12, b: 1, c: C.green });
      s += arrow(166, 194, 232, 222, { c: C.red, w: 1.6 }) + t(198, 222, '오류', { a: 'm', size: 12, b: 1, c: C.red });
      s += res(236, 166, '계산 결과', { w: 100, h: 28, size: 13 }) + res(236, 208, '0', { w: 100, h: 28, fill: C.orangeL, c: C.orange, size: 14 });
      s += t(350, 222, '← #DIV/0! 대신', { size: 12, c: C.orange, b: 1 });
      return F.svg(480, 250, s);
    } };

  R.andor = { topics: ['excel/func'], cards: ['AND / OR / NOT', 'NOT(조건)'],
    cap: 'AND 는 조건이 모두 참이어야 TRUE(직렬), OR 는 하나만 참이어도 TRUE(병렬), NOT 은 결과를 반대로',
    draw: function () {
      var s = '';
      function sw(x, y, on) { return circle(x, y, 3, { fill: C.ink, c: C.ink, w: 1 }) + circle(x + 30, y, 3, { fill: C.ink, c: C.ink, w: 1 }) + line(x, y, x + 28, on ? y : y - 12, { c: C.ink, w: 2 }); }
      function lamp(x, y, on) { return circle(x, y, 12, { fill: on ? '#fde68a' : '#fff', c: on ? C.orange : C.ink, w: 1.8 }) + line(x - 8, y - 8, x + 8, y + 8, { c: on ? C.orange : C.ink, w: 1.2 }) + line(x - 8, y + 8, x + 8, y - 8, { c: on ? C.orange : C.ink, w: 1.2 }); }
      /* AND */
      s += t(20, 24, 'AND — 모두', { size: 15, b: 1, c: C.blue });
      s += line(20, 60, 50, 60, { w: 2 }) + sw(50, 60, true) + line(80, 60, 110, 60, { w: 2 }) + sw(110, 60, true) + line(140, 60, 178, 60, { w: 2 }) + lamp(190, 60, true);
      s += t(65, 80, '조건1', { a: 'm', size: 12, c: C.sub }) + t(125, 80, '조건2', { a: 'm', size: 12, c: C.sub }) + t(190, 88, 'TRUE', { a: 'm', size: 12, b: 1, c: C.orange });
      /* OR */
      s += t(260, 24, 'OR — 하나라도', { size: 15, b: 1, c: C.green });
      s += line(260, 60, 290, 60, { w: 2 }) + line(290, 44, 290, 76, { w: 2 }) + line(290, 44, 310, 44, { w: 2 }) + line(290, 76, 310, 76, { w: 2 });
      s += sw(310, 44, true) + sw(310, 76, false) + line(340, 44, 360, 44, { w: 2 }) + line(340, 76, 360, 76, { w: 2 }) + line(360, 44, 360, 76, { w: 2 }) + line(360, 60, 408, 60, { w: 2 }) + lamp(420, 60, true);
      s += t(420, 88, 'TRUE', { a: 'm', size: 12, b: 1, c: C.orange });
      s += hdiv(108);
      /* 표 */
      var o = { cols: ['조건1', '조건2', 'AND', 'OR'], cw: [80, 80, 80, 80], rh: 26, hdr: false,
        rows: [['조건1', '조건2', 'AND', 'OR'], ['참', '참', 'TRUE', 'TRUE'], ['참', '거짓', 'FALSE', 'TRUE'], ['거짓', '거짓', 'FALSE', 'FALSE']],
        align: { 0: 'm', 1: 'm', 2: 'm', 3: 'm' }, bold: { '0,0': 1, '0,1': 1, '0,2': 1, '0,3': 1 }, fill: { '0,0': C.grayL, '0,1': C.grayL, '0,2': C.blueL, '0,3': C.greenL },
        color: { '1,2': C.blue, '1,3': C.green, '2,3': C.green } };
      s += sheet(20, 122, o);
      s += box(360, 136, 104, 70, { fill: C.purpleL, c: C.purple, w: 1.4, r: 8 }) + t(412, 154, 'NOT', { a: 'm', size: 15, b: 1, c: C.purple, halo: false }) + t(412, 176, '참 → FALSE', { a: 'm', size: 12, halo: false }) + t(412, 194, '거짓 → TRUE', { a: 'm', size: 12, halo: false });
      return F.svg(480, 238, s);
    } };

  R.rank = { topics: ['excel/func'], cards: ['RANK.EQ'], slide: ['excel/func#5'],
    cap: 'RANK.EQ(값, 범위, 순서) — 순서 0(생략)은 큰 값이 1위, 0이 아니면 작은 값이 1위. 범위는 $ 로 고정한다(숫자는 예)',
    draw: function () {
      var s = fbox(20, 14, 440, '=RANK.EQ(D2, $D$2:$D$4, 0)', { size: 16 });
      s += callout(248, 46, 248, 64, '범위는 절대 참조', { a: 'm', size: 12, c: C.red, tc: C.red, b: 1 });
      s += t(120, 90, '0 · 생략 → 큰 값이 1위', { a: 'm', size: 14, b: 1, c: C.blue }) + t(360, 90, '1 → 작은 값이 1위', { a: 'm', size: 14, b: 1, c: C.orange }) + divider(240, 80, 228);
      var v = [90, 85, 95], r0 = [2, 3, 1], r1 = [2, 1, 3];
      v.forEach(function (x, i) {
        var y = 108 + i * 36;
        s += box(40, y, 70, 30, { fill: '#fff', c: C.grayM, w: 1, r: 0 }) + t(102, y + 15, String(x), { a: 'e', size: 15, halo: false });
        s += arrow(116, y + 15, 150, y + 15, { w: 1.4, head: 7, c: C.sub }) + circle(170, y + 15, 14, { fill: r0[i] === 1 ? C.blue : C.blueL, c: C.blue, w: 1.4 }) + t(170, y + 15.5, r0[i] + '위', { a: 'm', size: 12, b: 1, c: r0[i] === 1 ? '#fff' : C.ink, halo: false });
        s += box(280, y, 70, 30, { fill: '#fff', c: C.grayM, w: 1, r: 0 }) + t(342, y + 15, String(x), { a: 'e', size: 15, halo: false });
        s += arrow(356, y + 15, 390, y + 15, { w: 1.4, head: 7, c: C.sub }) + circle(410, y + 15, 14, { fill: r1[i] === 1 ? C.orange : C.orangeL, c: C.orange, w: 1.4 }) + t(410, y + 15.5, r1[i] + '위', { a: 'm', size: 12, b: 1, c: r1[i] === 1 ? '#fff' : C.ink, halo: false });
      });
      s += t(120, 228, '점수 · 생산량', { a: 'm', size: 12, c: C.sub }) + t(360, 228, '기록 시간 · 불량 수', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 244, s);
    } };

  R.round = { topics: ['excel/func'], cards: ['ROUND / ROUNDUP / ROUNDDOWN'],
    cap: '자릿수 — 양수는 소수점 아래 자리, 0 은 정수, 음수는 정수 왼쪽 자리에서 반올림(ROUND)·올림(ROUNDUP)·내림(ROUNDDOWN)',
    draw: function () {
      var d = ['3', '4', '5', '6', '.', '7', '8', '9'], k = ['-3', '-2', '-1', '0', '', '1', '2', '3'], s = '';
      d.forEach(function (ch, i) {
        var x = 60 + i * 44;
        if (ch === '.') { s += t(x + 18, 42, '.', { a: 'm', size: 26, b: 1 }); return; }
        s += box(x, 22, 40, 40, { fill: +k[i] > 0 ? C.orangeL : (k[i] === '0' ? C.greenL : C.blueL), c: C.grayM, w: 1, r: 4, label: ch, size: 20 });
        s += t(x + 20, 76, k[i], { a: 'm', size: 14, b: 1, c: +k[i] > 0 ? C.orange : (k[i] === '0' ? C.green : C.blue) });
      });
      s += t(20, 76, '자릿수', { size: 12, c: C.sub });
      var o = { cols: [], cw: [118, 110, 110, 110], rh: 28, hdr: false,
        rows: [['자릿수', 'ROUND', 'ROUNDUP', 'ROUNDDOWN'], ['1', '3456.8', '3456.8', '3456.7'], ['0', '3457', '3457', '3456'], ['-1', '3460', '3460', '3450']],
        align: { 0: 'm', 1: 'e', 2: 'e', 3: 'e' }, bold: { '0,0': 1, '0,1': 1, '0,2': 1, '0,3': 1 }, fill: { '0,0': C.grayL, '0,1': C.grayL, '0,2': C.grayL, '0,3': C.grayL } };
      s += sheet(16, 98, o);
      s += t(240, 230, '3456.789 를 자릿수대로 — 반올림 · 올림 · 내림', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 246, s);
    } };

  R.inttrunc = { topics: ['excel/func'], cards: ['INT / MOD / ABS', 'TRUNC(수, 자릿수)'],
    cap: 'INT 는 작아지는 쪽 정수로(INT(-5.6) = -6), TRUNC 는 소수만 잘라 버린다(TRUNC(-5.6) = -5). MOD 는 나머지, ABS 는 절댓값',
    draw: function () {
      var s = '', u = 110;
      function X(v) { return 70 + (v + 7) * u; }
      s += arrow(40, 70, 450, 70, { w: 1.6, head: 9, c: C.ink }) + t(450, 90, '0 쪽 →', { a: 'e', size: 12, c: C.sub });
      [-7, -6, -5, -4].forEach(function (v) { s += line(X(v), 64, X(v), 76, { w: 1.4 }) + t(X(v), 92, String(v), { a: 'm', size: 15, b: v === -6 || v === -5 }); });
      s += circle(X(-5.6), 70, 6, { fill: C.purple, c: C.purple, w: 1 }) + t(X(-5.6), 46, '-5.6', { a: 'm', size: 16, b: 1, c: C.purple });
      s += line(X(-5.6), 76, X(-5.6), 132, { c: C.purple, w: 1, dash: '3 3' });
      s += arrow(X(-5.6), 112, X(-6), 112, { c: C.red, w: 2, head: 9 }) + t(X(-6) - 8, 112, 'INT → -6', { a: 'e', size: 15, b: 1, c: C.red });
      s += arrow(X(-5.6), 132, X(-5), 132, { c: C.blue, w: 2, head: 9 }) + t(X(-5) + 8, 132, 'TRUNC → -5', { size: 15, b: 1, c: C.blue });
      s += t(X(-6) - 8, 132, '작아지는 쪽으로', { a: 'e', size: 12, c: C.sub }) + t(X(-5) + 8, 154, '소수만 잘라 냄', { size: 12, c: C.sub });
      s += hdiv(176);
      s += fbox(20, 190, 130, '=MOD(7, 3)', { size: 14 }) + t(160, 206, '→ 1 (나머지)', { size: 14, b: 1, c: C.green });
      s += fbox(262, 190, 110, '=ABS(-5)', { size: 14 }) + t(382, 206, '→ 5', { size: 14, b: 1, c: C.green });
      return F.svg(480, 236, s);
    } };

  R.textfn = { topics: ['excel/func'], cards: ['LEFT / RIGHT / MID'],
    cap: 'LEFT 는 왼쪽부터, RIGHT 는 오른쪽부터, MID(문자열, 시작 위치, 개수)는 가운데에서 글자를 떼어 낸다(부품 번호는 예)',
    draw: function () {
      var str = 'M2026-031'.split(''), s = '', fill = [C.blueL, C.greenL, C.greenL, C.greenL, C.greenL, C.grayL, C.orangeL, C.orangeL, C.orangeL];
      str.forEach(function (ch, i) {
        var x = 42 + i * 44;
        s += box(x, 30, 40, 40, { fill: fill[i], c: C.grayM, w: 1, r: 4, label: ch, size: 20 }) + t(x + 20, 84, String(i + 1), { a: 'm', size: 12, c: C.sub });
      });
      s += t(20, 20, 'A2', { size: 12, c: C.sub });
      s += fbox(20, 104, 150, '=LEFT(A2, 1)', { size: 14 }) + res(180, 104, 'M', { fill: C.blueL, c: C.blue, w: 60 });
      s += fbox(20, 146, 150, '=MID(A2, 2, 4)', { size: 14, c: C.green }) + res(180, 146, '2026', { w: 80 });
      s += fbox(20, 188, 150, '=RIGHT(A2, 3)', { size: 14, c: C.orange }) + res(180, 188, '031', { fill: C.orangeL, c: C.orange, w: 70 });
      s += t(290, 120, '왼쪽에서 1글자', { size: 13 }) + t(290, 162, '2번째부터 4글자', { size: 13 }) + t(290, 204, '오른쪽에서 3글자', { size: 13 });
      return F.svg(480, 234, s);
    } };

  R.vlookup = { topics: ['excel/func'], cards: ['VLOOKUP / HLOOKUP'], slide: ['excel/func#0'], hide: ['0 = 정확히 일치', ', 0)', '첫 열'],
    cap: 'VLOOKUP(찾을 값, 범위, 열 번호, 0) — 범위의 첫 열에서 찾아, 그 행의 n번째 열 값을 가져온다. 0(FALSE) = 정확히 일치',
    draw: function () {
      var s = fbox(20, 14, 440, '=VLOOKUP("P03", A2:C4, 3, 0)', { size: 16 });
      var o = { cols: ['A', 'B', 'C'], cw: [70, 80, 70], rh: 30, rows: [['코드', '품명', '단가'], ['P01', '볼트', 50], ['P02', '너트', 30], ['P03', '와셔', 10]],
        bold: { '0,0': 1, '0,1': 1, '0,2': 1, '3,0': 1, '3,2': 1 }, fill: { '1,0': C.blueL, '2,0': C.blueL, '3,0': C.blueL, '3,2': C.greenL } };
      s += sheet(20, 62, o);
      s += box(46, 122, 70, 90, { fill: 'none', c: C.blue, w: 2.2, r: 0 });
      s += arrow(118, 207, 188, 207, { c: C.green, w: 2, head: 8 });
      s += t(290, 90, '① 첫 열에서 "P03" 찾기', { size: 14, b: 1, c: C.blue });
      s += t(290, 118, '② 범위의 3번째 열 값', { size: 14, b: 1, c: C.green });
      s += res(290, 136, '10', { w: 70 });
      s += t(290, 192, '0 = 정확히 일치', { size: 13 }) + t(290, 212, '1·생략 = 근사값(첫 열 오름차순)', { size: 12, c: C.sub });
      s += t(290, 232, 'HLOOKUP 은 첫 행에서 찾는다', { size: 12, c: C.sub });
      return F.svg(480, 246, s);
    } };

  R.datefn = { topics: ['excel/func'], cards: ['TODAY / NOW / YEAR / MONTH / DAY', 'DATE(연, 월, 일)'], slide: ['excel/func#8'],
    cap: '날짜는 사실 숫자다 — DATE 로 만들고 YEAR·MONTH·DAY 로 쪼개며, 두 날짜를 빼면 지난 일수가 나온다(날짜는 예)',
    draw: function () {
      var s = fbox(20, 16, 190, '=DATE(2026, 10, 1)', { size: 14 }) + arrow(214, 32, 248, 32, { c: C.blue }) + res(252, 16, '2026-10-01', { w: 120, fill: C.blueL, c: C.blue, size: 15 });
      s += arrow(312, 50, 150, 88, { c: C.sub, w: 1.2, head: 7 }) + arrow(312, 50, 270, 88, { c: C.sub, w: 1.2, head: 7 }) + arrow(312, 50, 390, 88, { c: C.sub, w: 1.2, head: 7 });
      s += box(90, 92, 120, 30, { fill: '#fff', c: C.grayM, w: 1, r: 4, label: 'YEAR → 2026', size: 13 }) + box(220, 92, 110, 30, { fill: '#fff', c: C.grayM, w: 1, r: 4, label: 'MONTH → 10', size: 13 }) + box(340, 92, 100, 30, { fill: '#fff', c: C.grayM, w: 1, r: 4, label: 'DAY → 1', size: 13 });
      s += hdiv(140);
      s += t(20, 162, '빼면 지난 일수', { size: 14, b: 1, c: C.green });
      s += box(20, 176, 110, 30, { fill: '#fff', c: C.ink, w: 1.2, r: 3, label: '2026-10-01', size: 14 }) + t(142, 191, '−', { a: 'm', size: 18, b: 1 });
      s += box(154, 176, 110, 30, { fill: '#fff', c: C.ink, w: 1.2, r: 3, label: '2026-09-01', size: 14 }) + t(276, 191, '=', { a: 'm', size: 18, b: 1 });
      s += res(290, 176, '30', { w: 60, h: 30 }) + t(360, 191, '일', { size: 14, b: 1, c: C.green });
      s += t(240, 230, 'TODAY() 오늘 날짜 · NOW() 날짜와 시간 — 괄호는 꼭', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 246, s);
    } };

  R.choose = { topics: ['excel/func'], cards: ['CHOOSE(번호, 값1, 값2, …)'],
    cap: 'CHOOSE(번호, 값1, 값2, …) — 번호 순서에 있는 값을 고른다. RANK.EQ 와 함께 순위별 메달을 붙일 때 쓴다',
    draw: function () {
      var s = fbox(20, 16, 440, '=CHOOSE(2, "금", "은", "동")', { size: 17 });
      var nm = ['금', '은', '동'], col = ['#fde68a', '#e5e7eb', '#fed7aa'];
      nm.forEach(function (m, i) {
        var x = 110 + i * 110;
        s += circle(x, 110, 30, { fill: col[i], c: i === 1 ? C.blue : C.grayM, w: i === 1 ? 3 : 1.4, label: m, size: 20 });
        s += t(x, 156, (i + 1) + '번', { a: 'm', size: 14, b: 1, c: i === 1 ? C.blue : C.sub });
      });
      s += arrow(78, 56, 208, 84, { c: C.blue, w: 1.8 }) + t(60, 70, '번호 2', { a: 'm', size: 13, b: 1, c: C.blue });
      s += t(240, 196, '→ "은"', { a: 'm', size: 18, b: 1, c: C.blue });
      return F.svg(480, 216, s);
    } };

  R.find = { topics: ['excel/func'], cards: ['FIND / SEARCH'],
    cap: 'FIND 는 대·소문자를 구분하고, SEARCH 는 구분하지 않는다(와일드카드 *, ? 도 SEARCH 만). 결과는 몇 번째 글자인지',
    draw: function () {
      var str = 'Pump-Motor'.split(''), s = '';
      str.forEach(function (ch, i) {
        var x = 20 + i * 44, f = i === 2 ? C.orangeL : (i === 5 ? C.blueL : '#fff');
        s += box(x, 28, 40, 40, { fill: f, c: C.grayM, w: 1, r: 4, label: ch, size: 20 }) + t(x + 20, 82, String(i + 1), { a: 'm', size: 12, c: C.sub });
      });
      s += fbox(20, 104, 200, '=FIND("M", A2)', { size: 15 }) + t(232, 120, '→ 6', { size: 17, b: 1, c: C.blue }) + t(290, 120, '큰 M 만 찾음', { size: 13 });
      s += fbox(20, 150, 200, '=SEARCH("M", A2)', { size: 15, c: C.orange }) + t(232, 166, '→ 3', { size: 17, b: 1, c: C.orange }) + t(290, 166, '작은 m 도 같게 봄', { size: 13 });
      s += t(240, 210, 'FIND = 대소문자 구분 · SEARCH = 구분 안 함, * ? 사용 가능', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 226, s);
    } };

  R.eomonth = { topics: ['excel/func'], cards: ['EDATE / EOMONTH'],
    cap: 'EDATE(시작일, 개월 수)는 몇 개월 뒤의 같은 날, EOMONTH(시작일, 개월 수)는 몇 개월 뒤 달의 마지막 날(날짜는 예)',
    draw: function () {
      var s = t(20, 22, '시작일 2026-01-15, 개월 수 1', { size: 14, b: 1, c: C.sub });
      function month(x, name, days, marks) {
        var o = t(x + 105, 46, name, { a: 'm', size: 15, b: 1 });
        for (var d = 1; d <= 35; d++) {
          var c = (d - 1) % 7, r = Math.floor((d - 1) / 7), bx = x + c * 30, by = 58 + r * 26;
          if (d > days) continue;
          var mk = marks[d];
          o += box(bx, by, 28, 24, { fill: mk ? mk[0] : '#fff', c: mk ? mk[1] : C.edge, w: mk ? 1.8 : 1, r: 3 }) + t(bx + 14, by + 12, String(d), { a: 'm', size: 12, halo: false, b: !!mk });
        }
        return o;
      }
      s += month(14, '1월', 31, { 15: [C.grayL, C.ink] });
      s += month(252, '2월', 28, { 15: [C.blueL, C.blue], 28: [C.orangeL, C.orange] });
      s += t(70, 212, '시작일', { a: 'm', size: 13, b: 1 });
      s += fbox(236, 200, 104, 'EDATE → 2/15', { size: 13, c: C.blue }) + fbox(346, 200, 124, 'EOMONTH → 2/28', { size: 13, c: C.orange });
      return F.svg(480, 244, s);
    } };


  /* ════════════ 2과목 ⑤ 데이터 관리(정렬·필터) ════════════ */
  R.sortorder = { topics: ['excel/data'], cards: ['오름차순 정렬 순서'], slide: ['excel/data#1'],
    cap: '오름차순 — 숫자 → 문자 → 논리값(FALSE→TRUE) → 오류값 → 빈 셀. 빈 셀은 오름차순·내림차순 모두 맨 뒤',
    draw: function () {
      var s = t(20, 24, '오름차순', { size: 16, b: 1, c: C.blue });
      var A = [['숫자', C.blueL, C.blue], ['문자', C.greenL, C.green], ['논리값', C.orangeL, C.orange], ['오류값', C.redL, C.red], ['빈 셀', C.grayL, C.sub]];
      function row(y, order) {
        var o = '';
        order.forEach(function (k, i) {
          var a = A[k], x = 20 + i * 92;
          o += box(x, y, 76, 36, { fill: a[1], c: a[2], w: 1.6, r: 6, label: a[0], size: 15 });
          if (i < 4) o += arrow(x + 78, y + 18, x + 90, y + 18, { w: 1.4, head: 7, c: C.sub });
        });
        return o;
      }
      s += row(38, [0, 1, 2, 3, 4]);
      s += t(58, 94, '작은 수부터', { a: 'm', size: 12, c: C.sub }) + t(242, 94, 'FALSE → TRUE', { a: 'm', size: 12, c: C.sub });
      s += t(20, 128, '내림차순', { size: 16, b: 1, c: C.orange }) + t(100, 128, '— 거꾸로, 단 빈 셀은 그대로 맨 뒤', { size: 13, c: C.sub });
      s += row(142, [3, 2, 1, 0, 4]);
      s += box(386, 30, 88, 150, { fill: 'none', c: C.red, w: 2, r: 8, dash: '6 4' });
      s += t(430, 200, '늘 맨 뒤', { a: 'm', size: 14, b: 1, c: C.red });
      return F.svg(480, 216, s);
    } };

  R.customsort = { topics: ['excel/data'], cards: ['사용자 지정 목록 정렬'],
    cap: '사용자 지정 목록 정렬 — 가나다 순이 아니라 «봄, 여름, 가을, 겨울»처럼 내가 정한 순서로 정렬한다',
    draw: function () {
      var s = t(120, 24, '가나다 순', { a: 'm', size: 16, b: 1, c: C.sub }) + t(360, 24, '사용자 지정 목록 순', { a: 'm', size: 16, b: 1, c: C.green }) + divider(240, 14, 210);
      ['가을', '겨울', '봄', '여름'].forEach(function (v, i) { s += box(70, 40 + i * 36, 100, 32, { fill: '#fff', c: C.grayM, w: 1.2, r: 0, label: v, size: 15 }); });
      ['봄', '여름', '가을', '겨울'].forEach(function (v, i) { s += box(310, 40 + i * 36, 100, 32, { fill: C.greenL, c: C.green, w: 1.4, r: 0, label: v, size: 15 }); });
      s += t(120, 200, '사전 순서', { a: 'm', size: 13, c: C.sub }) + t(360, 200, '내가 정한 순서', { a: 'm', size: 13, b: 1, c: C.green });
      return F.svg(480, 220, s);
    } };

  R.autofilter = { topics: ['excel/data'], cards: ['자동 필터', '자동 필터의 특징'],
    cap: '자동 필터 — 머리글의 ▼ 로 조건을 걸면 맞는 행만 보인다. 여러 열에 건 조건은 AND 로 이어진다(자료는 예)',
    draw: function () {
      var rows = [['라인 ▼', '판정 ▼', '생산량'], ['A', '합격', 520], ['B', '합격', 480], ['A', '불량', 30], ['A', '합격', 530], ['B', '불량', 25]];
      var f = {}, col = {};
      [0, 1].forEach(function (c) { f['0,' + c] = C.blueL; });
      [2, 3, 5].forEach(function (r) { for (var c = 0; c < 3; c++) { f[r + ',' + c] = C.grayL; col[r + ',' + c] = C.line; } });
      var o = { cols: ['A', 'B', 'C'], cw: [70, 70, 76], rh: 28, rows: rows, fill: f, color: col, bold: { '0,0': 1, '0,1': 1, '0,2': 1 } };
      var s = sheet(16, 16, o);
      [2, 3, 5].forEach(function (r) { s += line(42, 16 + 28 * (r + 1) + 14, 258, 16 + 28 * (r + 1) + 14, { c: C.line, w: 1.2 }); });
      s += t(276, 40, '조건: 라인 = A', { size: 14, b: 1, c: C.blue }) + t(276, 62, '그리고 판정 = 합격', { size: 14, b: 1, c: C.blue });
      s += t(276, 94, '→ 2행과 5행만 보인다', { size: 13 }) + t(276, 114, '(나머지는 숨김)', { size: 12, c: C.sub });
      s += box(270, 140, 196, 64, { fill: C.redL, c: C.red, w: 1.2, r: 8 });
      s += t(368, 158, '두 열을 OR 로 잇기 ✕', { a: 'm', size: 13, b: 1, c: C.red, halo: false }) + t(368, 182, '결과를 다른 곳에 추출 ✕', { a: 'm', size: 13, b: 1, c: C.red, halo: false });
      s += t(368, 222, '→ 이럴 땐 고급 필터', { a: 'm', size: 13, b: 1, c: C.green });
      return F.svg(480, 240, s);
    } };

  R.advfilter = { topics: ['excel/data'], cards: ['고급 필터', '고급 필터 조건 지정'], slide: ['excel/data#0'],
    cap: '고급 필터 조건 범위 — 같은 행에 쓰면 AND(그리고), 다른 행에 쓰면 OR(또는). 첫 행에는 필드명을 쓴다',
    draw: function () {
      var s = t(120, 24, 'AND — 같은 행', { a: 'm', size: 16, b: 1, c: C.blue }) + t(360, 24, 'OR — 다른 행', { a: 'm', size: 16, b: 1, c: C.orange }) + divider(240, 14, 226);
      var o1 = { cols: ['F', 'G'], cw: [80, 90], rh: 30, rows: [['라인', '생산량'], ['A', '>=500']], bold: { '0,0': 1, '0,1': 1 }, fill: { '0,0': C.grayL, '0,1': C.grayL, '1,0': C.blueL, '1,1': C.blueL }, align: { 1: 's' } };
      s += sheet(24, 40, o1);
      s += t(120, 148, 'A 라인 이면서', { a: 'm', size: 14, b: 1 }) + t(120, 170, '생산량 500 이상', { a: 'm', size: 14, b: 1 });
      var o2 = { cols: ['F', 'G'], cw: [80, 90], rh: 30, rows: [['라인', '생산량'], ['A', ''], ['', '>=500']], bold: { '0,0': 1, '0,1': 1 }, fill: { '0,0': C.grayL, '0,1': C.grayL, '1,0': C.orangeL, '2,1': C.orangeL }, align: { 1: 's' } };
      s += sheet(264, 40, o2);
      s += t(360, 178, 'A 라인 이거나', { a: 'm', size: 14, b: 1 }) + t(360, 200, '생산량 500 이상', { a: 'm', size: 14, b: 1 });
      s += t(120, 206, '첫 행 = 원본과 같은 필드명', { a: 'm', size: 12, c: C.sub });
      s += t(240, 244, '조건 범위를 미리 만들어 둔다 · 결과를 다른 위치에 복사할 수 있다', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 258, s);
    } };

  R.split = { topics: ['excel/data'], cards: ['텍스트 나누기'], slide: ['excel/data#5'],
    cap: '텍스트 나누기 — 한 셀의 데이터를 구분 기호(쉼표·탭·공백)나 일정한 너비로 여러 열에 나눈다',
    draw: function () {
      var o1 = { cols: ['A'], cw: [140], rh: 30, rows: [['1호기,A,520'], ['2호기,B,480'], ['3호기,A,530']] };
      var s = sheet(16, 30, o1);
      s += arrow(190, 90, 236, 90, { c: C.blue, w: 2 }) + t(213, 70, '쉼표', { a: 'm', size: 13, b: 1, c: C.blue });
      var o2 = { cols: ['A', 'B', 'C'], cw: [64, 50, 60], rh: 30, rows: [['1호기', 'A', 520], ['2호기', 'B', 480], ['3호기', 'A', 530]], fill: { '0,0': C.blueL, '1,0': C.blueL, '2,0': C.blueL, '0,1': C.greenL, '1,1': C.greenL, '2,1': C.greenL, '0,2': C.orangeL, '1,2': C.orangeL, '2,2': C.orangeL } };
      s += sheet(244, 30, o2);
      s += t(240, 176, '구분 기호로: 쉼표 · 탭 · 공백', { a: 'm', size: 14, b: 1 }) + t(240, 198, '또는 너비가 일정하면 글자 수로', { a: 'm', size: 13, c: C.sub });
      s += t(240, 224, '오른쪽 칸을 덮어쓰니 빈 열을 미리 둔다', { a: 'm', size: 12, c: C.red });
      return F.svg(480, 240, s);
    } };

  R.dedup = { topics: ['excel/data'], cards: ['중복된 항목 제거'],
    cap: '중복된 항목 제거 — 고른 열의 값이 같은 행을 찾아 지운다. 원본 데이터가 실제로 지워진다',
    draw: function () {
      var s = t(100, 22, '전', { a: 'm', size: 15, b: 1 }) + t(360, 22, '후', { a: 'm', size: 15, b: 1, c: C.green });
      var a = ['볼트', '너트', '볼트', '와셔', '너트'], dup = [0, 0, 1, 0, 1];
      a.forEach(function (v, i) {
        s += box(50, 36 + i * 30, 100, 28, { fill: dup[i] ? C.redL : '#fff', c: dup[i] ? C.red : C.grayM, w: 1.2, r: 0, label: v, size: 15, lc: dup[i] ? C.red : C.ink });
        if (dup[i]) s += line(60, 50 + i * 30, 140, 50 + i * 30, { c: C.red, w: 1.6 }) + t(160, 50 + i * 30, '중복', { size: 12, b: 1, c: C.red });
      });
      s += arrow(210, 110, 280, 110, { c: C.green, w: 2 });
      ['볼트', '너트', '와셔'].forEach(function (v, i) { s += box(310, 66 + i * 30, 100, 28, { fill: C.greenL, c: C.green, w: 1.2, r: 0, label: v, size: 15 }); });
      s += box(90, 200, 300, 32, { fill: C.redL, c: C.red, w: 1.2, r: 8, label: '원본에서 실제로 지워진다', size: 14 });
      return F.svg(480, 246, s);
    } };

  R.validation = { topics: ['excel/data'], cards: ['데이터 유효성 검사'],
    cap: '데이터 유효성 검사 — 입력할 수 있는 값의 종류·범위를 제한한다. 셀을 고르면 설명 메시지, 틀리게 넣으면 오류 메시지(값은 예)',
    draw: function () {
      var s = box(30, 40, 110, 32, { fill: '#fff', c: C.green, w: 2.2, r: 0 }) + t(20, 24, '불량 수 입력칸', { size: 13, c: C.sub });
      s += box(150, 36, 150, 56, { fill: C.yellowL, c: C.orange, w: 1.4, r: 4 }) + t(160, 54, '설명 메시지', { size: 12, b: 1, c: C.orange, halo: false }) + t(160, 76, '0~100 정수만', { size: 14, halo: false });
      s += t(40, 120, '150 을 입력하면', { size: 14, b: 1 });
      s += box(30, 134, 110, 32, { fill: '#fff', c: C.red, w: 2.2, r: 0 }) + t(132, 150, '150', { a: 'e', size: 15, b: 1, c: C.red, halo: false });
      s += arrow(146, 150, 196, 150, { c: C.red, w: 1.8 });
      s += win(200, 112, 264, 96, '오류 메시지', { bar: C.redL, btn: false });
      s += circle(228, 162, 13, { fill: C.red, c: C.red, w: 1, label: '✕', size: 13, lc: '#fff' }) + t(250, 152, '0~100 사이 정수를', { size: 14, halo: false }) + t(250, 174, '입력하세요', { size: 14, halo: false });
      s += box(390, 180, 60, 22, { fill: C.grayL, c: C.grayM, w: 1, r: 4, label: '다시 시도', size: 11 });
      return F.svg(480, 224, s);
    } };

  R.record = { topics: ['excel/data'], cards: ['레코드 / 필드'],
    cap: '데이터 목록에서 가로 한 줄은 레코드, 세로 한 줄은 필드, 첫 행은 필드명(머리글)',
    draw: function () {
      var f = {};
      for (var r = 1; r < 5; r++) f[r + ',1'] = C.greenL;
      for (var c = 0; c < 3; c++) { f['0,' + c] = C.grayL; f['2,' + c] = C.blueL; }
      f['2,1'] = '#bfdbfe';
      var o = { cols: ['A', 'B', 'C'], cw: [80, 80, 80], rh: 30, rows: [['설비', '라인', '생산량'], ['1호기', 'A', 520], ['2호기', 'B', 480], ['3호기', 'A', 530], ['4호기', 'B', 470]], fill: f, bold: { '0,0': 1, '0,1': 1, '0,2': 1 } };
      var s = sheet(20, 20, o);
      s += box(46, 110, 240, 30, { fill: 'none', c: C.blue, w: 2.4, r: 0 }) + box(126, 50, 80, 150, { fill: 'none', c: C.green, w: 2.4, r: 0 });
      s += callout(286, 64, 312, 64, '필드명(머리글)', { size: 14, b: 1 });
      s += callout(286, 125, 312, 118, '레코드 = 가로 줄(행)', { size: 14, b: 1, c: C.blue, tc: C.blue });
      s += callout(166, 200, 312, 180, '필드 = 세로 줄(열)', { size: 14, b: 1, c: C.green, tc: C.green });
      return F.svg(480, 224, s);
    } };

  R.sortdir = { topics: ['excel/data'], cards: ['정렬 옵션(방향)'],
    cap: '정렬 방향 — 기본은 위쪽에서 아래쪽(행을 옮김), [옵션]에서 왼쪽에서 오른쪽(열을 옮김)을 고를 수 있다',
    draw: function () {
      var s = t(120, 22, '위쪽 → 아래쪽 (기본)', { a: 'm', size: 15, b: 1, c: C.blue }) + t(360, 22, '왼쪽 → 오른쪽', { a: 'm', size: 15, b: 1, c: C.orange }) + divider(240, 12, 200);
      [3, 1, 2].forEach(function (v, i) { s += box(60, 40 + i * 32, 110, 30, { fill: C.blueL, c: C.blue, w: 1.2, r: 0, label: '자료 ' + v, size: 14 }); });
      s += F.route([[180, 55], [196, 55], [196, 119], [180, 119]], { c: C.blue, w: 1.6, head: 8 }) + t(120, 158, '행(가로줄)이 자리를 바꾼다', { a: 'm', size: 12, c: C.sub });
      [3, 1, 2].forEach(function (v, i) { s += box(290 + i * 50, 50, 46, 80, { fill: C.orangeL, c: C.orange, w: 1.2, r: 0, label: '' + v, size: 15 }); });
      s += F.route([[313, 136], [313, 150], [413, 150], [413, 136]], { c: C.orange, w: 1.6, head: 8 }) + t(360, 172, '열(세로줄)이 자리를 바꾼다', { a: 'm', size: 12, c: C.sub });
      s += t(240, 220, '[정렬] - [옵션] 에서 방향과 대·소문자 구분을 정한다', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 236, s);
    } };

  /* ════════════ 2과목 ⑥ 데이터 분석과 차트 ════════════ */
  R.subtotal = { topics: ['excel/analysis'], cards: ['부분합', '부분합 중첩'], slide: ['excel/analysis#2'],
    cap: '부분합 — 그룹으로 묶을 항목을 먼저 정렬한 뒤 [부분합]. 두 번째 부분합은 [새로운 값으로 대치]를 해제해야 앞의 것이 남는다(숫자는 예)',
    draw: function () {
      var s = t(20, 22, '① 라인으로 정렬', { size: 14, b: 1, c: C.blue }) + t(250, 22, '② 부분합', { size: 14, b: 1, c: C.green });
      var o1 = { cols: ['라인', '생산량'], cw: [70, 80], rh: 26, hdr: false, rows: [['라인', '생산량'], ['A', 520], ['A', 530], ['B', 480], ['B', 470]], bold: { '0,0': 1, '0,1': 1 }, fill: { '0,0': C.grayL, '0,1': C.grayL, '1,0': C.blueL, '2,0': C.blueL, '3,0': C.orangeL, '4,0': C.orangeL } };
      s += sheet(20, 34, o1);
      s += arrow(180, 100, 240, 100, { c: C.green, w: 2 });
      var o2 = { cols: ['라인', '생산량'], cw: [90, 80], rh: 24, hdr: false, rows: [['라인', '생산량'], ['A', 520], ['A', 530], ['A 요약', 1050], ['B', 480], ['B', 470], ['B 요약', 950], ['총합계', 2000]],
        bold: { '0,0': 1, '0,1': 1, '3,0': 1, '3,1': 1, '6,0': 1, '6,1': 1, '7,0': 1, '7,1': 1 }, fill: { '0,0': C.grayL, '0,1': C.grayL, '3,0': C.greenL, '3,1': C.greenL, '6,0': C.greenL, '6,1': C.greenL, '7,0': C.yellowL, '7,1': C.yellowL } };
      s += sheet(290, 34, o2);
      [1, 2, 3].forEach(function (k, i) { s += box(250 + i * 0, 40 + i * 28, 22, 22, { fill: '#fff', c: C.sub, w: 1, r: 3, label: '' + k, size: 12 }); });
      s += t(261, 136, '윤곽', { a: 'm', size: 11, c: C.sub });
      s += box(20, 180, 216, 56, { fill: C.yellowL, c: C.orange, w: 1.2, r: 8 });
      s += box(30, 190, 16, 16, { fill: '#fff', c: C.ink, w: 1.4, r: 2 }) + t(54, 198, '새로운 값으로 대치', { size: 13, b: 1, halo: false });
      s += t(128, 224, '중첩할 땐 체크 해제', { a: 'm', size: 13, b: 1, c: C.red, halo: false });
      return F.svg(480, 244, s);
    } };

  R.pivot = { topics: ['excel/analysis'], cards: ['피벗 테이블', '피벗 차트'], slide: ['excel/analysis#0'],
    cap: '피벗 테이블 — 필터·행·열·값 네 영역에 필드를 놓아 많은 자료를 요약한다. 원본이 바뀌면 [새로 고침]. 피벗 차트는 함께 바뀐다(숫자는 예)',
    draw: function () {
      var s = t(90, 22, '필드 놓는 곳', { a: 'm', size: 14, b: 1, c: C.sub });
      var A = [['필터', '공장', C.purple, C.purpleL], ['열', '월', C.orange, C.orangeL], ['행', '설비', C.blue, C.blueL], ['값', '합계: 생산량', C.green, C.greenL]];
      A.forEach(function (a, i) {
        var x = 16 + (i % 2) * 90, y = 34 + Math.floor(i / 2) * 64;
        s += box(x, y, 84, 58, { fill: a[3], c: a[2], w: 1.4, r: 6 }) + t(x + 8, y + 14, a[0], { size: 13, b: 1, c: a[2], halo: false }) + box(x + 6, y + 26, 72, 24, { fill: '#fff', c: a[2], w: 1, r: 4, label: a[1], size: 11 });
      });
      s += arrow(196, 94, 218, 94, { w: 1.8, c: C.ink });
      var o = { cols: [], cw: [62, 56, 56, 62], rh: 26, size: 13, hdr: false, rows: [['합계', '1월', '2월', '총합계'], ['1호기', 520, 530, 1050], ['2호기', 480, 470, 950], ['총합계', 1000, 1000, 2000]],
        fill: { '0,1': C.orangeL, '0,2': C.orangeL, '1,0': C.blueL, '2,0': C.blueL, '1,1': C.greenL, '1,2': C.greenL, '2,1': C.greenL, '2,2': C.greenL, '0,0': C.grayL, '0,3': C.grayL, '3,0': C.grayL, '3,3': C.yellowL }, bold: { '0,1': 1, '0,2': 1, '3,3': 1 } };
      s += sheet(222, 40, o);
      s += t(222, 28, '공장: (전체) ▼', { size: 12, c: C.purple, b: 1 });
      /* 피벗 차트 */
      s += box(250, 160, 110, 70, { fill: '#fff', c: C.ink, w: 1.3, r: 4 });
      [[270, 36, C.blue], [286, 38, C.blue], [310, 30, C.green], [326, 29, C.green]].forEach(function (b) { s += box(b[0], 222 - b[1], 12, b[1], { fill: b[2], c: 'none', w: 0, r: 1 }); });
      s += t(370, 184, '피벗 차트', { size: 13, b: 1 }) + t(370, 204, '표를 바꾸면 함께', { size: 12, c: C.sub });
      s += box(20, 176, 176, 36, { fill: C.yellowL, c: C.orange, w: 1.2, r: 8, label: '원본 바뀜 → [새로 고침]', size: 13 });
      return F.svg(480, 244, s);
    } };

  R.goalseek = { topics: ['excel/analysis'], cards: ['목표값 찾기'],
    cap: '목표값 찾기 — 수식의 결과를 원하는 값으로 만들려면 입력값(셀 하나)이 얼마여야 하는지 거꾸로 찾는다(숫자는 예)',
    draw: function () {
      var o = { cols: ['A', 'B'], cw: [70, 90], rh: 32, rows: [['단가', 50], ['수량', '?'], ['매출', '=B1*B2']], bold: { '2,1': 1 }, fill: { '1,1': C.orangeL, '2,1': C.blueL }, align: { '1,1': 'm', '2,1': 's' } };
      var s = sheet(16, 30, o);
      s += win(236, 20, 228, 128, '목표값 찾기', { btn: false });
      [['수식 셀', 'B3', C.blue], ['찾는 값', '50000', C.green], ['값을 바꿀 셀', 'B2', C.orange]].forEach(function (r, i) {
        var y = 54 + i * 30;
        s += t(248, y + 11, r[0], { size: 13, halo: false }) + box(350, y, 100, 22, { fill: '#fff', c: r[2], w: 1.4, r: 3, label: r[1], size: 13 });
      });
      s += F.route([[420, 150], [420, 176], [222, 176], [222, 110], [206, 110]], { c: C.orange, w: 2, head: 9 });
      s += t(275, 206, '거꾸로 계산해서 → 수량 1000', { a: 'm', size: 14, b: 1, c: C.orange });
      s += t(240, 236, '바꿀 셀은 딱 하나 · 그 셀엔 수식이 아닌 값', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 252, s);
    } };

  R.scenario = { topics: ['excel/analysis'], cards: ['시나리오'],
    cap: '시나리오 — 여러 가정(변경 셀 값)을 저장해 두고 결과를 나란히 비교한다. 변경 셀은 최대 32개(숫자는 예)',
    draw: function () {
      var s = t(240, 22, '시나리오 요약 보고서', { a: 'm', size: 16, b: 1 });
      var o = { cols: [], cw: [120, 100, 100, 100], rh: 34, hdr: false, rows: [['', '낙관', '보통', '비관'], ['판매량 (변경 셀)', 1200, 1000, 800], ['매출 (결과 셀)', 60000, 50000, 40000]],
        bold: { '0,1': 1, '0,2': 1, '0,3': 1, '2,1': 1, '2,2': 1, '2,3': 1 }, fill: { '0,1': C.greenL, '0,2': C.blueL, '0,3': C.redL, '1,0': C.orangeL, '2,0': C.grayL }, align: { 0: 's' } };
      s += sheet(20, 40, o);
      s += t(240, 170, '가정마다 결과를 한 표로 비교', { a: 'm', size: 14, b: 1, c: C.blue });
      s += t(240, 194, '매출 = 판매량 × 단가 50', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 210, s);
    } };

  R.consolidate = { topics: ['excel/analysis'], cards: ['데이터 통합'],
    cap: '데이터 통합 — 여러 시트·범위에 흩어진 같은 모양의 표를 하나로 모아 합계·평균 등을 낸다(숫자는 예)',
    draw: function () {
      var s = '', M = [['1월', 10, 8], ['2월', 12, 9], ['3월', 11, 7]];
      M.forEach(function (m, i) {
        var y = 16 + i * 66;
        s += t(20, y + 12, m[0] + ' 시트', { size: 12, b: 1, c: C.sub });
        s += sheet(20, y + 22, { cols: [], cw: [66, 50], rh: 20, hdr: false, rows: [['1호기', m[1]], ['2호기', m[2]]], size: 13 });
        s += arrow(142, y + 42, 240, 110, { c: C.blue, w: 1.2, head: 8, dash: '5 4' });
      });
      s += t(250, 70, '통합 (합계)', { size: 15, b: 1, c: C.blue });
      s += sheet(250, 84, { cols: [], cw: [80, 70], rh: 30, hdr: false, rows: [['1호기', 33], ['2호기', 24]], fill: { '0,1': C.blueL, '1,1': C.blueL }, bold: { '0,1': 1, '1,1': 1 } });
      s += t(325, 172, '합계 · 평균 · 최대 …', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 220, s);
    } };

  R.chartparts = { topics: ['excel/analysis'], cards: ['차트의 구성 요소'], slide: ['excel/analysis#5'],
    cap: '차트 구성 요소 — 차트 영역 · 그림 영역 · 차트 제목 · 축 · 범례 · 데이터 계열 · 데이터 레이블 · 눈금선(숫자는 예)',
    draw: function () {
      var s = box(14, 14, 330, 236, { fill: '#fff', c: C.ink, w: 1.6, r: 6 });
      s += t(179, 36, '설비별 생산량', { a: 'm', size: 15, b: 1 });
      s += box(60, 56, 220, 150, { fill: C.grayL, c: C.grayM, w: 1, r: 0 });
      [0, 1, 2, 3].forEach(function (k) { s += line(60, 206 - k * 45, 280, 206 - k * 45, { c: C.grayM, w: 1 }); s += t(52, 206 - k * 45, String(k * 200), { a: 'e', size: 11, c: C.sub }); });
      var v = [520, 480, 530];
      v.forEach(function (x, i) { var h = x / 600 * 135, bx = 88 + i * 66; s += box(bx, 206 - h, 34, h, { fill: C.blue, c: 'none', w: 0, r: 1 }); s += t(bx + 17, 196 - h, String(x), { a: 'm', size: 12, b: 1 }); s += t(bx + 17, 220, (i + 1) + '호기', { a: 'm', size: 12 }); });
      s += box(266, 44, 12, 12, { fill: C.blue, c: 'none', w: 0, r: 1 }) + t(282, 50, '생산량', { size: 11 });
      s += callout(240, 36, 360, 28, '차트 제목', { size: 13 });
      s += callout(318, 50, 360, 58, '범례', { size: 13 });
      s += callout(254, 150, 360, 120, '데이터 계열', { size: 13, b: 1, c: C.blue, tc: C.blue });
      s += callout(252, 62, 360, 90, '데이터 레이블', { size: 13 });
      s += callout(270, 161, 360, 170, '눈금선', { size: 13 });
      s += callout(274, 196, 360, 200, '그림 영역', { size: 13 });
      s += callout(338, 236, 360, 232, '차트 영역', { size: 13 });
      s += callout(46, 100, 30, 262, '세로(값) 축', { size: 12, a: 's' });
      s += callout(170, 226, 170, 262, '가로(항목) 축', { size: 12, a: 'm' });
      return F.svg(480, 276, s);
    } };

  R.f11 = { topics: ['excel/analysis'], cards: ['차트 만들기 단축키'],
    cap: 'F11 은 새 차트 시트에, Alt+F1 은 지금 워크시트 안에 기본 차트를 만든다',
    draw: function () {
      var s = t(120, 22, 'F11', { a: 'm', size: 18, b: 1, c: C.blue }) + t(360, 22, 'Alt + F1', { a: 'm', size: 18, b: 1, c: C.green }) + divider(240, 12, 212);
      s += box(30, 40, 180, 120, { fill: '#fff', c: C.ink, w: 1.4, r: 2 });
      [50, 70, 40, 90].forEach(function (h, i) { s += box(60 + i * 36, 146 - h, 22, h, { fill: C.blue, c: 'none', w: 0, r: 1 }); });
      s += box(30, 168, 60, 22, { fill: C.grayL, c: C.grayM, w: 1, r: 3, label: 'Sheet1', size: 11 }) + box(92, 168, 60, 22, { fill: '#fff', c: C.blue, w: 1.8, r: 3, label: 'Chart1', size: 11 });
      s += t(120, 206, '새 차트 시트가 생긴다', { a: 'm', size: 13, b: 1 });
      var o = { cols: ['A', 'B'], cw: [50, 50], rh: 22, rows: [['1호기', 520], ['2호기', 480], ['3호기', 530]], size: 12 };
      s += sheet(258, 40, o);
      s += box(370, 50, 96, 84, { fill: '#fff', c: C.green, w: 1.8, r: 3 });
      [40, 34, 44].forEach(function (h, i) { s += box(388 + i * 22, 124 - h, 14, h, { fill: C.green, c: 'none', w: 0, r: 1 }); });
      s += t(360, 206, '지금 시트 안에 차트', { a: 'm', size: 13, b: 1 });
      return F.svg(480, 222, s);
    } };

  function mini(x, y, w, h, kind, c) {
    var s = box(x, y, w, h, { fill: '#fff', c: C.grayM, w: 1, r: 4 });
    var bx = x + 10, by = y + h - 10, W = w - 20, H = h - 20;
    c = c || C.blue;
    if (kind === 'col') [0.5, 0.8, 0.35, 0.65].forEach(function (v, i) { s += box(bx + 6 + i * W / 4, by - v * H, W / 4 - 10, v * H, { fill: c, c: 'none', w: 0, r: 1 }); });
    if (kind === 'bar') [0.5, 0.85, 0.35].forEach(function (v, i) { s += box(bx, y + 14 + i * (H / 3), v * W, H / 3 - 8, { fill: c, c: 'none', w: 0, r: 1 }); });
    if (kind === 'line' || kind === 'area') {
      var p = [0.3, 0.45, 0.4, 0.65, 0.8], pts = p.map(function (v, i) { return [bx + i * W / 4, by - v * H]; });
      if (kind === 'area') s += poly([[bx, by]].concat(pts).concat([[bx + W, by]]), { close: 1, fill: c === C.blue ? C.blueL : C.greenL, c: c, w: 1.6 });
      else s += poly(pts, { c: c, w: 2.2 }) + pts.map(function (q) { return circle(q[0], q[1], 3, { fill: c, c: c, w: 1 }); }).join('');
    }
    if (kind === 'pie') {
      var cx = x + w / 2, cy = y + h / 2, r = Math.min(w, h) / 2 - 10;
      s += circle(cx, cy, r, { fill: C.blueL, c: C.blue, w: 1.4 }) + path('M' + cx + ',' + cy + ' L' + cx + ',' + (cy - r) + ' A' + r + ',' + r + ' 0 0 1 ' + (cx + r) + ',' + cy + ' Z', { fill: C.orangeL, c: C.orange, w: 1.4 });
      s += path('M' + (cx + 6) + ',' + (cy + 6) + ' L' + (cx + 6 + r * 0.7) + ',' + (cy + 6 + r * 0.7) + ' A' + r + ',' + r + ' 0 0 1 ' + (cx + 6) + ',' + (cy + 6 + r) + ' Z', { fill: C.greenL, c: C.green, w: 1.4 });
    }
    if (kind === 'scatter') [[0.1, 0.2], [0.25, 0.3], [0.35, 0.45], [0.5, 0.5], [0.6, 0.7], [0.8, 0.75], [0.9, 0.9]].forEach(function (q) { s += circle(bx + q[0] * W, by - q[1] * H, 3.5, { fill: c, c: c, w: 1 }); });
    if (kind === 'bubble') [[0.2, 0.3, 6], [0.45, 0.6, 12], [0.75, 0.4, 9], [0.6, 0.8, 5]].forEach(function (q) { s += circle(bx + q[0] * W, by - q[1] * H, q[2], { fill: C.purpleL, c: C.purple, w: 1.2 }); });
    if (kind === 'stock') [[0.3, 0.8, 0.6], [0.4, 0.9, 0.5], [0.2, 0.6, 0.45], [0.35, 0.85, 0.75]].forEach(function (q, i) { var xx = bx + 10 + i * W / 4; s += line(xx, by - q[0] * H, xx, by - q[1] * H, { c: C.ink, w: 2 }) + line(xx, by - q[2] * H, xx + 7, by - q[2] * H, { c: C.red, w: 2.4 }); });
    s += line(bx, by, bx + W, by, { c: C.sub, w: 1 }) + (kind === 'pie' ? '' : line(bx, by, bx, y + 8, { c: C.sub, w: 1 }));
    return s;
  }
  R.charts4 = { topics: ['excel/analysis'], cards: ['차트 종류별 용도', '원형 차트'],
    cap: '세로 막대형은 항목 비교, 꺾은선형은 시간에 따른 추세, 원형은 전체에 대한 비율(계열 1개·축 없음), 분산형은 두 값의 상관관계',
    draw: function () {
      var s = '', P = [[14, 14], [246, 14], [14, 138], [246, 138]];
      var K = [['col', '세로 막대형', '항목끼리\n비교'], ['line', '꺾은선형', '시간에 따른\n추세'], ['pie', '원형', '전체 비율\n계열 1개\n축 없음 · 쪼개기'], ['scatter', '분산형', '두 값의\n상관관계']];
      K.forEach(function (k, i) {
        var x = P[i][0], y = P[i][1];
        s += mini(x, y + 26, 100, 90, k[0]) + t(x, y + 12, k[1], { size: 15, b: 1, c: C.blue }) + t(x + 110, y + 70, k[2], { size: 13, b: 1 });
      });
      return F.svg(480, 262, s);
    } };

  R.trend = { topics: ['excel/analysis'], cards: ['추세선'],
    cap: '추세선 — 데이터가 어느 쪽으로 가는지 보여 주는 선. 원형·도넛형·방사형·표면형 차트에는 넣을 수 없다',
    draw: function () {
      var s = box(20, 20, 280, 180, { fill: '#fff', c: C.grayM, w: 1, r: 4 });
      var v = [0.3, 0.42, 0.35, 0.55, 0.5, 0.68, 0.72];
      v.forEach(function (h, i) { s += box(40 + i * 36, 186 - h * 150, 24, h * 150, { fill: C.blueL, c: C.blue, w: 1, r: 1 }); });
      s += line(40, 186 - 0.28 * 150, 280, 186 - 0.76 * 150, { c: C.orange, w: 2.6, dash: '8 5' });
      s += t(270, 50, '추세선', { a: 'e', size: 14, b: 1, c: C.orange });
      s += box(316, 40, 150, 110, { fill: C.redL, c: C.red, w: 1.2, r: 8 });
      s += t(391, 60, '넣을 수 없는 차트', { a: 'm', size: 13, b: 1, c: C.red, halo: false });
      ['원형 · 도넛형', '방사형 · 표면형'].forEach(function (x, i) { s += t(391, 90 + i * 24, x, { a: 'm', size: 13, halo: false }); });
      return F.svg(480, 214, s);
    } };

  R.spark = { topics: ['excel/analysis'], cards: ['스파크라인'],
    cap: '스파크라인 — 셀 하나 안에 그리는 작은 차트. 꺾은선형 · 열 · 승패 세 종류(숫자는 예)',
    draw: function () {
      var rows = [['1호기', 5, 7, 6, 9, ''], ['2호기', 8, 6, 7, 5, ''], ['3호기', 3, -2, 4, -1, '']];
      var o = { cols: ['A', 'B', 'C', 'D', 'E', 'F'], cw: [60, 40, 40, 40, 40, 120], rh: 44, rows: rows, fill: { '0,5': C.yellowL, '1,5': C.yellowL, '2,5': C.yellowL } };
      var s = sheet(16, 16, o);
      var fx = 16 + 26 + 220, y0 = 16 + 44;
      /* 꺾은선 */
      var p = [5, 7, 6, 9].map(function (v, i) { return [fx + 12 + i * 32, y0 + 36 - v * 3.2]; });
      s += poly(p, { c: C.blue, w: 2 });
      /* 열 */
      [8, 6, 7, 5].forEach(function (v, i) { s += box(fx + 10 + i * 26, y0 + 44 + 38 - v * 3.8, 16, v * 3.8, { fill: C.green, c: 'none', w: 0, r: 1 }); });
      /* 승패 */
      [3, -2, 4, -1].forEach(function (v, i) { s += box(fx + 10 + i * 26, v > 0 ? y0 + 88 + 8 : y0 + 88 + 22, 16, 14, { fill: v > 0 ? C.blue : C.red, c: 'none', w: 0, r: 1 }); });
      s += t(fx + 136, y0 + 22, '꺾은선형', { size: 13, b: 1, c: C.blue }) + t(fx + 136, y0 + 66, '열', { size: 13, b: 1, c: C.green }) + t(fx + 136, y0 + 110, '승패', { size: 13, b: 1, c: C.red });
      s += t(240, 212, '데이터 바로 옆 셀에서 흐름을 본다', { a: 'm', size: 13, b: 1 });
      return F.svg(480, 228, s);
    } };

  R.secaxis = { topics: ['excel/analysis'], cards: ['보조 축'],
    cap: '보조 축 — 값의 크기가 크게 다른 계열(생산량과 불량률 등)을 오른쪽에 따로 만든 축으로 나타낸다(숫자는 예)',
    draw: function () {
      var s = box(60, 30, 330, 170, { fill: '#fff', c: C.grayM, w: 1, r: 0 });
      [0, 500, 1000].forEach(function (v, k) { s += t(54, 200 - k * 80, String(v), { a: 'e', size: 12, c: C.blue }); });
      ['0%', '2%', '4%'].forEach(function (v, k) { s += t(396, 200 - k * 80, v, { size: 12, c: C.orange }); });
      var bars = [800, 950, 700, 900], rate = [1.2, 3.1, 2.4, 1.6];
      var pts = [];
      bars.forEach(function (b, i) { var x = 96 + i * 76; s += box(x, 200 - b * 0.16, 40, b * 0.16, { fill: C.blueL, c: C.blue, w: 1.2, r: 1 }); pts.push([x + 20, 200 - rate[i] * 40]); s += t(x + 20, 214, (i + 1) + '월', { a: 'm', size: 12 }); });
      s += poly(pts, { c: C.orange, w: 2.6 }) + pts.map(function (q) { return circle(q[0], q[1], 4, { fill: C.orange, c: C.orange, w: 1 }); }).join('');
      s += t(20, 20, '기본 축: 생산량(개)', { size: 13, b: 1, c: C.blue }) + t(460, 20, '보조 축: 불량률', { a: 'e', size: 13, b: 1, c: C.orange });
      s += line(390, 30, 390, 200, { c: C.orange, w: 2 }) + line(60, 30, 60, 200, { c: C.blue, w: 2 });
      return F.svg(480, 228, s);
    } };

  R.charts4b = { topics: ['excel/analysis'], cards: ['가로 막대형 차트', '영역형 차트', '주식형 차트', '거품형 차트'],
    cap: '가로 막대형(항목 이름이 길 때 비교) · 영역형(변화의 양 강조) · 주식형(고가-저가-종가) · 거품형(X·Y·거품 크기 세 값)',
    draw: function () {
      var s = '', P = [[14, 14], [246, 14], [14, 138], [246, 138]];
      var K = [['bar', '가로 막대형', '긴 항목 이름\n비교'], ['area', '영역형', '변화의 양\n강조'], ['stock', '주식형', '고가 · 저가\n· 종가 순서'], ['bubble', '거품형', 'X · Y ·\n거품 크기']];
      K.forEach(function (k, i) {
        var x = P[i][0], y = P[i][1];
        s += mini(x, y + 26, 100, 90, k[0]) + t(x, y + 12, k[1], { size: 15, b: 1, c: C.blue }) + t(x + 110, y + 70, k[2], { size: 13, b: 1 });
      });
      return F.svg(480, 262, s);
    } };

  R.overlap = { topics: ['excel/analysis'], cards: ['계열 겹치기 / 간격 너비'],
    cap: '[데이터 계열 서식] — 계열 겹치기(-100%~100%)는 양수면 막대가 겹치고 음수면 벌어진다. 간격 너비(0~500%)는 항목 사이 간격',
    draw: function () {
      var s = '', X = [14, 170, 326], W = 140, nm = ['겹치기 0%', '겹치기 +50%', '겹치기 −50%'], off = [0, -12, 12];
      nm.forEach(function (n, i) {
        s += t(X[i] + W / 2, 22, n, { a: 'm', size: 14, b: 1, c: [C.sub, C.blue, C.orange][i] });
        s += line(X[i] + 10, 150, X[i] + W - 10, 150, { c: C.sub, w: 1.2 });
        [0, 1].forEach(function (g) {
          var gx = X[i] + 24 + g * 60;
          s += box(gx, 150 - 90, 24, 90, { fill: C.blueL, c: C.blue, w: 1.2, r: 1 });
          s += box(gx + 24 + off[i], 150 - 70, 24, 70, { fill: C.orangeL, c: C.orange, w: 1.2, r: 1, op: 0.8 });
        });
      });
      s += F.dim(X[0] + 72, 164, X[0] + 84, 164, '', {});
      s += callout(X[0] + 78, 168, X[0] + 78, 196, '간격 너비 = 항목 사이', { a: 'm', size: 12, b: 1, c: C.green, tc: C.green });
      s += divider(163, 14, 180) + divider(319, 14, 180);
      s += t(360, 212, '양수 → 겹침 · 음수 → 벌어짐', { a: 'm', size: 13, b: 1 });
      return F.svg(480, 228, s);
    } };

  /* ════════════ 2과목 ⑦ 출력과 매크로 ════════════ */
  function page(x, y, w, h, o) {
    o = o || {};
    return box(x, y, w, h, { fill: o.fill || '#fff', c: o.c || C.ink, w: o.w || 1.6, r: 2 }) + (o.lines ? (function () { var l = ''; for (var i = 0; i < o.lines; i++) l += line(x + 10, y + 16 + i * 12, x + w - 10, y + 16 + i * 12, { c: C.grayM, w: 1.4 }); return l; })() : '');
  }
  R.pagesetup = { topics: ['excel/print'], cards: ['페이지 설정 - 페이지'],
    cap: '[페이지] 탭 — 용지 방향(세로/가로), 확대·축소 배율(10~400%), 자동 맞춤(용지 너비·높이에 맞추기), 용지 크기',
    draw: function () {
      var s = t(90, 22, '용지 방향', { a: 'm', size: 15, b: 1, c: C.blue });
      s += page(30, 40, 56, 76, { lines: 4 }) + t(58, 132, '세로', { a: 'm', size: 13 });
      s += page(100, 56, 76, 56, { lines: 3 }) + t(138, 132, '가로', { a: 'm', size: 13 });
      s += t(340, 22, '자동 맞춤', { a: 'm', size: 15, b: 1, c: C.green });
      s += box(230, 40, 150, 50, { fill: C.greenL, c: C.green, w: 1.2, r: 0 }) + t(305, 65, '넓은 표', { a: 'm', size: 13, halo: false });
      s += arrow(384, 65, 404, 65, { c: C.green, w: 1.6, head: 8 }) + page(408, 40, 52, 70) + box(412, 52, 44, 16, { fill: C.greenL, c: C.green, w: 1, r: 0 });
      s += t(340, 132, '용지 너비 1 · 높이 1 에 맞춤', { a: 'm', size: 12, c: C.sub });
      s += hdiv(150);
      s += t(20, 176, '확대·축소 배율', { size: 15, b: 1, c: C.orange });
      s += box(150, 164, 300, 24, { fill: C.grayL, c: C.grayM, w: 1, r: 12 }) + box(150, 164, 60, 24, { fill: C.orangeL, c: C.orange, w: 1.2, r: 12 });
      s += t(150, 204, '10%', { size: 13, b: 1 }) + t(450, 204, '400%', { a: 'e', size: 13, b: 1 });
      return F.svg(480, 222, s);
    } };

  R.margins = { topics: ['excel/print'], cards: ['페이지 설정 - 여백', '머리글/바닥글'], slide: ['excel/print#0'],
    cap: '여백과 머리글·바닥글 — 머리글·바닥글은 모든 페이지 위·아래에 반복 인쇄된다. [여백] 탭에서 페이지 가운데 맞춤',
    draw: function () {
      var s = page(120, 14, 200, 240, { fill: '#fff' });
      s += box(146, 54, 148, 160, { fill: 'none', c: C.blue, w: 1.2, r: 0, dash: '5 4' });
      s += box(146, 22, 148, 22, { fill: C.orangeL, c: C.orange, w: 1, r: 2, label: '머리글', size: 12 }) + box(146, 224, 148, 22, { fill: C.orangeL, c: C.orange, w: 1, r: 2, label: '바닥글 · 1 쪽', size: 12 });
      s += box(170, 104, 100, 60, { fill: C.greenL, c: C.green, w: 1.2, r: 0, label: '표', size: 14 });
      s += F.dim(146, 190, 170, 190, '', {}) + F.dim(270, 190, 294, 190, '', {});
      s += callout(146, 90, 70, 90, '여백', { size: 14, b: 1, c: C.blue, tc: C.blue });
      s += callout(270, 134, 340, 134, '페이지 가운데 맞춤', { size: 13, b: 1, c: C.green, tc: C.green });
      s += t(340, 154, '(가로 · 세로)', { size: 12, c: C.sub });
      s += callout(294, 33, 340, 40, '페이지 번호 · 날짜', { size: 13, c: C.orange, tc: C.orange });
      s += t(340, 60, '파일 이름 · 시트 이름', { size: 13, c: C.orange });
      s += t(340, 236, '모든 페이지에 반복', { size: 12, c: C.sub });
      return F.svg(480, 266, s);
    } };

  R.printarea = { topics: ['excel/print'], cards: ['인쇄 영역'],
    cap: '인쇄 영역 — 워크시트에서 인쇄할 범위만 지정하면 그 부분만 인쇄된다',
    draw: function () {
      var rows = []; for (var r = 0; r < 6; r++) rows.push(['', '', '', '', '']);
      var f = {}; for (var r2 = 1; r2 < 4; r2++) for (var c = 1; c < 4; c++) f[r2 + ',' + c] = C.blueL;
      var o = { cols: ['A', 'B', 'C', 'D', 'E'], cw: [40, 40, 40, 40, 40], rh: 26, rows: rows, fill: f };
      var s = sheet(20, 24, o);
      s += box(86, 76, 120, 78, { fill: 'none', c: C.blue, w: 2.2, r: 0, dash: '6 4' });
      s += t(146, 200, '인쇄 영역 지정', { a: 'm', size: 13, b: 1, c: C.blue });
      s += arrow(260, 110, 310, 110, { c: C.blue, w: 2 });
      s += page(330, 30, 120, 160) + box(350, 50, 80, 52, { fill: C.blueL, c: C.blue, w: 1.2, r: 0 });
      s += t(390, 210, '그 부분만 인쇄', { a: 'm', size: 13, b: 1 });
      return F.svg(480, 228, s);
    } };

  R.repeat = { topics: ['excel/print'], cards: ['반복할 행 / 반복할 열'], slide: ['excel/print#5'],
    cap: '반복할 행 — 여러 페이지로 인쇄될 때 제목 행을 페이지마다 다시 찍는다. [페이지 설정]-[시트] 탭(틀 고정과는 상관없음)',
    draw: function () {
      var s = '';
      [0, 1].forEach(function (p) {
        var x = 40 + p * 220;
        s += page(x, 20, 170, 170) + t(x + 85, 206, (p + 1) + '쪽', { a: 'm', size: 13, b: 1 });
        s += box(x + 12, 34, 146, 22, { fill: C.orangeL, c: C.orange, w: 1.4, r: 0 }) + t(x + 20, 45, '설비  라인  생산량', { size: 12, b: 1, halo: false });
        for (var i = 0; i < 6; i++) s += line(x + 18, 72 + i * 18, x + 150, 72 + i * 18, { c: C.grayM, w: 1.4 });
      });
      s += arrow(212, 45, 256, 45, { c: C.orange, w: 1.6, head: 8, dash: '5 4' }) + t(234, 30, '다시', { a: 'm', size: 12, b: 1, c: C.orange });
      s += box(100, 222, 280, 28, { fill: C.yellowL, c: C.grayM, w: 1, r: 6, label: '반복할 행:  $1:$1', size: 14 });
      return F.svg(480, 262, s);
    } };

  R.pagebreak = { topics: ['excel/print'], cards: ['페이지 나누기 미리 보기'],
    cap: '페이지 나누기 미리 보기 — 인쇄될 페이지의 경계를 파란 선으로 보여 주고, 선을 끌어 나누는 위치를 바꾼다',
    draw: function () {
      var s = box(20, 20, 440, 190, { fill: '#fff', c: C.grayM, w: 1, r: 0 });
      for (var i = 1; i < 8; i++) s += line(20 + i * 55, 20, 20 + i * 55, 210, { c: C.edge, w: 1 });
      for (var j = 1; j < 8; j++) s += line(20, 20 + j * 24, 460, 20 + j * 24, { c: C.edge, w: 1 });
      s += t(130, 115, '1 페이지', { a: 'm', size: 22, b: 1, c: '#cbd5e1' }) + t(350, 115, '2 페이지', { a: 'm', size: 22, b: 1, c: '#cbd5e1' });
      s += line(240, 20, 240, 210, { c: C.blue, w: 3, dash: '8 5' }) + box(20, 20, 440, 190, { fill: 'none', c: C.blue, w: 3, r: 0 });
      s += arrow(246, 160, 290, 160, { c: C.blue, w: 2, head: 9 }) + t(300, 160, '끌어서 옮긴다', { size: 13, b: 1, c: C.blue });
      s += t(240, 230, '파란 선 = 페이지 경계', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 246, s);
    } };

  R.freeze = { topics: ['excel/print'], cards: ['틀 고정', '창 나누기'], slide: ['excel/print#1'], hide: ['인쇄에는 영향 없음'],
    cap: '틀 고정은 스크롤해도 특정 행·열이 계속 보이게 한다(인쇄엔 영향 없음). 창 나누기는 최대 4개 영역으로 나누고 선을 옮길 수 있다',
    draw: function () {
      var s = t(120, 22, '틀 고정', { a: 'm', size: 16, b: 1, c: C.blue }) + t(360, 22, '창 나누기', { a: 'm', size: 16, b: 1, c: C.green }) + divider(240, 12, 222);
      var rows = [['설비', '1월', '2월'], ['8호기', 510, 490], ['9호기', 505, 530], ['10호기', 470, 480]];
      var o = { cols: ['A', 'D', 'E'], cw: [60, 50, 50], rh: 28, rows: rows, fill: { '0,0': C.blueL, '0,1': C.blueL, '0,2': C.blueL, '1,0': C.blueL, '2,0': C.blueL, '3,0': C.blueL }, bold: { '0,0': 1, '0,1': 1, '0,2': 1 } };
      s += sheet(24, 40, o);
      s += line(24, 96, 210, 96, { c: C.blue, w: 3 }) + line(110, 40, 110, 180, { c: C.blue, w: 3 });
      s += arrow(218, 110, 218, 170, { c: C.sub, w: 1.4, head: 8 }) + t(222, 100, '', {});
      s += t(120, 200, '스크롤해도 제목은 고정', { a: 'm', size: 13, b: 1 }) + t(120, 218, '인쇄에는 영향 없음', { a: 'm', size: 12, c: C.sub });
      s += box(270, 40, 180, 140, { fill: '#fff', c: C.ink, w: 1.4, r: 0 });
      s += box(270, 40, 90, 60, { fill: C.greenL, c: 'none', w: 0, r: 0 }) + box(360, 100, 90, 80, { fill: C.orangeL, c: 'none', w: 0, r: 0 });
      s += line(360, 40, 360, 180, { c: C.green, w: 4 }) + line(270, 100, 450, 100, { c: C.green, w: 4 });
      s += arrow(364, 70, 392, 70, { c: C.green, w: 1.4, head: 7, both: true });
      s += t(360, 200, '최대 4개 영역', { a: 'm', size: 13, b: 1 }) + t(360, 218, '나눈 선은 끌어서 이동', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 232, s);
    } };

  R.macro = { topics: ['excel/print'], cards: ['매크로'],
    cap: '매크로 — 반복하는 작업을 기록해 두었다가 한 번에 실행한다. 기록된 내용은 VBA 코드로 저장된다',
    draw: function () {
      var s = t(80, 22, '① 기록', { a: 'm', size: 15, b: 1, c: C.red }) + t(240, 22, '② VBA 코드로 저장', { a: 'm', size: 15, b: 1, c: C.blue }) + t(400, 22, '③ 한 번에 실행', { a: 'm', size: 15, b: 1, c: C.green });
      s += circle(40, 60, 9, { fill: C.red, c: C.red, w: 1 });
      ['제목 굵게', '테두리', '생산량 정렬'].forEach(function (x, i) { s += box(56, 44 + i * 30, 96, 26, { fill: '#fff', c: C.grayM, w: 1, r: 4, label: x, size: 12 }); });
      s += arrow(156, 88, 176, 88, { w: 1.6, head: 8 });
      s += box(180, 40, 128, 100, { fill: '#1f2937', c: C.ink, w: 1.2, r: 4 });
      ['Sub 일보정리()', '  …굵게…', '  …테두리…', '  …정렬…', 'End Sub'].forEach(function (x, i) { s += t(188, 56 + i * 18, x, { size: 12, c: i === 0 || i === 4 ? '#93c5fd' : '#e5e7eb', halo: false }); });
      s += arrow(312, 88, 332, 88, { w: 1.6, head: 8 });
      s += combo(400, 74, ['Ctrl', 'q'], { a: 'm', fill: C.greenL });
      s += t(400, 124, '반복 작업 끝!', { a: 'm', size: 13, b: 1, c: C.green });
      s += t(240, 172, '매크로가 든 파일은 .xlsm 으로 저장', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 190, s);
    } };

  R.macroname = { topics: ['excel/print'], cards: ['매크로 이름 규칙', '매크로 바로 가기 키'], slide: ['excel/print#6'],
    cap: '매크로 이름 — 첫 글자는 문자, 공백·특수문자는 안 된다. 바로 가기 키는 Ctrl+소문자(Ctrl+Shift+대문자), 기본 단축키보다 매크로가 우선',
    draw: function () {
      var s = win(14, 14, 220, 120, '매크로 기록', { btn: false });
      s += t(26, 52, '매크로 이름', { size: 12, halo: false }) + box(26, 62, 196, 24, { fill: '#fff', c: C.blue, w: 1.4, r: 3 }) + t(34, 74, '일보정리', { size: 14, halo: false });
      s += t(26, 104, '바로 가기 키  Ctrl +', { size: 12, halo: false }) + box(150, 92, 30, 24, { fill: '#fff', c: C.orange, w: 1.6, r: 3, label: 'q', size: 14 });
      s += box(250, 14, 216, 56, { fill: C.greenL, c: C.green, w: 1.2, r: 8 }) + t(262, 32, '○ 되는 이름', { size: 13, b: 1, c: C.green, halo: false }) + t(262, 54, '일보정리 · 표_서식 · Macro1', { size: 13, halo: false });
      s += box(250, 78, 216, 76, { fill: C.redL, c: C.red, w: 1.2, r: 8 }) + t(262, 96, '✕ 안 되는 이름', { size: 13, b: 1, c: C.red, halo: false });
      s += t(262, 118, '1월정리 (숫자로 시작)', { size: 13, halo: false }) + t(262, 138, '일보 정리 (공백) · 정리/완료', { size: 13, halo: false });
      s += hdiv(170);
      s += t(20, 196, '소문자 q → Ctrl + q', { size: 14, b: 1 }) + t(20, 220, '대문자 Q → Ctrl + Shift + Q', { size: 14, b: 1 });
      s += box(270, 184, 196, 48, { fill: C.yellowL, c: C.orange, w: 1.2, r: 8 }) + t(368, 200, 'Ctrl+C 를 주면', { a: 'm', size: 13, halo: false }) + t(368, 220, '복사 대신 매크로 실행!', { a: 'm', size: 13, b: 1, c: C.red, halo: false });
      return F.svg(480, 246, s);
    } };

  R.protect = { topics: ['excel/print'], cards: ['시트 보호', '통합 문서 보호'],
    cap: '시트 보호는 셀 내용을 못 바꾸게 막고(잠금 해제한 셀은 수정 가능), 통합 문서 보호는 시트 추가·삭제·이름 바꾸기 같은 구조를 막는다',
    draw: function () {
      var s = t(120, 22, '시트 보호', { a: 'm', size: 16, b: 1, c: C.blue }) + t(360, 22, '통합 문서 보호', { a: 'm', size: 16, b: 1, c: C.orange }) + divider(240, 12, 222);
      var f = {}; for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) f[r + ',' + c] = (c === 2 && r > 0) ? '#fff' : C.grayL;
      var o = { cols: ['A', 'B', 'C'], cw: [56, 56, 60], rh: 28, rows: [['설비', '기준', '실측'], ['1호기', 520, ''], ['2호기', 480, ''], ['3호기', 530, '']], fill: f, bold: { '0,0': 1, '0,1': 1, '0,2': 1 } };
      s += sheet(24, 40, o);
      s += box(162, 96, 60, 84, { fill: 'none', c: C.green, w: 2.4, r: 0 });
      s += t(120, 200, '잠긴 셀 ✕ · 잠금 해제한 셀 ○', { a: 'm', size: 12, b: 1 }) + t(120, 218, '암호는 선택 사항', { a: 'm', size: 12, c: C.sub });
      var tabs = ['1월', '2월', '3월'];
      tabs.forEach(function (tb, i) { s += box(270 + i * 56, 60, 52, 26, { fill: '#fff', c: C.orange, w: 1.4, r: 3, label: tb, size: 13 }); });
      s += lock(440, 56, C.orange);
      ['시트 추가·삭제 ✕', '이름 바꾸기·숨기기 ✕', '셀 내용 수정은 ○'].forEach(function (x, i) { s += t(270, 112 + i * 26, x, { size: 13, b: i === 2, c: i === 2 ? C.green : C.red }); });
      s += t(360, 208, '구조를 지킨다', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 232, s);
    } };

  R.pageorder = { topics: ['excel/print'], cards: ['페이지 순서'],
    cap: '페이지 순서 — 여러 페이지로 나뉜 시트를 아래쪽 먼저(세로로 먼저) 찍을지, 오른쪽 먼저(가로로 먼저) 찍을지 고른다. [시트] 탭',
    draw: function () {
      var s = t(120, 22, '아래쪽 먼저', { a: 'm', size: 16, b: 1, c: C.blue }) + t(360, 22, '오른쪽 먼저', { a: 'm', size: 16, b: 1, c: C.orange }) + divider(240, 12, 212);
      function grid(x, order, c) {
        var o = '', P = [[x, 40], [x + 90, 40], [x, 124], [x + 90, 124]];
        P.forEach(function (p, i) { o += page(p[0], p[1], 76, 72) + t(p[0] + 38, p[1] + 36, String(order[i]), { a: 'm', size: 22, b: 1, c: c }); });
        return o;
      }
      s += grid(38, [1, 3, 2, 4], C.blue) + F.route([[76, 116], [76, 124]], { c: C.blue, w: 2, head: 7 }) + F.route([[118, 150], [140, 150], [140, 90], [160, 90]], { c: C.blue, w: 1.6, head: 8, dash: '5 4' });
      s += grid(278, [1, 2, 3, 4], C.orange) + arrow(356, 76, 366, 76, { c: C.orange, w: 2, head: 7 }) + F.route([[400, 116], [400, 120], [320, 120], [320, 124]], { c: C.orange, w: 1.6, head: 8, dash: '5 4' });
      s += t(240, 228, '[페이지 설정] - [시트] 탭 · 인쇄 영역·반복할 행·눈금선도 같은 탭', { a: 'm', size: 12, c: C.sub });
      return F.svg(480, 244, s);
    } };

  return R;
})();
