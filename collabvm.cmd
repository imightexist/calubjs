pushd %~dp0%
echo make sure you are running install.cmd first
pause
aria2c http://router.collabnet.local/penis.crt
cmd /c "node\npm" config set cafile "%cd%\penis.crt"
takeown /f C:\windows\syswow64\opengl32.dll
takeown /f C:\windows\system32\opengl32.dll
icacls C:\windows\system32\opengl32.dll /grant Administrators:F
icacls C:\windows\syswow64\opengl32.dll /grant Administrators:F
aria2c -x16 -m16 -s16 https://github.com/imightexist/calubjs/raw/mesa/mesa.7z
7z x mesa.7z -omesa
del mesa.7z
copy /y mesa\gl32.dll C:\windows\syswow64\opengl32.dll
copy /y mesa\gl64.dll C:\windows\system32\opengl32.dll
