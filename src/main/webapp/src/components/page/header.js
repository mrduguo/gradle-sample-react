import React, { Component } from 'react'
import './_header'

export default class Header extends Component {
  render () {
    return (
      <div className='header u-clearfix'>
        Hello, <span>user</span>.
        <form action='/logout' method='post'>
          <input type='submit' value='Log Out'/>
        </form>
        <h1>Spring Boot with React Example</h1>
      </div>
    )
  }
}
