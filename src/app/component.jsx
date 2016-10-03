import React from "react"

export default class Component extends React.Component {
  updateState(state) {
    this.setState(Object.assign({}, this.state, state))
  }
}
