let fs = require('fs')
let a = fs.readFileSync("auth/expire.txt")
if (Number(a) < Date.now()){
  //expired
  if (fs.existsSync('auth/expired.txt')){
    fs.unlinkSync('auth/expired.txt')
  }
  fs.writeFileSync('auth/expired.txt','true')
}else{
  if (fs.existsSync('auth/expired.txt')){
    fs.unlinkSync('auth/expired.txt')
  }
  fs.writeFileSync('auth/expired.txt','false')
}
