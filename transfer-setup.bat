@echo off
echo 🚀 SHOERACK Transfer Setup Script
echo.

echo 📦 Installing dependencies...
call npm run install-deps

echo.
echo 🌱 Seeding database...
call npm run seed

echo.
echo ✅ Setup complete! Starting application...
call npm start

pause