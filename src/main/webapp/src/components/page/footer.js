import React from 'react'
import './_footer'

export default class Footer extends React.Component {
  render () {
    const year = (new Date()).getFullYear()
    return (
      <div className='footer'>
        &copy; ACME {year}
      </div>
    )
  }
}
