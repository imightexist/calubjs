echo installing node.js packages
pacman -Syu nodejs npm
npm config set strict-ssl false
npm i
echo installing mesa3d
pacman -Sy mesa
chmod +x download.sh
echo installing 7zip
pacman -Sy p7zip-full
echo setting up dirs
mkdir assets
mkdir data
mkdir json
mkdir versions
./download.sh
