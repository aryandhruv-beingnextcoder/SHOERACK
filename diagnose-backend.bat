@echo off
echo SHOERACK Backend Diagnostics
echo ============================

echo.
echo 1. Checking if MongoDB is accessible...
curl -s http://localhost:5001/health

echo.
echo.
echo 2. Testing backend API root...
curl -s http://localhost:5001/

echo.
echo.
echo 3. Testing admin login...
curl -s -X POST http://localhost:5001/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@shoerack.com\",\"password\":\"admin123\"}"

echo.
echo.
echo 4. Checking ports in use...
netstat -ano | findstr ":3000\|:5001"

echo.
echo.
echo 5. Frontend environment configuration:
type frontend\.env

echo.
echo.
echo 6. Backend environment configuration:
type backend\.env

pause