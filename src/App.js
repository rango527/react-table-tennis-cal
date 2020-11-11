import React, { Component, Fragment } from 'react'
import { Router, Link } from '@reach/router'
import { baseUrl, HEADERS } from './constants'
import { Container, Segment, Header, Button, Message } from 'semantic-ui-react'
import Nav from './components/Nav'
import PlayerContainer from './containers/PlayerContainer'
import GroupContainer from './containers/GroupContainer'
import SessionContainer from './containers/SessionContainer'
import LoginForm from './components/LoginForm'
import CalculateRatings from './components/CalculateRatings'

export default class App extends Component {
  state = {
    loading: false,
    activeItem: 'players',
    groups: [],
    players: [],
    loggedIn: false,
    error: '',
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

    this.setState({ error: '' })

    fetch(baseUrl + '/login', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          window.history.pushState({}, 'Home', '/')
          localStorage.setItem('token', data.jwt)
          localStorage.setItem('admin', data.player.admin)

          this.setState({
            error: '',
            loggedIn: true,
            user: data.player,
          })
        } else {
          this.setState({ error: 'Invalid username or password' })
          alert('Invalid username or password')
        }
      })
  }

  handleLogout = () => {
    localStorage.clear()
    this.setState({ loggedIn: false })
  }

  fetchGroups = () => {
    this.setState({ loading: true, groups: [] })

    // let token = localStorage.getItem('token')
    // if (token) {
    fetch(baseUrl + '/groups', {
      // headers: HEADERS,
    })
      .then((res) => res.json())
      .then((groups) => {
        console.log('App -> groups', groups)

        this.setState({ groups, loading: false })
      })
      .catch((e) => console.error(e))
    // }
  }

  fetchPlayers = () => {
    this.setState({ loading: true, players: [] })

    // let token = localStorage.getItem('token')
    // if (token) {
    fetch(baseUrl + '/players', {
      // headers: HEADERS,
    })
      .then((res) => res.json())
      .then((players) => {
        console.log('App -> players', players)
        const sortedPlayers = players.sort((a, b) => {
          if (a.ratings.length > 0 && b.ratings.length > 0) {
            const sortedARatings = a.ratings.sort((a, b) => a.id - b.id)
            const sortedBRatings = b.ratings.sort((a, b) => a.id - b.id)

            return (
              sortedBRatings[sortedBRatings.length - 1].value -
              sortedARatings[sortedARatings.length - 1].value
            )
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
    // }
  }

  handleAddPlayerToGroup = (groupId, playerId, addOrRemove) => {
    this.setState({ loading: true })

    let data = {
      player_id: playerId,
      add_or_remove: addOrRemove,
    }

    fetch(`${baseUrl}/groups/${groupId}`, {
      method: 'PATCH',
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

  handleNavClick = (item) => {
    this.setState({ navigated: true, activeItem: item })
  }

  setActiveItem = () => {
    const path = window.location.pathname
    let activeItem
    if (path.indexOf('groups') > -1) {
      activeItem = 'groups'
    } else if (path.indexOf('sessions') > -1) {
      activeItem = 'sessions'
    } else if (path.indexOf('record-results') > -1) {
      activeItem = 'record-results'
    } else {
      activeItem = 'players'
    }
    this.setState({ activeItem })
  }

  componentDidMount() {
    this.setActiveItem()
    this.fetchGroups()
    this.fetchPlayers()
  }

  render() {
    const { user, groups, players, loading, activeItem } = this.state
    return (
      <Container style={{ padding: '1rem' }}>
        <div>
          <Segment clearing>
            <Header as="h1" floated="left">
              WDCTT Ratings
            </Header>
            {localStorage.getItem('token') ? (
              <Link to="/login" onClick={this.handleLogout}>
                <Button floated="right">Log Out</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button floated="right">Log In</Button>
              </Link>
            )}
          </Segment>
          <Nav activeItem={activeItem} handleNavClick={this.handleNavClick} />
          <Message
            style={{ marginBottom: '1rem' }}
            content="If you see something wrong, or have questions, email Oren Magid at oren.michael.magid@gmail.com."
          />
        </div>
        <Router>
          <Segment path="/">
            <Fragment>
              <PlayerContainer
                path="/"
                loading={loading}
                user={user}
                groups={groups}
                players={players}
                handleAddPlayerToGroup={this.handleAddPlayerToGroup}
                handleCreatePlayer={this.handleCreatePlayer}
              />
              <GroupContainer
                path="groups"
                loading={loading}
                user={user}
                groups={groups}
                players={players}
                handleAddPlayerToGroup={this.handleAddPlayerToGroup}
              />
              <SessionContainer path="/sessions" user={user} />
              {localStorage.getItem('token') ? (
                <CalculateRatings path="/record-results" user={user} />
              ) : null}
            </Fragment>

            {!localStorage.getItem('token') ? (
              <LoginForm path="login" handleLogin={this.handleLogin} />
            ) : null}
          </Segment>
        </Router>
      </Container>
    )
  }
}
