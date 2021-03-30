import React, { Component } from "react"
import { Table } from "semantic-ui-react"

export default class ResultsTable extends Component {
  state = {}

  componentDidMount() {}

  render() {
    const { matches } = this.props
    const matchesToReport = matches.filter(
      (match) => match.count && match.played
    )
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
              <Table.Row key={match.id + i}>
                <Table.Cell>{match.winner.name}</Table.Cell>
                <Table.Cell>{match.loser.name}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }
}
