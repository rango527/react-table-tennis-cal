import React, { Component } from 'react'
import { baseUrl } from './constants'
import { Container, Segment, Header, Menu } from 'semantic-ui-react'
import PlayerContainer from './containers/PlayerContainer'
import GroupContainer from './containers/GroupContainer'
import SessionContainer from './containers/SessionContainer'

export default class App extends Component {
  state = {
    activeItem: 'players',
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  componentDidMount() {}

  render() {
    const { activeItem } = this.state

    return (
      <Container>
        <Segment clearing>
          <Header as="h1" floated="left">
            WDCTT Ratings
          </Header>
        </Segment>
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
      </Container>
    )
  }
}
