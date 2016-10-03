import { Table } from "react-bootstrap"

import Component from "../component"
import File from "./file"

import styles from "./styles.css"

export default class Folder extends Component {
  renderItem(file) {
    return <File file={file} key={file.path} onDoubleClick={this.props.onFileOpen} />
  }
  renderList() {
    return this.props.files.map(file => this.renderItem(file))
  }
  render() {
    return this.props.files && this.props.files.length
      ? <Table responsive className={styles.folder}>
          <tbody>{this.renderList()}</tbody>
        </Table>
      : <div className={styles.empty}><i>Empty</i></div>
  }
}
