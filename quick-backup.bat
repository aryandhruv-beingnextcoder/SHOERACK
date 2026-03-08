@echo off
echo ⚡ Creating quick SHOERACK backup...

powershell -Command "Compress-Archive -Path 'frontend\src','frontend\public','backend\*.js','backend\models','backend\routes','backend\middleware','package.json','README.md' -DestinationPath 'shoerack-quick.zip' -Force"

echo ✅ Quick backup created: shoerack-quick.zip
pause