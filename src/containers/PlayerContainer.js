import React, { Component, Fragment } from 'react'
import PlayerTable from '../components/PlayerTable'
import { Loader } from 'semantic-ui-react'
import { baseUrl } from '../constants'

export default class PlayerContainer extends Component {
  state = {
    column: null,
    direction: null,
    players: [],
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
      players: sortedPlayers,
    })
  }

  fetchPlayers = () => {
    let token = localStorage.getItem('token')
    if (token) {
      fetch(baseUrl + '/players', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((players) => {
          const sortedPlayers = players.sort((a, b) => {
            if (a.ratings.length > 0 && b.ratings.length > 0) {
              return (
                b.ratings[b.ratings.length - 1].value -
                a.ratings[a.ratings.length - 1].value
              )
            } else {
              return 0
            }
          })
          this.setState({
            players: sortedPlayers,
          })
        })
        .catch((e) => console.error(e))
    }
  }
  componentDidMount() {
    this.fetchPlayers()
  }

  render() {
    const { column, direction, players } = this.state

    return (
      <Fragment>
        {players.length > 0 ? (
          <PlayerTable
            players={players}
            column={column}
            direction={direction}
            handleHeaderClick={this.handleHeaderClick}
          />
        ) : (
          <Loader active inline="centered" />
        )}
      </Fragment>
    )
  }
}
