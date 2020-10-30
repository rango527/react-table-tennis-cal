import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

export default class MatchesTable extends Component {
  state = {}

  componentDidMount() {}

  render() {
    const { matches } = this.props
    console.log('MatchesTable -> render -> matches', matches)

    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Winner</Table.HeaderCell>
            <Table.HeaderCell>Loser</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {matches.map((match) => {
            return (
              <Table.Row key={match.id}>
                <Table.Cell>
                  {
                    match.players.find(
                      (player) => player.id === match.winner_id
                    ).name
                  }
                </Table.Cell>
                <Table.Cell>
                  {
                    match.players.find(
                      (player) => player.id !== match.winner_id
                    ).name
                  }
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }
}
