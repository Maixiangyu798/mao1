@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo 未检测到 Node.js，请先安装 Node.js 18 或更高版本：
  echo https://nodejs.org/
  echo.
  pause
  exit /b 1
)

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Milliseconds 1200; Start-Process 'http://localhost:4173'"
set "NO_OPEN=1"
node server.mjs
pause
