@echo off
title OTT-PLATFORM - first-time setup
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed.
  echo Install it from https://nodejs.org - choose the LTS version - then double-click setup.bat again.
  pause
  exit /b 1
)

sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
  echo WARNING: MongoDB does not look like it is running on this computer.
  echo Install MongoDB Community Server with "Install as a Service" ticked.
  echo If you use MongoDB Atlas instead, you can ignore this warning.
  echo Press any key to continue...
  pause >nul
)

echo.
echo [1/4] Installing server packages. This can take a few minutes...
call npm install --prefix server
if errorlevel 1 goto failed

echo.
echo [2/4] Installing client packages...
call npm install --prefix client
if errorlevel 1 goto failed

echo.
echo [3/4] Installing database tools...
call npm install --prefix database
if errorlevel 1 goto failed

echo.
echo [4/4] Loading movies and users into MongoDB...
pushd database
call node import-data.js
call node seed.js
popd

echo.
echo ==========================================
echo  SETUP DONE
echo  Now double-click start.bat to run the website.
echo  Admin login: admin@ott.com / admin123
echo ==========================================
pause
exit /b 0

:failed
echo.
echo Something went wrong while installing packages.
echo Check your internet connection and double-click setup.bat again.
pause
exit /b 1
