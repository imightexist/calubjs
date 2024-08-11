pushd %~dp0%
set NODE_SKIP_PLATFORM_CHECK=1
aria2c http://router.collabnet.local/penis.crt
cmd /c "node-v15.8.0-win-x64\npm" config set cafile "%cd%\penis.crt"
takeown /f %systemroot%\syswow64\opengl32.dll
takeown /f %systemroot%\system32\opengl32.dll
icacls %systemroot%\system32\opengl32.dll /grant Administrators:F
icacls %systemroot%\syswow64\opengl32.dll /grant Administrators:F
aria2c -x16 -m16 -s16 https://github.com/imightexist/calubjs/raw/mesa/mesa.7z
7z x -aos mesa.7z -omesa
del mesa.7z
copy /y mesa\gl32.dll %systemroot%\syswow64\opengl32.dll
copy /y mesa\gl64.dll %systemroot%\system32\opengl32.dll
