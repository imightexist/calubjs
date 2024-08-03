@prompt $G
::@echo 64 bit only
@pushd %~dp0%
@echo creating folders
md assets
md assets/indexes
md assets/objects
md data
md json
md versions
@echo.
@echo downloading calubcraft
::aria2c "https://raw.githubusercontent.com/imightexist/calubjs/main/! username.cmd"
del "! download.cmd" /q
aria2c "https://raw.githubusercontent.com/imightexist/calubjs/main/! download.cmd"
del piss.js /q
aria2c "https://raw.githubusercontent.com/imightexist/calubjs/main/piss.js"
@echo.
@echo downloading nodejs
aria2c -x16 -m16 -s16 https://nodejs.org/download/release/v22.5.1/node-v22.5.1-win-x64.7z
@echo.
@echo extracting nodejs
7z x node-v22.5.1-win-x64.7z -onode
del /q node-v21.5.0-win-x86.7z
@echo.
@echo installing packages
del package.json /q
aria2c https://raw.githubusercontent.com/imightexist/calubjs/main/package.json
::cmd /c "node\npm" i prompt
::cmd /c "node\npm" i node-wget
@echo.
@echo run collabvm.cmd as admin if you are running this on collabvm before continuing
@pause
cmd /c "node\npm" config set strict-ssl false
cmd /c "node\npm" i
:: @echo wowza you arent a normie running this on a 32 bit vm
::cmd /c "! username.cmd"
@prompt
cmd /c "! download.cmd"
