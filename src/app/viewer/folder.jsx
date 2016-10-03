import { Table } from "react-bootstrap"

import Component from "../component"
import File from "./file"

export default class Folder extends Component {
  renderItem(file) {
    return <File file={file} key={file.path} onDoubleClick={this.props.onFileOpen} />
  }
  renderList() {
    return this.props.files.map((file) => this.renderItem(file))
  }
  render() {
    return this.props.files && this.props.files.length
      ? <Table responsive>
          <tbody>{this.renderList()}</tbody>
        </Table>
      : <div style={{ padding: '5px 5px 5px 18px' }}><i>Empty</i></div>
  }
}
