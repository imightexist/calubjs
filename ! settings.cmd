:exit
@echo off
@prompt
echo     (1y/n)  demo mode
echo     (2y/n)  downloading sounds
echo     (3/3d)  sign in to minecraft (d to delete cache)
echo        (4)  log off minecraft
echo     (5v/i)  download vanilla/indev (not ready yet)
echo     (6y/n)  make a redistributable install (not ready yet)
echo        (7)  http proxy (not ready yet)
echo        (8)  delete cache
echo        (9)  change username (offline mode)
echo       (10)  check for updates (not ready yet)
echo    (11o/f)  install optifine/fabric (not ready yet)
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
