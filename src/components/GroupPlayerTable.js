import React, { useState, useEffect } from "react"
import { baseUrl } from "../constants"
import PlayerTable from "./PlayerTable"
import { Loader } from "semantic-ui-react"

export default function GroupPlayerTable({
  user,
  groups,
  match,
  handleAddPlayerToGroup: handleAddPlayerToGroupFromProps,
}) {
  const [groupId, setGroupId] = useState(null)
  const [column, setColumn] = useState(null)
  const [direction, setDirection] = useState(null)
  const [sortedPlayers, setSortedPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  const handleHeaderClick = (e, name) => {
    if (name === column) {
      sortedPlayers = sortedPlayers.reverse()
    } else {
      if (name === "rating") {
        sortedPlayers = sortedPlayers.sort((a, b) => {
          return (
            a.ratings[a.ratings.length - 1].value -
            b.ratings[b.ratings.length - 1].value
          )
        })
      } else if (name === "group") {
        sortedPlayers = sortedPlayers.sort((a, b) => {
          if (a.groups[0].name < b.groups[0].name) {
            return -1
          }
          if (a.groups[0].name > b.groups[0].name) {
            return 1
          }
          return 0
        })
      } else if (name === "email") {
        sortedPlayers = sortedPlayers.sort((a, b) => {
          if (a.email < b.email) {
            return -1
          }
          if (a.email > b.email) {
            return 1
          }
          return 0
        })
      } else if (name === "name") {
        sortedPlayers = sortedPlayers.sort((a, b) => {
          if (a.name < b.name) {
            return -1
          }
          if (a.name > b.name) {
            return 1
          }
          return 0
        })
      }
    }

    setColumn(name)
    setDirection(direction === "ascending" ? "descending" : "ascending")
    setSortedPlayers(sortedPlayers)
  }

  const handleAddPlayerToGroup = (group_id, player_id, addOrRemove = "add") => {
    setSortedPlayers([])

    handleAddPlayerToGroupFromProps(group_id, player_id, addOrRemove)
  }

  const fetchGroup = () => {
    const { groupId } = match.params
    fetch(baseUrl + `/groups/${groupId}`, {})
      .then((res) => res.json())
      .then((group) => {
        const sortedPlayers = group.players.sort((a, b) => {
          if (a.most_recent_rating && b.most_recent_rating) {
            return b.most_recent_rating - a.most_recent_rating
          } else {
            return 0
          }
        })
        setGroupId(groupId)
        setSortedPlayers(sortedPlayers)
        setLoading(false)
      })
      .catch((e) => console.error(e))
  }

  useEffect(() => {
    fetchGroup()
  }, [match.params.groupId])

  return (
    <>
      {!loading && sortedPlayers.length > 0 && groups.length > 0 ? (
        <PlayerTable
          user={user}
          groups={groups}
          column={column}
          direction={direction}
          players={sortedPlayers}
          handleHeaderClick={handleHeaderClick}
          handleAddPlayerToGroup={handleAddPlayerToGroup}
        />
      ) : (
        <Loader style={{ marginTop: "1rem" }} active inline="centered" />
      )}
    </>
  )
}
