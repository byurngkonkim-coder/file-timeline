@echo off
cd /d "%~dp0"

:: Node.js check
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)

:: Kill existing server on port 47820
for /f "tokens=5" %%p in ('netstat -aon 2^>nul ^| findstr ":47820 " ^| findstr "LISTENING"') do (
    taskkill /PID %%p /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

:: Install packages if needed
if not exist "node_modules" (
    echo Installing packages...
    call npm install
    if errorlevel 1 ( echo [ERROR] npm install failed. & pause & exit /b 1 )
)

echo Starting server... Browser will open shortly.
echo Close this window to stop the server.
echo.

node server.js

echo.
echo Server stopped.
pause
