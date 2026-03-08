@echo off
echo 🚀 Starting SHOERACK Application...
echo.

echo 🧹 Cleaning up ports...
call cleanup-ports.bat
echo.

echo 📦 Installing dependencies...
call npm run install-deps
echo.

echo 🌱 Seeding database...
call npm run seed
echo.

echo 🎯 Starting servers...
call npm run dev