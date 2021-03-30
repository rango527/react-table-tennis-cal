import React, { Component } from "react"
import { Route } from "react-router-dom"
import SessionTable from "../components/SessionTable"
import MatchesTable from "../components/MatchesTable"
import { Loader } from "semantic-ui-react"
import { baseUrl } from "../constants"

export default class SessionContainer extends Component {
  state = {
    sessions: [],
    activeItem: null,
  }

  fetchSessions = () => {
    fetch(baseUrl + "/sessions", {})
      .then((res) => res.json())
      .then((sessions) => {
        this.setState({ sessions })
      })
      .catch((e) => console.error(e))
  }

  handleSessionClick = (e, session_id) => {
    const { sessions } = this.state
    this.setState({
      activeItem: session_id,
      matches: sessions.find((session) => session.id === session_id).matches,
    })
    this.props.history.push(`/results/${session_id}`)
  }

  componentDidMount() {
    this.fetchSessions()
  }

  render() {
    const { sessions, activeItem } = this.state

    return (
      <>
        <Route
          path={`/results/:sessionId`}
          render={(props) => <MatchesTable {...props} />}
        ></Route>

        {sessions.length > 0 ? (
          <Route
            exact
            path={`/results`}
            render={(props) => (
              <SessionTable
                sessions={sessions}
                activeItem={activeItem}
                handleSessionClick={this.handleSessionClick}
                {...props}
              />
            )}
          ></Route>
        ) : (
          <Loader style={{ marginTop: "1rem" }} active inline="centered" />
        )}
      </>
    )
  }
}
