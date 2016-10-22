import { Table } from "react-bootstrap"

import Component from "../../component"
import File from "./file"

import styles from "./styles.css"

export default class Folder extends Component {
  renderItem(file, top) {
    return <File file={file} top={top} key={file.path}
      onFileOpen={this.props.onFileOpen}
      onFileDelete={this.props.onFileDelete} />
  }
  renderList() {
    return this.props.files.map((file, i) => this.renderItem(file, i === 0))
  }
  render() {
    return this.props.files && this.props.files.length
      ? <Table className={styles.folder}>
          <tbody>{this.renderList()}</tbody>
        </Table>
      : <div className={styles.empty}><i>Empty</i></div>
  }
}
