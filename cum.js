let fs = require('fs')
let b = process.argv[2]
let e = process.argv[3]
let a = fs.readFileSync('versions/'+b+'/! run.cmd').toString()
let c = JSON.parse(fs.readFileSync('optifine/versions/'+b+'/'+b+'.json'))
//let d = a.substring(a.lastIndexOf("\n"))
let f = JSON.parse(fs.readFileSync('json/'+e+'.json'))
//a = a.substring(0,a.lastIndexOf("\n"))
a = a.replaceAll(e,b)
if (Object.keys(c).includes("arguments")){
  if (Object.keys(c.arguments).includes("game")){
    c.arguments.game.forEach(function(g){
      a += " "+g
    })
  }
}
if (Object.keys(c).includes("mainClass")){
  a = a.replaceAll(f.mainClass,c.mainClass)
}

fs.unlinkSync('versions/'+b+'/! run.cmd')
fs.writeFileSync('versions/'+b+'/! run.cmd',a)
