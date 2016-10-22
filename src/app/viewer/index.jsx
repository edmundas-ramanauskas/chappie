import { Maybe } from "monet"
import { Alert, Breadcrumb, Glyphicon, Panel } from "react-bootstrap"

import Component from "../component"
import { joinPath, readDirectory, splitPath } from "../../storage"
import cmd from "../../cmd"
import Folder from "./list/folder"

import styles from "./styles.css"

export default class Viewer extends Component {
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
  deleteFile(file) {
    console.log(this.state.files.some())
    cmd.shell.remove(file.path)
  }
  getFolderContent(path) {
    readDirectory(path, true).then(files => {
      this.updateState({ path, files: Maybe.fromNull(files), filter: null, focused: false })
    })
  }
  updateState(state) {
    this.setState(Object.assign({}, this.state, state))
  }
  renderList() {
    const files = this.getFiles()
    if(files.isNone()) {
      return <div>Loading...</div>
    }
    return <Folder files={files.some()}
      onFileOpen={file => this.openFile(file)}
      onFileDelete={file => this.deleteFile(file)} />
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
    return <Breadcrumb style={{ padding: '0' }}>
      {items}
      <Glyphicon glyph="star-empty" className={styles.star} />
      <Glyphicon glyph="th-large" className="pull-right" />
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
    const handleReference = (input) => {
      if(input && !this.state.filter) input.focus()
    }
    return this.state.filter !== null || this.state.focused
      ? <div className={styles.filter}>
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
      {this.renderError()}
      <Panel header={this.renderTitle()}>
        {this.renderList()}
      </Panel>
    </div>
  }
}
