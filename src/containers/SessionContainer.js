import React, { Component, Fragment } from 'react'
import SessionTable from '../components/SessionTable'
import MatchesTable from '../components/MatchesTable'
import { Loader } from 'semantic-ui-react'
import { baseUrl, HEADERS } from '../constants'

export default class SessionContainer extends Component {
  state = {
    sessions: [],
    matches: [],
    activeItem: null,
  }

  fetchSessions = () => {
    // let token = localStorage.getItem('token')
    // if (token) {
    fetch(baseUrl + '/sessions', {
      // headers: HEADERS,
    })
      .then((res) => res.json())
      .then((sessions) => {
        this.setState({ sessions })
      })
      .catch((e) => console.error(e))
    // }
  }

  handleSessionClick = (e, session_id) => {
    const { sessions } = this.state
    this.setState({
      activeItem: session_id,
      matches: sessions.find((session) => session.id === session_id).matches,
    })
  }

  componentDidMount() {
    this.fetchSessions()
  }

  render() {
    const { sessions, activeItem, matches } = this.state

    return (
      <Fragment>
        {sessions.length > 0 ? (
          <SessionTable
            sessions={sessions}
            activeItem={activeItem}
            handleSessionClick={this.handleSessionClick}
          />
        ) : (
          <Loader style={{ marginTop: '1rem' }} active inline="centered" />
        )}

        {activeItem ? <MatchesTable matches={matches} /> : null}
      </Fragment>
    )
  }
}
