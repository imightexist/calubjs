echo installing node.js packages
pacman -Syu nodejs npm
npm config set strict-ssl false
npm i
echo installing mesa3d
pacman -Sy mesa
chmod +x download.sh
./download.sh
