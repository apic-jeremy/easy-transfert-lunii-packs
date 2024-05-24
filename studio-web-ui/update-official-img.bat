@REM @setlocal enableextensions enabledelayedexpansion
@REM @echo off
@REM set STUDIO_PATH=%~dp0
@REM set DOT_STUDIO=%UserProfile%\.studio
@REM set LOCAL_LUNIITHEQUE=%UserProfile%\AppData\Roaming\Luniitheque

@REM :: Copy token
@REM for /f "tokens=5 delims=:," %%a in ('type %LOCAL_LUNIITHEQUE%\.local.properties^|find "tokens"') do (
@REM   set tok=%%a & goto :continue
@REM )
@REM :continue
@REM set tok=%tok:~1%
@REM set tokk=!tok:~0,-2!
@REM SET URL=https://lunii-data-prod.firebaseio.com/packs.json?auth=%tokk%
@REM curl %URL% -o %DOT_STUDIO%\db\official.json