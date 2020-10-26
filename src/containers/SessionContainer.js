import React, { Component, Fragment } from 'react'
import SessionTable from '../components/SessionTable'
import CreateSessionForm from '../components/CreateSessionForm'
import { Button } from 'semantic-ui-react'
import { baseUrl } from '../constants'

export default class SessionContainer extends Component {
  state = {
    sessions: [],
    groups: [],
    displayForm: false,
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

  fetchGroups = () => {
    let token = localStorage.getItem('token')
    if (token) {
      fetch(baseUrl + '/groups', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((groups) => {
          this.setState({ groups })
        })
        .catch((e) => console.error(e))
    }
  }

  handleClick = () => {
    this.setState({ displayForm: true })
  }
  componentDidMount() {
    this.fetchSessions()
    this.fetchGroups()
  }

  render() {
    const { sessions, groups, displayForm } = this.state

    return (
      <Fragment>
        {!displayForm ? (
          <Button
            style={{ marginBottom: '1rem' }}
            floated="right"
            onClick={this.handleClick}
          >
            Create New Session
          </Button>
        ) : null}
        {displayForm ? <CreateSessionForm groups={groups} /> : null}
        <SessionTable sessions={sessions} />
      </Fragment>
    )
  }
}
