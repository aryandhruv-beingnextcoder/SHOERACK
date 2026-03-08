@echo off
echo 📦 Creating SHOERACK backup (excluding node_modules)...

powershell -Command "Get-ChildItem -Path . -Recurse | Where-Object { $_.FullName -notlike '*node_modules*' -and $_.FullName -notlike '*.git*' } | Compress-Archive -DestinationPath 'shoerack-backup.zip' -Force"

echo ✅ Backup created: shoerack-backup.zip
pause