import React, { useState } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import { baseUrl } from "./constants"
import { Container, Segment } from "semantic-ui-react"
import AppHeader from "./components/AppHeader"
import Players from "./pages/Players"
import Groups from "./pages/Groups"
import Results from "./pages/Results"
import LoginForm from "./components/LoginForm"
import CalculateRatingsContainer from "./pages/CalculateRatings"

export default function App() {
  const [user, setUser] = useState({})

  const handleLogin = (e) => {
    e.preventDefault()

    let params = {
      player: {
        username: e.currentTarget.username.value,
        password: e.currentTarget.password.value,
      },
    }

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

          setUser(data.player)
        } else {
          alert("Invalid username or password")
        }
      })
  }

  const handleLogout = () => {
    localStorage.clear()
  }

  const handleCreatePlayer = () => {}

  return (
    <Router>
      <Container style={{ padding: "1rem" }}>
        <Route
          path="/"
          render={(props) => (
            <AppHeader handleLogout={handleLogout} {...props} />
          )}
        ></Route>
        <main>
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
                  <Players
                    user={user}
                    handleCreatePlayer={handleCreatePlayer}
                    {...props}
                  />
                )}
              ></Route>

              <Route
                path="/groups"
                render={(props) => (
                  <Groups
                    user={user}
                    // handleAddPlayerToGroup={handleAddPlayerToGroup}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                path="/results"
                render={(props) => <Results user={user} {...props} />}
              ></Route>
              {localStorage.getItem("token") ? (
                <Route
                  path="/record-results"
                  render={(props) => (
                    <CalculateRatingsContainer
                      path="/record-results"
                      {...props}
                    />
                  )}
                ></Route>
              ) : null}
            </Segment>
          </Switch>
        </main>
      </Container>
    </Router>
  )
}
