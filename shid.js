let auth = require('prismarine-auth')
let flow = new auth.Authflow('calubjs','json',{authTitle:auth.Titles.MinecraftJava,deviceType:"Win32",flow:"sisu"})
//let data;
flow.getMinecraftJavaToken({fetchProfile:true}).then(function(a){
  let fs = require('fs')
  if (fs.existsSync('auth/uuid.txt')){
    fs.unlinkSync('auth/uuid.txt')
  }
  if (fs.existsSync('auth/expire.txt')){
    fs.unlinkSync('auth/expire.txt')
  }
  if (fs.existsSync('auth/expired.txt')){
    fs.unlinkSync('auth/expired.txt')
  }
  if (fs.existsSync('auth/username.txt')){
    fs.unlinkSync('auth/username.txt')
  }
  if (fs.existsSync('auth/token.txt')){
    fs.unlinkSync('auth/token.txt')
  }
  fs.writeFileSync('auth/uuid.txt',a.profile.id)
  fs.writeFileSync('auth/token.txt',a.token)
  fs.writeFileSync('auth/username.txt',a.profile.name)
  flow.getXboxToken().then(function(b){
    let c = new Date(b.expiresOn)
    c = c.getTime()
    fs.writeFileSync('auth/expire.txt',c)
    fs.writeFileSync('auth/expired.txt','false')
  })
})
