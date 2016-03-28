import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Container from 'components/page/container'
import Payroll from 'components/payroll/payroll'

class App extends Component {
  render () {
    return (
      <Container>
        <Payroll />
      </Container>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react'))
