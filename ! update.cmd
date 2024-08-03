@prompt $G
for %%I in (.) do set pwd=%%~nxI
cd..
del /q calubjs-main.zip
"%pwd%\aria2c" -x16 -m16 -s16 https://github.com/imightexist/calubjs/archive/refs/heads/main.zip --out=calubjs-main.zip
rename %pwd% calubjs-main
"calubjs-main\7z" x -aoa calubjs-main.zip
cd calubjs-main
"! install.cmd"
