echo installing node.js packages
sudo apt install nodejs npm
npm config set strict-ssl false
npm i
echo installing mesa3d
sudo add-apt-repository ppa:kisak/kisak-mesa
sudo apt update
sudo apt upgrade
chmod +x download.sh
./download.sh
