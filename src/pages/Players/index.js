import React from "react"
import { Link, Route } from "react-router-dom"
import { Loader, Button, Icon, Message } from "semantic-ui-react"
import PlayerTable from "../../components/PlayerTable"
import PlayerStats from "../../components/PlayerStats"
import ErrorMessage from "../../components/ErrorMessage"
import { useQuery } from "react-query"
import { fetchPlayers, fetchGroups } from "../../api"

export default function PlayerContainer({ user, handleCreatePlayer }) {
  const {
    data: players,
    error: playersError,
    isLoading: isLoadingPlayers,
    isError: isPlayersError,
  } = useQuery("players", fetchPlayers)

  const {
    data: groups,
    error: groupsError,
    isLoading: isLoadingGroups,
    isError: isGroupsError,
  } = useQuery("groups", fetchGroups)

  const isLoading = isLoadingPlayers || isLoadingGroups
  const isError = isPlayersError || isGroupsError
  const error = playersError ? playersError : groupsError

  if (isLoading) {
    return <Loader style={{ marginTop: "1rem" }} active inline="centered" />
  }

  if (isError) {
    return <ErrorMessage message={error} />
  }

  return (
    <>
      <Route
        path={`/players/:playerId`}
        render={(props) => <PlayerStats {...props} />}
      />

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
                Here's a list of player ratings. We started with the last rating
                maintained by Charlene before she left. We don't have a ratings
                history that predates the beginning of March, when we restarted
                the league, but if a player has played in the league since the
                restart, there will be a little chart icon{" "}
                <Icon name="chart line" /> by their name. Click on that to see
                their ratings history.
              </p>
            </div>
          </Message>

          <PlayerTable user={user} groups={groups} players={players} />
        </Route>
      </>
    </>
  )
}
