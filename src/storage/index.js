import fs from "fs"
import path from "path"

function isHidden(file) {
  return file.charAt(0) === '.'
}

function compare(a, b) {
  const aDir = a.isDirectory ? 0 : 1
  const bDir = b.isDirectory ? 0 : 1
  if (aDir > bDir) {
    return 1;
  }
  if (aDir < bDir) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  return 0;
}

export function splitPath(pathName) {
  return pathName.split(path.sep)
}

export function joinPath(pathParts) {
  return pathParts.join(path.sep)
}

export function readDirectory(directory, ignoreHidden) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (error, files) => {
      if(error) reject(error)
      else resolve(files)
    })
  }).then(files => {
    return Promise.all(files.map(file => {
        return new Promise((resolve, reject) => {
          const filePath = path.join(directory, file)
          fs.stat(filePath, (error, stats) => {
            if(error) reject(error)
            else resolve({
              name: file,
              path: filePath,
              isDirectory: stats.isDirectory()
            })
          })
        })
      })
    )
  }).then(files => {
    if(ignoreHidden) {
      return files.filter(file => !isHidden(file.name))
    }
    return files
  }).then(files => {
    files.sort(compare)
    return files
  })
}

export default {
  splitPath, joinPath, readDirectory
}
