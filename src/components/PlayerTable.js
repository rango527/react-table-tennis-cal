import React, { Component } from 'react'
import { Dropdown, Table, Loader, Icon } from 'semantic-ui-react'

export default class PlayerTable extends Component {
  render() {
    const {
      column,
      direction,
      players,
      handleHeaderClick,
      groups,
      handleAddPlayerToGroup,
      handleShowPlayer,
      loading,
    } = this.props

    return (
      <Table sortable celled>
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
            {localStorage.getItem('admin') ? (
              <Table.HeaderCell>Actions</Table.HeaderCell>
            ) : null}
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
                <Table.Cell>
                  {player.ratings.length > 1 ? (
                    <div>
                      {player.name}
                      <Icon
                        name="chart line"
                        onClick={() => handleShowPlayer(player)}
                        style={{ marginLeft: '.25rem' }}
                      />
                    </div>
                  ) : (
                    player.name
                  )}
                </Table.Cell>
                <Table.Cell>{player.email}</Table.Cell>
                <Table.Cell>
                  {player.groups.map((group, index) => {
                    const appendToName =
                      index === player.groups.length - 1 ? '' : `${', '}`
                    return group.name + appendToName
                  })}
                </Table.Cell>
                {localStorage.getItem('admin') ? (
                  <Table.Cell>
                    {!loading ? (
                      <Dropdown compact style={{ width: '50%' }}>
                        <Dropdown.Menu>
                          {groups
                            .filter(
                              (group) =>
                                player.groups
                                  .map((g) => g.id)
                                  .indexOf(group.id) === -1
                            )
                            .map((group) => {
                              return (
                                <Dropdown.Item
                                  key={group.name}
                                  onClick={() =>
                                    handleAddPlayerToGroup(
                                      group.id,
                                      player.id,
                                      'add'
                                    )
                                  }
                                >
                                  Add to {group.name}
                                </Dropdown.Item>
                              )
                            })}
                          {groups
                            .filter(
                              (group) =>
                                player.groups
                                  .map((g) => g.id)
                                  .indexOf(group.id) !== -1
                            )
                            .map((group) => {
                              return (
                                <Dropdown.Item
                                  key={group.name}
                                  onClick={() =>
                                    handleAddPlayerToGroup(
                                      group.id,
                                      player.id,
                                      'remove'
                                    )
                                  }
                                >
                                  Remove from {group.name}
                                </Dropdown.Item>
                              )
                            })}
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : (
                      <Loader active inline="centered" />
                    )}
                  </Table.Cell>
                ) : null}

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
