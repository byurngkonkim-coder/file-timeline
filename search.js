// Windows Search 인덱스(SYSTEMINDEX)를 통한 PC 전체 파일 검색
'use strict';

const { exec } = require('child_process');
const fs       = require('fs');
const path     = require('path');
const os       = require('os');
const { EXT_LABEL, TARGET_EXTS } = require('./cache');

const UTF8_BOM = Buffer.from([0xEF, 0xBB, 0xBF]);

// PowerShell 5.1은 BOM 없는 UTF-8을 CP949로 읽음 → BOM 포함 저장
function writePs1(filePath, content) {
  fs.writeFileSync(filePath, Buffer.concat([UTF8_BOM, Buffer.from(content, 'utf8')]));
}

/**
 * Windows Search 인덱스에서 파일명 LIKE 검색을 수행한다.
 * @param {string}   keyword  검색 키워드
 * @param {Function} callback (err, files[])
 */
function searchFiles(keyword, callback) {
  // SQL 이스케이프: 작은따옴표(SQL 문자열), LIKE 와일드카드(%, _, [) 처리
  const safe    = keyword.replace(/'/g, "''").replace(/[%_[]/g, '[$&]');
  const extCond = [...TARGET_EXTS].map(e => `System.FileExtension = '${e}'`).join(' OR ');
  const ps1File = path.join(os.tmpdir(), `ft_search_${Date.now()}_${process.pid}.ps1`);

  const ps1 = `
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'SilentlyContinue'
try {
  $con = New-Object -ComObject ADODB.Connection
  $con.Open("Provider=Search.CollatorDSO;Extended Properties='Application=Windows';")
  $rs  = New-Object -ComObject ADODB.Recordset
  $sql = "SELECT System.ItemPathDisplay, System.FileName, System.Size, System.DateModified " +
         "FROM SYSTEMINDEX " +
         "WHERE (${extCond}) AND System.FileName LIKE '%${safe}%' " +
         "ORDER BY System.DateModified DESC"
  $rs.Open($sql, $con)
  $out = @()
  while (-not $rs.EOF) {
    try {
      $fp   = $rs.Fields["System.ItemPathDisplay"].Value
      $name = $rs.Fields["System.FileName"].Value
      $sz   = $rs.Fields["System.Size"].Value
      $mod  = $rs.Fields["System.DateModified"].Value
      if ($fp -and $name -and -not ($fp -is [System.DBNull]) -and -not ($name -is [System.DBNull])) {
        $fpStr = [string]$fp
        if ($fpStr -and $fpStr -notlike '*$Recycle.Bin*') {
          $ext = [System.IO.Path]::GetExtension($fpStr).ToLower()
          $dt  = ''; try { $dt = ([DateTime]$mod).ToString('o') } catch {}
          $szN = $null; try { if ($sz -and -not ($sz -is [System.DBNull])) { $szN = [long]$sz } } catch {}
          $out += [PSCustomObject]@{
            name=[string]$name; ext=$ext; folder=[System.IO.Path]::GetDirectoryName($fpStr)
            fullPath=$fpStr; size=$szN; accessTime=$dt
          }
        }
      }
    } catch {}
    if ($out.Count -ge 500) { break }
    $rs.MoveNext()
  }
  $rs.Close(); $con.Close()
  if ($out.Count -eq 0) { Write-Output '[]' }
  else { Write-Output ($out | ConvertTo-Json -Compress) }
} catch { Write-Output '[]' }
`;

  writePs1(ps1File, ps1);

  exec(
    `powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "${ps1File}"`,
    { timeout: 20000, maxBuffer: 30 * 1024 * 1024, encoding: 'utf8' },
    (err, stdout) => {
      try { fs.unlinkSync(ps1File); } catch {}
      try {
        const raw = (stdout || '').replace(/^﻿/, '').trim();
        if (!raw || raw === 'null') return callback(null, []);
        let arr = JSON.parse(raw);
        if (!Array.isArray(arr)) arr = [arr];
        const files = arr.map(f => ({
          ...f,
          label: EXT_LABEL[f.ext] || (f.ext || '').slice(1).toUpperCase(),
        }));
        callback(null, files);
      } catch (e) {
        callback(null, []);
      }
    }
  );
}

module.exports = { searchFiles };
