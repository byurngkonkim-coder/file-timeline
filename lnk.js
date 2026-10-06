// MS-SHLLINK 스펙 기반 .lnk 바이너리 파서 — PowerShell/COM 의존 없음
'use strict';

const fs    = require('fs');
const iconv = require('iconv-lite');

/**
 * .lnk 파일에서 대상 경로를 추출한다.
 * @param {string} lnkPath  .lnk 파일의 절대 경로
 * @returns {string|null}   대상 경로 문자열 또는 null
 */
function parseLnkTarget(lnkPath) {
  try {
    const buf = fs.readFileSync(lnkPath);

    // 헤더 검증: 첫 4바이트가 0x4C (76) 이어야 함
    if (buf.length < 76 || buf.readUInt32LE(0) !== 0x4C) return null;

    const linkFlags   = buf.readUInt32LE(20);
    const hasIDList   = (linkFlags & 0x01) !== 0;
    const hasLinkInfo = (linkFlags & 0x02) !== 0;

    // IDList 블록 건너뜀
    let offset = 76;
    if (hasIDList) {
      const idListSize = buf.readUInt16LE(offset);
      offset += 2 + idListSize;
    }

    if (!hasLinkInfo || offset + 28 > buf.length) return null;

    const liStart  = offset;
    const liHdrSz  = buf.readUInt32LE(offset + 4);
    const liFlags  = buf.readUInt32LE(offset + 8);

    // VolumeIDAndLocalBasePath 플래그가 없으면 로컬 경로 없음
    if (!(liFlags & 0x01)) return null;

    // ① Unicode 경로 우선 (LinkInfoHeaderSize >= 36)
    if (liHdrSz >= 36 && offset + 32 < buf.length) {
      const uOff = buf.readUInt32LE(offset + 28);
      if (uOff > 0 && liStart + uOff < buf.length) {
        let s = liStart + uOff;
        let e = s;
        while (e + 1 < buf.length && !(buf[e] === 0 && buf[e + 1] === 0)) e += 2;
        const t = buf.slice(s, e).toString('utf16le');
        if (t) return t;
      }
    }

    // ② ANSI 경로 → CP949 디코딩 (한국어 Windows 표준 코드페이지)
    const aOff = buf.readUInt32LE(offset + 16);
    if (aOff > 0 && liStart + aOff < buf.length) {
      let s = liStart + aOff;
      let e = s;
      while (e < buf.length && buf[e] !== 0) e++;
      return iconv.decode(buf.slice(s, e), 'cp949');
    }

    return null;
  } catch {
    return null;
  }
}

module.exports = { parseLnkTarget };
