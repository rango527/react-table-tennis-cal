import React, { Component } from "react"
import { Dropdown, Table, Loader, Icon } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { isAdmin, groupNameFromGroupId } from "../utilities"

export default class PlayerTable extends Component {
  componentDidMount() {}

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

    return (
      <>
        {players.length > 0 ? (
          <>
            <Table
              // sortable
              celled
            >
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    sorted={column === "name" ? direction : null}
                    // onClick={(e) => handleHeaderClick(e, "name")}
                  >
                    Name
                  </Table.HeaderCell>
                  {isAdmin() ? (
                    <Table.HeaderCell
                      sorted={column === "email" ? direction : null}
                      // onClick={(e) => handleHeaderClick(e, "email")}
                    >
                      E-mail address
                    </Table.HeaderCell>
                  ) : null}
                  <Table.HeaderCell
                    sorted={column === "group" ? direction : null}
                    // onClick={(e) => handleHeaderClick(e, "group")}
                  >
                    Group(s)
                  </Table.HeaderCell>
                  {isAdmin() ? (
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  ) : null}
                  <Table.HeaderCell
                    sorted={column === "rating" ? direction : null}
                    // onClick={(e) => handleHeaderClick(e, "rating")}
                  >
                    Rating
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {players.map((player) => {
                  if (!player.hide) {
                    return (
                      <Table.Row key={player.name}>
                        <Table.Cell>
                          {player.most_recent_rating ? (
                            <div>
                              {player.name}
                              {player.participated ? (
                                <Link to={`/players/${player.id}`}>
                                  <Icon
                                    name="chart line"
                                    style={{
                                      marginLeft: ".25rem",
                                    }}
                                  />
                                </Link>
                              ) : null}
                            </div>
                          ) : (
                            player.name
                          )}
                        </Table.Cell>
                        {isAdmin() ? (
                          <Table.Cell>{player.email}</Table.Cell>
                        ) : null}
                        <Table.Cell>
                          {player.player_groups.map((player_group, index) => {
                            const appendToName =
                              index === player.player_groups.length - 1
                                ? ""
                                : `${", "}`
                            return (
                              groupNameFromGroupId(
                                groups,
                                player_group.group_id
                              ) + appendToName
                            )
                          })}
                        </Table.Cell>
                        {isAdmin() ? (
                          <Table.Cell>
                            {!loading ? (
                              <Dropdown compact style={{ width: "50%" }}>
                                <Dropdown.Menu>
                                  {groups
                                    .filter(
                                      (group) =>
                                        player.player_groups
                                          .map((g) => g.group_id)
                                          .indexOf(group.id) === -1
                                    )
                                    .map((group) => {
                                      return (
                                        <Dropdown.Item
                                          key={`${player.name}-${group.name}-Add`}
                                          onClick={() =>
                                            handleAddPlayerToGroup(
                                              group.id,
                                              player.id,
                                              "add"
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
                                        player.player_groups
                                          .map((g) => g.group_id)
                                          .indexOf(group.id) !== -1
                                    )
                                    .map((group) => {
                                      return (
                                        <Dropdown.Item
                                          key={`${player.name}-${group.name}-Remove`}
                                          onClick={() =>
                                            handleAddPlayerToGroup(
                                              group.id,
                                              player.id,
                                              "remove"
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

                        <Table.Cell>{player.most_recent_rating}</Table.Cell>
                      </Table.Row>
                    )
                  }
                })}
              </Table.Body>
            </Table>
          </>
        ) : null}
      </>
    )
  }
}
