import React from "react"
import { Col, Grid, Row } from "react-bootstrap"
import os from "os"

import Favorites from './favorites'
import Viewer from './viewer'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      home: os.homedir(),
      path: os.homedir()
    }
  }
  componentDidMount() {
    localStorage.setItem('key', 'test')
  }
  handleChangePath(path) {
    this.updateState({ path })
  }
  updateState(state) {
    this.setState(Object.assign({}, this.state, state))
  }
  render() {
    return <Grid fluid={true}>
      <Row>
        <Col sm={2}><Favorites home={this.state.home} onChangePath={this.handleChangePath.bind(this)} /></Col>
        <Col sm={10}><Viewer path={this.state.path}/></Col>
      </Row>
    </Grid>
  }
}
