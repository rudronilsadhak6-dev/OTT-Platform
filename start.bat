@echo off
title OTT-PLATFORM launcher
cd /d "%~dp0"

sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 echo WARNING: MongoDB is not running. Start the MongoDB Server service first, or the backend will stop.

start "OTT Backend - keep this open" /d "%~dp0server" cmd /k npm run dev
start "OTT Frontend - keep this open" /d "%~dp0client" cmd /k npm run dev

echo Starting the website. The browser opens in a few seconds...
echo To stop everything, close the two black windows.
timeout /t 8 /nobreak >nul
start "" http://localhost:5173
