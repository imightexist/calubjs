:exit
@echo off
@prompt
echo     (1y/n)  demo mode
echo     (2y/n)  downloading sounds
echo     (3/3d)  sign in to minecraft/refresh session (d to delete cache)
echo        (4)  log off minecraft
rem echo     (5v/i)  download vanilla/indev (not ready yet)
rem echo     (5y/n)  make a redistributable install (not ready yet)
echo        (5)  http proxy (not ready yet)
echo        (6)  delete cache
echo        (7)  change username (offline mode)
echo        (8)  check for updates
echo        (9)  install mods (eg optifine/forge/fabric)
rem echo    (12a/o)  install fabric/forge (not ready yet)
echo       (10)  exit
echo.
set /p a=whad u wanna do: 
echo.
@echo on
@prompt $G
@if /i %a% == 1Y goto 1y
@if /i %a% == 1N goto 1n
@if /i %a% == 2Y goto 2y
@if /i %a% == 2N goto 2n
@if /i %a% == 3 goto 3
@if /i %a% == 3d goto 3d
@if /i %a% == 4 goto 4
@if /i %a% == 8 goto 8
@if /i %a% == 9 goto 9
@if /i %a% == 10 "! update.cmd"
@if /i %a% == 11 goto 11
@if /i %a% == 13 exit
@echo fake!!
goto exit
:1y
echo  --demo > auth\demo.txt
goto exit
:1n
type nul > auth\demo.txt
goto exit
:2y
echo true > auth\sounds.txt
goto exit
:2n
echo false > auth\sounds.txt
goto exit
:3
set NODE_SKIP_PLATFORM_CHECK=1
"node-v15.8.0-win-x64\node" shid.js
goto exit
:3d
set NODE_SKIP_PLATFORM_CHECK=1
"node-v15.8.0-win-x64\node" shid.js
del /q json\cache\*.*
goto exit
:4
del /q json/cache/*.*
echo notch > auth\username.txt
echo  notch > auth\uuid.txt
echo notch > auth\token.txt
echo 0 > auth\expire.txt
echo true > auth\expired.txt
goto exit
:8
del /q json/cache/*.*
goto exit
:9
@set /p b=username: 
::echo %b% > auth\offline.txt
echo %b% > auth\username.txt
echo  %b% > auth\uuid.txt
echo %b% > auth\token.txt
goto exit
:11
@set /p c=minecraft version (you must have it downloaded first): 
if exist versions\%c% goto 11b
@echo.
@echo download %c% first
goto exit
:11b
md optifine
md optifine\versions
echo {"profiles":{}} > optifine\launcher_profiles.json
md optifine\versions\%c%
copy json\%c%.json optifine\versions\%c%
copy versions\%c%\client.jar optifine\versions\%c%\%c%.jar
rem start "" "https://google.com/search?q=optifine+%c%&btnI"
@echo.
@echo install da mod to "%cd%\optifine" before continuing
@pause
rd optifine\versions\%c% /q
dir optifine\versions /b > optifine\real.txt
set /p d=<optifine\real.txt
md versions\%d%
md versions\%d%\natives
copy /y versions\%c%\*.* versions\%d%
copy /y versions\%c%\natives\*.* versions\%d%\natives
dir /b /s optifine\libraries\*.jar > optifine\nut.txt
for /f %%i in (optifine\nut.txt) do copy /y %%i versions\%d%\!%random%.jar
rem rewrite launch.cmd
node cum.js %d%
rd optifine /q
goto exit
