import React, { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom"
import { baseUrl, HEADERS } from "./constants"
import { Container, Segment, Header, Button, Message } from "semantic-ui-react"
import Nav from "./components/Nav"
import PlayerContainer from "./containers/PlayerContainer"
import GroupContainer from "./containers/GroupContainer"
import SessionContainer from "./containers/SessionContainer"
import LoginForm from "./components/LoginForm"
import CalculateRatings from "./components/CalculateRatings"

export default function App() {
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState([])
  const [players, setPlayers] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState({})

  const handleLogin = (e) => {
    e.preventDefault()

    let params = {
      player: {
        username: e.currentTarget.username.value,
        password: e.currentTarget.password.value,
      },
    }

    setError("")

    fetch(baseUrl + "/login", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          window.history.pushState({}, "Home", "/")
          localStorage.setItem("token", data.jwt)
          localStorage.setItem("admin", data.player.admin)

          setError("")
          setLoggedIn(true)
          setUser(data.player)
        } else {
          setError("Invalid username or password")
          alert("Invalid username or password")
        }
      })
  }

  const handleLogout = () => {
    localStorage.clear()
    setLoggedIn(false)
  }

  const fetchGroups = () => {
    setLoading(true)
    setGroups([])

    fetch(baseUrl + "/groups", {})
      .then((res) => res.json())
      .then((groups) => {
        setLoading(false)
        setGroups(groups)
      })
      .catch((e) => console.error(e))
  }

  const fetchPlayers = () => {
    setLoading(true)
    setPlayers([])

    fetch(baseUrl + "/players", {})
      .then((res) => res.json())
      .then((players) => {
        const sortedPlayers = players.sort((a, b) => {
          if (a.most_recent_rating && b.most_recent_rating) {
            return b.most_recent_rating - a.most_recent_rating
          } else {
            return 0
          }
        })
        setLoading(false)
        setPlayers(sortedPlayers)
      })
      .catch((e) => console.error(e))
  }

  const handleAddPlayerToGroup = (groupId, playerId, addOrRemove) => {
    setLoading(true)

    let data = {
      player_id: playerId,
      add_or_remove: addOrRemove,
    }

    fetch(`${baseUrl}/groups/${groupId}`, {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        fetchPlayers()
        fetchGroups()
        setLoading(false)
      })
  }

  const handleCreatePlayer = () => {}

  useEffect(() => {
    fetchGroups()
    fetchPlayers()
  }, [])

  return (
    <Router>
      <Container style={{ padding: "1rem" }}>
        <div>
          <Segment clearing>
            <Header as="h1" floated="left">
              WDCTT Ratings
            </Header>
            {localStorage.getItem("token") ? (
              <Link to="/login" onClick={handleLogout}>
                <Button floated="right">Log Out</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button floated="right">Log In</Button>
              </Link>
            )}
          </Segment>
          <Route path="/" render={(props) => <Nav {...props} />}></Route>

          <Message
            style={{ marginBottom: "1rem" }}
            content="If you see something wrong, or have questions, email Oren Magid at oren.michael.magid@gmail.com."
          />
        </div>
        <Switch>
          <Segment>
            <Route exact path="/">
              <Redirect to="/players" />
            </Route>
            <Route path="/login">
              {!localStorage.getItem("token") ? (
                <LoginForm handleLogin={handleLogin} />
              ) : (
                <Redirect to="/players" />
              )}
            </Route>
            <Route
              path="/players"
              render={(props) => (
                <PlayerContainer
                  loading={loading}
                  user={user}
                  groups={groups}
                  players={players}
                  handleAddPlayerToGroup={handleAddPlayerToGroup}
                  handleCreatePlayer={handleCreatePlayer}
                  {...props}
                />
              )}
            ></Route>

            <Route
              path="/groups"
              render={(props) => (
                <GroupContainer
                  loading={loading}
                  user={user}
                  groups={groups}
                  players={players}
                  handleAddPlayerToGroup={handleAddPlayerToGroup}
                  {...props}
                />
              )}
            ></Route>
            <Route
              path="/results"
              render={(props) => <SessionContainer user={user} {...props} />}
            ></Route>
            {localStorage.getItem("token") ? (
              <Route
                path="/record-results"
                render={(props) => (
                  <CalculateRatings path="/record-results" {...props} />
                )}
              ></Route>
            ) : null}
          </Segment>
        </Switch>
      </Container>
    </Router>
  )
}
