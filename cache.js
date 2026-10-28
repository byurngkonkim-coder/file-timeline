// RECENT 폴더 스캔: PowerShell WScript.Shell 방식 (1차) + raw lnk 파서 (폴백)
// WScript.Shell.CreateShortcut 은 Windows 표준 COM — 한글/유니코드 경로 완전 지원
'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');
const { execSync } = require('child_process');

// ── 대상 확장자: 작업 문서 위주, 시스템/실행파일 제외 ──────────────────
const TARGET_EXTS = new Set([
  // Office / 한글
  '.xlsx', '.xls', '.xlsm', '.xlsb',
  '.docx', '.doc', '.docm',
  '.pptx', '.ppt', '.pptm',
  '.hwp', '.hwpx',
  '.odt', '.ods', '.odp',
  // PDF / 전자문서
  '.pdf',
  // 텍스트 / 코드 / 데이터
  '.txt', '.csv', '.tsv', '.json', '.xml',
  '.md', '.markdown', '.log',
  '.js', '.ts', '.jsx', '.tsx',
  '.py', '.java', '.cs', '.cpp', '.c', '.h',
  '.sql', '.html', '.htm', '.css',
  '.sh', '.ps1',
  // 이미지
  '.png', '.jpg', '.jpeg', '.gif', '.bmp',
  '.svg', '.webp', '.tif', '.tiff', '.heic',
  // 미디어
  '.mp4', '.avi', '.mov', '.wmv', '.mkv',
  '.mp3', '.wav', '.aac', '.m4a',
  // 압축
  '.zip', '.rar', '.7z', '.tar', '.gz',
  // 기타 작업 파일
  '.mdb', '.accdb', '.dwg', '.dxf',
  '.ai', '.psd', '.fig',
  '.iso', '.eml', '.msg',
]);

const EXT_LABEL = {
  '.xlsx':'Excel', '.xls':'Excel', '.xlsm':'Excel', '.xlsb':'Excel',
  '.docx':'Word',  '.doc':'Word',  '.docm':'Word',
  '.pptx':'PPT',   '.ppt':'PPT',   '.pptm':'PPT',
  '.hwp':'HWP',    '.hwpx':'HWP',
  '.odt':'Writer', '.ods':'Calc',  '.odp':'Impress',
  '.pdf':'PDF',
  '.txt':'텍스트', '.md':'Markdown', '.log':'로그',
  '.csv':'CSV', '.tsv':'TSV', '.json':'JSON', '.xml':'XML', '.sql':'SQL',
  '.js':'JS', '.ts':'TS', '.jsx':'JSX', '.tsx':'TSX',
  '.py':'Python', '.java':'Java', '.cs':'C#', '.cpp':'C++', '.c':'C', '.h':'C헤더',
  '.html':'HTML', '.htm':'HTML', '.css':'CSS', '.sh':'Shell', '.ps1':'PS',
  '.png':'PNG', '.jpg':'JPEG', '.jpeg':'JPEG', '.gif':'GIF',
  '.bmp':'BMP', '.svg':'SVG', '.webp':'WebP', '.tif':'TIFF', '.tiff':'TIFF', '.heic':'HEIC',
  '.mp4':'MP4', '.avi':'AVI', '.mov':'MOV', '.wmv':'WMV', '.mkv':'MKV',
  '.mp3':'MP3', '.wav':'WAV', '.aac':'AAC', '.m4a':'M4A',
  '.zip':'ZIP', '.rar':'RAR', '.7z':'7Z', '.tar':'TAR', '.gz':'GZ',
  '.mdb':'Access', '.accdb':'Access', '.dwg':'CAD', '.dxf':'CAD',
  '.ai':'Illustrator', '.psd':'Photoshop', '.fig':'Figma',
  '.iso':'ISO', '.eml':'Email', '.msg':'Email',
};

// ── 자동 접근 제외 규칙 (사용자가 직접 열지 않은 파일 걸러내기) ──────────
// ① 제외 폴더: 이 경로 아래 파일은 목록에서 뺀다 (대소문자 무시)
const EXCLUDE_FOLDERS = [
  'D:\\백업\\utility\\OKF_지식위키\\sources',
  'D:\\백업\\utility\\raw\\OKF_지식위키\\sources',
];
// ② 일괄 생성 제외: 같은 1분에 바로가기가 이 개수 이상 생기면 프로그램의 대량 접근으로 보고 뺀다
const BURST_MIN = 8;

const _exLower = EXCLUDE_FOLDERS.map(function(p) { return p.toLowerCase().replace(/[\\/]+$/, ''); });
function isExcluded(target) {
  const t = target.toLowerCase();
  return _exLower.some(function(p) { return t === p || t.startsWith(p + '\\'); });
}
let _minuteCount = {};
function minuteKey(iso) { return iso.slice(0, 16); }   // UTC 분 단위 키

const RECENT_DIR = path.join(
  os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Recent'
);

let _cache    = null;
let _building = false;
let _diagError = null;
let _diagInfo  = {};

// ── PowerShell 방식 (1차): WScript.Shell.CreateShortcut ────────────────
function buildWithPowerShell() {
  const ps1Content = [
    '[Console]::OutputEncoding = [System.Text.Encoding]::UTF8',
    '$OutputEncoding = [System.Text.Encoding]::UTF8',
    '$ErrorActionPreference = "SilentlyContinue"',
    '$sh = New-Object -ComObject WScript.Shell',
    '$recent = @([Environment]::GetFolderPath("Recent"), (Join-Path $env:APPDATA "Microsoft\\Office\\Recent"))',
    'Get-ChildItem $recent -Filter "*.lnk" | ForEach-Object {',
    '    try {',
    '        $target = $sh.CreateShortcut($_.FullName).TargetPath',
    '        if ($target -and $target.Trim() -ne "") {',
    '            Write-Output ("" + $_.LastWriteTime.ToString("o") + "|" + $target)',
    '        }',
    '    } catch {}',
    '}',
  ].join('\r\n');

  const ps1File = path.join(os.tmpdir(), 'ft_cache_build.ps1');
  // UTF-8 BOM 포함 저장 — PowerShell 5.1이 BOM 없으면 CP949로 읽음
  const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
  fs.writeFileSync(ps1File, Buffer.concat([bom, Buffer.from(ps1Content, 'utf8')]));

  const raw = execSync(
    `powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "${ps1File}"`,
    { encoding: 'utf8', timeout: 15000, windowsHide: true }
  );

  const results = [];
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const sep = trimmed.indexOf('|');
    if (sep < 0) continue;
    const accessTime = trimmed.slice(0, sep).trim();
    const target     = trimmed.slice(sep + 1).trim();
    if (!target) continue;
    if (target.startsWith('\\\\')) continue;     // UNC 제외
    if (target.includes('$Recycle.Bin')) continue;

    let ts;
    try { ts = new Date(accessTime).toISOString(); } catch { ts = new Date().toISOString(); }
    _minuteCount[minuteKey(ts)] = (_minuteCount[minuteKey(ts)] || 0) + 1;   // 확장자 필터 전에 집계

    const ext = path.extname(target).toLowerCase();
    if (!TARGET_EXTS.has(ext)) continue;

    results.push({
      name:       path.basename(target),
      ext,
      label:      EXT_LABEL[ext] || ext.slice(1).toUpperCase(),
      folder:     path.dirname(target),
      fullPath:   target,
      accessTime: ts,
      size:       null,
      source:     'powershell',
    });
  }
  return results;
}

// ── raw lnk 파서 폴백 (PowerShell 실패 시) ────────────────────────────
function buildWithLnkParser() {
  const { parseLnkTarget } = require('./lnk');
  const results = [];
  const lnkFiles = fs.readdirSync(RECENT_DIR)
    .filter(function(f) { return f.toLowerCase().endsWith('.lnk'); });

  for (var i = 0; i < lnkFiles.length; i++) {
    var lnkPath = path.join(RECENT_DIR, lnkFiles[i]);
    try {
      var lnkStat = fs.statSync(lnkPath);
      var target  = parseLnkTarget(lnkPath);
      if (!target) continue;
      if (target.startsWith('\\\\')) continue;
      if (target.includes('$Recycle.Bin')) continue;
      var mk = minuteKey(lnkStat.mtime.toISOString());
      _minuteCount[mk] = (_minuteCount[mk] || 0) + 1;
      var ext = path.extname(target).toLowerCase();
      if (!TARGET_EXTS.has(ext)) continue;
      results.push({
        name:       path.basename(target),
        ext,
        label:      EXT_LABEL[ext] || ext.slice(1).toUpperCase(),
        folder:     path.dirname(target),
        fullPath:   target,
        accessTime: lnkStat.mtime.toISOString(),
        size:       null,
        source:     'lnk-parser',
      });
    } catch(e) { _diagError = (_diagError||'') + '|lnk:' + e.message; }
  }
  return results;
}

// ── 점프리스트 수집 ──────────────────────────────────────────────────
function buildFromJumpLists() {
  const { readJumpLists } = require('./jumplist');
  const results = [];
  const seen = new Set();
  for (const e of readJumpLists(path.join(RECENT_DIR, 'AutomaticDestinations'))) {
    const target = e.fullPath;
    if (target.startsWith('\\\\')) continue;
    if (target.includes('$Recycle.Bin')) continue;
    const key = target.toLowerCase() + '|' + e.accessTime;
    if (seen.has(key)) continue;          // 앱 여러 개의 점프리스트에 같은 항목이 중복됨
    seen.add(key);
    _minuteCount[minuteKey(e.accessTime)] = (_minuteCount[minuteKey(e.accessTime)] || 0) + 1;
    const ext = path.extname(target).toLowerCase();
    if (!TARGET_EXTS.has(ext)) continue;
    results.push({
      name:       path.basename(target),
      ext,
      label:      EXT_LABEL[ext] || ext.slice(1).toUpperCase(),
      folder:     path.dirname(target),
      fullPath:   target,
      accessTime: e.accessTime,
      size:       null,
      source:     'jumplist',
    });
  }
  return results;
}

// ── 누적 기록 (data\history.json) ─────────────────────────────────────
// pkg 실행 시 __dirname 은 읽기 전용 스냅샷이므로 exe 옆에 저장한다
const HISTORY_FILE = path.join(process.pkg ? path.dirname(process.execPath) : __dirname, 'data', 'history.json');

function mergeHistory(fresh) {
  let old = [];
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      try { old = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')).files || []; }
      catch(e) {
        _diagError = (_diagError||'') + '|history:' + e.message;
        try { fs.renameSync(HISTORY_FILE, HISTORY_FILE + '.bak'); } catch {}
      }
    }
  } catch {}
  // 기존 제외 규칙 변경분도 반영해 다시 걸러낸다(일괄접근 규칙은 신규 수집분에만 적용됨)
  old = old.filter(function(r) { return r && r.fullPath && r.accessTime && !isExcluded(r.fullPath); });

  const map = new Map();
  for (const r of old.concat(fresh)) {
    const k = r.fullPath.toLowerCase();
    const cur = map.get(k);
    if (!cur || r.accessTime > cur.accessTime) map.set(k, r);
  }
  const merged = Array.from(map.values()).sort(function(a, b) {
    return a.accessTime < b.accessTime ? 1 : a.accessTime > b.accessTime ? -1 : 0;
  });

  try {
    fs.mkdirSync(path.dirname(HISTORY_FILE), { recursive: true });
    fs.writeFileSync(HISTORY_FILE, JSON.stringify({ files: merged }), 'utf8');
  } catch(e) { _diagError = (_diagError||'') + '|history-save:' + e.message; }
  return merged;
}

function build() {
  if (_building) return;
  _building = true;
  _diagError = null;
  _minuteCount = {};

  let results = [];
  let method  = 'none';

  // 1차: PowerShell (Windows에서 가장 신뢰성 높음)
  try {
    results = buildWithPowerShell();
    method  = 'powershell';
  } catch(e) {
    _diagError = 'ps1:' + e.message;
    // 2차: raw lnk 파서
    try {
      results = buildWithLnkParser();
      method  = 'lnk-parser';
    } catch(e2) {
      _diagError += '|lnk2:' + e2.message;
    }
  }

  // 점프리스트: Recent 바로가기가 잘려 나간 더 오래된 접근 이력
  try { results = results.concat(buildFromJumpLists()); }
  catch(e) { _diagError = (_diagError||'') + '|jl:' + e.message; }

  // 자동 접근 제외: 제외 폴더 + 같은 분 일괄 생성
  const before = results.length;
  results = results.filter(function(r) {
    return !isExcluded(r.fullPath) && (_minuteCount[minuteKey(r.accessTime)] || 0) < BURST_MIN;
  });
  const dropped = before - results.length;

  results.sort(function(a, b) {
    return new Date(b.accessTime) - new Date(a.accessTime);
  });

  // 중복 제거 (같은 fullPath) — 최신순 정렬 상태이므로 처음 만난 것이 마지막 접근
  const seen = new Set();
  results = results.filter(function(r) {
    const k = r.fullPath.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });

  // 이전 실행에서 쌓은 기록과 병합 — Windows가 바로가기를 지워도 남는다
  results = mergeHistory(results);

  _diagInfo = { method, count: results.length, dropped, recentDir: RECENT_DIR, since: results.length ? results[results.length - 1].accessTime : null };
  _cache    = results;
  _building = false;
}

function get() {
  if (_cache === null) build();
  return _cache || [];
}

function refresh() {
  _cache    = null;
  _building = false;
  build();
}

function diag() {
  let dirExists = false, lnkCount = 0;
  try { const ff = fs.readdirSync(RECENT_DIR); dirExists=true; lnkCount=ff.filter(f=>f.endsWith('.lnk')).length; } catch(e){}
  return {
    cacheCount: (_cache||[]).length,
    building:   _building,
    error:      _diagError,
    method:     _diagInfo.method,
    since:      _diagInfo.since,
    recentDir:  RECENT_DIR,
    dirExists,
    lnkCount,
  };
}

module.exports = { build, get, refresh, diag, EXT_LABEL, TARGET_EXTS };
