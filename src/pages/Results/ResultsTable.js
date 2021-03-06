import React from "react"
import { Table, Message } from "semantic-ui-react"
import { getFormattedDate } from "../../utilities"

export default function ResultsTable({
  sessions,
  handleSessionClick,
  activeItem,
}) {
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
          {sessions.map((session, i) => {
            return (
              <Table.Row
                key={session.date + i}
                onClick={(e) => handleSessionClick(e, session.id)}
                active={activeItem === session.id}
              >
                <Table.Cell>{getFormattedDate(session.date)}</Table.Cell>
                <Table.Cell>{session.group.name}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </>
  )
}
