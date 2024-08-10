mkdir auth
mkdir assets
mkdir assets/indexes
mkdir assets/objects
mkdir data
mkdir json
mkdir versions
echo notch > auth/username.txt
echo notch > auth/uuid.txt
echo notch > auth/token.txt
echo 0 > auth/expire.txt
echo true > auth/expired.txt
sudo add-apt-repository ppa:kisak/kisak-mesa
sudo apt update
sudo apt install nodejs npm openjdk-21-jdk p7zip-full aria2 -y
npm config set strict-ssl false
npm i
chmod +x download.sh
