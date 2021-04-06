import React, { useState } from "react"
import { Link, Route } from "react-router-dom"
import { Loader, Button, Icon, Message } from "semantic-ui-react"
import PlayerTable from "../components/PlayerTable"
import PlayerStats from "../components/PlayerStats"

export default function PlayerContainer({
  user,
  groups,
  players,
  handleAddPlayerToGroup,
  loading,
  handleCreatePlayer,
}) {
  const [column, setColumn] = useState(null)
  const [direction, setDirection] = useState(null)
  const [sortedPlayers, setSortedPlayers] = useState([])

  const handleHeaderClick = (e, name) => {
    let sortedPlayers
    if (name === column) {
      sortedPlayers = players.reverse()
    } else {
      if (name === "rating") {
        sortedPlayers = players.sort((a, b) => {
          return (
            a.ratings[a.ratings.length - 1].value -
            b.ratings[b.ratings.length - 1].value
          )
        })
      } else if (name === "group") {
        sortedPlayers = players.sort((a, b) => {
          if (a.groups.length === 0) {
            return -1
          }
          if (b.groups.length === 0) {
            return 1
          }
          if (a.groups[0].name < b.groups[0].name) {
            return -1
          }
          if (a.groups[0].name > b.groups[0].name) {
            return 1
          }
          return 0
        })
      } else if (name === "email") {
        sortedPlayers = players.sort((a, b) => {
          if (a.email < b.email) {
            return -1
          }
          if (a.email > b.email) {
            return 1
          }
          return 0
        })
      } else if (name === "name") {
        sortedPlayers = players.sort((a, b) => {
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

  return (
    <>
      <Route
        path={`/players/:playerId`}
        render={(props) => <PlayerStats {...props} />}
      />
      {players.length > 0 && !loading ? (
        <>
          {localStorage.getItem("token") === true ? (
            <Link to="/create-player" onClick={handleCreatePlayer}>
              <Button icon labelPosition="left" onClick={handleCreatePlayer}>
                <Icon name="plus" />
                Create Player
              </Button>
            </Link>
          ) : null}
          <Route exact path="/players">
            <Message attached>
              <div className="content">
                <div className="header">Player Ratings</div>
                <p>
                  Here's a list of player ratings. We started with the last
                  rating maintained by Charlene before she left. We don't have a
                  ratings history that predates the beginning of March, when we
                  restarted the league, but if a player has played in the league
                  since the restart, there will be a little chart icon{" "}
                  <Icon name="chart line" /> by their name. Click on that to see
                  their ratings history.
                </p>
              </div>
            </Message>
            <PlayerTable
              loading={loading}
              user={user}
              groups={groups}
              players={sortedPlayers.length > 0 ? sortedPlayers : players}
              column={column}
              direction={direction}
              handleHeaderClick={handleHeaderClick}
              handleAddPlayerToGroup={handleAddPlayerToGroup}
            />
          </Route>
        </>
      ) : (
        <Loader style={{ marginTop: "1rem" }} active inline="centered" />
      )}
    </>
  )
}
