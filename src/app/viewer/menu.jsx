import React from "react"
import { Clearfix, MenuItem } from "react-bootstrap"
import onClickOutside from "react-onclickoutside"

import styles from "./styles.css"

class Popover extends React.Component {
  render() {
    return <div id={this.props.id} className={styles.popover}>
      <Clearfix className="open">
        <ul className="dropdown-menu">
          <MenuItem onSelect={this.props.onOpen}>Open</MenuItem>
          <MenuItem onSelect={this.props.onDelete}>Delete</MenuItem>
        </ul>
      </Clearfix>
    </div>
  }
}

class ContextMenu extends React.Component {
  handleClickOutside() {
    this.props.onClose()
  }
  render() {
    return this.props.show
      ? <Popover onOpen={this.props.onOpen} onDelete={this.props.onDelete}/>
      : null
  }
}

const Wrapper = onClickOutside(ContextMenu)

export default class ContextMenuWrapper extends React.Component {
  render() {
    return <Wrapper {...this.props} outsideClickIgnoreClass={styles.popover} />
  }
}
