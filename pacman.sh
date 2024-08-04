echo installing node.js packages
pacman -Sy nodejs npm wget --noconfirm > /dev/null
npm config set strict-ssl false
npm i
echo installing mesa3d
pacman -Sy mesa --noconfirm > /dev/null
chmod +x download.sh
echo installing 7zip
pacman -Sy p7zip --noconfirm > /dev/null
echo setting up dirs
mkdir assets
mkdir data
mkdir json
mkdir versions
./download.sh
