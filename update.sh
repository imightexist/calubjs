p=$(basename $PWD)
cd ..
rm -f calubjs-linucks.zip
aria2c -x16 -m16 -s16 https://github.com/imightexist/calubjs/archive/refs/heads/linucks.zip --out=calubjs-linucks.zip
rename $p calubjs-linucks
7z x -aoa calubjs-linucks.zip
