let auth = require('prismarine-auth')
let flow = new auth.Authflow(String(Math.random()),undefined,{authTitle:auth.Titles.MinecraftJava})
flow.getMinecraftJavaToken().then(console.log)
