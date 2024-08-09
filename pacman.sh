echo installing node.js packages
pacman -Sy nodejs npm wget --needed --noconfirm > /dev/null
npm config set strict-ssl false
npm i
echo installing aria2c
pacman -Sy aria2 --needed --noconfirm > /dev/null
echo installing java
pacman -Sy openjdk-17-jdk openjdk-21-jdk openjdk-8-jre --needed --noconfirm > /dev/null
echo installing mesa3d
pacman -Sy mesa --needed --noconfirm > /dev/null
chmod +x download.sh
echo installing 7zip
pacman -Sy p7zip --needed --noconfirm > /dev/null
echo setting up dirs
mkdir assets
mkdir data
mkdir json
mkdir versions
./download.sh
