import React, { Component } from 'react'
import Header from './header'
import Footer from './footer'
import './_base'
import './_container'

export default class Container extends Component {
  render () {
    return (
      <div className='container bar'>
        <Header />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}
