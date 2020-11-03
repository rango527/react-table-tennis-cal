import React, { Component, Fragment } from 'react'
import { Link } from '@reach/router'
import PlayerStats from '../components/PlayerStats'
import PlayerTable from '../components/PlayerTable'
import { Loader, Button, Icon } from 'semantic-ui-react'

export default class PlayerContainer extends Component {
  state = {
    column: null,
    direction: null,
    sortedPlayers: [],
  }

  handleHeaderClick = (e, name) => {
    const { direction, players, column } = this.state

    let sortedPlayers
    if (name === column) {
      sortedPlayers = players.reverse()
    } else {
      if (name === 'rating') {
        sortedPlayers = players.sort((a, b) => {
          return (
            a.ratings[a.ratings.length - 1].value -
            b.ratings[b.ratings.length - 1].value
          )
        })
      } else if (name === 'group') {
        sortedPlayers = players.sort((a, b) => {
          if (a.groups.length === 0) {
            return -1
          }
          if (b.groups.length === 0) {
            return 1
          }
          if (a.groups[0].name < b.groups[0].name) {
            return -1
          }
          if (a.groups[0].name > b.groups[0].name) {
            return 1
          }
          return 0
        })
      } else if (name === 'email') {
        sortedPlayers = players.sort((a, b) => {
          if (a.email < b.email) {
            return -1
          }
          if (a.email > b.email) {
            return 1
          }
          return 0
        })
      } else if (name === 'name') {
        sortedPlayers = players.sort((a, b) => {
          if (a.name < b.name) {
            return -1
          }
          if (a.name > b.name) {
            return 1
          }
          return 0
        })
      }
    }

    this.setState({
      column: name,
      direction: direction === 'ascending' ? 'descending' : 'ascending',
      sortedPlayers,
    })
  }

  handleShowPlayer = (player) => {
    this.setState({ player })
  }

  componentDidMount() {}

  render() {
    const { column, direction, sortedPlayers } = this.state
    const {
      user,
      groups,
      players,
      handleAddPlayerToGroup,
      loading,
      handleCreatePlayer,
    } = this.props

    return (
      <Fragment>
        {players.length > 0 && !loading ? (
          <Fragment>
            <Link to="/players/create" onClick={handleCreatePlayer}>
              <Button icon labelPosition="left" onClick={handleCreatePlayer}>
                <Icon name="plus" />
                Create Player
              </Button>
            </Link>
            <PlayerTable
              loading={loading}
              user={user}
              groups={groups}
              players={sortedPlayers.length > 0 ? sortedPlayers : players}
              column={column}
              direction={direction}
              handleHeaderClick={this.handleHeaderClick}
              handleAddPlayerToGroup={handleAddPlayerToGroup}
              handleShowPlayer={this.handleShowPlayer}
            />
          </Fragment>
        ) : (
          <Loader active inline="centered" />
        )}
      </Fragment>
    )
  }
}
