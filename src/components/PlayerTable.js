import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

export default class PlayerTable extends Component {
  render() {
    const { column, direction, players, handleHeaderClick } = this.props

    return (
      <Table sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'name' ? direction : null}
              onClick={(e) => handleHeaderClick(e, 'name')}
            >
              Name
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'email' ? direction : null}
              onClick={(e) => handleHeaderClick(e, 'email')}
            >
              E-mail address
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'group' ? direction : null}
              onClick={(e) => handleHeaderClick(e, 'group')}
            >
              Group(s)
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'rating' ? direction : null}
              onClick={(e) => handleHeaderClick(e, 'rating')}
            >
              Rating
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {players.map((player) => {
            return (
              <Table.Row key={player.name}>
                <Table.Cell>{player.name}</Table.Cell>
                <Table.Cell>{player.email}</Table.Cell>
                <Table.Cell>
                  {player.groups.map((group, index) => {
                    const appendToName =
                      index === player.groups.length - 1 ? '' : `${', '}`
                    return group.name + appendToName
                  })}
                </Table.Cell>

                <Table.Cell>
                  {player.ratings.length > 0
                    ? player.ratings[player.ratings.length - 1].value
                    : ''}
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }
}
