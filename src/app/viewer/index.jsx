import React from "react"
import { Maybe } from "monet"
import { Alert, Breadcrumb, Glyphicon, Table } from "react-bootstrap"

import { joinPath, readDirectory, splitPath } from "../../storage"
import cmd from "../../cmd"
import ContextMenu from "./menu"

export default class Viewer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      path: null,
      files: Maybe.None(),
      error: null,
      filter: null,
      focused: false
    }
  }
  componentWillReceiveProps(props) {
    this.getFolderContent(props.path)
  }
  componentDidMount() {
    this.getFolderContent(this.props.path)
    document.addEventListener('keypress', this.handleFilter.bind(this));
  }
  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleFilter.bind(this));
  }
  handleFilter() {
    if(this.state.filter === null) {
      this.updateState({ filter: '' })
    }
  }
  getFiles() {
    return this.state.filter
      ? this.state.files.map(files =>
          files.filter(file => file.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1)
        )
      : this.state.files
  }
  openFile(file) {
    if(file.isDirectory) {
      this.getFolderContent(file.path)
    } else {
      cmd.shell.launch(file.path)
    }
  }
  getFolderContent(path) {
    readDirectory(path, true).then(files => {
      this.updateState({ path, files: Maybe.fromNull(files), filter: null, focused: false })
    })
  }
  toggleFolder(file, paths) {
    if(file.expanded) {
      this.closeFolder(file, paths.concat([file.path]))
      return
    }
    this.openFolder(file, paths.concat([file.path]))
  }
  closeFolder(file, paths) {
    const files = this.state.files.map(items => {
      return this.walkTree(items, paths, 0, (item) => {
        return Object.assign({}, item, {
          expanded: false
        })
      })
    })
    this.updateState({ files })
  }
  openFolder(file, paths) {
    readDirectory(file.path, true).then(children => {
      const files = this.state.files.map(items => {
        return this.walkTree(items, paths, 0, (item) => {
          return Object.assign({}, item, {
            children,
            expanded: true
          })
        })
      })
      this.updateState({ files })
    }).catch(error => this.updateState({ error }))
  }
  walkTree(folder, paths, idx, callback) {
    return folder.map(file => {
      if(file.path === paths[idx]) {
        if(paths.length === idx + 1) {
          return callback(file)
        } else
          return Object.assign({}, file, {
            children: this.walkTree(file.children, paths, idx + 1, callback)
          })
      }
      return file
    })
  }
  updateState(state) {
    this.setState(Object.assign({}, this.state, state))
  }
  showContextMenu(file, paths) {
    const files = this.state.files.map(items => {
      return this.walkTree(items, paths.concat([file.path]), 0, (item) => {
        return Object.assign({}, item, {
          contextMenu: true
        })
      })
    })
    this.updateState({ files })
  }
  hideContextMenu(file, paths) {
    const files = this.state.files.map(items => {
      return this.walkTree(items, paths.concat([file.path]), 0, (item) => {
        return Object.assign({}, item, {
          contextMenu: false
        })
      })
    })
    this.updateState({ files })
  }
  renderItem(file, index, paths) {
    const style = index === 0 ? { borderTop: 'none' } : {}
    const textStyle = { display: 'inline-block', paddingLeft: '5px' }
    const rowClassName = this.state.selected === file.path ? 'warning' : ''
    const icon = file.isDirectory
      ? file.expanded
        ? 'folder-open'
        : 'folder-close'
      : 'file'
    const folderIcon = file.expanded ? 'triangle-bottom' : 'triangle-right'
    const onClickExpand = () => {
      this.toggleFolder(file, paths)
    }
    const folder = file.isDirectory ? <Glyphicon glyph={folderIcon} onClick={onClickExpand} /> : null
    const children = file.children && file.children.length && file.expanded
      ? this.renderList(Maybe.Some(file.children), paths.concat([ file.path ]))
      : file.expanded
        ? <div style={{ padding: '5px 5px 5px 18px' }}><i>Empty</i></div>
        : null
    const onDoubleClick = (e) => {
      e.stopPropagation()
      this.openFile(file)
    }
    const onContextMenuShow = (e) => {
      e.preventDefault()
      this.showContextMenu(file, paths)
    }
    const onContextMenuHide = () => {
      this.hideContextMenu(file, paths)
    }
    return <tr key={file.name} className={rowClassName}>
      <td style={Object.assign({}, style, { width: '15px', textAlign: 'center', cursor: 'pointer' })}>
        {folder}
      </td>
      <td style={Object.assign({}, style, { cursor: 'default' })}>
        <div ref={file.path} style={{ position: 'relative', left: '-5px' }} onContextMenu={onContextMenuShow} onDoubleClick={onDoubleClick}>
          <Glyphicon glyph={icon} /><span style={textStyle}>{file.name}</span>
          {children}
        </div>
        <ContextMenu
          show={file.contextMenu}
          target={this.refs[file.path]}
          id={file.path}
          onClose={onContextMenuHide}
          outsideClickIgnoreClass="popover"
          ></ContextMenu>
      </td>
    </tr>
  }
  renderList(maybeFiles, paths) {
    const items = maybeFiles.map(files => {
      return files.map((file, index) => this.renderItem(file, index, paths))
    })
    if(items.isNone()) {
      return <div>Loading...</div>
    }
    return <Table responsive striped hover>
      <tbody>{items.some()}</tbody>
    </Table>
  }
  renderTitle() {
    const items = this.state.path
      ? splitPath(this.state.path).map((part, idx, arr) => {
          const active = idx === arr.length - 1
          const onClick = (e) => {
            e.preventDefault()
            this.getFolderContent(joinPath(arr.slice(0, idx + 1)))
          }
          return <Breadcrumb.Item href="#" key={part} active={active} onClick={onClick}>
            {part}
          </Breadcrumb.Item>
        })
      : null
    const starStyle = {
      cursor: 'pointer',
      position: 'relative',
      top: '2px',
      marginLeft: '15px' }
    return <Breadcrumb>
      {items}
      <Glyphicon glyph="star-empty" className="text-info" style={starStyle} />
    </Breadcrumb>
  }
  handleAlertDismiss() {
    this.updateState({ error: null })
  }
  renderError() {
    return this.state.error
      ? <Alert bsStyle="danger" onDismiss={() => this.handleAlertDismiss()}>{this.state.error}</Alert>
      : null
  }
  handleFilterChange(e) {
    this.updateState({ filter: e.target.value })
  }
  handleFilterFocus() {
    this.updateState({ focused: true })
  }
  handleFilterBlur() {
    const filter = this.state.filter || null
    this.updateState({ focused: false, filter })
  }
  handleFilterClear() {
    this.updateState({ filter: null, focused: false })
  }
  renderFilter() {
    const style = {
      width: '400px',
      position: 'absolute',
      top: '3px',
      left: '50%',
      marginLeft: '-200px'
    }
    const handleReference = (input) => {
      if(input && !this.state.filter) input.focus()
    }
    return this.state.filter !== null || this.state.focused
      ? <div style={style}>
          <div className="form-group">
            <div className="input-group">
              <input ref={handleReference} type="search" className="form-control"
                onBlur={this.handleFilterBlur.bind(this)}
                onFocus={this.handleFilterFocus.bind(this)}
                onChange={this.handleFilterChange.bind(this)} />
              <span className="input-group-addon" style={{ cursor: 'pointer' }} onClick={this.handleFilterClear.bind(this)}>
                <i className="glyphicon glyphicon-remove"></i>
              </span>
            </div>
          </div>
        </div>
      : null
  }
  render() {
    return <div>
      {this.renderFilter()}
      {this.renderTitle()}
      {this.renderError()}
      {this.renderList(this.getFiles(), [])}
    </div>
  }
}
