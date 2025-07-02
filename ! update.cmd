@prompt $G
set close=false
set /p close=<auth\close.txt
if /i %close% == false noclose
for %%I in (.) do set pwd=%%~nxI
cd..
del /q calubjs-main.zip
"%pwd%\aria2c" -x16 -m16 -s16 https://github.com/imightexist/calubjs/archive/refs/heads/main.zip --out=calubjs-main.zip
echo rename %pwd% calubjs-main > f.cmd
echo "calubjs-main\7z" x -aoa calubjs-main.zip >> f.cmd
echo del /q calubjs-main.zip >> f.cmd
echo cd calubjs-main >> f.cmd
echo start "" "! install.cmd" >> f.cmd
echo @title you can close this window now >> f.cmd
echo start cmd /c del /q "..\f.cmd" >> f.cmd
start f.cmd
@prompt
