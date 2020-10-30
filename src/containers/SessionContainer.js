import React, { Component, Fragment } from 'react'
import SessionTable from '../components/SessionTable'
import MatchesTable from '../components/MatchesTable'
import { baseUrl } from '../constants'

export default class SessionContainer extends Component {
  state = {
    sessions: [],
    matches: [],
    activeItem: null,
  }

  fetchSessions = () => {
    let token = localStorage.getItem('token')
    if (token) {
      fetch(baseUrl + '/sessions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((sessions) => {
          this.setState({ sessions })
        })
        .catch((e) => console.error(e))
    }
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
        <SessionTable
          sessions={sessions}
          activeItem={activeItem}
          handleSessionClick={this.handleSessionClick}
        />
        {activeItem ? <MatchesTable matches={matches} /> : null}
      </Fragment>
    )
  }
}
