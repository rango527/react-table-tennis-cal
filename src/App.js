import React, { Component } from "react"
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

export default class App extends Component {
  state = {
    loading: false,
    groups: [],
    players: [],
    loggedIn: false,
    error: "",
    user: {},
  }

  handleLogin = (e) => {
    e.preventDefault()

    let params = {
      player: {
        username: e.currentTarget.username.value,
        password: e.currentTarget.password.value,
      },
    }

    this.setState({ error: "" })

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

          this.setState({
            error: "",
            loggedIn: true,
            user: data.player,
          })
        } else {
          this.setState({ error: "Invalid username or password" })
          alert("Invalid username or password")
        }
      })
  }

  handleLogout = () => {
    localStorage.clear()
    this.setState({ loggedIn: false })
  }

  fetchGroups = () => {
    this.setState({ loading: true, groups: [] })

    fetch(baseUrl + "/groups", {})
      .then((res) => res.json())
      .then((groups) => {
        this.setState({ groups, loading: false })
      })
      .catch((e) => console.error(e))
  }

  fetchPlayers = () => {
    this.setState({ loading: true, players: [] })

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

        this.setState({
          players: sortedPlayers,
          loading: false,
        })
      })
      .catch((e) => console.error(e))
  }

  handleAddPlayerToGroup = (groupId, playerId, addOrRemove) => {
    this.setState({ loading: true })

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
        this.fetchPlayers()
        this.fetchGroups()
        this.setState({
          loading: false,
        })
      })
  }

  handleCreatePlayer = () => {}

  componentDidMount() {
    this.fetchGroups()
    this.fetchPlayers()
  }

  render() {
    const { user, groups, players, loading } = this.state
    return (
      <Router>
        <Container style={{ padding: "1rem" }}>
          <div>
            <Segment clearing>
              <Header as="h1" floated="left">
                WDCTT Ratings
              </Header>
              {localStorage.getItem("token") ? (
                <Link to="/login" onClick={this.handleLogout}>
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
                  <LoginForm handleLogin={this.handleLogin} />
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
                    handleAddPlayerToGroup={this.handleAddPlayerToGroup}
                    handleCreatePlayer={this.handleCreatePlayer}
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
                    handleAddPlayerToGroup={this.handleAddPlayerToGroup}
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
}
