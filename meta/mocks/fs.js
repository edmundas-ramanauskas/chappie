const path = require('./path.js')
const os = require('./os.js')

const tree = {
  'example': { isDirectory: () => true },
  'work': { isDirectory: () => true },
  'pictures': { isDirectory: () => true },
  'music': { isDirectory: () => true }
}

const dummy = { isDirectory: () => true }

module.exports = {
  readdir: (path, cb) => {
    const home = os.homedir()
    const files = path === home
      ? Object.keys(tree)
      : home.startsWith(path)
        ? [ 'dummy' ]
        : []
    cb(null, files)
  },
  stat: (file, cb) => {
    const stats = file === os.homedir()
      ? dummy
      : tree[file.split(path.sep).slice(-1).pop()]
    cb(null, stats)
  },
  readFileSync: () => {}
}
