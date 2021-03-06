import React from "react"
import { ListGroup, ListGroupItem, Panel } from "react-bootstrap"

export default class Favorites extends React.Component {
  constructor(props) {
    super(props)
  }
  handleClick(path, e) {
    e.preventDefault()
    this.props.onChangePath(path)
  }
  render() {
    const header = <div>Favorites</div>
    return <Panel header={header}>
      <ListGroup fill>
        <ListGroupItem>
          <a href="#" onClick={this.handleClick.bind(this, this.props.home)}>Home</a>
        </ListGroupItem>
    </ListGroup>
    </Panel>
  }
}
