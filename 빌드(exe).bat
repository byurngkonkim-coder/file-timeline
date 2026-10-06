@echo off
chcp 65001 > nul
title FileTimeline 빌드
cd /d "%~dp0"

echo =========================================
echo   FileTimeline.exe  빌드
echo =========================================
echo.

where node >nul 2>&1
if errorlevel 1 ( echo [오류] Node.js 없음. & pause & exit /b 1 )

echo [1/2] 패키지 설치...
call npm install
if errorlevel 1 ( echo 실패. & pause & exit /b 1 )

echo.
echo [2/2] exe 패키징 중... (2~3분 소요)
call npx pkg server.js --targets node18-win-x64 --output FileTimeline.exe
if errorlevel 1 ( echo 실패. & pause & exit /b 1 )

echo.
echo =========================================
echo   완료!  FileTimeline.exe  생성됨
echo =========================================
pause
