@echo off
echo Cleaning up ports 3000 and 5001...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
    echo Killing process %%a on port 3000
    taskkill /PID %%a /F >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5001"') do (
    echo Killing process %%a on port 5001
    taskkill /PID %%a /F >nul 2>&1
)

echo Ports cleaned up!