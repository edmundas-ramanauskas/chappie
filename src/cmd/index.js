import { shell } from "electron"

const launch = (file) => {
  shell.openItem(file)
}
const remove = (file) => {
  shell.moveItemToTrash(file)
}

export default {
  shell: {
    launch,
    remove
  }
}
