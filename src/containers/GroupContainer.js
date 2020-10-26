import React, { Component, Fragment } from 'react'
import GroupTable from '../components/GroupTable'
import PlayerTable from '../components/PlayerTable'
import { baseUrl } from '../constants'

export default class GroupContainer extends Component {
  state = {
    groups: [],
    activeItem: null,
    column: null,
    direction: null,
    players: [],
  }

  handleGroupClick = (e, group_id) => {
    const { groups } = this.state
    this.setState({
      activeItem: group_id,
      players: groups.find((group) => group.id === group_id).players,
    })
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

  fetchGroups = () => {
    fetch(baseUrl + '/groups', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
    })
      .then((res) => res.json())
      .then((groups) => {
        this.setState({ groups })
      })
      .catch((e) => console.error(e))
  }

  componentDidMount() {
    this.fetchGroups()
  }

  render() {
    const { groups, activeItem, players, column, direction } = this.state

    return (
      <Fragment>
        <GroupTable
          groups={groups}
          activeItem={activeItem}
          handleGroupClick={this.handleGroupClick}
        />
        {activeItem ? (
          <PlayerTable
            column={column}
            direction={direction}
            players={players}
            handleHeaderClick={this.handleHeaderClick}
          />
        ) : null}
      </Fragment>
    )
  }
}
