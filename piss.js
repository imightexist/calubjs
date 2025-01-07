let wget = require('node-wget')
let prompt = require('prompt')
let proc = require('child_process')
let fs = require('fs')
let versions;
let user;
let demo = fs.readFileSync('auth/demo.txt').toString();
let allAssets = JSON.parse(fs.readFileSync('auth/sounds.txt'));
let beta = require('./json/beta_manifest.json')
//let data = require('./data.json')
//let version;
function indev(a){
    if (Object.keys(beta.versions).includes(a)){
        return [beta.versions[a]]
    }
    return null;
}
if (demo.startsWith(" --demo")){
    console.log('demo mode is on! its turned on by default just in case mojan wants to go nintendo mode')
    console.log()
}
if (!allAssets){
    console.log('sounds will not be downloaded.. you can turn this on if you wanna')
    console.log()
}
wget({url:'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json',dest:'json/'}, function (e, res, body) {
    if (e) {
        console.log('mojang pissed himself')
        process.exit(1)
    } else {
        //console.log(body)
        versions = JSON.parse(body)
        //console.log(versions)qwerweqW
        console.log("Latest release: " + versions.latest.release)
        console.log("Latest snapshot: " + versions.latest.snapshot)
        prompt.start()
        prompt.get(['version'], function (e2, res2) {
            console.log();
            version = null;
            if (!(body.includes(res2.version))) {
                version = indev(res2.version)
                if (version==null){
                    console.log('fake!')
                    process.exit(1)
                }
            }
            let startTime = Date.now()
            if (version==null){
                version = versions.versions.filter(function (d) { return res2.version == d.id });
            }
            res2.version.replaceAll("%20"," ")
            wget({url:version[0].url,dest:'json/'}, function (e3, res3, body2) {
                if (e3) {
                    console.log('mojang pissed himself')
                    process.exit(1)
                } else {
                    shit = JSON.parse(body2)
                    if (!(fs.existsSync('versions/' + res2.version))) {
                        console.log("creating folder")
                        fs.mkdirSync('versions/' + res2.version)
                    } else {
                        console.log("deleting existing folder")
                        fs.rmdirSync('versions/' + res2.version, { force: true, recursive: true })
                    }
                    /*wget({
                        url: shit.downloads.client.url,
                        dest: 'versions/' + res2.version
                    })*/
                    console.log("downloading client.jar")
                    if (version[0].type=="indev"){
                        shit.downloads = {client:{url:"https://archive.org/download/Minecraft-JE-Indev/"+version[0].id+"/"+version[0].id+".jar"}}
                        shit.assetIndex = {"id": "pre-1.6", "sha1": "3d8e55480977e32acd9844e545177e69a52f594b", "size": 74091, "totalSize": 49505710, "url": "https://launchermeta.mojang.com/v1/packages/3d8e55480977e32acd9844e545177e69a52f594b/pre-1.6.json"}
                    }else if (version[0].type=="infdev"){
                        shit.downloads = {client:{url:"https://archive.org/download/Minecraft-JE-Infdev/"+version[0].id+"/"+version[0].id+".jar"}}
                        shit.assetIndex = {"id": "pre-1.6", "sha1": "3d8e55480977e32acd9844e545177e69a52f594b", "size": 74091, "totalSize": 49505710, "url": "https://launchermeta.mojang.com/v1/packages/3d8e55480977e32acd9844e545177e69a52f594b/pre-1.6.json"}
                    }else if (version[0].type=="alpha"){
                        shit.downloads = {client:{url:"https://archive.org/download/Minecraft-JE-Alpha/"+version[0].id+"/"+version[0].id+".jar"}}
                        shit.assetIndex = {"id": "pre-1.6", "sha1": "3d8e55480977e32acd9844e545177e69a52f594b", "size": 74091, "totalSize": 49505710, "url": "https://launchermeta.mojang.com/v1/packages/3d8e55480977e32acd9844e545177e69a52f594b/pre-1.6.json"}
                    }else if (version[0].type=="beta"){
                        shit.downloads = {client:{url:"https://archive.org/download/Minecraft-JE-Beta/"+version[0].id+"/"+version[0].id+".jar"}}
                        shit.assetIndex = {"id": "pre-1.6", "sha1": "3d8e55480977e32acd9844e545177e69a52f594b", "size": 74091, "totalSize": 49505710, "url": "https://launchermeta.mojang.com/v1/packages/3d8e55480977e32acd9844e545177e69a52f594b/pre-1.6.json"}
                    }else if (version[0].type=="prerelease"){
                        shit.downloads = {client:{url:"https://archive.org/download/Minecraft-JE-Beta/Prereleases/"+version[0].id+"/"+version[0].id+".jar"}}
                        shit.assetIndex = {"id": "pre-1.6", "sha1": "3d8e55480977e32acd9844e545177e69a52f594b", "size": 74091, "totalSize": 49505710, "url": "https://launchermeta.mojang.com/v1/packages/3d8e55480977e32acd9844e545177e69a52f594b/pre-1.6.json"}
                    }else if (version[0].type=="classic"){
                        shit.downloads = {client:{url:"https://archive.org/download/Minecraft-JE-Classic/"+version[0].id+"/"+version[0].id+".jar"}}
                        shit.assetIndex = {"id": "pre-1.6", "sha1": "3d8e55480977e32acd9844e545177e69a52f594b", "size": 74091, "totalSize": 49505710, "url": "https://launchermeta.mojang.com/v1/packages/3d8e55480977e32acd9844e545177e69a52f594b/pre-1.6.json"}
                    }
                    for (let i = 0; i < shit.libraries.length; i++){
                        if (!(Object.keys(shit.libraries[i]).includes("downloads"))){
                            f = "https://libraries.minecraft.net/"+shit.libraries[i].name.split(":")[0].replaceAll(".","/")+"/"+shit.libraries[i].name.substring(shit.libraries[i].name.indexOf(":")+1).replaceAll(":","-")+".jar"
                            shit.libraries[i].downloads = {artifact:{url:f}}
                        }
                    }
                    let clientDL = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.downloads.client.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                    clientDL.on('close', function (c2) {
                        let javaDL, javaZIP;
                        if (!(body2.includes("javaVersion"))){
                            shit.javaVersion = {majorVersion:8}
                        }
                        if (shit.javaVersion.majorVersion == 17 || shit.javaVersion.majorVersion == 16) {
                            //console.log('java 17 has no 32-bit')
                            //process.exit(1)
                            if (!(fs.existsSync("jdk-17.0.9"))) {
                                console.log("downloading JDK 17")
                                /*wget({
                                    url: 'https://download.oracle.com/java/17/archive/jdk-17.0.9_windows-x64_bin.zip',
                                    dest: './jdk17.zip'
                                }, function (e4, res4, body3) {
                                    if (e4) {
                                        console.log('oracle pissed himself')
                                    } else {
                                        proc.spawnSync('7z', ['x', 'jdk17.zip'])
                                        fs.unlinkSync('jdk17.zip')
                                    }
                                })*/
                                javaDL = proc.spawn('aria2c', ['-x16', '-s16', '-m16', 'https://download.oracle.com/java/17/archive/jdk-17.0.9_windows-x64_bin.zip', '--out=jdk17.zip'], { shell: true, detached: true })
                                javaZIP = 'jdk17.zip'
                                /*javaDL.on('close', function (c) {
                                    proc.spawnSync('7z', ['x', javaZIP],{shell:true,detached:true})
                                    fs.unlinkSync(javaZIP)
                                })*/
                                //data.java.push(17)
                                //fs.writeFileSync('data.json', JSON.stringify(data))
                            } else {
                                javaDL = proc.spawn('cmd', ['/c', 'echo', 'java already installed'])
                            }
                            //wget()
                            java = '"../../jdk-17.0.9/bin/java"'
                        }else if (shit.javaVersion.majorVersion == 21){
                            if (!(fs.existsSync('jdk-21.0.3'))) {
                                console.log("downloading JDK 21")
                                javaDL = proc.spawn('aria2c', ['-x16', '-s16', '-m16', 'https://download.oracle.com/java/21/archive/jdk-21.0.3_windows-x64_bin.zip', '--out=jdk21.zip'], { shell: true, detached: true })
                                javaZIP = 'jdk21.zip'
                                /*javaDL.on('close', function (c) {
                                    proc.spawnSync('7z', ['x', 'jre8.zip', '-ojre8'],{shell:true,detached:true})
                                    fs.unlinkSync('jre8.zip')
                                })*/
                                //data.java.push(8)
                                //fs.writeFileSync('data.json', JSON.stringify(data))
                            } else {
                                javaDL = proc.spawn('cmd', ['/c', 'echo', 'java already installed'])
                            }
                            java = '"../../jdk-21.0.3/bin/java"'
                        }else if (shit.javaVersion.majorVersion == 8){
                            if (!(fs.existsSync('jre8'))) {
                                console.log("downloading JRE 8")
                                /*wget({
                                    url: 'https://archive.org/download/Java_8_update_51/jre-8u51-windows-x32.zip',
                                    dest: './jre8.zip'
                                }, function (e4, res4, body3) {
                                    if (e4) {
                                        console.log('archive.org pissed himself')
                                    } else {
                                        proc.spawnSync('7z', ['x', 'jre8.zip', '-ojre8'])
                                        fs.unlinkSync('jre8.zip')
                                    }
                                })*/
                                javaDL = proc.spawn('aria2c', ['-x16', '-s16', '-m16', 'https://archive.org/download/Java_8_update_51/jre-8u51-windows-x64.zip', '--out=jre8.zip'], { shell: true, detached: true })
                                javaZIP = 'jre8.zip'
                                /*javaDL.on('close', function (c) {
                                    proc.spawnSync('7z', ['x', 'jre8.zip', '-ojre8'],{shell:true,detached:true})
                                    fs.unlinkSync('jre8.zip')
                                })*/
                                //data.java.push(8)
                                //fs.writeFileSync('data.json', JSON.stringify(data))
                            } else {
                                javaDL = proc.spawn('cmd', ['/c', 'echo', 'java already installed'])
                            }
                            java = '"../../jre8/bin/java"'
                        }
                        javaDL.on('close', function (c) {
                            //console.log("hi")
                            if (javaZIP == "jdk17.zip") {
                                console.log("extracting JDK 17")
                                proc.spawnSync('7z', ['x', javaZIP], { shell: true, detached: true })
                                fs.unlinkSync(javaZIP)
                            } else if (javaZIP == "jre8.zip") {
                                console.log("extracting JRE 8")
                                proc.spawnSync('7z', ['x', javaZIP, '-ojre8'], { shell: true, detached: true })
                                fs.unlinkSync(javaZIP)
                            }else if (javaZIP == "jdk21.zip"){
                                console.log("extracting JDK 21")
                                proc.spawnSync('7z', ['x', javaZIP], { shell: true, detached: true })
                                fs.unlinkSync(javaZIP)
                            }
                            //console.log("downloading assets")
                            let assetIndex = shit.assetIndex.id;
                            /*if (!(fs.existsSync('data/assets/indexes/'+assetIndex+'.json'))){
                                assetDL = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.assetIndex.url, '--out=assets/indexes/'+assetIndex+'.json'], { shell: true, detached: true })
                            }*/
                            wget({url:shit.assetIndex.url,dest:'assets/indexes/'},function(e5,res5,body5){
                                filenames = Object.keys(JSON.parse(body5).objects)
                                objects = Object.values(JSON.parse(body5).objects)
                                function downloadAsset(j){
                                    if (objects.length == j){
                                        console.log("generating launch script")
                                        if (body2.includes("minecraftArguments")) {
                                            //last version known is 1.6.2, which isnt legacy auth soooo
                                            //uses launchwrapper
                                            args = ' -cp "*" -Djava.library.path="'+__dirname+'\\versions\\'+res2.version+'\\natives" -Dorg.lwjgl.librarypath="'+__dirname+'\\versions\\'+res2.version+'\\natives" ' + shit.mainClass + " " + shit.minecraftArguments
                                            args = args.replaceAll('${auth_player_name}', '%username%')
                                            args = args.replaceAll('${auth_access_token}', '%token%')
                                            args = args.replaceAll(' --session ${auth_session}', '')
                                            args = args.replaceAll('${game_assets}', '"' + __dirname + '\\assets"')
                                            args = args.replaceAll('${game_directory}', '"' + __dirname + '\\data"')
                                            
                                            args = args.replaceAll('${launcher_name}', 'calubcraft')
                                            args = args.replaceAll('${launcher_version}', '21')
                                            args = args.replaceAll('${natives_directory}', 'natives')
                                            args = args.replaceAll('${version_name}', shit.id)
                                            args = args.replaceAll('${assets_root}', '"' + __dirname + '\\assets"')
                                            args = args.replaceAll('${assets_index_name}', assetIndex)
                                            //args = args.replaceAll('--uuid ${auth_uuid}', '')
                                            //args = args.replaceAll(' --uuid ${auth_uuid}', '')
                                            args = args.replaceAll(' --uuid ${auth_uuid}', '%uuid%')
                                            args = args.replaceAll(' --clientId ${clientid}','')
                                            args = args.replaceAll(' --xuid ${auth_xuid}','')
                                            args = args.replaceAll(' --userType ${user_type}','')
                                            args = args.replaceAll(' --versionType ${version_type}', '')
                                            args = args.replaceAll(' --userProperties ${user_properties}', '')
                                            /*if (demo){
                                                args += " --demo"
                                            }*/
                                            //args += ' -Djava.library.path="' + __dirname + '\\natives" -Dorg.lwjgl.librarypath="' + __dirname + '\\natives"'
                                        } else {
                                            args = ' -cp "*" -Djava.library.path="'+__dirname+'\\versions\\'+res2.version+'\\natives" ' + shit.mainClass + " "
                                            for (i = shit.arguments.game.length-1; i > -1; i-=2) {
                                                if (typeof shit.arguments.game[i] == 'string') {
                                                    args += " "
                                                    args += shit.arguments.game[i-1]
                                                    args += " "
                                                    args += shit.arguments.game[i]
                                                }
                                            }
                                            args = args.replaceAll('${launcher_name}', 'calubcraft')
                                            args = args.replaceAll('${launcher_version}', '21')
                                            args = args.replaceAll('${natives_directory}', __dirname+'\\versions\\'+res2.version+'\\natives"')
                                            args = args.replaceAll('${auth_player_name}', '%username%')
                                            args = args.replaceAll('${auth_access_token}', '%token%')
                                            args = args.replaceAll('${assets_root}', '"' + __dirname + '\\assets"')
                                            args = args.replaceAll('${game_directory}', '"' + __dirname + '\\data"')
                                            args = args.replaceAll('${version_name}', shit.id)
                                            args = args.replaceAll('${assets_index_name}', assetIndex)
                                            args = args.replaceAll(' --uuid ${auth_uuid}', '%uuid%')
                                            args = args.replaceAll(' --clientId ${clientid}','')
                                            args = args.replaceAll(' --xuid ${auth_xuid}','')
                                            args = args.replaceAll(' --userType ${user_type}','')
                                            args = args.replaceAll(' --versionType ${version_type}', '')
                                            args = args.replaceAll(' -Dminecraft.launcher.brand=${launcher_name}','')
                                            args = args.replaceAll(' -Dminecraft.launcher.version=${launcher_version}','')
                                            /*if (demo){
                                                args += " --demo"
                                            }*/
                                        }
                                        args += "%demo%"
                                        /*for (i = 0; i < shit.libraries; i++) {
                                            /*wget({
                                                dest: './versions' + res2.version,
                                                url: shit.libraries[i].downloads.artifact.url
                                            })
                                            proc.spawnSync('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                        }*/
                                        //console.log("generating launch script (2/2)")
                                        mainClass = shit.mainClass
                                        //console.log("ree")
                                        fs.writeFileSync('versions/' + res2.version + '/! run.cmd', "set cde=%cd%\ncd../..\n\"node/node\" shid2.js\ncd /d %cde%\nset /p expired=<../../auth/expired.txt\nif %expired% == false goto launch\n@echo.\n@echo your minecraft token has expired. sign in with \"! settings.cmd\" to enable online mode\n@pause\n:launch\nset /p demo=<../../auth/demo.txt\nset /p username=<../../auth/username.txt\nset /p token=<../../auth/token.txt\nset /p uuid=<../../auth/uuid.txt\n" + java + args, { flag: 'a' })
                                        function downloadLib(list, i) {
                                            //console.log(i + " " + shit.libraries.length)
                                            if (shit.libraries.length == i) {
                                                console.log()
                                                console.log('finished in ' + (Date.now() - startTime) / 1000 + "s")
                                                process.exit(1)
                                            }
                                            if (Object.keys(shit.libraries[i].downloads).includes("classifiers")){
                                                if (Object.keys(shit.libraries[i].downloads.classifiers).includes("natives-windows")){
                                                    if (Object.keys(shit.libraries[i].downloads.classifiers["natives-windows"]).includes("url")){
                                                        nativejar = shit.libraries[i].downloads.classifiers["natives-windows"].url.split("/")[shit.libraries[i].downloads.classifiers["natives-windows"].url.split("/").length-1]
                                                        console.log("downloading native jar: " + nativejar)
                                                        download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.classifiers["natives-windows"].url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                        download.on('close',function(c3){
                                                            proc.spawn('7z',['x','-aoa','"versions/'+res2.version+'/'+nativejar+'"','-o"versions/'+res2.version+'/natives"'],{shell:true,detached:true})
                                                            downloadLib(shit.libraries,++i)
                                                        })
                                                    }else{
                                                        if (Object.keys(shit.libraries[i].downloads).includes("artifact")) {
                                                            if (Object.keys(shit.libraries[i]).includes("rules")){
                                                                if (Object.keys(shit.libraries[i].rules[0]).includes("os")){
                                                                    if (shit.libraries[i].rules[0].os.name == "windows" && shit.libraries[i].name.endsWith("windows")){
                                                                        let semen = shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1]
                                                                        //console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                                        console.log("downloading native jar: " + semen)
                                                                        download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                                        download.on('close', function (c3) {
                                                                            //proc.spawn('7z',['x','-aoa','versions/'+res2.version+'/'+semen,'-oversions/'+res2.version+'/natives'],{shell:true,detached:true})
                                                                            if (shit.libraries[i].name.endsWith("natives-windows")){
                                                                                proc.spawn('7z',['x','-aoa','"versions/'+res2.version+'/'+semen+'"','-o"versions/'+res2.version+'/natives"'],{shell:true,detached:true})
                                                                            }
                                                                            downloadLib(shit.libraries, ++i)
                                                                        })
                                                                    }else{
                                                                        downloadLib(shit.libraries,++i)
                                                                    }
                                                                }else{
                                                                    console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                                    download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                                    download.on('close', function (c3) {
                                                                        downloadLib(shit.libraries, ++i)
                                                                    })
                                                                }
                                                            }else{
                                                                console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                                download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                                download.on('close', function (c3) {
                                                                    downloadLib(shit.libraries, ++i)
                                                                })
                                                            }
                                                        }else{
                                                            downloadLib(shit.libraries,++i)
                                                        }
                                                    }
                                                }else{
                                                    if (Object.keys(shit.libraries[i].downloads).includes("artifact")) {
                                                        if (Object.keys(shit.libraries[i]).includes("rules")){
                                                            if (Object.keys(shit.libraries[i].rules[0]).includes("os")){
                                                                if (shit.libraries[i].rules[0].os.name == "windows" && shit.libraries[i].name.endsWith("windows")){
                                                                    let semen = shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1]
                                                                    //console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                                    console.log("downloading native jar: " + semen)
                                                                    download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                                    download.on('close', function (c3) {
                                                                        //proc.spawn('7z',['x','-aoa','versions/'+res2.version+'/'+semen,'-oversions/'+res2.version+'/natives'],{shell:true,detached:true})
                                                                        if (shit.libraries[i].name.endsWith("natives-windows")){
                                                                            proc.spawn('7z',['x','-aoa','"versions/'+res2.version+'/'+semen+'"','-o"versions/'+res2.version+'/natives"'],{shell:true,detached:true})
                                                                        }
                                                                        downloadLib(shit.libraries, ++i)
                                                                    })
                                                                }else{
                                                                    downloadLib(shit.libraries,++i)
                                                                }
                                                            }else{
                                                                console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                                download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                                download.on('close', function (c3) {
                                                                    downloadLib(shit.libraries, ++i)
                                                                })
                                                            }
                                                        }else{
                                                            console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                            download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                            download.on('close', function (c3) {
                                                                downloadLib(shit.libraries, ++i)
                                                            })
                                                        }
                                                    }else{
                                                        downloadLib(shit.libraries,++i)
                                                    }
                                                }
                                            }else{
                                                if (Object.keys(shit.libraries[i].downloads).includes("artifact")) {
                                                    if (Object.keys(shit.libraries[i]).includes("rules")){
                                                        if (Object.keys(shit.libraries[i].rules[0]).includes("os")){
                                                            if (shit.libraries[i].rules[0].os.name == "windows" && shit.libraries[i].name.endsWith("windows")){
                                                                let semen = shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1]
                                                                //console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                                console.log("downloading native jar: " + semen)
                                                                download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                                download.on('close', function (c3) {
                                                                    //proc.spawn('7z',['x','-aoa','versions/'+res2.version+'/'+semen,'-oversions/'+res2.version+'/natives'],{shell:true,detached:true})
                                                                    if (shit.libraries[i].name.endsWith("natives-windows")){
                                                                        proc.spawn('7z',['x','-aoa','"versions/'+res2.version+'/'+semen+'"','-o"versions/'+res2.version+'/natives"'],{shell:true,detached:true})
                                                                    }
                                                                    downloadLib(shit.libraries, ++i)
                                                                })
                                                            }else{
                                                                downloadLib(shit.libraries,++i)
                                                            }
                                                        }else{
                                                            console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                            download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                            download.on('close', function (c3) {
                                                                downloadLib(shit.libraries, ++i)
                                                            })
                                                        }
                                                    }else{
                                                        console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                        download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                        download.on('close', function (c3) {
                                                            downloadLib(shit.libraries, ++i)
                                                        })
                                                    }
                                                }
                                            }
                                        }
                                        downloadLib(shit.libraries, 0)
                                    }else{
                                        file = objects[j]
                                        hash = file.hash
                                        folder = hash.charAt(0)+hash.charAt(1)
                                        if (!(fs.existsSync("assets/objects/"+folder+"/"+hash))){
                                            if (filenames[j].endsWith(".png") || filenames[j].endsWith(".icns") || allAssets){
                                                console.log("downloading asset ("+(j+1)+"/"+objects.length+")")
                                                assetDL = proc.spawn('aria2c', ['-x16', '-s16', '-m16', 'https://resources.download.minecraft.net/'+folder+'/'+hash, '--out=assets/objects/'+folder+'/'+hash], { shell: true, detached: true })
                                                assetDL.on('close',function(c4){
                                                    downloadAsset(++j)
                                                })
                                            }else{
                                                downloadAsset(++j)
                                            }
                                        }else{
                                            downloadAsset(++j);
                                        }
                                    }
                                }
                                downloadAsset(0);
                            })
                        })
                    })
                    //fs.unlinkSync(version[0].url.split("/")[version[0].url.length-1])
                }
            })
        })
    }
})
//fs.unlinkSync("version_manifest_v2.json")
