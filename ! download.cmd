@prompt $G
set close=true
set /p close=<auth\close.txt
if /i %close% == false noclose
if exist node-v15.8.0-win-x64 goto download
::@echo 64 bit only
@pushd %~dp0%
@echo.
@echo if you didn't just download this from github, make sure to run to close and run the updater before installing
@pause
@echo.
@echo creating folders
md auth
md assets
md assets\indexes
md assets\objects
md data
md json
md json\cache
md versions
if not exist auth\username.txt echo notch > auth\username.txt
if not exist auth\uuid.txt echo  notch > auth\uuid.txt
if not exist auth\token.txt echo notch > auth\token.txt
if not exist auth\expire.txt echo 0 > auth\expire.txt
if not exist auth\expired.txt echo true > auth\expired.txt
if not exist auth\sounds.txt echo false > auth\sounds.txt
if not exist auth\demo.txt echo  --demo > auth\demo.txt
if not exist auth\close.txt echo true > auth\close.txt
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
@echo if your pc has no gpu, run collabvm.cmd as admin BEFORE CONTINUING. if you're on COLLABVM with a gpu, run collabvm.cmd WITHOUT ADMIN
@pause
set NODE_SKIP_PLATFORM_CHECK=1
set NODE_EXTRA_CA_CERTS=penis.crt
cmd /c "node-v15.8.0-win-x64\npm" config set strict-ssl false
cmd /c "node-v15.8.0-win-x64\npm" i
:: @echo wowza you arent a normie running this on a 32 bit vm
::cmd /c "! username.cmd"
:download
set NODE_SKIP_PLATFORM_CHECK=1
set NODE_EXTRA_CA_CERTS=penis.crt
"node-v15.8.0-win-x64\node" piss.js
pause
@prompt
