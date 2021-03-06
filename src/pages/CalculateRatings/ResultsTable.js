import React from "react"
import { Table } from "semantic-ui-react"

export default function ResultsTable({ matches }) {
  console.log(
    "🚀 ~ file: ResultsTable.js ~ line 5 ~ ResultsTable ~ matches",
    matches
  )
  const matchesToReport = matches.filter((match) => match.count && match.played)
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Winner</Table.HeaderCell>
          <Table.HeaderCell>Loser</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {matchesToReport.map((match, i) => {
          return (
            <Table.Row key={`${match.winner.name} beat ${match.loser.name}`}>
              <Table.Cell>{match.winner.name}</Table.Cell>
              <Table.Cell>{match.loser.name}</Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}
