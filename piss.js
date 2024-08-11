let wget = require('node-wget')
let prompt = require('prompt')
let proc = require('child_process')
let fs = require('fs')
let versions;
let user;
let demo = true;
//let username = "notch";
//let token = username;
//let uuid = ""; // add "--uuid " before your uuid so it recognizes it
//let data = require('./data.json')
//let version;
let allAssets = false;
if (demo){
    console.log('demo mode is on! its turned on by default just in case mojan wants to go nintendo mode')
    console.log()
}
if (!allAssets){
    console.log('sounds will not be downloaded.. you can turn this off if you wanna')
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
            if (!(body.includes(res2.version))) {
                console.log('fake!')
                process.exit(1)
            }
            let startTime = Date.now()
            version = versions.versions.filter(function (d) { return res2.version == d.id });
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
                    let clientDL = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.downloads.client.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                    clientDL.on('close', function (c2) {
                        (function(){
                            //console.log("hi")
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
                                            args = ' -cp "*" -Djava.library.path="'+__dirname+'//versions//'+res2.version+'//natives" -Dorg.lwjgl.librarypath="'+__dirname+'//versions//'+res2.version+'//natives" ' + shit.mainClass + " " + shit.minecraftArguments
                                            args = args.replaceAll('${auth_player_name}', '$username')
                                            args = args.replaceAll('${auth_access_token}', '$token')
                                            args = args.replaceAll(' --session ${auth_session}', '')
                                            args = args.replaceAll('${game_assets}', '"' + __dirname + '//assets"')
                                            args = args.replaceAll('${game_directory}', '"' + __dirname + '//data"')
                                            
                                            args = args.replaceAll('${launcher_name}', 'calubcraft')
                                            args = args.replaceAll('${launcher_version}', '21')
                                            args = args.replaceAll('${natives_directory}', 'natives')
                                            args = args.replaceAll('${version_name}', shit.id)
                                            args = args.replaceAll('${assets_root}', '"' + __dirname + '//assets"')
                                            args = args.replaceAll('${assets_index_name}', assetIndex)
                                            //args = args.replaceAll('--uuid ${auth_uuid}', '')
                                            //args = args.replaceAll(' --uuid ${auth_uuid}', '')
                                            args = args.replaceAll(' --uuid ${auth_uuid}', '$uuid')
                                            args = args.replaceAll(' --clientId ${clientid}','')
                                            args = args.replaceAll(' --xuid ${auth_xuid}','')
                                            args = args.replaceAll(' --userType ${user_type}','')
                                            args = args.replaceAll(' --versionType ${version_type}', '')
                                            args = args.replaceAll(' --userProperties ${user_properties}', '')
                                            if (demo){
                                                args += " --demo"
                                            }
                                            //args += ' -Djava.library.path="' + __dirname + '//natives" -Dorg.lwjgl.librarypath="' + __dirname + '//natives"'
                                        } else {
                                            args = ' -cp "*" -Djava.library.path="'+__dirname+'//versions//'+res2.version+'//natives" ' + shit.mainClass + " "
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
                                            args = args.replaceAll('${natives_directory}', __dirname+'//versions//'+res2.version+'//natives"')
                                            args = args.replaceAll('${auth_player_name}', '$username')
                                            args = args.replaceAll('${auth_access_token}', '$token')
                                            args = args.replaceAll('${assets_root}', '"' + __dirname + '//assets"')
                                            args = args.replaceAll('${game_directory}', '"' + __dirname + '//data"')
                                            args = args.replaceAll('${version_name}', shit.id)
                                            args = args.replaceAll('${assets_index_name}', assetIndex)
                                            args = args.replaceAll(' --uuid ${auth_uuid}', '$uuid')
                                            args = args.replaceAll(' --clientId ${clientid}','')
                                            args = args.replaceAll(' --xuid ${auth_xuid}','')
                                            args = args.replaceAll(' --userType ${user_type}','')
                                            args = args.replaceAll(' --versionType ${version_type}', '')
                                            args = args.replaceAll(' -Dminecraft.launcher.brand=${launcher_name}','')
                                            args = args.replaceAll(' -Dminecraft.launcher.version=${launcher_version}','')
                                            if (demo){
                                                args += " --demo"
                                            }
                                        }
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
                                        fs.writeFileSync('versions/' + res2.version + '/run.sh', "cde=$PWD\ncd ../..\nnode shid2.js\ncd $PWD\nexpired=$(cat ../../auth/expired.txt)\nif [$expired = \"false\"]; then\nread -p your minecraft token has expired. run login.sh to enable online mode\nusername=$(cat ../../auth/username.txt)\ntoken=$(cat ../../auth/token.txt)\nuuid=$(cat ../../auth/uuid.txt)\njava " + args, { flag: 'a' })
                                        function downloadLib(list, i) {
                                            //console.log(i + " " + shit.libraries.length)
                                            if (shit.libraries.length == i) {
                                                console.log()
                                                console.log('finished in ' + (Date.now() - startTime) / 1000 + "s")
                                                process.exit(1)
                                            }
                                            if (Object.keys(shit.libraries[i].downloads).includes("classifiers")){
                                                if (Object.keys(shit.libraries[i].downloads.classifiers).includes("natives-linux")){
                                                    if (Object.keys(shit.libraries[i].downloads.classifiers["natives-linux"]).includes("url")){
                                                        nativejar = shit.libraries[i].downloads.classifiers["natives-linux"].url.split("/")[shit.libraries[i].downloads.classifiers["natives-linux"].url.split("/").length-1]
                                                        console.log("downloading native jar: " + nativejar)
                                                        download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.classifiers["natives-linux"].url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                        download.on('close',function(c3){
                                                            proc.spawn('7z',['x','-aoa','"versions/'+res2.version+'/'+nativejar+'"','-o"versions/'+res2.version+'/natives"'],{shell:true,detached:true})
                                                            downloadLib(shit.libraries,++i)
                                                        })
                                                    }else{
                                                        if (Object.keys(shit.libraries[i].downloads).includes("artifact")) {
                                                            if (Object.keys(shit.libraries[i]).includes("rules")){
                                                                if (Object.keys(shit.libraries[i].rules[0]).includes("os")){
                                                                    if (shit.libraries[i].rules[0].os.name == "linux" && shit.libraries[i].name.endsWith("linux")){
                                                                        let semen = shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1]
                                                                        //console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                                        console.log("downloading native jar: " + semen)
                                                                        download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                                        download.on('close', function (c3) {
                                                                            //proc.spawn('7z',['x','-aoa','versions/'+res2.version+'/'+semen,'-oversions/'+res2.version+'/natives'],{shell:true,detached:true})
                                                                            if (shit.libraries[i].name.endsWith("natives-linux")){
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
                                                                if (shit.libraries[i].rules[0].os.name == "linux" && shit.libraries[i].name.endsWith("linux")){
                                                                    let semen = shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1]
                                                                    //console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                                    console.log("downloading native jar: " + semen)
                                                                    download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                                    download.on('close', function (c3) {
                                                                        //proc.spawn('7z',['x','-aoa','versions/'+res2.version+'/'+semen,'-oversions/'+res2.version+'/natives'],{shell:true,detached:true})
                                                                        if (shit.libraries[i].name.endsWith("natives-linux")){
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
                                                            if (shit.libraries[i].rules[0].os.name == "linux" && shit.libraries[i].name.endsWith("linux")){
                                                                let semen = shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1]
                                                                //console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                                console.log("downloading native jar: " + semen)
                                                                download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir="versions/' + res2.version + '"'], { shell: true, detached: true })
                                                                download.on('close', function (c3) {
                                                                    //proc.spawn('7z',['x','-aoa','versions/'+res2.version+'/'+semen,'-oversions/'+res2.version+'/natives'],{shell:true,detached:true})
                                                                    if (shit.libraries[i].name.endsWith("natives-linux")){
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
                        })()
                    })
                    //fs.unlinkSync(version[0].url.split("/")[version[0].url.length-1])
                }
            })
        })
    }
})
//fs.unlinkSync("version_manifest_v2.json")
