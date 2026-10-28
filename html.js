// 프론트엔드 HTML을 문자열로 내보낸다
'use strict';

module.exports = /* html */`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<title>파일 타임라인</title>
<style>
:root{
  --bg:#f4f5f7;--surface:#fdfdfe;--line:#e3e6eb;--line-soft:#eceef2;
  --text:#16181d;--muted:#5b6270;--subtle:#69707d;
  --accent:#2d5be3;--accent-ink:#fdfdfe;--accent-soft:#e8eefc;
  --hover:#f6f8fc;--danger:#b4322a;--mark:#ffefb0;--skel:#eceef2;
  --r-ctl:8px;--r-box:12px;
}
@media (prefers-color-scheme:dark){
  :root{
    --bg:#0f1115;--surface:#171a20;--line:#272c35;--line-soft:#20242c;
    --text:#e8eaee;--muted:#a1a9b7;--subtle:#8b93a1;
    --accent:#7d9bff;--accent-ink:#0b0d12;--accent-soft:#1c2438;
    --hover:#1b1f27;--danger:#ff8a80;--mark:#5a4a12;--skel:#20242c;
  }
}
*{box-sizing:border-box;margin:0;padding:0}
html{color-scheme:light dark}
body{font-family:'Pretendard','Segoe UI','Malgun Gothic','맑은 고딕',sans-serif;
  background:var(--bg);color:var(--text);font-size:14px;line-height:1.5;
  -webkit-font-smoothing:antialiased}
button,input{font:inherit;color:inherit}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.ic{width:18px;height:18px;flex-shrink:0;fill:none;stroke:currentColor;
  stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.ic.sm{width:15px;height:15px}
.wrap{max-width:1080px;margin:0 auto;padding:0 24px}

/* 상단 바 */
.top{position:sticky;top:0;z-index:100;background:var(--bg);border-bottom:1px solid var(--line)}
.bar1{display:flex;align-items:center;gap:16px;min-height:64px}
.brand{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:700;
  letter-spacing:-.01em;white-space:nowrap}
.brand-mark{width:32px;height:32px;border-radius:var(--r-ctl);background:var(--accent);
  color:var(--accent-ink);display:grid;place-items:center}
.search{flex:1;max-width:520px;margin:0 auto}
.sbox{display:flex;align-items:center;gap:8px;height:40px;padding:0 10px 0 12px;
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r-ctl);
  color:var(--subtle);transition:border-color .15s,box-shadow .15s}
.sbox:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft);color:var(--accent)}
.sbox input{flex:1;min-width:0;border:none;outline:none;background:transparent;color:var(--text)}
.sbox input::placeholder{color:var(--subtle)}
.s-clear{display:none;width:24px;height:24px;border:none;background:none;border-radius:6px;
  cursor:pointer;color:var(--subtle);place-items:center}
.s-clear.show{display:grid}
.s-clear:hover{color:var(--danger)}
.hd-right{display:flex;align-items:center;gap:8px}
.hd-total{font-size:13px;color:var(--subtle);white-space:nowrap;margin-right:4px}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:40px;
  padding:0 14px;border:1px solid var(--line);border-radius:var(--r-ctl);
  background:var(--surface);color:var(--text);font-size:13.5px;font-weight:600;
  white-space:nowrap;cursor:pointer;transition:border-color .15s,color .15s,background .15s}
.btn:hover{border-color:var(--accent);color:var(--accent)}
.btn:active{transform:translateY(1px)}
.btn:disabled{opacity:.6;cursor:default}
.btn.primary{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.btn.primary:hover{filter:brightness(1.08);color:var(--accent-ink)}
.btn.sm{height:32px;padding:0 12px;font-size:13px}
.btn.spinning .ic{animation:spin .7s linear infinite}

.bar2{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding-bottom:12px}
.tabs{display:flex;gap:2px;padding:3px;background:var(--line-soft);border-radius:var(--r-box);
  max-width:100%;overflow-x:auto;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.tab{height:32px;padding:0 14px;border:none;background:transparent;border-radius:var(--r-ctl);
  font-size:13.5px;color:var(--muted);white-space:nowrap;cursor:pointer;
  transition:background .15s,color .15s}
.tab:hover{color:var(--text)}
.tab.on{background:var(--surface);color:var(--accent);font-weight:700;
  box-shadow:0 1px 2px rgba(20,30,60,.12)}
.drange{display:flex;align-items:center;gap:8px}
.dinput{height:36px;padding:0 10px;border:1px solid var(--line);border-radius:var(--r-ctl);
  background:var(--surface);color:var(--text);cursor:pointer}
.dinput:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
.dsep{color:var(--subtle)}

/* 본문 */
.content{max-width:1080px;margin:0 auto;padding:8px 24px 64px}
.ph{display:flex;align-items:center;gap:8px 12px;flex-wrap:wrap;margin:24px 0 20px}
.ph h1{font-size:26px;font-weight:700;letter-spacing:-.02em;line-height:1.25}
.ph .cnt{font-size:14px;color:var(--muted)}
.ph .chips{display:flex;gap:8px;margin-left:auto}

.dg{display:grid;grid-template-columns:120px minmax(0,1fr);gap:20px;margin-bottom:28px}
.dg-date{padding-top:12px}
.dg-d1{font-size:15px;font-weight:700}
.dg-d1.today{color:var(--accent)}
.dg-d2{font-size:13px;color:var(--subtle)}
.list{background:var(--surface);border:1px solid var(--line);border-radius:var(--r-box);overflow:hidden}
.row{display:grid;grid-template-columns:40px minmax(0,1fr) auto auto;align-items:center;gap:14px;
  padding:12px 16px;cursor:pointer;transition:background .12s}
.row+.row{border-top:1px solid var(--line-soft)}
.row:hover,.row:focus-visible{background:var(--hover)}
.row:focus-visible{outline-offset:-2px}
.ficon{width:40px;height:40px;border-radius:var(--r-ctl);display:grid;place-items:center;
  font-size:10.5px;font-weight:800;letter-spacing:.02em;color:#fff}
.ic-xls{background:#1a7f5a}.ic-doc{background:#2a5aa8}.ic-ppt{background:#c2452a}
.ic-hwp{background:#a8691a}.ic-pdf{background:#b13333}
.rmain{min-width:0}
.fname{font-size:15px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fname em{font-style:normal;background:var(--mark);border-radius:3px;padding:0 2px}
.fpath{display:inline-flex;align-items:center;gap:5px;max-width:100%;margin-top:1px;
  font-size:12.5px;color:var(--subtle);cursor:pointer;align-items:flex-start}
.fpath .ic{margin-top:2px}
.fpath span{overflow-wrap:anywhere}
.fpath:hover{color:var(--accent)}
.rmeta{text-align:right;font-variant-numeric:tabular-nums;min-width:76px}
.rmeta .t{display:block;font-size:13.5px;color:var(--muted)}
.rmeta .s{display:block;font-size:12.5px;color:var(--subtle)}
.ract{display:flex;gap:4px;opacity:0;transition:opacity .12s}
.row:hover .ract,.row:focus-within .ract{opacity:1}
.act-btn{width:32px;height:32px;border:1px solid var(--line);border-radius:var(--r-ctl);
  background:var(--surface);color:var(--muted);display:grid;place-items:center;cursor:pointer;
  transition:border-color .15s,color .15s}
.act-btn:hover{border-color:var(--accent);color:var(--accent)}
@media (hover:none){.ract{opacity:1}}

/* 상태 화면 */
.state{display:flex;flex-direction:column;align-items:center;text-align:center;
  padding:72px 16px;gap:8px;color:var(--muted)}
.state .ic{width:40px;height:40px;stroke-width:1.5;color:var(--subtle);margin-bottom:8px}
.state h2{font-size:17px;font-weight:700;color:var(--text)}
.state p{font-size:13.5px;max-width:420px}
.state .btns{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:12px}
.state.err h2{color:var(--danger)}
.skel{padding:0}
.skel-row{display:grid;grid-template-columns:40px 1fr 72px;gap:14px;align-items:center;padding:12px 16px}
.skel-row+.skel-row{border-top:1px solid var(--line-soft)}
.sk{background:var(--skel);border-radius:6px;height:12px;animation:pulse 1.4s ease-in-out infinite}
.sk.ico{height:40px;border-radius:var(--r-ctl)}
.sk.w1{width:55%;height:14px;margin-bottom:8px}.sk.w2{width:35%}
.loadbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:24px 0 16px;
  color:var(--muted)}
.pc-prog{display:flex;align-items:center;gap:12px;padding:16px 18px;margin:24px 0 16px;
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r-box);color:var(--muted)}
.spinner{width:18px;height:18px;border:2px solid var(--line);border-top-color:var(--accent);
  border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
.err-box{background:var(--surface);border:1px solid var(--danger);border-radius:var(--r-box);
  padding:20px;margin:24px 0;color:var(--danger);line-height:1.6}
.err-box button{margin-top:10px}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--text);
  color:var(--bg);padding:10px 20px;border-radius:var(--r-ctl);font-size:13.5px;z-index:300;
  transition:opacity .5s}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{50%{opacity:.45}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}

@media (max-width:760px){
  .wrap,.content{padding-left:16px;padding-right:16px}
  .bar1{flex-wrap:wrap;padding:12px 0 4px;gap:12px}
  .hd-right{margin-left:auto}
  .search{order:3;flex-basis:100%;max-width:none}
  .dg{grid-template-columns:minmax(0,1fr);gap:8px}
  .dg-date{padding-top:0;display:flex;gap:8px;align-items:baseline}
  .row{grid-template-columns:40px minmax(0,1fr) auto;padding:12px}
  .ract{display:none}
  .ph h1{font-size:22px}
}
@media (max-width:520px){.btn .lbl{display:none}.hd-total{display:none}}
</style>
</head>
<body>

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-clock" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></symbol>
  <symbol id="i-refresh" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></symbol>
  <symbol id="i-folder" viewBox="0 0 24 24"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></symbol>
  <symbol id="i-open" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></symbol>
  <symbol id="i-doc" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></symbol>
  <symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></symbol>
</svg>

<header class="top">
  <div class="wrap">
    <div class="bar1">
      <div class="brand">
        <span class="brand-mark"><svg class="ic"><use href="#i-clock"/></svg></span>
        파일 타임라인
      </div>
      <div class="search">
        <div class="sbox">
          <svg class="ic"><use href="#i-search"/></svg>
          <input id="sInput" type="text" placeholder="파일명 검색  ( / )" autocomplete="off" aria-label="파일명 검색">
          <button class="s-clear" id="sClear" aria-label="검색어 지우기"><svg class="ic sm"><use href="#i-x"/></svg></button>
        </div>
      </div>
      <div class="hd-right">
        <span class="hd-total" id="hdTotal"></span>
        <button class="btn" id="btnPcSearch" title="검색어로 PC 전체에서 찾기">
          <svg class="ic"><use href="#i-search"/></svg><span class="lbl">PC 전체 검색</span>
        </button>
        <button class="btn" id="btnRefresh" title="최근 파일 목록 다시 읽기">
          <svg class="ic"><use href="#i-refresh"/></svg><span class="lbl">새로고침</span>
        </button>
      </div>
    </div>
    <div class="bar2">
      <nav class="tabs" aria-label="기간">
        <button class="tab on" data-p="today">오늘</button>
        <button class="tab"    data-p="yesterday">어제</button>
        <button class="tab"    data-p="week">이번 주</button>
        <button class="tab"    data-p="month">이번 달</button>
        <button class="tab"    data-p="all">전체</button>
      </nav>
      <div class="drange" id="drange">
        <input type="date" class="dinput" id="dFrom" aria-label="시작일">
        <span class="dsep">~</span>
        <input type="date" class="dinput" id="dTo" aria-label="종료일">
        <button class="btn primary sm" id="btnApply">조회</button>
      </div>
    </div>
  </div>
</header>

<main class="content" id="mainArea"></main>

<script>
// ── 상태 변수 ─────────────────────────────────────────────────────────────
var ALL         = [];
var SINCE       = '';   // 누적 기록의 최초 접근 시각(ISO)
var PC          = [];
var mode        = 'recent';
var period      = 'today';
var cfrom       = '';
var cto         = '';
var kw          = '';
var fetchAbort       = null;   // 진행 중인 fetch AbortController
var loadingCancelled = false;  // 로딩 중단 플래그
var isLoading        = false;  // fetch 진행 중 여부

// mainArea: id="mainArea" 로 변경하여 window.main 충돌 방지
function getMain() { return document.getElementById('mainArea'); }
function getEl(id)  { return document.getElementById(id); }
function ico(n, cls) { return '<svg class="ic '+(cls||'')+'" aria-hidden="true"><use href="#i-'+n+'"/></svg>'; }

function showToast(msg) {
  var t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function(){ t.style.opacity='0'; }, 1800);
  setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 2400);
}
function showDiag() {
  fetch('/api/debug')
    .then(function(r){ return r.json(); })
    .then(function(d){
      var msg = '진단 결과\\n'
        + '------------------\\n'
        + 'Recent 폴더 존재: ' + (d.dirExists ? '예' : '아니오') + '\\n'
        + '.lnk 파일 수: ' + d.lnkCount + '\\n'
        + '불러온 파일 수: ' + d.cacheCount + '\\n'
        + '에러: ' + (d.error || '없음') + '\\n'
        + '\\nRecent 폴더 경로:\\n' + d.recentDir;
      alert(msg);
    })
    .catch(function(){ alert('서버에 연결할 수 없습니다.\\n실행.bat으로 서버를 시작해 주세요.'); });
}

// 아이콘 + 제목 + 설명 + 버튼으로 구성된 상태 화면
function stateHtml(icon, title, desc, btns, err) {
  return '<div class="state'+(err?' err':'')+'">'+ico(icon)
    +'<h2>'+title+'</h2>'+(desc?'<p>'+desc+'</p>':'')
    +(btns?'<div class="btns">'+btns+'</div>':'')+'</div>';
}
var BTN_RETRY = '<button class="btn primary" onclick="loadAll()">다시 시도</button>';

// ── 날짜 유틸 (로컬 시간 기준: UTC 변환 시 KST 오전 9시 이전 날짜 오류 방지) ───
function localDateStr(d) {
  return d.getFullYear()+'-'+
    ('0'+(d.getMonth()+1)).slice(-2)+'-'+
    ('0'+d.getDate()).slice(-2);
}
function todayStr()  { return localDateStr(new Date()); }
function yestStr()   { var d=new Date(); d.setDate(d.getDate()-1); return localDateStr(d); }
function monStr()    { var d=new Date(); d.setDate(d.getDate()-((d.getDay()+6)%7)); return localDateStr(d); }
function mo1stStr()  { return todayStr().slice(0,7)+'-01'; }

function getRange() {
  var t = todayStr();
  if (period==='all')       return {f:'', t:''};
  if (period==='today')     return {f:t,  t:t};
  if (period==='yesterday') return {f:yestStr(), t:yestStr()};
  if (period==='week')      return {f:monStr(),   t:t};
  if (period==='month')     return {f:mo1stStr(), t:t};
  if (period==='custom')    return {f:cfrom, t:cto};
  return {f:'', t:''};
}

function inRange(iso) {
  if (!iso) return false;
  var r = getRange();
  var ds = localDateStr(new Date(iso));   // UTC ISO → 로컬 날짜 문자열로 변환
  return (!r.f || ds >= r.f) && (!r.t || ds <= r.t);
}

function getFiltered() {
  var src = mode==='pc' ? PC : ALL;
  var lkw = kw.toLowerCase();
  var out = [];
  for (var i=0; i<src.length; i++) {
    var x = src[i];
    if (!inRange(x.accessTime)) continue;   // 기간 탭은 PC 전체 검색에도 적용 (초기 로딩 속도를 위한 의도된 동작)
    if (lkw && x.name.toLowerCase().indexOf(lkw) < 0) continue;
    out.push(x);
  }
  return out;
}

// ── 포맷 함수 ─────────────────────────────────────────────────────────────
function ftime(iso) {
  if (!iso) return '-';
  var d=new Date(iso), h=d.getHours(), m=('0'+d.getMinutes()).slice(-2);
  var h12 = h % 12 || 12;    // 0 → 12, 13 → 1, etc.
  return (h<12?'오전':'오후')+' '+h12+':'+m;
}
function fsize(b) {
  if (b==null || b===0) return '';
  b = Number(b)||0;
  if (b<1024)    return b+'B';
  if (b<1048576) return Math.round(b/1024)+'KB';
  return (b/1048576).toFixed(1)+'MB';
}
var WEEKDAY = ['일','월','화','수','목','금','토'];
// ds: 로컬 날짜 'YYYY-MM-DD' → 제목/부제
function fdate(ds) {
  var p = ds.split('-');
  if (p.length!==3) return {t:ds, s:'', c:''};
  var d = new Date(+p[0], +p[1]-1, +p[2]);
  var md = (+p[1])+'월 '+(+p[2])+'일';
  var wd = WEEKDAY[d.getDay()]+'요일';
  if (ds===todayStr()) return {t:'오늘',  s:md+' '+wd, c:'today'};
  if (ds===yestStr())  return {t:'어제',  s:md+' '+wd, c:''};
  return {t:md, s:wd+(+p[0]!==new Date().getFullYear()?' ('+p[0]+')':''), c:''};
}
function trunc(p,n) {
  n=n||64;
  if (!p) return '';
  var bs=String.fromCharCode(92); // 백슬래시: 리터럴 사용시 템플릿 이스케이프 오류 방지
  var s=p.split(bs);
  // 전체 길이가 n 이하면 그대로, 초과일 때만 중간 생략
  if (p.length<=n) return p;
  var shortened = s[0]+bs+'...'+bs+s.slice(-2).join(bs);
  // 줄인 후에도 n 초과 시 마지막 세그먼트만 유지
  return shortened.length<=n ? shortened : s[0]+bs+'...'+bs+s[s.length-1];
}
function esc(s)  { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escA(s) { return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;'); }
function hl(n,q) {
  if (!q) return esc(n);
  var i = n.toLowerCase().indexOf(q.toLowerCase());
  if (i<0) return esc(n);
  return esc(n.slice(0,i))+'<em>'+esc(n.slice(i,i+q.length))+'</em>'+esc(n.slice(i+q.length));
}

var ICON_CLS  = {'.xlsx':'ic-xls','.xls':'ic-xls','.docx':'ic-doc','.doc':'ic-doc',
                 '.pptx':'ic-ppt','.ppt':'ic-ppt','.hwp':'ic-hwp','.hwpx':'ic-hwp','.pdf':'ic-pdf'};
var ICON_TXT  = {'.xlsx':'XLS','.xls':'XLS','.docx':'DOC','.doc':'DOC',
                 '.pptx':'PPT','.ppt':'PPT','.hwp':'HWP','.hwpx':'HWP','.pdf':'PDF'};
var TITLES    = {today:'오늘', yesterday:'어제', week:'이번 주', month:'이번 달', custom:'기간 지정', all:'전체 기간'};

// ── 렌더링 ────────────────────────────────────────────────────────────────
function render() {
  var mainEl = getMain();
  if (!mainEl) return;

  var files = getFiltered();

  // 헤더 카운트
  var hdTotal = getEl('hdTotal');
  if (hdTotal) hdTotal.textContent = ALL.length ? '최근 '+ALL.length+'개 파일' : '';

  // 페이지 제목 영역
  var title, cnt, chips = '';
  if (mode==='pc') {
    title = 'PC 전체 검색';
    cnt   = '"'+esc(kw)+'" 결과 '+files.length+'건';
    chips = '<button class="btn sm" id="xPc">'+ico('x','sm')+'검색 종료</button>';
  } else if (kw) {
    title = esc(TITLES[period]);
    cnt   = '"'+esc(kw)+'" 포함 '+files.length+'건';
    chips = '<button class="btn sm" id="goPc">'+ico('search','sm')+'PC 전체 검색</button>'
          + '<button class="btn sm" id="xKw">'+ico('x','sm')+'필터 해제</button>';
  } else {
    var r = getRange();
    var desc = '';
    if (period!=='all' && r.f) desc = (r.f===r.t ? r.f : r.f+' ~ '+r.t).replace(/-/g,'.');
    title = esc(TITLES[period]);
    cnt   = files.length+'개 파일'+(desc && period!=='today' ? ' ('+desc+')' : '');
  }
  var sumHtml = '<div class="ph"><h1>'+title+'</h1><span class="cnt">'+cnt+'</span>'
    + (chips?'<div class="chips">'+chips+'</div>':'')+'</div>';

  // 조회 시작일이 누적 기록의 최초일보다 앞서면 "자료 없음"이 아니라 "기록 없음"임을 알린다
  if (mode!=='pc' && SINCE) {
    var rr = getRange(), sd = localDateStr(new Date(SINCE));
    if (rr.f && rr.f < sd) sumHtml += '<div class="cnt" style="margin:0 0 12px">ⓘ 이 PC의 접근 기록은 '+sd.replace(/-/g,'.')+'부터 있습니다. 그 이전 날짜는 조회되지 않습니다.</div>';
  }

  if (!files.length) {
    var st;
    if (ALL.length === 0 && mode!=='pc') {
      st = stateHtml('doc', '파일을 불러오지 못했습니다',
        'Recent 폴더에서 문서 파일을 찾지 못했습니다. 서버 재시작 후 다시 시도해 보세요.',
        BTN_RETRY+'<button class="btn" onclick="showDiag()">진단</button>');
    } else if (mode==='pc') {
      st = stateHtml('search', '검색 결과가 없습니다',
        'Windows 검색 색인에서 이 이름의 문서를 찾지 못했습니다. 다른 검색어로 시도해 보세요.');
    } else if (kw) {
      st = stateHtml('search', '일치하는 파일이 없습니다',
        '이 기간의 최근 파일에는 없습니다. PC 전체에서 찾아볼 수 있습니다.');
    } else if (period === 'today') {
      st = stateHtml('doc', '오늘 연 파일이 없습니다', '위 탭에서 <b>어제</b>나 <b>이번 주</b>를 선택해 보세요.');
    } else {
      st = stateHtml('doc', '선택한 기간에 파일이 없습니다', '');
    }
    mainEl.innerHTML = sumHtml + st;
    bindEvents(mainEl); return;
  }

  // 날짜별 그룹핑 (로컬 날짜 기준)
  var groups = {};
  for (var i=0; i<files.length; i++) {
    var fi = files[i];
    var ds = fi.accessTime ? localDateStr(new Date(fi.accessTime)) : '?';
    if (!groups[ds]) groups[ds] = [];
    groups[ds].push(fi);
  }
  var dates = Object.keys(groups).sort(function(a,b){ return b.localeCompare(a); });

  var body = sumHtml;
  for (var di=0; di<dates.length; di++) {
    var dsk = dates[di];
    var lbl = fdate(dsk);
    body += '<section class="dg"><div class="dg-date">'
      +'<div class="dg-d1 '+lbl.c+'">'+esc(lbl.t)+'</div>'
      +'<div class="dg-d2">'+esc(lbl.s)+'</div></div>'
      +'<div class="list">';

    var grp = groups[dsk];
    for (var gi=0; gi<grp.length; gi++) {
      var f  = grp[gi];
      var ic = ICON_CLS[f.ext]||'ic-hwp';
      var it = ICON_TXT[f.ext]||(f.ext||'?').replace('.','').slice(0,3).toUpperCase();
      body += '<div class="row" tabindex="0" data-path="'+escA(f.fullPath)+'" title="'+escA(f.label||'')+'">'
        +'<div class="ficon '+ic+'">'+esc(it)+'</div>'
        +'<div class="rmain"><div class="fname">'+hl(f.name,kw)+'</div>'
        +'<span class="fpath" data-folder="'+escA(f.folder)+'" title="'+escA(f.folder)+'">'
        +ico('folder','sm')+'<span>'+esc(f.folder)+'</span></span></div>'
        +'<div class="rmeta"><span class="t">'+ftime(f.accessTime)+'</span>'
        +'<span class="s">'+fsize(f.size)+'</span></div>'
        +'<div class="ract">'
        +'<button class="act-btn" data-path="'+escA(f.fullPath)+'" title="파일 열기" aria-label="파일 열기">'+ico('open','sm')+'</button>'
        +'<button class="act-btn" data-folder="'+escA(f.folder)+'" title="폴더 열기" aria-label="폴더 열기">'+ico('folder','sm')+'</button>'
        +'</div></div>';
    }
    body += '</div></section>';
  }
  mainEl.innerHTML = body;
  bindEvents(mainEl);
}

// mainEl 을 명시적으로 받아 스코프 문제 완전 제거
function bindEvents(mainEl) {
  if (!mainEl) return;
  mainEl.querySelectorAll('.row').forEach(function(el) {
    el.addEventListener('click', function(){ openFile(el.getAttribute('data-path')); });
    el.addEventListener('keydown', function(ev){
      if (ev.key==='Enter' && ev.target===el) openFile(el.getAttribute('data-path'));
    });
  });
  mainEl.querySelectorAll('.act-btn[data-path]').forEach(function(el) {
    el.addEventListener('click', function(ev){ ev.stopPropagation(); openFile(el.getAttribute('data-path')); });
  });
  mainEl.querySelectorAll('.fpath, .act-btn[data-folder]').forEach(function(el) {
    el.addEventListener('click', function(ev){ ev.stopPropagation(); openFile(el.getAttribute('data-folder'),'folder'); });
  });
  var xKw = getEl('xKw');
  var xPc = getEl('xPc');
  var goPc = getEl('goPc');
  if (xKw) xKw.addEventListener('click', function(){
    kw=''; getEl('sInput').value=''; getEl('sClear').classList.remove('show'); safeRender();
  });
  if (xPc) xPc.addEventListener('click', clearPc);
  if (goPc) goPc.addEventListener('click', doPcSearch);
}

// render() 오류 시 무한 로딩 방지
function safeRender() {
  try {
    render();
  } catch(err) {
    var mainEl = getMain();
    if (mainEl) {
      mainEl.innerHTML = '<div class="err-box">'
        +'<strong>화면 표시 중 오류가 발생했습니다.</strong><br>'
        +esc(String(err&&err.message||err))
        +'<br><button class="btn" onclick="location.reload()">새로고침</button></div>';
    }
  }
}

// ── API ───────────────────────────────────────────────────────────────────
function openFile(p, type) {
  fetch('/api/open', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({filePath:p, type:type||'file'})
  }).catch(function(){});
}

// ── 로딩 중단 ─────────────────────────────────────────────────────────────
function cancelLoad() {
  isLoading = false;   // 탭 클릭 즉시 동작하도록
  // fetch는 백그라운드 진행 → 완료 시 현재 탭으로 자동 렌더
  // 즉시 현재 period로 렌더 (데이터 있으면 표시, 없으면 안내)
  safeRender();
}

function skeletonHtml() {
  var rows = '';
  for (var i=0; i<5; i++) {
    rows += '<div class="skel-row"><div class="sk ico"></div>'
      +'<div><div class="sk w1"></div><div class="sk w2"></div></div><div class="sk"></div></div>';
  }
  return '<div class="loadbar"><span>파일 목록을 불러오는 중...</span>'
    +'<button class="btn sm" id="btnCancelLoad">로딩 중단</button></div>'
    +'<div class="list skel">'+rows+'</div>';
}

function loadAll() {
  if (isLoading) return;           // 중복 호출 방지
  isLoading = true;
  loadingCancelled = false;
  if (fetchAbort) { fetchAbort.abort(); }
  fetchAbort = (typeof AbortController !== 'undefined') ? new AbortController() : null;

  // 로딩 UI: 중단 버튼을 mainArea 안에 직접 배치 (CSS 레이아웃 의존 없음)
  var mainEl = getMain();
  if (mainEl) {
    mainEl.innerHTML = skeletonHtml();
    var cb = document.getElementById('btnCancelLoad');
    if (cb) cb.addEventListener('click', cancelLoad);
  }

  var opts = fetchAbort ? { signal: fetchAbort.signal } : {};

  // 10초 타임아웃: 서버 무응답 시 에러 메시지 표시
  var loadTimer = setTimeout(function() {
    if (!isLoading) return;
    isLoading = false;
    if (fetchAbort) { fetchAbort.abort(); fetchAbort = null; }
    var el = getMain();
    if (el) el.innerHTML = stateHtml('alert', '서버 응답이 없습니다',
      '10초 안에 응답이 없었습니다. 실행.bat 또는 FileTimeline.exe가 켜져 있는지 확인해 주세요.',
      BTN_RETRY, true);
  }, 10000);

  fetch('/api/recent', opts)
    .then(function(r){ return r.json(); })
    .then(function(d){
      clearTimeout(loadTimer);
      isLoading = false;
      fetchAbort = null;
      ALL = d.files || [];
      SINCE = d.since || '';
      safeRender();
    })
    .catch(function(e){
      clearTimeout(loadTimer);
      isLoading = false;
      fetchAbort = null;
      if (e && e.name === 'AbortError') { safeRender(); return; }
      // 네트워크/파싱 에러 표시
      var el = getMain();
      if (el) el.innerHTML = stateHtml('alert', '불러오기에 실패했습니다',
        esc(e.message||'알 수 없는 오류')+'<br>서버가 실행 중인지 확인해 주세요.', BTN_RETRY, true);
      ALL = [];
    });
}

function doRefresh() {
  loadingCancelled = false;
  if (fetchAbort) { fetchAbort.abort(); fetchAbort = null; }
  var btn = getEl('btnRefresh');
  if (btn) { btn.classList.add('spinning'); btn.disabled = true; }
  fetch('/api/refresh',{method:'POST'})
    .then(function(){ return fetch('/api/recent'); })
    .then(function(r){ return r.json(); })
    .then(function(d){
      ALL = d.files || [];
      SINCE = d.since || '';
      if (btn) { btn.classList.remove('spinning'); btn.disabled = false; }
      safeRender();
      showToast('새로고침 완료: '+ALL.length+'개 파일');
    })
    .catch(function(){
      if (btn) { btn.classList.remove('spinning'); btn.disabled = false; }
      safeRender();
      showToast('새로고침 실패 (서버 확인 필요)');
    });
}

function doPcSearch() {
  var q = (getEl('sInput').value||'').trim();
  if (!q) { getEl('sInput').focus(); showToast('검색어를 먼저 입력해 주세요'); return; }
  kw = q; mode = 'pc'; PC = [];
  var mainEl = getMain();
  if (mainEl) mainEl.innerHTML = '<div class="pc-prog">'
    +'<div class="spinner"></div>'
    +'<span>PC 전체 검색 중: <strong>'+esc(q)+'</strong></span></div>';
  fetch('/api/search?q='+encodeURIComponent(q))
    .then(function(r){ return r.json(); })
    .then(function(d){ PC = d.files || []; safeRender(); })
    .catch(function(){ PC = []; safeRender(); });
}

function clearPc() {
  mode='recent'; PC=[]; kw='';
  var si=getEl('sInput'), sc=getEl('sClear');
  if (si) si.value='';
  if (sc) sc.classList.remove('show');
  safeRender();
}

// ── 이벤트 바인딩 ────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(function(b){ b.classList.remove('on'); });
    btn.classList.add('on');
    period = btn.getAttribute('data-p');
    // 프리셋 탭을 고르면 직접 지정한 날짜는 비운다
    cfrom=''; cto=''; getEl('dFrom').value=''; getEl('dTo').value='';
    if (isLoading) {
      // 로딩 중: 스피너 유지 (fetch 완료 시 이 period로 자동 렌더)
      // 중단 버튼은 mainArea 안에 이미 있으므로 그대로 유지
    } else {
      if (ALL.length === 0) { loadAll(); } else { safeRender(); }
    }
  });
});

// 기간 지정: 시작일/종료일 입력칸은 항상 표시. 적용하면 탭 선택을 해제한다
function applyRange(strict) {
  cfrom = getEl('dFrom').value;
  cto   = getEl('dTo').value;
  if (!cfrom||!cto) { if (strict) alert('시작일과 종료일을 모두 선택해 주세요.'); return; }
  if (cfrom>cto)    { if (strict) alert('시작일이 종료일보다 늦을 수 없습니다.'); return; }
  period = 'custom';
  document.querySelectorAll('.tab').forEach(function(b){ b.classList.remove('on'); });
  if (!isLoading) safeRender();
}
getEl('btnApply').addEventListener('click', function(){ applyRange(true); });
getEl('dFrom').addEventListener('change', function(){ applyRange(false); });
getEl('dTo').addEventListener('change',   function(){ applyRange(false); });

var sInput = getEl('sInput');
var sClear = getEl('sClear');
sInput.addEventListener('input', function() {
  sClear.classList.toggle('show', sInput.value.length>0);
  if (mode!=='pc') { kw=sInput.value.trim(); safeRender(); }
});
sInput.addEventListener('keydown', function(ev) {
  if (ev.key==='Enter') {
    var q=sInput.value.trim();
    if (q) { if(mode==='pc') doPcSearch(); else { kw=q; safeRender(); } }
  }
  if (ev.key==='Escape') {
    if (mode==='pc') clearPc();
    else { kw=''; sInput.value=''; sClear.classList.remove('show'); safeRender(); }
  }
});
sClear.addEventListener('click', function() {
  if (mode==='pc') clearPc();
  else { kw=''; sInput.value=''; sClear.classList.remove('show'); safeRender(); }
  sInput.focus();
});
// "/" 키로 검색창 포커스
document.addEventListener('keydown', function(ev) {
  var tg = ev.target && ev.target.tagName;
  if (ev.key==='/' && tg!=='INPUT' && tg!=='TEXTAREA') { ev.preventDefault(); sInput.focus(); }
});
getEl('btnPcSearch').addEventListener('click', doPcSearch);
getEl('btnRefresh').addEventListener('click', doRefresh);

// ── 시작 ──────────────────────────────────────────────────────────────────
loadAll();
</script>
</body>
</html>`;
