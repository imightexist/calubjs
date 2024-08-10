let auth = require('prismarine-auth')
let flow = new auth.Authflow(String(Math.random()),'json',{authTitle:auth.Titles.MinecraftJava,device:"Win32",flow:"sisu"})
flow.getMinecraftJavaToken().then(console.log)
