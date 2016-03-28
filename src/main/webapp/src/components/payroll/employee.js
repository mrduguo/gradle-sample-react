import React, { Component } from 'react'
import UpdateDialog from './update-dialog'

export default class Employee extends Component {
  constructor (props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleDelete () {
    this.props.onDelete(this.props.employee)
  }

  render () {
    return (
      <tr>
        <td>
          {this.props.employee.entity.firstName}
        </td>
        <td>
          {this.props.employee.entity.lastName}
        </td>
        <td>
          {this.props.employee.entity.description}
        </td>
        <td>
          {this.props.employee.entity.manager.name}
        </td>
        <td>
          <UpdateDialog
            employee={this.props.employee}
            attributes={this.props.attributes}
            onUpdate={this.props.onUpdate}/>
        </td>
        <td>
          <button onClick={this.handleDelete}>
            Delete
          </button>
        </td>
      </tr>
    )
  }
}
