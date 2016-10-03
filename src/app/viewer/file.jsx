import { Glyphicon } from "react-bootstrap"

import Component from "../component"
import ContextMenu from "./menu"
import Folder from "./folder"
import { readDirectory } from "../../storage"

import styles from "./styles.css"

export default class File extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      children: null,
      contextMenu: false
    }
  }
  toggleFolder() {
    if(!this.state.expanded) {
      if(!this.state.children) {
        readDirectory(this.props.file.path, true).then(files => {
          this.updateState({ children: files, expanded: true })
        })
      } else {
        this.updateState({ expanded: true })
      }
    } else
      this.updateState({ expanded: false })
  }
  render() {
    const icon = this.props.file.isDirectory
      ? this.props.file.expanded
        ? 'folder-open'
        : 'folder-close'
      : 'file'
    const folderIcon = this.state.expanded ? 'triangle-bottom' : 'triangle-right'
    const onClickExpand = () => {
      this.toggleFolder()
    }
    const folder = this.props.file.isDirectory ? <Glyphicon glyph={folderIcon} onClick={onClickExpand} /> : null
    const children = this.state.expanded
      ? <Folder files={this.state.children} onFileOpen={(file) => this.props.onDoubleClick(file)} />
      : null
    const onDoubleClick = (e) => {
      e.stopPropagation()
      this.props.onDoubleClick(this.props.file)
    }
    const onContextMenuShow = (e) => {
      e.preventDefault()
      this.updateState({ contextMenu: true })
    }
    const onContextMenuHide = () => {
      this.updateState({ contextMenu: false })
    }
    return <tr>
      <td className={styles.expand}>
        {folder}
      </td>
      <td style={{ cursor: 'default' }}>
        <div ref={this.props.file.path} className={styles.file} onContextMenu={onContextMenuShow} onDoubleClick={onDoubleClick}>
          <Glyphicon glyph={icon} />
          <span className={styles.fileName}>{this.props.file.name}</span>
          {children}
        </div>
        <ContextMenu
          show={this.state.contextMenu}
          target={this.refs[this.props.file.path]}
          id={this.props.file.path}
          onClose={onContextMenuHide}
          outsideClickIgnoreClass="popover"
          ></ContextMenu>
      </td>
    </tr>
  }
}
