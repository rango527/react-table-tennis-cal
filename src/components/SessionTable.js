import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

export default class SessionTable extends Component {
  state = {}

  componentDidMount() {}

  render() {
    const { sessions } = this.props
    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Session Date</Table.HeaderCell>
            <Table.HeaderCell>Group</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sessions.map((session) => {
            return (
              <Table.Row key={session.date}>
                <Table.Cell>{new Date(session.date).toDateString()}</Table.Cell>
                <Table.Cell>{session.group.name}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }
}
