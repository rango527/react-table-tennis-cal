import React from "react"
import { useMutation, useQueryClient } from "react-query"
import { addPlayerToGroup } from "../api"
import { Dropdown, Table, Loader, Icon } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { isAdmin, groupNameFromGroupId } from "../utilities"

export default function PlayerTable({ players, groups }) {
  const queryClient = useQueryClient()

  const { mutate: groupMutate, isLoading, isError, isSuccess } = useMutation(
    ({ groupId, playerId, addOrRemove }) =>
      addPlayerToGroup(groupId, playerId, addOrRemove),
    {
      onSuccess: ({ group, groupId, playerId }) => {
        // queryClient.invalidateQueries("groups")
        // queryClient.invalidateQueries(["group", groupId])
        // queryClient.refetchQueries(["group", group.id])
        // queryClient.invalidateQueries("players")
        // queryClient.invalidateQueries(["player", playerId])
        queryClient.refetchQueries({ stale: true })
      },
    }
  )

  return (
    <>
      {players.length > 0 ? (
        <>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                {isAdmin() ? (
                  <Table.HeaderCell>E-mail address</Table.HeaderCell>
                ) : null}
                <Table.HeaderCell>Group(s)</Table.HeaderCell>
                {isAdmin() ? (
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                ) : null}
                <Table.HeaderCell>Rating</Table.HeaderCell>
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
                          {!isLoading && !isError ? (
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
                                          groupMutate({
                                            groupId: group.id,
                                            playerId: player.id,
                                            addOrRemove: "add",
                                          })
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
                                          groupMutate({
                                            groupId: group.id,
                                            playerId: player.id,
                                            addOrRemove: "remove",
                                          })
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
                } else {
                  return null
                }
              })}
            </Table.Body>
          </Table>
        </>
      ) : null}
    </>
  )
}
