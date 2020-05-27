#!/usr/bin/env node

const fs = require('fs')

const BRANCH = '├── ' 
const INDENT = '    ' 
const LAST_BRANCH = '└── ' 
const VERTICAL = '│   ' 

// reversed tree option
const isReversed = false
// raw output option
const rawOutput = false
// display hidden files option
const displayHidden = false
// so the user can print it in a file without the cli coloring spacail characteres 
const colored = false

const path = "."
const cwdName = "."

let directoriesNumber = 0
let filesNumber = 0

const dirColor = dirName => `\x1b[34m${dirName}\x1b[0m`

const dirents2list = dirents => dirents.map(dirent => ({ name: dirent.name, isDir: dirent.isDirectory() }))

const sort = list => list.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

const cwdContent = path => {
    let items = fs.readdirSync(path, { withFileTypes: true })

    if ( !displayHidden ) items = items.filter(item => item.name.slice(0, 1) !== '.')

    const files = isReversed ? sort(dirents2list(items)).reverse() : sort(dirents2list(items))

    files.map(file => { if (file.isDir) file.content = cwdContent(path + '/' + file.name) })
    return files
}

const formatContent = (cwd, depth, isParentLast) => {
    cwd.content.map((item, index) => { 
        
        if ( item.isDir ) {
            if (colored) item.name = dirColor(item.name)
            directoriesNumber ++
        } else {
            filesNumber ++
        }

        if ( depth === 0 ) {
            if (index === cwd.content.length -1) { 
                item.name = LAST_BRANCH + item.name
                if ( item.isDir )  item.content = formatContent(item, depth + 1, [true])
            } else {
                item.name = BRANCH + item.name
                if ( item.isDir )  item.content = formatContent(item, depth + 1, [false])
            }
        } else {
            if (index === cwd.content.length -1) { 
                item.name = generateBranches(depth, isParentLast) + LAST_BRANCH + item.name
                if ( item.isDir )  item.content = formatContent(item, depth + 1, [...isParentLast, true])
            } else {
                item.name = generateBranches(depth, isParentLast) +  BRANCH + item.name
                if ( item.isDir )  item.content = formatContent(item, depth + 1, [...isParentLast, false])
            }
        }
    })
    
    return cwd.content
}

const generateBranches = (depth, isParentLast, braches = "") => {
    if ( isParentLast[depth - 1] ) {
        if ( (depth - 1) === 0 ) braches = INDENT + braches
        else braches = generateBranches(depth - 1, isParentLast, INDENT + braches)
    } else {
        if ( (depth - 1) === 0 ) braches = VERTICAL + braches
        else braches = generateBranches(depth-1, isParentLast, VERTICAL + braches)
    }
    return braches
}

const printBranch = cwd => {
    let tree = cwd.name + "\n"
    cwd.content.map( item  => {
        if ( item.content && item.content.length > 0 ) tree += printBranch(item)
        else tree += item.name + "\n"
    })
    return tree 
}

const cwd = { name: colored ? dirColor(cwdName) : cwdName , content: cwdContent(path) }
if (!rawOutput) cwd.content = formatContent(cwd, 0, [false])

const printTree = () => {
    console.log(printBranch(cwd))
    console.log(`${directoriesNumber} directories, ${filesNumber} files`)
}

printTree()