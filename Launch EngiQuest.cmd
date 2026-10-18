@echo off
setlocal DisableDelayedExpansion
title EngiQuest Local Website
cd /d "%~dp0"
if errorlevel 1 goto directory_error

where node.exe >nul 2>nul
if not errorlevel 1 goto node_ready
if not exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" goto node_missing
set "PATH=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"

:node_ready
echo Starting EngiQuest from:
echo "%CD%"
echo Keep this window open while using EngiQuest. Press Ctrl+C to stop.
echo Checking Node.js, npm, and the saved dependency lockfile...
node.exe "%~dp0scripts\launch.mjs"
set "ENGIQUEST_EXIT=%ERRORLEVEL%"
if "%ENGIQUEST_EXIT%"=="0" goto stopped
echo.
echo EngiQuest could not start or stopped with an error.
echo Read the message above. The detailed log is:
echo "%~dp0logs\launch.log"
goto finish

:directory_error
echo Could not open the EngiQuest project folder.
echo Move or extract the complete project into a folder you can open, then try again.
set "ENGIQUEST_EXIT=1"
goto finish

:node_missing
echo Node.js is missing. Install Node.js 24 LTS from https://nodejs.org/
echo Choose the Windows Installer and keep the npm package manager option selected.
echo After installation, reopen this launcher.
set "ENGIQUEST_EXIT=1"
goto finish

:stopped
echo EngiQuest has stopped.

:finish
if "%ENGIQUEST_SKIP_PAUSE%"=="1" goto return
echo.
pause
:return
exit /b %ENGIQUEST_EXIT%
