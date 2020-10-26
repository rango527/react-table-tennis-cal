import React, { Component, Fragment } from 'react'
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

export default class App extends Component {
  state = {
    loggedIn: false,
    activeItem: 'players',
    error: '',
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

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

  componentDidMount() {}

  render() {
    const { activeItem } = this.state

    return (
      <Container style={{ padding: '1rem' }}>
        {localStorage.getItem('token') ? (
          <Fragment>
            <Segment clearing>
              <Header as="h1" floated="left">
                WDCTT Ratings
              </Header>
              <Button floated="right" onClick={this.handleLogout}>
                Log Out
              </Button>
            </Segment>
            <Message>
              <Message.Header>
                Application status: very much under construction
              </Message.Header>
              <Message.List>
                <Message.Item>
                  Right now, it pretty much just displays players (and their
                  ratings), groups (and their players), and sessions
                </Message.Item>
                <Message.Item>
                  Next up: creating a session, recording results, and
                  calculating ratings
                </Message.Item>
              </Message.List>
            </Message>
            <Menu attached="top" tabular>
              <Menu.Item
                name="players"
                active={activeItem === 'players'}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="groups"
                active={activeItem === 'groups'}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="sessions"
                active={activeItem === 'sessions'}
                onClick={this.handleItemClick}
              />
            </Menu>

            <Segment attached="bottom">
              {activeItem === 'players' ? <PlayerContainer /> : null}
              {activeItem === 'groups' ? <GroupContainer /> : null}
              {activeItem === 'sessions' ? <SessionContainer /> : null}
            </Segment>
          </Fragment>
        ) : (
          <LoginForm handleLogin={this.handleLogin} />
        )}
      </Container>
    )
  }
}
