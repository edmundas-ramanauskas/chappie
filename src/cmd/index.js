import { shell } from "electron"

const launch = (file) => {
  shell.openItem(file)
}

export default {
  shell: {
    launch
  }
}
