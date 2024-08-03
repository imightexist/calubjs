@prompt $G
for %%I in (.) do set pwd=%%~nxI
cd..
"%pwd%\aria2c" -x16 -m16 -s16 https://github.com/imightexist/calubjs/archive/refs/heads/main.zip --out=calub-main.zip
rename %pwd% calub-main
"calub-main\7z" x -aoa calub-main.zip
cd calub-main
"! install.cmd"
