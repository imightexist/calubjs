echo installing node.js packages
sudo apt install nodejs npm -y > /dev/null
npm config set strict-ssl false
npm i
echo installing mesa3d
sudo add-apt-repository ppa:kisak/kisak-mesa > /dev/null
sudo apt update > /dev/null
# sudo apt upgrade
echo installing 7zip
sudo apt install p7zip-full -y > /dev/null
echo setting up dirs
mkdir assets
mkdir data
mkdir json
mkdir versions
chmod +x download.sh
./download.sh
