let auth = require('prismarine-auth')
let flow = new auth.Authflow(String(Math.random()),undefined,{authTitle:auth.Titles.MinecraftJava,device:"Win32"})
flow.getMinecraftJavaToken().then(console.log)