let wget = require('node-wget')
let prompt = require('prompt')
let proc = require('child_process')
let fs = require('fs')
let versions;
let user;
//let data = require('./data.json')
//let version;
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
            if (body.includes(res2.version)) {
                let startTime = Date.now()
                version = versions.versions.filter(function (d) { return res2.version == d.id });
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
                        let clientDL = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.downloads.client.url, '--dir=versions/' + res2.version], { shell: true, detached: true })
                        clientDL.on('close', function (c2) {
                            let javaDL, javaZIP;
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
                            } else if (shit.javaVersion.majorVersion == 8){
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
                                    javaDL = proc.spawn('aria2c', ['-x16', '-s16', '-m16', 'https://archive.org/download/Java_8_update_51/jre-8u51-windows-x32.zip', '--out=jre8.zip'], { shell: true, detached: true })
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
                                console.log("downloading assets")
                                let assetIndex = shit.assetIndex.id;
                                if (!(fs.existsSync('assets/'+assetIndex+'.json'))){
                                    assetDL = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.assetIndex.url, '--out=assets/'+assetIndex+'.json'], { shell: true, detached: true })
                                }
                                console.log("generating launch script")
                                if (body2.includes("minecraftArguments")) {
                                    //last version known is 1.6.2, which isnt legacy auth soooo
                                    //uses launchwrapper
                                    args = ' -cp "*" -Djava.library.path="' + __dirname + '\\natives" -Dorg.lwjgl.librarypath="' + __dirname + '\\natives" ' + shit.mainClass + " " + shit.minecraftArguments
                                    args = args.replaceAll('${auth_player_name}', '%username%')
                                    args = args.replaceAll('${auth_access_token}', '%username%')
                                    args = args.replaceAll('${auth_session} ', '')
                                    args = args.replaceAll('${game_assets}', __dirname + '\\assets')
                                    args = args.replaceAll('${game_directory}', '"' + __dirname + '\\data"')
                                    
                                    args = args.replaceAll('${launcher_name}', 'calubcraft')
                                    args = args.replaceAll('${launcher_version}', '21')
                                    args = args.replaceAll('${natives_directory}', '"' + __dirname + '\\natives"')
                                    args = args.replaceAll('${version_name}', shit.id)
                                    args = args.replaceAll('${assets_root}', __dirname + '\\assets')
                                    args = args.replaceAll('${assets_index_name}', assetIndex)
                                    args = args.replaceAll('--uuid ${auth_uuid}', '')
                                    args = args.replaceAll(' --uuid ${auth_uuid}', '')
                                    args = args.replaceAll(' --clientId ${clientid}','')
                                    args = args.replaceAll(' --xuid ${auth_xuid}','')
                                    args = args.replaceAll(' --userType ${user_type}','')
                                    args = args.replaceAll(' --versionType ${version_type}', '')
                                    //args += ' -Djava.library.path="' + __dirname + '\\natives" -Dorg.lwjgl.librarypath="' + __dirname + '\\natives"'
                                } else {
                                    args = ' -cp "*" -Djava.library.path="' + __dirname + '\\natives" ' + shit.mainClass + " "
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
                                    args = args.replaceAll('${natives_directory}', '"' + __dirname + '\\natives"')
                                    args = args.replaceAll('${auth_player_name}', '%username%')
                                    args = args.replaceAll('${auth_access_token}', '%username%')
                                    args = args.replaceAll('${assets_root}', 'assets')
                                    args = args.replaceAll('${game_directory}', '"' + __dirname + '\\data"')
                                    args = args.replaceAll('${version_name}', shit.id)
                                    args = args.replaceAll('${assets_index_name}', '8')
                                    args = args.replaceAll(' --uuid ${auth_uuid}', '')
                                    args = args.replaceAll(' --clientId ${clientid}','')
                                    args = args.replaceAll(' --xuid ${auth_xuid}','')
                                    args = args.replaceAll(' --userType ${user_type}','')
                                    args = args.replaceAll(' --versionType ${version_type}', '')
                                    args = args.replaceAll(' -Dminecraft.launcher.brand=${launcher_name}','')
                                    args = args.replaceAll(' -Dminecraft.launcher.version=${launcher_version}','')
                                }
                                /*for (i = 0; i < shit.libraries; i++) {
                                    /*wget({
                                        dest: './versions' + res2.version,
                                        url: shit.libraries[i].downloads.artifact.url
                                    })
                                    proc.spawnSync('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir=versions/' + res2.version], { shell: true, detached: true })
                                }*/
                                //console.log("generating launch script (2/2)")
                                mainClass = shit.mainClass
                                //console.log("ree")
                                fs.writeFileSync('versions/' + res2.version + '/! run.cmd', "set /p username=<../../username.txt\n" + java + args, { flag: 'a' })
                                function downloadLib(list, i) {
                                    //console.log(i + " " + shit.libraries.length)
                                    if (Object.keys(shit.libraries[i].downloads).includes("classifiers")){
                                        if (Object.keys(shit.libraries[i].downloads.classifiers).includes("natives-windows")){
                                            if (Object.keys(shit.libraries[i].downloads.classifiers["natives-windows"]).includes("url")){
                                                console.log("downloaded native jar: " + shit.libraries[i].downloads.classifiers["natives-windows"].url.split("/")[shit.libraries[i].downloads.classifiers["natives-windows"].url.split("/").length-1])
                                                download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.classifiers["natives-windows"].url, '--dir=versions/' + res2.version], { shell: true, detached: true })
                                            }
                                        }
                                    }
                                    if (Object.keys(shit.libraries[i].downloads).includes("artifact")) {
                                        if (Object.keys(shit.libraries[i]).includes("rules")){
                                            if (Object.keys(shit.libraries[i].rules[0]).includes("os")){
                                                if (shit.libraries[i].rules[0].os.name == "windows" && shit.libraries[i].name.endsWith("windows")){
                                                    console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                    download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir=versions/' + res2.version], { shell: true, detached: true })
                                                    download.on('close', function (c3) {
                                                        downloadLib(shit.libraries, ++i)
                                                    })
                                                }else{
                                                    downloadLib(shit.libraries,++i)
                                                }
                                            }else{
                                                console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                                download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir=versions/' + res2.version], { shell: true, detached: true })
                                                download.on('close', function (c3) {
                                                    downloadLib(shit.libraries, ++i)
                                                })
                                            }
                                        }else{
                                            console.log("downloading jar (" + (i + 1) + "/" + shit.libraries.length + "): " + shit.libraries[i].downloads.artifact.url.split("/")[shit.libraries[i].downloads.artifact.url.split("/").length-1])
                                            download = proc.spawn('aria2c', ['-x16', '-s16', '-m16', shit.libraries[i].downloads.artifact.url, '--dir=versions/' + res2.version], { shell: true, detached: true })
                                            download.on('close', function (c3) {
                                                downloadLib(shit.libraries, ++i)
                                            })
                                        }
                                    }else{
                                        downloadLib(shit.libraries,++i)
                                    }
                                    if (shit.libraries.length - 1 == i) {
                                        console.log()
                                        console.log('finished in ' + (Date.now() - startTime) / 1000 + "s")
                                        process.exit(1)
                                    }
                                }
                                downloadLib(shit.libraries, 0)
                            })
                        })
                        //fs.unlinkSync(version[0].url.split("/")[version[0].url.length-1])
                    }
                })
            } else {
                console.log('fake!')
                process.exit(1);
            }
        })
    }
})
//fs.unlinkSync("version_manifest_v2.json")
