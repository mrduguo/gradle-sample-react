/* eslint-env es2015*/
/* eslint arrow-parens: [2, "always"]*/
import React, {Component} from 'react'
import ReactDOM from 'react-dom'

export default class UpdateDialog extends Component {

  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    var updatedEmployee = {}
    this.props.attributes.forEach(attribute =>// eslint-disable-line
      updatedEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim()
    )
    this.props.onUpdate(this.props.employee, updatedEmployee)
    window.location = '#'
  }

  render () {
    var inputs = this.props.attributes.map(attribute =>// eslint-disable-line
      <p key={this.props.employee.entity[attribute]}>
        <input
          type='text'
          name={attribute}
          placeholder={attribute}
          defaultValue={this.props.employee.entity[attribute]}
          ref={attribute}
          className='field'/>
      </p>
    )

    var dialogId = 'updateEmployee-' + this.props.employee.entity._links.self.href

    return (
      <div>
        <a href={'#' + dialogId}>Update</a>
        <div id={dialogId} className='modalDialog'>
          <div>
            <a href='#' title='Close' className='close'>X</a>
            <h2>Update an employee</h2>
            <form>
              {inputs}
              <button onClick={this.handleSubmit}>
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

}
