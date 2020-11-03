import React, { Component } from 'react'
import { Dropdown, Table, Loader, Icon, Modal } from 'semantic-ui-react'
import PlayerStats from './PlayerStats'

export default class PlayerTable extends Component {
  state = {
    modalOpen: false,
    modalPlayer: {},
  }

  render() {
    const {
      column,
      direction,
      players,
      handleHeaderClick,
      groups,
      handleAddPlayerToGroup,
      loading,
    } = this.props

    const { modalOpen, modalPlayer } = this.state

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
                      <Modal
                        closeIcon
                        open={modalOpen}
                        trigger={
                          <Icon
                            name="chart line"
                            // onClick={() => handleShowPlayer(player)}
                            style={{ marginLeft: '.25rem' }}
                          />
                        }
                        onClose={() =>
                          this.setState({ modalOpen: false, modalPlayer: {} })
                        }
                        onOpen={() =>
                          this.setState({
                            modalOpen: true,
                            modalPlayer: player,
                          })
                        }
                      >
                        <Modal.Content>
                          <PlayerStats player={modalPlayer} />
                        </Modal.Content>
                      </Modal>
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
