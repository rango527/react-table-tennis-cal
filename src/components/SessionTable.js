import React, { Component } from "react"
import { Table, Message } from "semantic-ui-react"

export default class SessionTable extends Component {
  state = {}

  componentDidMount() {}

  render() {
    const { sessions, handleSessionClick, activeItem } = this.props
    return (
      <>
        <Message
          attached
          header="Past Sessions"
          content="Click on a session to see a list of results from that session."
        />
        <Table singleLine selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Session Date</Table.HeaderCell>
              <Table.HeaderCell>Group</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {sessions.map((session) => {
              return (
                <Table.Row
                  key={session.date}
                  onClick={(e) => handleSessionClick(e, session.id)}
                  active={activeItem === session.id}
                >
                  <Table.Cell>
                    {new Date(session.date).toDateString()}
                  </Table.Cell>
                  <Table.Cell>{session.group.name}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </>
    )
  }
}
