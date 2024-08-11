if test $(whoami) = "root"
then
    echo dont run it as root cuz nikitas is a little stoopid
    read -p "enter to quit"
    exit 1
fi
mkdir -p auth assets/indexes assets/objects data json versions
echo notch > auth/username.txt
echo notch > auth/uuid.txt
echo notch > auth/token.txt
echo 0 > auth/expire.txt
echo true > auth/expired.txt
pacman -Qq nodejs npm aria2 jdk21-openjdk mesa p7zip &> /dev/null
# im not sure it works
if [ $? -ne 0 ]; then
  if [ -f "/usr/bin/sudo" ]; then
    sudo pacman -Sy nodejs npm aria2 jdk21-openjdk mesa p7zip --needed --noconfirm &> /tmp/calub_deps
    if [ $? -ne 0 ]; then
      echo getting deps failed, check /tmp/calub_deps
      ping -c2 127.0.0.1 &> /dev/null
    fi
  else
    echo man where is your sudo? run  pacman -Sy nodejs npm aria2 jdk21-openjdk mesa p7zip  manually as root.
    read -p "enter to quit"
  fi
fi
npm config set strict-ssl false
npm i
chmod +x download.sh
