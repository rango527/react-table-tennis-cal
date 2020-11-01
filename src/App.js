import React, { Component, Fragment } from 'react'
import { Link, Route, Redirect } from 'wouter'
import { baseUrl } from './constants'
import {
  Container,
  Segment,
  Header,
  Menu,
  Button,
  Message,
} from 'semantic-ui-react'
import PlayerContainer from './containers/PlayerContainer'
import GroupContainer from './containers/GroupContainer'
import SessionContainer from './containers/SessionContainer'
import LoginForm from './components/LoginForm'
import CalculateRatings from './components/CalculateRatings'

export default class App extends Component {
  state = {
    activeItem: 'players',
    loggedIn: false,
    error: '',
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
          window.location.replace('/players')
          localStorage.setItem('token', data.jwt)
          this.setState({ error: '', loggedIn: true })
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

  handleItemClick = () => {
    this.setState({ navigated: true })
  }

  componentDidMount() {}

  render() {
    return (
      <Container style={{ padding: '1rem' }}>
        {localStorage.getItem('token') ? (
          <Fragment>
            <Segment clearing>
              <Header as="h1" floated="left">
                WDCTT Ratings
              </Header>
              <Link href="/login" onClick={this.handleLogout}>
                <Button floated="right">Log Out</Button>
              </Link>
            </Segment>
            <Message>
              <Message.Header>
                Application status: very much under construction
              </Message.Header>
              <Message.List>
                <Message.Item>
                  Right now, it pretty much just displays players (and their
                  ratings), groups (and their players), and sessions.
                </Message.Item>
                <Message.Item>
                  I've just started on the main interface for recording results
                  and calculating ratings. It's in the "Record Results" tab.
                </Message.Item>
              </Message.List>
            </Message>
            <Menu attached="top" tabular stackable>
              <Link
                href="/players"
                onClick={() => this.handleItemClick('players')}
              >
                <Menu.Item
                  name="players"
                  active={window.location.href.indexOf('players') > -1}
                />
              </Link>
              <Link
                href="/groups"
                onClick={() => this.handleItemClick('groups')}
              >
                <Menu.Item
                  name="groups"
                  active={window.location.href.indexOf('groups') > -1}
                />
              </Link>
              <Link
                href="/sessions"
                onClick={() => this.handleItemClick('sessions')}
              >
                <Menu.Item
                  name="sessions"
                  active={window.location.href.indexOf('sessions') > -1}
                />
              </Link>
              <Link
                href="/record-results"
                onClick={() => this.handleItemClick('record-results')}
              >
                <Menu.Item
                  name="record results"
                  icon="calculator"
                  active={window.location.href.indexOf('record-results') > -1}
                />
              </Link>
            </Menu>

            <Segment attached="bottom">
              <Route path="/players">
                <PlayerContainer />
              </Route>
              <Route path="/groups">
                <GroupContainer />
              </Route>
              <Route path="/sessions">
                <SessionContainer />
              </Route>
              <Route path="/record-results">
                <CalculateRatings />
              </Route>
            </Segment>
          </Fragment>
        ) : (
          <Redirect to="/login" />
        )}
        {!localStorage.getItem('token') ? (
          <Route path="/login">
            <LoginForm handleLogin={this.handleLogin} />
          </Route>
        ) : null}
      </Container>
    )
  }
}
