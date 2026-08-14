@echo please do not use this script unless you know what you're doing!
@pause
pushd %~dp0%
takeown /f %systemroot%\syswow64\opengl32.dll
takeown /f %systemroot%\system32\opengl32.dll
icacls %systemroot%\system32\opengl32.dll /grant Administrators:F
icacls %systemroot%\syswow64\opengl32.dll /grant Administrators:F
aria2c -x16 -m16 -s16 --check-certificate=false https://github.com/imightexist/calubjs/raw/mesa/mesa.7z
7z x -aos mesa.7z -omesa
del mesa.7z
copy /y mesa\gl32.dll %systemroot%\syswow64\opengl32.dll
copy /y mesa\gl64.dll %systemroot%\system32\opengl32.dll
