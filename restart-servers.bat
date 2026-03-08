@echo off
echo Stopping existing servers...

REM Kill processes on ports 3000 and 5001
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5001') do taskkill /f /pid %%a 2>nul

echo Waiting for ports to be released...
timeout /t 3 /nobreak >nul

echo Starting backend server...
cd backend
start "Backend Server" cmd /k "node server.js"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting frontend server...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"

echo Both servers are starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo Admin Panel: http://localhost:3000/admin

pause