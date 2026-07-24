/* 컴활 2급 필기 개념게임 - 엔진 */
'use strict';

const DATA = window.COMHWAL2_DATA || {};
const SUBJECT_ORDER = ['comp', 'excel'];
const STORE_KEY = 'comhwal2_progress_v1';

let state = {
  subject: 'comp',
  unit: null,      // unit object
  mode: null,
  // 게임 진행
  queue: [],
  idx: 0,
  score: 0,
  combo: 0,
  correct: 0,
  wrong: 0,
  answered: false,
};

/* ---------- 저장/진행 ---------- */
function loadProg() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveProg(p) { localStorage.setItem(STORE_KEY, JSON.stringify(p)); }
let PROG = loadProg();
// 구조: PROG = { totXp, totStar, units:{ 'comp/sys':{best, stars, xp} } }
PROG.units = PROG.units || {};
PROG.totXp = PROG.totXp || 0;
PROG.totStar = PROG.totStar || 0;
PROG.wrong = PROG.wrong || {};   // 누적 오답: key → {subj, unitId, kind:'quiz'|'ox', q}

/* ---------- 누적 오답 ---------- */
function wrongKey(subj, unitId, kind, text) { return subj + '|' + unitId + '|' + kind + '|' + String(text).slice(0, 60); }
function markWrong(subj, unitId, kind, text) {
  PROG.wrong[wrongKey(subj, unitId, kind, text)] = { subj: subj, unitId: unitId, kind: kind, q: text };
  saveProg(PROG);
}
function clearWrong(subj, unitId, kind, text) {
  var k = wrongKey(subj, unitId, kind, text);
  if (PROG.wrong[k]) { delete PROG.wrong[k]; saveProg(PROG); }
}
// 저장된 오답 → 실제 문항으로 복원 (못 찾으면 null)
function resolveWrong(w) {
  var subj = DATA[w.subj];
  if (!subj || !subj.ready) return null;
  var unit = subj.units.filter(function (u) { return u.id === w.unitId; })[0];
  if (!unit) return null;
  var src = (w.kind === 'quiz')
    ? (unit.quiz || []).filter(function (x) { return String(x.q).slice(0, 60) === w.q; })[0]
    : (unit.ox || []).filter(function (x) { return String(x.s).slice(0, 60) === w.q; })[0];
  return src ? { w: w, unit: unit, src: src } : null;
}
// 복원 가능한 오답만 반환. 문제 텍스트가 바뀌어 못 찾는 옛 기록은 정리(자가 치유).
function wrongList() {
  var out = [], pruned = false;
  Object.keys(PROG.wrong).forEach(function (k) {
    if (resolveWrong(PROG.wrong[k])) out.push(PROG.wrong[k]);
    else { delete PROG.wrong[k]; pruned = true; }
  });
  if (pruned) saveProg(PROG);
  return out;
}

function unitKey(subj, unitId) { return subj + '/' + unitId; }

function recordResult(pct, xpGain) {
  if (!state.unit) {                 // 오답 복습 등 특정 단원이 아닌 경우: XP만 적립
    PROG.totXp += xpGain; saveProg(PROG); updateHeader();
    return;
  }
  const key = unitKey(state.subject, state.unit.id);
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
  const rec = PROG.units[key] || { best: 0, stars: 0, xp: 0 };
  const newStars = Math.max(rec.stars, stars);
  PROG.totStar += (newStars - rec.stars);      // 별은 최고기록 증가분만 누적
  rec.best = Math.max(rec.best, pct);
  rec.stars = newStars;
  rec.xp += xpGain;
  PROG.units[key] = rec;
  PROG.totXp += xpGain;
  saveProg(PROG);
  updateHeader();
}

function updateHeader() {
  document.getElementById('totStar').textContent = PROG.totStar;
  document.getElementById('totXp').textContent = PROG.totXp;
}

/* ---------- 유틸 ---------- */
const $ = (id) => document.getElementById(id);
function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function show(id) { $(id).classList.remove('hidden'); }
function hide(id) { $(id).classList.add('hidden'); }
function toast(txt, color) {
  const t = $('toast');
  t.textContent = txt;
  t.style.color = color || 'var(--gold)';
  t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
}

/* ---------- 홈 렌더 ---------- */
function renderSubjects() {
  const box = $('subjects');
  box.innerHTML = '';
  SUBJECT_ORDER.forEach(sid => {
    const s = DATA[sid];
    if (!s) return;
    const el = document.createElement('div');
    el.className = 'subject' + (sid === state.subject ? ' on' : '') + (s.ready ? '' : ' soon');
    el.innerHTML = `<div class="ico">${s.icon}</div><div class="nm">${s.name}</div>
      <div class="st">${s.ready ? s.units.length + '개 단원' : '준비 중'}</div>
      ${s.ready ? '' : '<div class="soonlab">SOON</div>'}`;
    if (s.ready) el.onclick = () => { state.subject = sid; renderHome(); };
    box.appendChild(el);
  });
}

function renderUnits() {
  const s = DATA[state.subject];
  const box = $('units');
  box.innerHTML = '';
  $('unitTitle').textContent = s.name + ' · 단원 선택';
  s.units.forEach(u => {
    const key = unitKey(state.subject, u.id);
    const rec = PROG.units[key] || { best: 0, stars: 0 };
    const nQ = (u.quiz ? u.quiz.length : 0) + (u.ox ? u.ox.length : 0);
    const starTxt = '★★★'.slice(0, rec.stars) + '☆☆☆'.slice(0, 3 - rec.stars);
    const el = document.createElement('div');
    el.className = 'unit';
    el.innerHTML = `<div class="star">${rec.stars ? starTxt : ''}</div>
      <div class="uico">${u.icon}</div>
      <div class="unm">${u.name}</div>
      <div class="cnt">카드 ${u.cards.length} · 문제 ${nQ}</div>
      <div class="bar"><i style="width:${rec.best}%"></i></div>`;
    el.onclick = () => openUnit(u);
    box.appendChild(el);
  });
}

function renderHome() {
  clearExamTimer();
  hide('modeSel'); hide('game'); hide('result'); show('home');
  renderSubjects();
  renderExamBar();
  renderReviewBar();
  renderUnits();
}
function renderReviewBar() {
  var box = $('reviewBar');
  if (!box) return;
  var n = wrongList().length;
  if (!n) { box.innerHTML = ''; box.classList.add('hidden'); return; }
  box.classList.remove('hidden');
  box.innerHTML = '<div class="revcard">' +
    '<div><div class="revnm">🔁 오답 복습</div>' +
    '<div class="revds">틀렸던 문제 <b>' + n + '개</b>만 다시 풀어요 · 맞히면 목록에서 빠져요</div></div>' +
    '<button class="btn" onclick="startReview()">복습 시작</button></div>';
}
function goHome() { renderHome(); }

/* ---------- 모드 선택 ---------- */
function openUnit(u) {
  state.unit = u;
  hide('home'); hide('game'); hide('result'); show('modeSel');
  $('modeUnitName').textContent = DATA[state.subject].icon + ' ' + u.name;
}

/* ---------- 게임 공통 ---------- */
function beginGame(mode, label) {
  clearExamTimer();
  var ht = $('hudTimer'); if (ht) { ht.classList.add('hidden'); ht.classList.remove('warn'); }
  state.mode = mode;
  state.idx = 0; state.score = 0; state.combo = 0;
  state.correct = 0; state.wrong = 0; state.answered = false;
  state.startTime = Date.now();
  hide('modeSel'); hide('home'); hide('result'); show('game');
  $('gameLabel').textContent = label;
  hide('nextBtn');
}
function updateHud(total) {
  $('hudLeft').textContent = (state.idx + 1) + ' / ' + total;
  $('pgFill').style.width = ((state.idx) / total * 100) + '%';
  $('hudScore').textContent = state.score + '점';
  const c = $('hudCombo');
  if (state.combo >= 2) { c.classList.remove('hidden'); c.textContent = '🔥 ' + state.combo; }
  else c.classList.add('hidden');
}
function quitGame() {
  if (state.mode === 'cards' || confirm('게임을 그만두시겠어요? 진행 중인 점수는 저장되지 않아요.')) {
    if (state.unit) openUnit(state.unit); else renderHome();
  }
}

/* ============ 1) 개념 카드 ============ */
function startCards() {
  beginGame('cards', '🃏 개념 카드');
  state.queue = state.unit.cards.slice();
  $('hudScore').classList.add('hidden');
  renderCard();
}
function renderCard() {
  const total = state.queue.length;
  const c = state.queue[state.idx];
  updateHud(total);
  $('hudScore').classList.add('hidden');
  $('hudCombo').classList.add('hidden');
  $('stage').innerHTML = `
    <div class="flip"><div class="flipinner" id="flipEl" onclick="flipCard()">
      <div class="face front"><div class="tlabel">용어</div><div class="term">${c.t}</div>
        <div class="hint">👆 탭하면 설명이 나와요</div></div>
      <div class="face back"><div class="tlabel">설명</div><div class="def">${c.d}</div></div>
    </div></div>
    <div class="row" style="gap:10px">
      <button class="btn ghost" style="flex:1" onclick="prevCard()" ${state.idx === 0 ? 'disabled' : ''}>← 이전</button>
      <button class="btn" style="flex:1" onclick="nextCard()">${state.idx === total - 1 ? '완료 ✓' : '다음 →'}</button>
    </div>`;
}
function flipCard() { $('flipEl').classList.toggle('flipped'); }
function prevCard() { if (state.idx > 0) { state.idx--; renderCard(); } }
function nextCard() {
  if (state.idx < state.queue.length - 1) { state.idx++; renderCard(); }
  else {
    // 학습 완료 - 소량 XP
    recordResult(0, state.queue.length * 2);
    showSimpleDone('🃏', '카드 학습 완료!', '개념 ' + state.queue.length + '개를 훑어봤어요', state.queue.length * 2);
  }
}

/* ============ 2) 스피드 퀴즈 (4지선다 + 타이머) ============ */
let quizTimer = null, quizTimeLeft = 0;
function startQuiz() {
  beginGame('quiz', '⚡ 스피드 퀴즈');
  $('hudScore').classList.remove('hidden');
  const items = shuffle(state.unit.quiz).map(q => {
    // 보기 순서 섞기 (정답 추적)
    const opts = q.o.map((t, i) => ({ t, correct: i === q.a }));
    const sh = shuffle(opts);
    return { q: q.q, opts: sh, ans: sh.findIndex(o => o.correct), ex: q.ex };
  });
  state.queue = items;
  renderQuiz();
}
function renderQuiz() {
  const total = state.queue.length;
  const item = state.queue[state.idx];
  state.answered = false;
  updateHud(total);
  const opts = item.opts.map((o, i) =>
    `<div class="opt" data-i="${i}" onclick="answerQuiz(${i})">
       <div class="k">${'ABCD'[i]}</div><div>${o.t}</div></div>`).join('');
  $('stage').innerHTML = `
    <div class="qcard">
      <div class="row" style="justify-content:space-between">
        <div class="qnum">Q${state.idx + 1}</div>
        <div class="qnum" id="timerLab">⏱ 20</div>
      </div>
      <div class="qtext">${item.q}</div>
      <div class="opts" id="opts">${opts}</div>
      <div id="expBox"></div>
    </div>`;
  hide('nextBtn');
  startQuizTimer();
}
function startQuizTimer() {
  clearInterval(quizTimer);
  quizTimeLeft = 20;
  $('timerLab').textContent = '⏱ 20';
  quizTimer = setInterval(() => {
    quizTimeLeft--;
    const lab = $('timerLab');
    if (lab) lab.textContent = '⏱ ' + quizTimeLeft;
    if (quizTimeLeft <= 5 && lab) lab.style.color = 'var(--no)';
    if (quizTimeLeft <= 0) { clearInterval(quizTimer); answerQuiz(-1); }
  }, 1000);
}
function answerQuiz(sel) {
  if (state.answered) return;
  state.answered = true;
  clearInterval(quizTimer);
  const item = state.queue[state.idx];
  const correct = sel === item.ans;
  document.querySelectorAll('#opts .opt').forEach((el, i) => {
    el.classList.add('locked');
    el.onclick = null;
    if (i === item.ans) el.classList.add('correct');
    else if (i === sel) el.classList.add('wrong');
    else el.classList.add('dim');
  });
  if (correct) {
    state.combo++; state.correct++;
    const bonus = Math.max(0, quizTimeLeft) * 2;           // 빨리 맞출수록 보너스
    const comboBonus = (state.combo - 1) * 5;
    const gain = 10 + bonus + comboBonus;
    state.score += gain;
    toast('정답! +' + gain, 'var(--ok)');
  } else {
    state.combo = 0; state.wrong++;
    toast(sel === -1 ? '시간 초과!' : '오답', 'var(--no)');
  }
  // 누적 오답 기록/해제
  (function () {
    var subj = item.subj || state.subject;
    var uid = item.unitId || (state.unit && state.unit.id);
    if (!uid) return;
    if (correct) clearWrong(subj, uid, 'quiz', item.q); else markWrong(subj, uid, 'quiz', item.q);
  })();
  $('hudScore').textContent = state.score + '점';
  $('expBox').innerHTML = `<div class="exp ${correct ? 'ok' : 'no'}">
    <b>${correct ? '✅ 정답' : '❌ ' + (sel === -1 ? '시간 초과' : '오답')}</b>${item.ex}</div>`;
  show('nextBtn');
  $('nextBtn').textContent = state.idx === state.queue.length - 1 ? '결과 보기 →' : '다음 →';
}

/* ============ 3) OX 퀴즈 ============ */
function startOX() {
  beginGame('ox', '⭕ OX 퀴즈');
  $('hudScore').classList.remove('hidden');
  state.queue = shuffle(state.unit.ox);
  renderOX();
}
function renderOX() {
  const total = state.queue.length;
  const item = state.queue[state.idx];
  state.answered = false;
  updateHud(total);
  $('stage').innerHTML = `
    <div class="qcard">
      <div class="qnum">Q${state.idx + 1} · 맞으면 O, 틀리면 X</div>
      <div class="qtext" style="min-height:80px;display:flex;align-items:center">${item.s}</div>
      <div class="oxbtns">
        <button class="oxbtn o" data-v="true" onclick="answerOX(true)">O</button>
        <button class="oxbtn x" data-v="false" onclick="answerOX(false)">X</button>
      </div>
      <div id="expBox"></div>
    </div>`;
  hide('nextBtn');
}
function answerOX(val) {
  if (state.answered) return;
  state.answered = true;
  const item = state.queue[state.idx];
  const correct = val === item.a;
  document.querySelectorAll('.oxbtn').forEach(b => {
    b.onclick = null;
    const bv = b.dataset.v === 'true';
    if (bv === item.a) b.classList.add('correct');
    else if (bv === val) b.classList.add('wrong');
  });
  if (correct) {
    state.combo++; state.correct++;
    const gain = 10 + (state.combo - 1) * 5;
    state.score += gain;
    toast('정답! +' + gain, 'var(--ok)');
  } else {
    state.combo = 0; state.wrong++;
    toast('오답', 'var(--no)');
  }
  // 누적 오답 기록/해제
  (function () {
    var subj = item.subj || state.subject;
    var uid = item.unitId || (state.unit && state.unit.id);
    if (!uid) return;
    if (correct) clearWrong(subj, uid, 'ox', item.s); else markWrong(subj, uid, 'ox', item.s);
  })();
  $('hudScore').textContent = state.score + '점';
  $('expBox').innerHTML = `<div class="exp ${correct ? 'ok' : 'no'}">
    <b>${correct ? '✅ 정답 (' + (item.a ? 'O' : 'X') + ')' : '❌ 오답 (정답: ' + (item.a ? 'O' : 'X') + ')'}</b>${item.ex}</div>`;
  show('nextBtn');
  $('nextBtn').textContent = state.idx === state.queue.length - 1 ? '결과 보기 →' : '다음 →';
}

/* ============ 4) 용어 매칭 ============ */
let matchSel = null, matchDone = 0, matchTotal = 0, matchTries = 0;
function startMatch() {
  beginGame('match', '🔗 용어 매칭');
  $('hudScore').classList.add('hidden');
  $('hudCombo').classList.add('hidden');
  const pool = shuffle(state.unit.cards).slice(0, 5); // 한 판 5쌍
  matchTotal = pool.length; matchDone = 0; matchTries = 0; matchSel = null;
  const lefts = shuffle(pool.map((c, i) => ({ id: i, txt: c.t })));
  const rights = shuffle(pool.map((c, i) => ({ id: i, txt: c.d })));
  $('hudLeft').textContent = '0 / ' + matchTotal + ' 쌍';
  $('pgFill').style.width = '0%';
  $('stage').innerHTML = `
    <div class="matchgrid">
      <div class="mcol" id="mLeft">${lefts.map(l =>
        `<div class="mitem" data-side="L" data-id="${l.id}" onclick="pickMatch(this)">${l.txt}</div>`).join('')}</div>
      <div class="mcol" id="mRight">${rights.map(r =>
        `<div class="mitem" data-side="R" data-id="${r.id}" onclick="pickMatch(this)">${r.txt}</div>`).join('')}</div>
    </div>
    <div style="text-align:center;color:var(--tx2);font-size:13px;margin-top:14px">
      왼쪽 용어와 오른쪽 설명을 짝지어 보세요</div>`;
  hide('nextBtn');
}
function pickMatch(el) {
  if (el.classList.contains('done')) return;
  if (!matchSel) {
    matchSel = el; el.classList.add('sel'); return;
  }
  if (matchSel === el) { el.classList.remove('sel'); matchSel = null; return; }
  if (matchSel.dataset.side === el.dataset.side) { // 같은 쪽 다시 선택 → 교체
    matchSel.classList.remove('sel'); matchSel = el; el.classList.add('sel'); return;
  }
  matchTries++;
  if (matchSel.dataset.id === el.dataset.id) { // 정답
    matchSel.classList.add('done'); el.classList.add('done');
    matchSel.classList.remove('sel');
    matchSel = null; matchDone++;
    $('hudLeft').textContent = matchDone + ' / ' + matchTotal + ' 쌍';
    $('pgFill').style.width = (matchDone / matchTotal * 100) + '%';
    toast('짝!', 'var(--ok)');
    if (matchDone === matchTotal) {
      const acc = Math.round(matchTotal / matchTries * 100);
      const xp = matchTotal * 4;
      recordResult(acc, xp);
      setTimeout(() => showSimpleDone('🔗', '매칭 완료!',
        '정확도 ' + acc + '% · 시도 ' + matchTries + '회', xp), 400);
    }
  } else { // 오답
    const a = matchSel, b = el;
    a.classList.add('bad'); b.classList.add('bad');
    a.classList.remove('sel');
    matchSel = null;
    setTimeout(() => { a.classList.remove('bad'); b.classList.remove('bad'); }, 350);
  }
}

/* ============ 5) 오답 복습 (퀴즈·OX 혼합) ============ */
function startReview() {
  var list = wrongList();
  if (!list.length) return;
  beginGame('review', '🔁 오답 복습');
  state.unit = null;                       // 특정 단원이 아님
  $('hudScore').classList.remove('hidden');
  var q = [];
  list.forEach(function (w) {
    var r = resolveWrong(w); if (!r) return;
    var src = r.src;
    if (w.kind === 'quiz') {
      var opts = shuffle(src.o.map(function (t, i) { return { t: t, correct: i === src.a }; }));
      q.push({ kind: 'quiz', subj: w.subj, unitId: w.unitId, q: src.q, opts: opts,
        ans: opts.findIndex(function (o) { return o.correct; }), ex: src.ex });
    } else {
      q.push({ kind: 'ox', subj: w.subj, unitId: w.unitId, s: src.s, a: src.a, ex: src.ex });
    }
  });
  if (!q.length) { alert('복습할 오답을 찾지 못했어요.'); renderHome(); return; }
  state.queue = shuffle(q);
  renderReviewItem();
}
function renderReviewItem() {
  var it = state.queue[state.idx];
  if (it.kind === 'quiz') renderQuiz(); else renderOX();
}

/* ============ 결과 화면 ============ */
function nextStep() {
  if (state.idx < state.queue.length - 1) {
    state.idx++;
    if (state.mode === 'quiz') renderQuiz();
    else if (state.mode === 'ox') renderOX();
    else if (state.mode === 'review') renderReviewItem();
  } else {
    finishQuizLike();
  }
}
function finishQuizLike() {
  const total = state.correct + state.wrong;
  const pct = total ? Math.round(state.correct / total * 100) : 0;
  const xp = state.correct * 5 + Math.floor(state.score / 10);
  recordResult(pct, xp);
  state.lastResult = { total, pct };
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
  const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '👍' : '💪';
  const msg = pct >= 90 ? '완벽해요!' : pct >= 70 ? '잘했어요!' : pct >= 40 ? '조금만 더!' : '복습이 필요해요';
  hide('game'); show('result');
  $('result').innerHTML = `
    <div class="result">
      <div class="big">${emoji}</div>
      <div class="score">${state.score}점</div>
      <div class="sub">${msg}</div>
      <div class="stars">${'⭐'.repeat(stars)}${'▫️'.repeat(3 - stars)}</div>
      <div class="rstats">
        <div class="rstat"><div class="v" style="color:var(--ok)">${state.correct}</div><div class="l">정답</div></div>
        <div class="rstat"><div class="v" style="color:var(--no)">${state.wrong}</div><div class="l">오답</div></div>
        <div class="rstat"><div class="v">${pct}%</div><div class="l">정답률</div></div>
        <div class="rstat"><div class="v" style="color:var(--gold)">+${xp}</div><div class="l">XP</div></div>
      </div>
      ${submitButtonHtml()}
      <div class="row" style="justify-content:center;margin-top:20px">
        ${state.unit ? '<button class="btn sec" onclick="openUnit(state.unit)">단원으로</button>'
                     : '<button class="btn sec" onclick="goHome()">홈으로</button>'}
        <button class="btn" onclick="retryMode()">다시 도전</button>
      </div>
    </div>`;
}

/* ---------- 결과 제출 (교사 링크로 배포 시에만 노출) ---------- */
function submitEnabled() {
  return !!(window.ResultCollector && ResultCollector.config && ResultCollector.config.endpoint);
}
function submitButtonHtml() {
  if (!submitEnabled()) return '';
  return `<div class="row" style="justify-content:center;margin-top:6px">
      <button class="btn" id="submitBtn" style="background:#16a34a"
        onclick="submitResult()">📤 선생님께 결과 제출</button></div>`;
}
function submitResult() {
  if (!submitEnabled()) return;
  const modeName = { quiz: '스피드퀴즈', ox: 'OX', cards: '개념카드', match: '매칭' }[state.mode] || '';
  const subj = DATA[state.subject].short;
  // 시트 탭을 '과목 · 단원'으로 분리 (교사가 단원별로 확인 가능)
  ResultCollector.config.tool = '컴활2급 ' + subj + ' · ' + state.unit.name;
  const r = state.lastResult || { total: state.correct + state.wrong, pct: 0 };
  ResultCollector.open({
    score: state.score,
    correct: state.correct,
    total: r.total,
    durationSec: Math.round((Date.now() - (state.startTime || Date.now())) / 1000),
    labels: { correct: '맞힘', total: '문항수', wrong: '모드' },
    wrong: modeName,
  });
}
function showSimpleDone(emoji, title, sub, xp) {
  hide('game'); show('result');
  $('result').innerHTML = `
    <div class="result">
      <div class="big">${emoji}</div>
      <div class="score" style="font-size:26px">${title}</div>
      <div class="sub">${sub}</div>
      <div class="sub" style="color:var(--gold);margin-top:10px;font-weight:700">+${xp} XP</div>
      <div class="row" style="justify-content:center;margin-top:20px">
        <button class="btn sec" onclick="openUnit(state.unit)">단원으로</button>
        <button class="btn" onclick="retryMode()">다시</button>
      </div>
    </div>`;
}
function retryMode() {
  const m = state.mode;
  if (m === 'cards') startCards();
  else if (m === 'quiz') startQuiz();
  else if (m === 'ox') startOX();
  else if (m === 'match') startMatch();
  else if (m === 'review') { if (wrongList().length) startReview(); else renderHome(); }
}

/* ============ 6) 모의고사 (두 과목 · 합격/불합격 · 해설은 제출 후) ============ */
var EXAM_MODES = [
  { key: 'real', nm: '실전 모의고사', ds: '40문항 · 40분 · 컴퓨터 20 + 스프레드시트 20', counts: { comp: 20, excel: 20 }, min: 40 },
  { key: 'mini', nm: '미니 모의고사', ds: '20문항 · 20분 · 과목당 10', counts: { comp: 10, excel: 10 }, min: 20 },
  { key: 'full', nm: '전체 한번에', ds: '배운 개념 문제 총정리 · 100분', counts: { comp: 'all', excel: 'all' }, min: 100 },
];
var PASS_AVG = 60, FAIL_UNDER = 40;   // 합격 평균 / 과락 기준
var examTimer = null;
function pad2(n) { return (n < 10 ? '0' : '') + n; }
function clearExamTimer() { if (examTimer) { clearInterval(examTimer); examTimer = null; } }

function renderExamBar() {
  var box = $('examBar');
  if (!box) return;
  // 두 과목 모두 문제가 있어야 모의고사 노출
  var ready = SUBJECT_ORDER.filter(function (k) { return DATA[k] && DATA[k].ready && examPool(k).length; });
  if (ready.length < 1) { box.innerHTML = ''; return; }
  box.innerHTML = '<div class="exambar">' +
    '<div class="exhead">🏆 모의고사' +
    '<span class="exsub">두 과목을 한번에 풀고 <b style="color:var(--ok)">합격/불합격</b>까지 · 풀이(해설)는 다 푼 뒤 모아보기</span></div>' +
    '<div class="exopts">' + EXAM_MODES.map(function (m, i) {
      return '<button class="exbtn" onclick="startExam(EXAM_MODES[' + i + '])"><b>' + m.nm + '</b><span>' + m.ds + '</span></button>';
    }).join('') + '</div></div>';
}

// 과목의 모든 스피드퀴즈 문제 → 평평한 배열
function examPool(k) {
  var s = DATA[k], arr = [];
  if (s && s.units) s.units.forEach(function (u) {
    (u.quiz || []).forEach(function (q) {
      arr.push({ subj: k, subjName: s.name, unit: u.name, q: q.q, o: q.o, a: q.a, ex: q.ex });
    });
  });
  return arr;
}
function buildExam(counts) {
  var qs = [];
  SUBJECT_ORDER.forEach(function (k) {
    if (!DATA[k] || !DATA[k].ready) return;
    var pool = shuffle(examPool(k));
    var want = counts[k] === 'all' ? pool.length : Math.min(counts[k] || 0, pool.length);
    for (var i = 0; i < want; i++) {
      var src = pool[i];
      var opts = shuffle(src.o.map(function (t, idx) { return { t: t, correct: idx === src.a }; }));
      qs.push({
        subj: src.subj, subjName: src.subjName, unit: src.unit, q: src.q,
        opts: opts, ans: opts.findIndex(function (o) { return o.correct; }), ex: src.ex, sel: null,
      });
    }
  });
  return qs;
}

function startExam(mode) {
  var qs = buildExam(mode.counts);
  if (!qs.length) { alert('문제를 준비하지 못했어요.'); renderHome(); return; }
  beginGame('exam', '📝 ' + mode.nm);
  state.unit = null;
  state.examMode = mode;
  state.examTitle = mode.nm;
  state.queue = qs;
  $('hudScore').classList.add('hidden');   // 시험 중에는 점수·정답 숨김
  $('hudCombo').classList.add('hidden');
  hide('nextBtn');
  // 제한 시간 타이머
  state.examTimeUp = false;
  state.examDeadline = Date.now() + (mode.min || 20) * 60000;
  var ht = $('hudTimer');
  if (ht) { ht.classList.remove('hidden'); }
  examTick();
  examTimer = setInterval(examTick, 1000);
  renderExamQ();
}
function examTick() {
  var left = Math.max(0, Math.round((state.examDeadline - Date.now()) / 1000));
  var ht = $('hudTimer');
  if (ht) {
    ht.textContent = '⏱ ' + pad2(Math.floor(left / 60)) + ':' + pad2(left % 60);
    ht.classList.toggle('warn', left <= 300);   // 5분 이하 경고
  }
  if (left <= 0) { clearExamTimer(); state.examTimeUp = true; finishExam(true); }
}
function examAnswered() {
  return state.queue.filter(function (q) { return q.sel !== null; }).length;
}
function renderExamQ() {
  var total = state.queue.length, item = state.queue[state.idx];
  $('hudLeft').textContent = (state.idx + 1) + ' / ' + total;
  $('pgFill').style.width = (state.idx / total * 100) + '%';
  var opts = item.opts.map(function (o, i) {
    return '<div class="opt' + (item.sel === i ? ' sel' : '') + '" onclick="selectExam(' + i + ')">' +
      '<div class="k">' + 'ABCD'[i] + '</div><div>' + o.t + '</div></div>';
  }).join('');
  var last = state.idx === total - 1;
  $('stage').innerHTML =
    '<div class="qcard">' +
      '<div class="row" style="justify-content:space-between">' +
        '<div class="qnum">Q' + (state.idx + 1) + ' · ' + item.subjName + '</div>' +
        '<div class="qnum">응답 ' + examAnswered() + ' / ' + total + '</div></div>' +
      '<div class="qtext">' + item.q + '</div>' +
      '<div class="opts">' + opts + '</div>' +
    '</div>' +
    '<div class="row" style="margin-top:16px;gap:10px">' +
      '<button class="btn ghost" style="flex:1" onclick="examNav(-1)"' + (state.idx === 0 ? ' disabled' : '') + '>← 이전</button>' +
      '<button class="btn" style="flex:1" onclick="examNav(1)">' + (last ? '제출하기 ✓' : '다음 →') + '</button>' +
    '</div>';
}
function selectExam(i) {
  state.queue[state.idx].sel = i;   // 정답 여부는 알려주지 않음(시험)
  renderExamQ();
}
function examNav(d) {
  if (d > 0 && state.idx === state.queue.length - 1) { confirmSubmitExam(); return; }
  state.idx = Math.min(state.queue.length - 1, Math.max(0, state.idx + d));
  renderExamQ();
}
function confirmSubmitExam() {
  var un = state.queue.length - examAnswered();
  var msg = un > 0 ? ('아직 풀지 않은 문제가 ' + un + '개 있어요.\n제출할까요?') : '답안을 제출할까요?';
  if (confirm(msg)) finishExam();
}
// 채점: 과목별 100점 환산 → 과락(40 미만)/평균(60 이상)으로 합격 판정
function gradeExam() {
  var per = {};
  state.queue.forEach(function (q) {
    if (!per[q.subj]) per[q.subj] = { name: q.subjName, total: 0, correct: 0 };
    per[q.subj].total++;
    if (q.sel === q.ans) per[q.subj].correct++;
  });
  var scores = SUBJECT_ORDER.filter(function (k) { return per[k]; }).map(function (k) {
    var p = per[k];
    return { name: p.name, correct: p.correct, total: p.total, score: Math.round(p.correct / p.total * 100) };
  });
  var avg = Math.round(scores.reduce(function (a, x) { return a + x.score; }, 0) / scores.length);
  var hasFail = scores.some(function (x) { return x.score < FAIL_UNDER; });
  var pass = !hasFail && avg >= PASS_AVG;
  var totalCorrect = state.queue.filter(function (q) { return q.sel === q.ans; }).length;
  return { scores: scores, avg: avg, pass: pass, hasFail: hasFail, totalCorrect: totalCorrect, totalQ: state.queue.length };
}
function finishExam(timeUp) {
  clearExamTimer();
  var ht = $('hudTimer'); if (ht) { ht.classList.add('hidden'); ht.classList.remove('warn'); }
  state.examTimeUp = !!timeUp;
  var r = gradeExam();
  state.examResult = r;
  state.examDur = Math.round((Date.now() - (state.startTime || Date.now())) / 1000);
  recordResult(0, r.totalCorrect * 5);   // XP만 적립(특정 단원 아님)
  showExamResult();
}
function showExamResult() {
  var r = state.examResult;
  hide('game'); hide('home'); show('result');
  var emoji = r.pass ? '🎉' : '💪';
  var ss = r.scores.map(function (x) {
    var fail = x.score < FAIL_UNDER;
    return '<div class="ss"><div class="nm">' + x.name + '</div>' +
      '<div class="sc' + (fail ? ' fail' : '') + '">' + x.score + '<span style="font-size:13px">점</span></div>' +
      '<div class="ct">' + x.correct + ' / ' + x.total + ' 정답</div>' +
      (fail ? '<div class="flag">과락</div>' : '') + '</div>';
  }).join('');
  $('result').innerHTML =
    '<div class="result">' +
      (state.examTimeUp ? '<div class="sub" style="color:var(--no);font-weight:700">⏰ 시간 종료로 자동 제출됐어요</div>' : '') +
      (state.examTitle ? '<div class="sub" style="font-weight:700">' + state.examTitle + '</div>' : '') +
      '<div class="big">' + emoji + '</div>' +
      '<div class="verdict ' + (r.pass ? 'pass' : 'fail') + '">' + (r.pass ? '합격' : '불합격') + '</div>' +
      '<div class="sub">평균 <b style="color:var(--tx)">' + r.avg + '점</b> · 정답 ' + r.totalCorrect + '/' + r.totalQ +
        ' · 소요 ' + Math.floor(state.examDur / 60) + '분 ' + (state.examDur % 60) + '초</div>' +
      '<div class="subjscore">' + ss + '</div>' +
      (r.hasFail ? '<div class="sub" style="color:var(--no);font-size:13px">한 과목 이상 40점 미만(과락)이에요.</div>'
                 : '<div class="sub" style="font-size:13px">과락 없이 평균 60점 이상이면 합격이에요.</div>') +
      submitExamButtonHtml() +
      '<div class="row" style="justify-content:center;margin-top:18px;flex-wrap:wrap">' +
        '<button class="btn sec" onclick="showExamReview()">📖 풀이 보기 (' + (r.totalQ - r.totalCorrect) + '개 오답)</button>' +
        '<button class="btn sec" onclick="goHome()">홈으로</button>' +
        '<button class="btn" onclick="startExam(state.examMode)">다시 도전</button>' +
      '</div>' +
    '</div>';
}
// 풀이과정: 문제 다 푼 뒤에 전체 문항의 정답·해설 모아보기
function showExamReview() {
  hide('game'); hide('home'); show('result');
  var items = state.queue.map(function (q, n) {
    var opts = q.opts.map(function (o, i) {
      var cls = 'opt';
      if (i === q.ans) cls += ' correct';
      else if (i === q.sel) cls += ' wrong';
      var tag = (i === q.ans) ? ' ✔' : (i === q.sel ? ' ✖(내 답)' : '');
      return '<div class="' + cls + '"><div class="k">' + 'ABCD'[i] + '</div><div>' + o.t + tag + '</div></div>';
    }).join('');
    var mark = (q.sel === q.ans) ? '<span style="color:var(--ok)">✅ 정답</span>'
      : (q.sel === null ? '<span style="color:var(--tx2)">⬜ 미응답</span>' : '<span style="color:var(--no)">❌ 오답</span>');
    return '<div class="reviewitem">' +
      '<div class="rq-meta">Q' + (n + 1) + ' · ' + q.subjName + ' · ' + q.unit + ' · ' + mark + '</div>' +
      '<div class="rq-text">' + q.q + '</div>' +
      '<div class="opts">' + opts + '</div>' +
      '<div class="exp ' + (q.sel === q.ans ? 'ok' : 'no') + '"><b>해설</b>' + q.ex + '</div>' +
    '</div>';
  }).join('');
  $('result').innerHTML =
    '<div class="result" style="text-align:left">' +
      '<div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px">' +
        '<div style="font-weight:800;font-size:16px">📖 풀이 보기 · ' + state.queue.length + '문항</div>' +
        '<button class="btn sec" onclick="showExamResult()">← 결과로</button></div>' +
      items +
      '<div class="row" style="justify-content:center;margin-top:14px">' +
        '<button class="btn sec" onclick="goHome()">홈으로</button>' +
        '<button class="btn" onclick="startExam(state.examMode)">다시 도전</button></div>' +
    '</div>';
  window.scrollTo(0, 0);
}
// 결과 제출(교사 링크로 배포 시에만)
function submitExamButtonHtml() {
  if (!submitEnabled()) return '';
  return '<div class="row" style="justify-content:center;margin-top:6px">' +
    '<button class="btn" style="background:#16a34a" onclick="submitExamResult()">📤 선생님께 결과 제출</button></div>';
}
function submitExamResult() {
  if (!submitEnabled()) return;
  var r = state.examResult;
  ResultCollector.config.tool = '컴활2급 모의고사 · ' + (state.examTitle || '');
  ResultCollector.open({
    score: r.avg,
    correct: r.totalCorrect,
    total: r.totalQ,
    durationSec: state.examDur,
    labels: { score: '평균점수', correct: '맞힘', total: '문항수', wrong: '합격여부' },
    wrong: r.pass ? '합격' : '불합격',
  });
}

/* ---------- init ---------- */
updateHeader();
renderHome();
