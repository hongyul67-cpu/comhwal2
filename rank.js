/* 컴활 2급 · 공용 계급(티어) · 랭크 포인트 모듈
 *
 * 개념게임(comhwal2)과 실기 연습소(comhwal2-excel)가 **같은 오리진**이라
 * localStorage 한 곳(comhwal2_progress_v1)을 공유한다.
 * → 어느 앱에서 풀든 계급이 같이 오른다.
 *
 * 붙이는 법
 *   <script src="rank.js"></script>            (comhwal2)
 *   <script src="../comhwal2/rank.js"></script> (comhwal2-excel)
 *
 * 쓰는 법
 *   CH2Rank.attach(PROG, save)   호스트가 진행상황 객체를 들고 있으면 연결(선택)
 *   CH2Rank.award(정답, 오답, 배수, 보너스) → {delta, up, down, t0, t1, after}
 *   CH2Rank.bannerHtml(res)      결과 화면에 붙일 RP·승급 배너
 *   CH2Rank.registerBtnHtml()    '랭킹 등록' 버튼
 *   CH2Rank.renderCard('rankCard')  홈에 큰 랭크 카드
 *   CH2Rank.renderMini('rankMini')  헤더에 작은 뱃지
 *   CH2Rank.openBoard()          랭킹판 열기
 *
 * RP 규칙: 정답 +3 / 오답 -1 · 배수(모의고사·실전 2배) · 합격 보너스 별도 · 0 미만 없음
 */
(function () {
  'use strict';
  var KEY = 'comhwal2_progress_v1';

  var TIERS = [
    { nm: '아이언', ico: '🖤', col: '#8d94a8', min: 0 },
    { nm: '브론즈', ico: '🥉', col: '#c98a52', min: 400 },
    { nm: '실버', ico: '🥈', col: '#c3ccdf', min: 800 },
    { nm: '골드', ico: '🥇', col: '#ffc93c', min: 1200 },
    { nm: '플래티넘', ico: '💎', col: '#3ee0c0', min: 1600 },
    { nm: '다이아', ico: '💠', col: '#6fa8ff', min: 2000 },
    { nm: '마스터', ico: '👑', col: '#c77dff', min: 2400 },
  ];
  var ROMAN = ['Ⅳ', 'Ⅲ', 'Ⅱ', 'Ⅰ'];
  var link = null;          // 호스트 앱의 진행상황 객체(있으면 랭크 필드를 동기화)
  var hostSave = null;

  /* ---------- 저장소 ---------- */
  function readRaw() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function ensure(p) {
    p.rp = p.rp || 0;
    p.rpBest = p.rpBest || 0;
    p.board = p.board || [];
    p.name = p.name || '';
    return p;
  }
  // 항상 저장소에서 새로 읽어 랭크 필드만 고치고 되쓴다 → 다른 앱의 진행상황을 덮어쓰지 않음
  function mutate(fn) {
    var p = ensure(readRaw());
    fn(p);
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
    if (link) { link.rp = p.rp; link.rpBest = p.rpBest; link.board = p.board; link.name = p.name; }
    return p;
  }
  function cur() { return ensure(readRaw()); }

  /* ---------- 계급 계산 ---------- */
  function tierOf(rp) {
    rp = Math.max(0, rp | 0);
    var ti = 0;
    for (var i = TIERS.length - 1; i >= 0; i--) { if (rp >= TIERS[i].min) { ti = i; break; } }
    var t = TIERS[ti], isMax = (ti === TIERS.length - 1);
    if (isMax) {
      return { tier: ti, ico: t.ico, col: t.col, div: 0, name: t.nm, cur: rp - t.min, need: 0, pct: 100, isMax: true };
    }
    var into = rp - t.min;
    var div = Math.min(3, Math.floor(into / 100));
    return { tier: ti, ico: t.ico, col: t.col, div: div, name: t.nm + ' ' + ROMAN[div],
             cur: into - div * 100, need: 100, pct: into - div * 100, isMax: false };
  }
  function rankIndex(rp) { var t = tierOf(rp); return t.isMax ? 999 : t.tier * 4 + t.div; }

  /* ---------- RP 지급 ---------- */
  function award(correct, wrong, mult, bonus) {
    mult = mult || 1;
    var delta = Math.round((correct || 0) * 3 * mult - (wrong || 0) * 1 * mult + (bonus || 0));
    var before = cur().rp, after = Math.max(0, before + delta);
    mutate(function (p) { p.rp = after; if (after > p.rpBest) p.rpBest = after; });
    refreshAll();
    return { delta: after - before, before: before, after: after,
             up: rankIndex(after) > rankIndex(before), down: rankIndex(after) < rankIndex(before),
             t0: tierOf(before), t1: tierOf(after) };
  }

  /* ---------- HTML 조각 ---------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function bannerHtml(r) {
    if (!r) return '';
    var sign = r.delta > 0 ? '+' : '';
    var col = r.delta > 0 ? 'var(--ok)' : (r.delta < 0 ? 'var(--no)' : 'var(--tx2)');
    var h = '<div class="rpline">랭크 포인트 <b style="color:' + col + '">' + sign + r.delta + ' RP</b>' +
      ' <span style="color:var(--tx2)">→ ' + r.after + ' RP</span></div>';
    if (r.up) {
      h += '<div class="rpbanner up">🎊 승급! <b>' + r.t0.name + '</b> → <b style="color:' + r.t1.col + '">' +
        r.t1.ico + ' ' + r.t1.name + '</b></div>';
    } else if (r.down) {
      h += '<div class="rpbanner down">⬇️ 강등 <b>' + r.t0.name + '</b> → <b>' + r.t1.ico + ' ' + r.t1.name +
        '</b> · 다시 올라가요!</div>';
    }
    return h;
  }
  function registerBtnHtml() {
    return '<div class="row" style="justify-content:center;margin-top:8px">' +
      '<button class="btn sec" onclick="CH2Rank.register()">🏆 랭킹 등록</button></div>';
  }
  function cardHtml() {
    var p = cur(), t = tierOf(p.rp);
    var label = t.isMax ? '최고 계급이에요! 👑'
      : (t.div === 3
          ? ('다음 계급 ' + TIERS[t.tier + 1].ico + ' ' + TIERS[t.tier + 1].nm + '까지 ' + (100 - t.cur) + ' RP')
          : ('다음 단계 ' + TIERS[t.tier].nm + ' ' + ROMAN[t.div + 1] + '까지 ' + (100 - t.cur) + ' RP'));
    return '<div class="rankcard" style="border-color:' + t.col + '55">' +
        '<div class="rkico" style="background:' + t.col + '22;border-color:' + t.col + '">' + t.ico + '</div>' +
        '<div class="rkmain">' +
          '<div class="rknm" style="color:' + t.col + '">' + t.name + '</div>' +
          '<div class="rkbar"><i style="width:' + (t.isMax ? 100 : t.pct) + '%;background:' + t.col + '"></i></div>' +
          '<div class="rkds">' + label + '</div>' +
        '</div>' +
        '<div class="rkright">' +
          '<div class="rkrp">' + p.rp + '<span>RP</span></div>' +
          '<button class="btn sec rkbtn" onclick="CH2Rank.openBoard()">🏆 랭킹판</button>' +
        '</div>' +
      '</div>';
  }
  function miniHtml() {
    var p = cur(), t = tierOf(p.rp);
    return '<div class="rmico">' + t.ico + '</div><div>' +
      '<div class="rmnm" style="color:' + t.col + '">' + t.name + '</div>' +
      '<div class="rmrp"><b>' + p.rp + '</b> RP</div></div>';
  }

  /* ---------- 렌더 ---------- */
  var cardIds = [], miniIds = [];
  function renderCard(id) {
    var el = document.getElementById(id); if (!el) return;
    if (cardIds.indexOf(id) < 0) cardIds.push(id);
    el.innerHTML = cardHtml();
  }
  function renderMini(id) {
    var el = document.getElementById(id); if (!el) return;
    if (miniIds.indexOf(id) < 0) miniIds.push(id);
    el.className = 'rankmini';
    el.title = '랭킹판 보기';
    el.onclick = openBoard;
    el.innerHTML = miniHtml();
  }
  function refreshAll() {
    cardIds.forEach(function (id) { var e = document.getElementById(id); if (e) e.innerHTML = cardHtml(); });
    miniIds.forEach(function (id) { var e = document.getElementById(id); if (e) e.innerHTML = miniHtml(); });
  }

  /* ---------- 랭킹판 ---------- */
  function sorted() { return cur().board.slice().sort(function (a, b) { return b.rp - a.rp; }); }
  function boardDom() {
    var d = document.getElementById('ch2board');
    if (d) return d;
    d = document.createElement('div');
    d.id = 'ch2board';
    d.className = 'hidden';
    d.innerHTML =
      '<div class="bdpanel">' +
        '<div class="bdtop"><div style="font-weight:900;font-size:18px">🏆 랭킹판</div><div style="flex:1"></div>' +
          '<button class="btn ghost" style="padding:8px 12px" onclick="CH2Rank.clearBoard()">기록 지우기</button>' +
          '<button class="btn sec" style="padding:8px 14px" onclick="CH2Rank.closeBoard()">닫기</button></div>' +
        '<div class="bdnote">이 컴퓨터에 저장돼요 · 같은 이름은 최고 RP만 남습니다 · 개념게임과 실기 점수가 함께 쌓여요</div>' +
        '<div id="ch2boardBody"></div>' +
      '</div>';
    d.addEventListener('click', function (e) { if (e.target === d) closeBoard(); });
    document.body.appendChild(d);
    return d;
  }
  function openBoard() {
    var d = boardDom(), list = sorted();
    var rows = list.length
      ? list.map(function (e, i) {
          var t = tierOf(e.rp);
          var medal = ['🥇', '🥈', '🥉'][i] || (i + 1);
          return '<div class="bdrow' + (i < 3 ? ' top' : '') + '">' +
            '<div class="bdno">' + medal + '</div>' +
            '<div class="bdnm">' + esc(e.name) + '</div>' +
            '<div class="bdtier" style="color:' + t.col + '">' + t.ico + ' ' + t.name + '</div>' +
            '<div class="bdrp">' + e.rp + ' RP</div>' +
            '<div class="bddt">' + (e.date || '') + '</div></div>';
        }).join('')
      : '<div class="bdempty">아직 등록된 기록이 없어요.<br>모드를 끝내고 <b>랭킹 등록</b>을 눌러 보세요!</div>';
    document.getElementById('ch2boardBody').innerHTML =
      '<div class="bdhead"><div class="bdno">순위</div><div class="bdnm">이름</div>' +
        '<div class="bdtier">계급</div><div class="bdrp">RP</div><div class="bddt">날짜</div></div>' + rows;
    d.classList.remove('hidden');
  }
  function closeBoard() { var d = document.getElementById('ch2board'); if (d) d.classList.add('hidden'); }
  function clearBoard() {
    if (!confirm('랭킹판 기록을 모두 지울까요?')) return;
    mutate(function (p) { p.board = []; });
    openBoard();
  }
  function register() {
    var p = cur();
    var nm = prompt('랭킹판에 올릴 이름을 적어 주세요 (예: 3반 홍길동)', p.name || '');
    if (nm === null) return;
    nm = String(nm).trim().slice(0, 20);
    if (!nm) { alert('이름을 입력해 주세요.'); return; }
    var d = new Date(), date = (d.getMonth() + 1) + '/' + d.getDate();
    mutate(function (q) {
      var prev = q.board.filter(function (e) { return e.name === nm; })[0];
      var rp = Math.max(q.rp, prev ? prev.rp : 0);
      q.board = q.board.filter(function (e) { return e.name !== nm; });
      q.board.push({ name: nm, rp: rp, date: date });
      q.board.sort(function (a, b) { return b.rp - a.rp; });
      q.board = q.board.slice(0, 20);
      q.name = nm;
    });
    var pos = sorted().findIndex(function (e) { return e.name === nm; }) + 1;
    toast('🏆 ' + pos + '위 등록!');
    openBoard();
  }

  /* ---------- 토스트(호스트에 없어도 되게 자체 제공) ---------- */
  function toast(msg) {
    var t = document.getElementById('ch2toast');
    if (!t) { t = document.createElement('div'); t.id = 'ch2toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
  }

  /* ---------- 스타일 ---------- */
  function injectCss() {
    if (document.getElementById('ch2rank-css')) return;
    var s = document.createElement('style');
    s.id = 'ch2rank-css';
    s.textContent = [
      '.rankmini{display:flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--line);',
      ' border-radius:12px;padding:6px 12px 6px 8px;cursor:pointer;transition:.12s}',
      '.rankmini:hover{border-color:var(--pri);transform:translateY(-1px)}',
      '.rankmini .rmico{font-size:22px;line-height:1}',
      '.rankmini .rmnm{font-size:13px;font-weight:900;line-height:1.2}',
      '.rankmini .rmrp{font-size:11px;color:var(--tx2)} .rankmini .rmrp b{color:var(--gold)}',
      '.rankcard{display:flex;align-items:center;gap:14px;background:var(--card);border:2px solid var(--line);',
      ' border-radius:16px;padding:14px 16px;margin-bottom:14px;box-shadow:var(--sh)}',
      '.rankcard .rkico{font-size:34px;width:60px;height:60px;flex:none;border:2px solid var(--line);',
      ' border-radius:16px;display:flex;align-items:center;justify-content:center}',
      '.rankcard .rkmain{flex:1;min-width:0}',
      '.rankcard .rknm{font-size:19px;font-weight:900;letter-spacing:-.5px}',
      '.rankcard .rkbar{height:9px;background:var(--card2);border-radius:6px;overflow:hidden;margin:7px 0 5px}',
      '.rankcard .rkbar>i{display:block;height:100%;border-radius:6px;transition:width .5s}',
      '.rankcard .rkds{font-size:12px;color:var(--tx2)}',
      '.rankcard .rkright{text-align:right;flex:none}',
      '.rankcard .rkrp{font-size:22px;font-weight:900;color:var(--gold);line-height:1}',
      '.rankcard .rkrp span{font-size:11px;color:var(--tx2);margin-left:3px}',
      '.rankcard .rkbtn{padding:7px 12px;font-size:12px;margin-top:8px}',
      '@media(max-width:480px){.rankcard{gap:10px;padding:12px}',
      ' .rankcard .rkico{width:48px;height:48px;font-size:26px}',
      ' .rankcard .rknm{font-size:16px} .rankcard .rkrp{font-size:18px}}',
      '.rpline{font-size:15px;font-weight:800;margin-top:12px}',
      '.rpbanner{margin-top:8px;border-radius:12px;padding:11px 14px;font-size:14px;font-weight:800}',
      '.rpbanner.up{background:linear-gradient(135deg,rgba(255,210,63,.22),rgba(39,192,147,.18));',
      ' border:1px solid var(--gold);color:var(--gold)}',
      '.rpbanner.down{background:rgba(255,90,106,.14);border:1px solid var(--no);color:var(--no)}',
      '#ch2board{position:fixed;inset:0;z-index:210;background:rgba(0,0,0,.62);display:flex;',
      ' align-items:center;justify-content:center;padding:16px}',
      '#ch2board.hidden{display:none!important}',
      '.bdpanel{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px;',
      ' width:100%;max-width:720px;max-height:86vh;overflow:auto;box-shadow:var(--sh)}',
      '.bdtop{display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap}',
      '.bdnote{font-size:12px;color:var(--tx2);margin-bottom:12px;line-height:1.6}',
      '.bdhead,.bdrow{display:grid;grid-template-columns:52px 1fr 110px 78px 52px;gap:8px;align-items:center;',
      ' padding:10px;border-radius:10px;font-size:13.5px}',
      '.bdhead{color:var(--tx2);font-size:12px;font-weight:700;border-bottom:1px solid var(--line);border-radius:0}',
      '.bdrow{background:var(--card2);margin-top:7px}',
      '.bdrow.top{background:linear-gradient(135deg,rgba(255,210,63,.14),transparent);border:1px solid var(--gold)}',
      '.bdno{font-weight:900;text-align:center;font-size:15px}',
      '.bdnm{font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.bdtier{font-weight:800;font-size:12.5px}',
      '.bdrp{color:var(--gold);font-weight:900;text-align:right}',
      '.bddt{color:var(--tx2);font-size:11.5px;text-align:right}',
      '.bdempty{text-align:center;color:var(--tx2);padding:32px 10px;line-height:1.8}',
      '@media(max-width:520px){.bdhead,.bdrow{grid-template-columns:40px 1fr 74px 62px;font-size:12.5px;padding:9px 8px}',
      ' .bddt{display:none} .bdtier{font-size:11px}}',
      '#ch2toast{position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:300;font-size:26px;',
      ' font-weight:900;color:var(--gold);pointer-events:none;opacity:0;text-shadow:0 4px 12px rgba(0,0,0,.5)}',
      '#ch2toast.show{animation:ch2pop .9s ease-out}',
      '@keyframes ch2pop{0%{opacity:0;transform:translateX(-50%) scale(.6)}',
      ' 30%{opacity:1;transform:translateX(-50%) scale(1.12)}100%{opacity:0;transform:translateX(-50%) translateY(-26px)}}',
    ].join('\n');
    document.head.appendChild(s);
  }
  if (document.head) injectCss();
  else document.addEventListener('DOMContentLoaded', injectCss);

  /* ---------- 공개 API ---------- */
  window.CH2Rank = {
    TIERS: TIERS,
    attach: function (prog, save) { link = ensure(prog || {}); hostSave = save || null; },
    rp: function () { return cur().rp; },
    prog: cur,
    tierOf: tierOf,
    award: award,
    bannerHtml: bannerHtml,
    registerBtnHtml: registerBtnHtml,
    cardHtml: cardHtml,
    renderCard: renderCard,
    renderMini: renderMini,
    refresh: refreshAll,
    openBoard: openBoard,
    closeBoard: closeBoard,
    clearBoard: clearBoard,
    register: register,
  };
})();
