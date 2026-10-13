@echo off
title OTT-PLATFORM - pack to share
cd /d "%~dp0"

echo Saving your movies and users from MongoDB...
pushd database
call node export-data.js
if errorlevel 1 (
  popd
  echo.
  echo Export failed. Start MongoDB first, then double-click pack.bat again.
  pause
  exit /b 1
)
popd

set "OUT=%USERPROFILE%\Desktop\OTT-PLATFORM-share"
echo.
echo Copying the project to %OUT% without node_modules...
robocopy "%~dp0." "%OUT%" /E /XD node_modules .git dist /NFL /NDL /NJH /NJS /NP >nul

echo.
echo ==========================================
echo  DONE
echo  Copy the folder OTT-PLATFORM-share from your Desktop
echo  to a pendrive or Google Drive and give it to your friend.
echo  On her computer she double-clicks setup.bat once.
echo ==========================================
pause
