const fs = require('fs')
const File = require('./lib/File.js')
const Dir = require('./lib/Dir.js')

function type(stats) {
    let type = {}

    type.isFile = false
    type.isDir = false
    type.isLink = false

    // File type
    if(stats.isFile())
        type.isFile = true
    else{
        // Directory type
        if(stats.isDirectory())
            type.isDir = true
        else{
            // Symbolic Link type
            if(stats.isSymbolicLink()){
                type.isLink = true
            }
        }
    }

    return type
}


function permissions(stats){
    let permission = {}      

    // owner permissions
    permission.or = stats["mode"] & 400 ? true : false
    permission.ow = stats["mode"] & 200 ? true : false
    permission.ox = stats["mode"] & 100 ? true : false
    //group permissions
    permission.gr = stats["mode"] & 40 ? true : false
    permission.gw = stats["mode"] & 20 ? true : false
    permission.gx = stats["mode"] & 10 ? true : false
    // others permissions
    permission.tr = stats["mode"] & 4 ? true : false
    permission.tw = stats["mode"] & 2 ? true : false
    permission.tx = stats["mode"] & 1 ? true : false
    
    return permission
}


function tree(path){
    let root = new Array()
    root.push("lmmł")

    fs.readdir(path, (err, items)=>{

        if(err){
            return err
        }else{
            
            items.forEach(item => {
                fs.lstat(`${path}/${item}`, (err, stats)=>{
                    if(err){
                        return err
                    }else{
                        if(stats.isFile()) {
                            let f = new File()
                            f.name = item
                            f.size = stats.size
                            f.owner = stats.uid
                            f.group = stats.gid
                            f.permissions = permissions(stats)
                            f.type = type(stats)
                            f.created_at = stats.birthtime
                            f.last_modification = stats.mtime
                            root.push(f)                          
                        }else{
                            if(stats.isDirectory()){
                                let d = new Dir()
                                d.name = item
                                d.size = stats.size
                                d.owner = stats.uid
                                d.group = stats.gid
                                d.permissions = permissions(stats)
                                d.type = type(stats)
                                d.created_at = stats.birthtime
                                d.last_modification = stats.mtime
                                d.files = tree(`${path}/${item}`)

                                console.log(d)
                            }
                        }
                    }
                })
            })

        }
    })
}

console.log(tree('./'))
