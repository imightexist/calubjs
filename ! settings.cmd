@prompt $G
set close=true
set /p close=<auth\close.txt
if /i %close% == false noclose
:exit
@echo.
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
echo        (9)  install optifine
echo    (10a/b)  install fabric/forge (not ready yet)
echo       (11)  change skin (offline mode, not ready yet)
echo    (12y/n)  enable close button
echo       (13)  exit
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
@if /i %a% == 6 goto 6
@if /i %a% == 7 goto 7
@if /i %a% == 8 "! update.cmd"
@if /i %a% == 9 goto 9
@if /i %a% == 12Y goto 12y
@if /i %a% == 12N goto 12n
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
set NODE_EXTRA_CA_CERTS=penis.crt
"node-v15.8.0-win-x64\node" shid.js
goto exit
:3d
set NODE_SKIP_PLATFORM_CHECK=1
set NODE_EXTRA_CA_CERTS=penis.crt
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
:6
del /q json/cache/*.*
goto exit
:7
@set /p b=username: 
::echo %b% > auth\offline.txt
echo %b% > auth\username.txt
echo  %b% > auth\uuid.txt
echo %b% > auth\token.txt
goto exit
:9
@set /p c=minecraft version (you must have it downloaded first): 
if exist versions\%c% goto 9b
@echo.
@echo download %c% first
goto exit
:9b
md optifine
md optifine\versions
echo {"profiles":{}} > optifine\launcher_profiles.json
md optifine\versions\%c%
copy json\%c%.json optifine\versions\%c%
copy versions\%c%\client.jar optifine\versions\%c%\%c%.jar
@rem start "" "https://google.com/search?q=optifine+%c%&btnI"
echo %cd%\optifine | clip
@echo.
@echo install to "%cd%\optifine" and wait a few secs before continuing
@pause
rd optifine\versions\%c% /s /q
dir optifine\versions /b > optifine\real.txt
set /p d=<optifine\real.txt
rd versions\%d% /s /q
md versions\%d%
md versions\%d%\natives
copy /y versions\%c%\*.* versions\%d%
copy /y versions\%c%\natives\*.* versions\%d%\natives
dir /b /s optifine\libraries\*.jar > optifine\nut.txt
setlocal enabledelayedexpansion
for /f %%i in (optifine\nut.txt) do copy /y %%i versions\%d%\^^!!random!.jar
endlocal
@rem rewrite launch.cmd
set NODE_SKIP_PLATFORM_CHECK=1
set NODE_EXTRA_CA_CERTS=penis.crt
"node-v15.8.0-win-x64\node" cum.js "%d%" "%c%"
rd optifine /s /q
goto exit
:12y
echo true > auth\close.txt
goto exit
:12n
echo false > auth\close.txt
goto exit
