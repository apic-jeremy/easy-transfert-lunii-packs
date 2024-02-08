@setlocal enableextensions enabledelayedexpansion
@echo off
set STUDIO_PATH=%~dp0
set DOT_STUDIO=%UserProfile%\.studio
set LOCAL_LUNIITHEQUE=%UserProfile%\AppData\Roaming\Luniitheque

:: Copy token
for /f "tokens=5 delims=:," %%a in ('type %LOCAL_LUNIITHEQUE%\.local.properties^|find "tokens"') do (
  set tok=%%a & goto :continue
)
:continue
set tok=%tok:~1%
set tokk=!tok:~0,-2!
SET URL=https://server-data-prod.lunii.com/v2/packs
curl %URL% -o %DOT_STUDIO%\db\official.json