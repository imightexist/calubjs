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
pacman -Sy nodejs npm aria2 jdk21-openjdk mesa p7zip --needed --noconfirm
npm config set strict-ssl false
npm i
chmod +x download.sh
