const SEP = '/'

module.exports = {
  sep: SEP,
  join: (path, file) => {
    return path + SEP + file
  }
}
