let auth = require('prismarine-auth')
let flow = new auth.Authflow('calubjs','json',{authTitle:auth.Titles.MinecraftJava,deviceType:"Win32",flow:"sisu"})
//let data;
flow.getMinecraftJavaToken({fetchProfile:true}).then(console.log)
