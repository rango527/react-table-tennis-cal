import React, { Component, Fragment } from 'react'
import GroupTable from '../components/GroupTable'
import PlayerTable from '../components/PlayerTable'
import { Message, Loader } from 'semantic-ui-react'

export default class GroupContainer extends Component {
  state = {
    activeItem: null,
    column: null,
    direction: null,
    sortedPlayers: [],
  }

  handleGroupClick = (e, group_id) => {
    const { groups } = this.props
    this.setState({
      activeItem: group_id,
      sortedPlayers: groups
        .find((group) => group.id === group_id)
        .players.sort((a, b) => {
          return (
            b.ratings[b.ratings.length - 1].value -
            a.ratings[a.ratings.length - 1].value
          )
        }),
    })
  }

  handleHeaderClick = (e, name) => {
    let { direction, sortedPlayers, column } = this.state

    if (name === column) {
      sortedPlayers = sortedPlayers.reverse()
    } else {
      if (name === 'rating') {
        sortedPlayers = sortedPlayers.sort((a, b) => {
          return (
            a.ratings[a.ratings.length - 1].value -
            b.ratings[b.ratings.length - 1].value
          )
        })
      } else if (name === 'group') {
        sortedPlayers = sortedPlayers.sort((a, b) => {
          if (a.groups[0].name < b.groups[0].name) {
            return -1
          }
          if (a.groups[0].name > b.groups[0].name) {
            return 1
          }
          return 0
        })
      } else if (name === 'email') {
        sortedPlayers = sortedPlayers.sort((a, b) => {
          if (a.email < b.email) {
            return -1
          }
          if (a.email > b.email) {
            return 1
          }
          return 0
        })
      } else if (name === 'name') {
        sortedPlayers = sortedPlayers.sort((a, b) => {
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

  handleAddPlayerToGroup = (group_id, player_id, addOrRemove = 'add') => {
    const { handleAddPlayerToGroup } = this.props

    this.setState({
      sortedPlayers: [],
    })

    handleAddPlayerToGroup(group_id, player_id, addOrRemove)
  }

  componentDidMount() {}

  render() {
    const { activeItem, column, direction, sortedPlayers } = this.state
    const { user, groups, loading } = this.props

    return (
      <Fragment>
        <Message
          attached
          header="Who is in what group?"
          content="Click on a group to see its members"
          style={{ marginBottom: '1rem' }}
        />

        {groups.length > 0 ? (
          <GroupTable
            groups={groups}
            activeItem={activeItem}
            handleGroupClick={this.handleGroupClick}
          />
        ) : (
          <Loader active inline="centered" />
        )}
        {activeItem && sortedPlayers.length > 0 && !loading ? (
          <PlayerTable
            user={user}
            groups={groups}
            column={column}
            direction={direction}
            players={sortedPlayers}
            handleHeaderClick={this.handleHeaderClick}
            handleAddPlayerToGroup={this.handleAddPlayerToGroup}
          />
        ) : null}
      </Fragment>
    )
  }
}
