@echo off
echo (1Y/N)  demo mode
echo (2Y/N)  downloading sounds
echo    (3)  sign in to minecraft
echo.
set /p a=whad u wanna do: 
echo.
if /i %a% == 1Y goto 1y
if /i %a% == 1N goto 1n
if /i %a% == 2Y goto 2y
if /i %a% == 2N goto 2n
if /i %a% == 3 goto 3
echo fake!!
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
:exit
echo.
pause
@echo on
