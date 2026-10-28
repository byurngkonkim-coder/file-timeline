// 점프리스트(AutomaticDestinations) 파서: OLE(CFB) 컨테이너 → DestList 스트림 → {경로, 마지막 접근 시각}
// Recent 폴더 바로가기는 ~150개에서 잘리지만 점프리스트에는 앱별로 더 오래된 이력이 남아 있다.
'use strict';

const fs   = require('fs');
const path = require('path');

const ENDOFCHAIN = 0xFFFFFFFE;
const FREESECT   = 0xFFFFFFFF;

function readCfbStream(buf, wantedName) {
  if (buf.length < 512 || buf.readUInt32LE(0) !== 0xE011CFD0) return null;
  const secSize   = 1 << buf.readUInt16LE(0x1E);
  const miniSize  = 1 << buf.readUInt16LE(0x20);
  const cutoff    = buf.readUInt32LE(0x38);
  const secOff    = function(s) { return (s + 1) * secSize; };

  // FAT: 헤더 DIFAT(109칸) + 추가 DIFAT 체인
  const fatSecs = [];
  for (let i = 0; i < 109; i++) {
    const s = buf.readUInt32LE(0x4C + i * 4);
    if (s !== FREESECT) fatSecs.push(s);
  }
  let difat = buf.readUInt32LE(0x44);
  for (let n = buf.readUInt32LE(0x48); n > 0 && difat !== ENDOFCHAIN && difat !== FREESECT; n--) {
    const base = secOff(difat), per = secSize / 4 - 1;
    for (let i = 0; i < per; i++) {
      const s = buf.readUInt32LE(base + i * 4);
      if (s !== FREESECT) fatSecs.push(s);
    }
    difat = buf.readUInt32LE(base + per * 4);
  }
  const fat = [];
  for (const fs_ of fatSecs) {
    const base = secOff(fs_);
    for (let i = 0; i < secSize / 4; i++) fat.push(buf.readUInt32LE(base + i * 4));
  }

  function chain(start, table) {
    const out = []; let s = start;
    while (s !== ENDOFCHAIN && s !== FREESECT && s < table.length && out.length < 1e6) { out.push(s); s = table[s]; }
    return out;
  }
  function readBig(start, size) {
    const parts = chain(start, fat).map(function(s) { return buf.slice(secOff(s), secOff(s) + secSize); });
    return Buffer.concat(parts).slice(0, size);
  }

  // 디렉터리 엔트리(128바이트)
  const dir = readBig(buf.readUInt32LE(0x30), 1 << 30);
  let root = null, target = null;
  for (let o = 0; o + 128 <= dir.length; o += 128) {
    const nlen = dir.readUInt16LE(o + 64);
    if (nlen < 2) continue;
    const name = dir.slice(o, o + nlen - 2).toString('utf16le');
    const type = dir[o + 66];
    const ent  = { start: dir.readUInt32LE(o + 116), size: dir.readUInt32LE(o + 120) };
    if (type === 5) root = ent;
    if (type === 2 && name === wantedName) target = ent;
  }
  if (!target) return null;
  if (target.size >= cutoff) return readBig(target.start, target.size);

  // 작은 스트림: MiniFAT + 루트의 미니 스트림
  const miniFat = [];
  const mf = readBig(buf.readUInt32LE(0x3C), buf.readUInt32LE(0x40) * secSize);
  for (let i = 0; i + 4 <= mf.length; i += 4) miniFat.push(mf.readUInt32LE(i));
  const miniStream = readBig(root.start, root.size);
  const parts = chain(target.start, miniFat).map(function(s) { return miniStream.slice(s * miniSize, (s + 1) * miniSize); });
  return Buffer.concat(parts).slice(0, target.size);
}

function filetimeToIso(lo, hi) {
  const ms = (hi * 4294967296 + lo) / 10000 - 11644473600000;   // 1601-01-01 → 1970-01-01
  if (!(ms > 0) || ms > 4102444800000) return null;               // 2100년 이후·0은 무효
  return new Date(ms).toISOString();
}

// DestList: 헤더 32바이트 + 엔트리. 버전 1은 경로 길이 오프셋 112, 3 이상은 128
function parseDestList(d) {
  const out = [];
  if (!d || d.length < 32) return out;
  const ver = d.readUInt32LE(0);
  const lenOff = ver >= 3 ? 128 : 112;
  let o = 32;
  while (o + lenOff + 2 <= d.length) {
    const plen = d.readUInt16LE(o + lenOff);
    const end  = o + lenOff + 2 + plen * 2;
    if (plen === 0 || end > d.length) break;
    const p = d.slice(o + lenOff + 2, end).toString('utf16le');
    const t = filetimeToIso(d.readUInt32LE(o + 100), d.readUInt32LE(o + 104));
    if (p && t) out.push({ fullPath: p, accessTime: t });
    o = end + (ver >= 3 ? 4 : 0);
  }
  return out;
}

function readJumpLists(dir) {
  const out = [];
  let files = [];
  try { files = fs.readdirSync(dir).filter(function(f) { return f.toLowerCase().endsWith('.automaticdestinations-ms'); }); } catch (e) { return out; }
  for (const f of files) {
    try {
      const d = readCfbStream(fs.readFileSync(path.join(dir, f)), 'DestList');
      for (const e of parseDestList(d)) out.push(e);
    } catch (e) { /* 손상 파일은 건너뜀 */ }
  }
  return out;
}

module.exports = { readJumpLists, readCfbStream, parseDestList };
