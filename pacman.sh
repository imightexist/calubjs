echo installing node.js packages
pacman -Sy nodejs npm wget --noconfirm
npm config set strict-ssl false
npm i
echo installing mesa3d
pacman -Sy mesa --noconfirm
chmod +x download.sh
echo installing 7zip
pacman -Sy p7zip --noconfirm
echo setting up dirs
mkdir assets
mkdir data
mkdir json
mkdir versions
./download.sh
