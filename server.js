// 파일 타임라인 뷰어 v2.0 — 메인 서버
'use strict';

const express        = require('express');
const { exec, execFile } = require('child_process');
const http           = require('http');
const cache          = require('./cache');
const { searchFiles }= require('./search');
const html           = require('./html');

const app  = express();
const PORT = 47820;

app.use(express.json());

// ── 정적 페이지 ──────────────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.send(html);
});

// ── 최근 파일 목록 (메모리 캐시 즉시 반환) ──────────────────────────────────────────────────────────────────
app.get('/api/recent', (_req, res) => {
  const files = cache.get();
  res.json({ files, since: files.length ? files[files.length - 1].accessTime : null });
});

// ── 캐시 새로고침 (동기 빌드이므로 완료 즉시 응답) ────────────────────────────────────────────────────────────
app.post('/api/refresh', (_req, res) => {
  cache.refresh();
  res.json({ ok: true, count: cache.get().length });
});

// ── 진단 ──────────────────────────────────────────────────────────────────────────────────────
app.get('/api/debug', (_req, res) => {
  res.json(cache.diag());
});

app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json({ files: [] });
  searchFiles(q, (_err, files) => res.json({ files }));
});

// ── 파일 / 폴더 열기 (execFile로 인자 분리 → 커맨드 인젝션 방지) ────────────────────────────────────────────────
app.post('/api/open', (req, res) => {
  const { filePath, type } = req.body || {};
  if (!filePath || typeof filePath !== 'string')
    return res.status(400).json({ error: 'filePath required' });
  if (type === 'folder') {
    execFile('explorer.exe', [filePath], { shell: false });
  } else {
    execFile('cmd.exe', ['/c', 'start', '', filePath], { shell: false });
  }
  res.json({ ok: true });
});

// ── 서버 기동 ────────────────────────────────────────────────────────────────────────────────────
const server = http.createServer(app);

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    const url = 'http://127.0.0.1:' + PORT;
    console.log('[FileTimeline] 이미 실행 중 → 브라우저 열기: ' + url);
    exec('start "" "' + url + '"', { shell: 'cmd.exe' });
    setTimeout(() => process.exit(0), 600);
  } else {
    console.error('[FileTimeline] 서버 오류:', err.message);
    process.exit(1);
  }
});

// 서버 기동 전 캐시 선제 빌드 (동기) — 첫 요청 즉시 응답 가능
console.log('[FileTimeline] 파일 목록 수집 중...');
cache.build();
const diagInfo = cache.diag();
const errNote = diagInfo.error ? (', 에러: ' + diagInfo.error) : '';
console.log('[FileTimeline] 캐시: ' + diagInfo.cacheCount + '개 (방법: ' + (diagInfo.method || '?') + errNote + ')');

server.listen(PORT, '127.0.0.1', () => {
  const url = 'http://127.0.0.1:' + PORT;
  console.log('[FileTimeline] 시작: ' + url);
  exec('start "" "' + url + '"', { shell: 'cmd.exe' });
});
