/*eslint-disable no-undef*/
/*eslint-disable arrow-parens*/
import React, { Component } from 'react'
import when from 'when'
import client from 'common/rest/client'
import follow from 'common/rest/follow' // function to hop multiple links by "rel"

import stompClient from 'common/rest/websocket-listener'
import EmployeeList from 'components/payroll/employee-list'
import CreateDialog from 'components/payroll/create-dialog'

const root = '/api'

export default class Payroll extends Component {
  constructor (props) {
    super(props)
    this.state = {employees: [], attributes: [], page: 1, pageSize: 2, links: {}}
    this.updatePageSize = this.updatePageSize.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onNavigate = this.onNavigate.bind(this)
    this.refreshCurrentPage = this.refreshCurrentPage.bind(this)
    this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this)
  }

  loadFromServer (pageSize) {
    follow(client, root, [
      {rel: 'employees', params: {size: pageSize}}]
    ).then(employeeCollection => {
      return client({
        method: 'GET',
        path: employeeCollection.entity._links.profile.href,
        headers: {'Accept': 'application/schema+json'}
      }).then(schema => {
        // tag::json-schema-filter[]
        /**
         * Filter unneeded JSON Schema properties, like uri references and
         * subtypes ($ref).
         */
        Object.keys(schema.entity.properties).forEach(function (property) {
          if (schema.entity.properties[property].hasOwnProperty('format') &&
            schema.entity.properties[property].format === 'uri') {
            delete schema.entity.properties[property]
          }
          if (schema.entity.properties[property].hasOwnProperty('$ref')) {
            delete schema.entity.properties[property]
          }
        })

        this.schema = schema.entity
        this.links = employeeCollection.entity._links
        return employeeCollection
        // end::json-schema-filter[]
      })
    }).then(employeeCollection => {
      this.page = employeeCollection.entity.page
      return employeeCollection.entity._embedded.employees.map(employee =>
        client({
          method: 'GET',
          path: employee._links.self.href
        })
      )
    }).then(employeePromises => {
      return when.all(employeePromises)
    }).done(employees => {
      this.setState({
        page: this.page,
        employees: employees,
        attributes: Object.keys(this.schema.properties),
        pageSize: pageSize,
        links: this.links
      })
    })
  }

  // tag::on-create[]
  onCreate (newEmployee) {
    follow(client, root, ['employees']).done(response => {
      client({
        method: 'POST',
        path: response.entity._links.self.href,
        entity: newEmployee,
        headers: {'Content-Type': 'application/json'}
      })
    })
  }

  // end::on-create[]

  // tag::on-update[]
  onUpdate (employee, updatedEmployee) {
    client({
      method: 'PUT',
      path: employee.entity._links.self.href,
      entity: updatedEmployee,
      headers: {
        'Content-Type': 'application/json',
        'If-Match': employee.headers.Etag
      }
    }).done(response => {
      /* Let the websocket handler update the state */
    }, response => {
      if (response.status.code === 403) {
        alert('ACCESS DENIED: You are not authorized to update ' +
          employee.entity._links.self.href)
      }
      if (response.status.code === 412) {
        alert('DENIED: Unable to update ' + employee.entity._links.self.href +
          '. Your copy is stale.')
      }
    })
  }

  // end::on-update[]

  // tag::on-delete[]
  onDelete (employee) {
    client({method: 'DELETE', path: employee.entity._links.self.href}
    ).done(response => { /* let the websocket handle updating the UI */ },
      response => {
        if (response.status.code === 403) {
          alert('ACCESS DENIED: You are not authorized to delete ' +
            employee.entity._links.self.href)
        }
      })
  }

  // end::on-delete[]

  onNavigate (navUri) {
    client({
      method: 'GET',
      path: navUri
    }).then(employeeCollection => {
      this.links = employeeCollection.entity._links
      this.page = employeeCollection.entity.page

      return employeeCollection.entity._embedded.employees.map(employee =>
        client({
          method: 'GET',
          path: employee._links.self.href
        })
      )
    }).then(employeePromises => {
      return when.all(employeePromises)
    }).done(employees => {
      this.setState({
        page: this.page,
        employees: employees,
        attributes: Object.keys(this.schema.properties),
        pageSize: this.state.pageSize,
        links: this.links
      })
    })
  }

  updatePageSize (pageSize) {
    if (pageSize !== this.state.pageSize) {
      this.loadFromServer(pageSize)
    }
  }

  // tag::websocket-handlers[]
  refreshAndGoToLastPage (message) {
    follow(client, root, [{
      rel: 'employees',
      params: {size: this.state.pageSize}
    }]).done(response => {
      this.onNavigate(response.entity._links.last.href)
    })
  }

  refreshCurrentPage (message) {
    follow(client, root, [{
      rel: 'employees',
      params: {
        size: this.state.pageSize,
        page: this.state.page.number
      }
    }]).then(employeeCollection => {
      this.links = employeeCollection.entity._links
      this.page = employeeCollection.entity.page

      return employeeCollection.entity._embedded.employees.map(employee => {
        return client({
          method: 'GET',
          path: employee._links.self.href
        })
      })
    }).then(employeePromises => {
      return when.all(employeePromises)
    }).then(employees => {
      this.setState({
        page: this.page,
        employees: employees,
        attributes: Object.keys(this.schema.properties),
        pageSize: this.state.pageSize,
        links: this.links
      })
    })
  }

  // end::websocket-handlers[]

  // tag::register-handlers[]
  componentDidMount () {
    this.loadFromServer(this.state.pageSize)
    stompClient.register([
      {route: '/topic/newEmployee', callback: this.refreshAndGoToLastPage},
      {route: '/topic/updateEmployee', callback: this.refreshCurrentPage},
      {route: '/topic/deleteEmployee', callback: this.refreshCurrentPage}
    ])
  }

  // end::register-handlers[]

  render () {
    return (
      <div>
        <CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
        <EmployeeList
          page={this.state.page}
          employees={this.state.employees}
          links={this.state.links}
          pageSize={this.state.pageSize}
          attributes={this.state.attributes}
          onNavigate={this.onNavigate}
          onUpdate={this.onUpdate}
          onDelete={this.onDelete}
          updatePageSize={this.updatePageSize}/>
      </div>
    )
  }
}
