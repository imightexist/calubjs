@prompt $G
::@echo 64 bit only
@pushd %~dp0%
@echo if you didn't download this, make sure to run to close and run the updater before installing
@pause
@echo.
@echo creating folders
md auth
md assets
md assets\indexes
md assets\objects
md data
md json
md versions
if not exist auth\username.txt echo notch > auth\username.txt
if not exist auth\uuid.txt echo notch > auth\uuid.txt
if not exist auth\token.txt echo notch > auth\token.txt
if not exist auth\expire.txt echo 0 > auth\expire.txt
if not exist auth\expired.txt echo true > auth\expired.txt
:: @echo.
:: @echo downloading calubcraft
:: del "! update.cmd" /q
:: aria2c "https://raw.githubusercontent.com/imightexist/calubjs/main/! update.cmd"
:: del "! download.cmd" /q
:: aria2c "https://raw.githubusercontent.com/imightexist/calubjs/main/! download.cmd"
:: del piss.js /q
:: aria2c "https://raw.githubusercontent.com/imightexist/calubjs/main/piss.js"
@echo.
@echo downloading nodejs
::del node-v22.5.1-win-x64.7z /q
::aria2c -x16 -m16 -s16 https://nodejs.org/download/release/v22.5.1/node-v22.5.1-win-x64.7z
del node-v15.8.0-win-x64.7z /q
aria2c -x16 -m16 -s16 https://nodejs.org/dist/v15.8.0/node-v15.8.0-win-x64.7z
@echo.
@echo extracting nodejs
7z x -aoa node-v15.8.0-win-x64.7z
del /q node-v15.8.0-win-x64.7z
@echo.
::@echo installing packages
::del package.json /q
::aria2c https://raw.githubusercontent.com/imightexist/calubjs/main/package.json
::cmd /c "node\npm" i prompt
::cmd /c "node\npm" i node-wget
::@echo.
@echo run collabvm.cmd as admin if you are running this on collabvm before continuing
@pause
set NODE_SKIP_PLATFORM_CHECK=1
cmd /c "node-v15.8.0-win-x64\npm" config set strict-ssl false
cmd /c "node-v15.8.0-win-x64\npm" i
:: @echo wowza you arent a normie running this on a 32 bit vm
::cmd /c "! username.cmd"
@prompt
cmd /c "! download.cmd"
