@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ==================================================
echo   Publikaciya papki na GitHub
echo   Papka: %CD%
echo ==================================================
echo.

REM ----- Nayti Git -----
set "GIT="
where git >nul 2>nul && set "GIT=git"

if not defined GIT (
  for /d %%i in ("%LOCALAPPDATA%\GitHubDesktop\app-*") do (
    if exist "%%i\resources\app\git\cmd\git.exe" set "GIT=%%i\resources\app\git\cmd\git.exe"
  )
)

if not defined GIT (
  echo [OSHIBKA] Git ne nayden na kompyutere.
  echo Skachay i ustanovi "Git for Windows": https://git-scm.com/download/win
  echo Zatem zapusti etot fayl snova.
  echo.
  pause
  exit /b
)

echo Git OK: !GIT!
echo.

REM ----- Ssylka na repozitoriy -----
set "URL="
set /p URL=Vstav' ssylku na repozitoriy (knopka Code -^> HTTPS) i nazhmi Enter: 
if not defined URL (
  echo Ssylka ne vvedena. Vyhod.
  pause
  exit /b
)
echo.

REM ----- Init -----
if not exist ".git" "!GIT!" init

REM ----- Lichnost' (esli ne zadana) -----
"!GIT!" config user.name >nul 2>nul
if errorlevel 1 (
  "!GIT!" config user.name "Valera"
  "!GIT!" config user.email "valera@users.noreply.github.com"
)

REM ----- Commit -----
"!GIT!" add -A
"!GIT!" commit -m "Initial commit"
"!GIT!" branch -M main

REM ----- Remote -----
"!GIT!" remote remove origin >nul 2>nul
"!GIT!" remote add origin "!URL!"

REM ----- Push -----
echo.
echo Zalivayu fayly na GitHub...
"!GIT!" push -u origin main --force

echo.
echo ==================================================
echo   Gotovo. Otkroy svoy repozitoriy na GitHub i prover'.
echo   Esli poprosilo voyti - avtorizuysya cherez brauzer.
echo ==================================================
pause
