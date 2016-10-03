import React from "react"
import { Button, ButtonGroup, Overlay, Popover } from "react-bootstrap"
import onClickOutside from "react-onclickoutside"

class ContextMenu extends React.Component {
  handleClickOutside() {
    this.props.onClose()
  }
  render() {
    return <Overlay
      show={this.props.show}
      target={this.props.target}
      placement="left"
      container={this}
      containerPadding={0}>
      <Popover id={this.props.id}>
        <ButtonGroup vertical block>
          <Button>Button</Button>
          <Button>Button</Button>
        </ButtonGroup>
      </Popover>
    </Overlay>
  }
}

export default onClickOutside(ContextMenu)
