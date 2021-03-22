import React, { Component } from "react"
import { baseUrl } from "../constants"
import PlayerTable from "./PlayerTable"
import { Loader } from "semantic-ui-react"

export default class GroupPlayerTable extends Component {
  state = {
    groupId: null,
    column: null,
    direction: null,
    sortedPlayers: [],
    loading: true,
  }

  handleHeaderClick = (e, name) => {
    let { direction, sortedPlayers, column } = this.state

    if (name === column) {
      sortedPlayers = sortedPlayers.reverse()
    } else {
      if (name === "rating") {
        sortedPlayers = sortedPlayers.sort((a, b) => {
          return (
            a.ratings[a.ratings.length - 1].value -
            b.ratings[b.ratings.length - 1].value
          )
        })
      } else if (name === "group") {
        sortedPlayers = sortedPlayers.sort((a, b) => {
          if (a.groups[0].name < b.groups[0].name) {
            return -1
          }
          if (a.groups[0].name > b.groups[0].name) {
            return 1
          }
          return 0
        })
      } else if (name === "email") {
        sortedPlayers = sortedPlayers.sort((a, b) => {
          if (a.email < b.email) {
            return -1
          }
          if (a.email > b.email) {
            return 1
          }
          return 0
        })
      } else if (name === "name") {
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
      direction: direction === "ascending" ? "descending" : "ascending",
      sortedPlayers,
    })
  }

  handleAddPlayerToGroup = (group_id, player_id, addOrRemove = "add") => {
    const { handleAddPlayerToGroup } = this.props

    this.setState({
      sortedPlayers: [],
    })

    handleAddPlayerToGroup(group_id, player_id, addOrRemove)
  }

  fetchGroup = () => {
    const { groupId } = this.props.match.params
    fetch(baseUrl + `/groups/${groupId}`, {})
      .then((res) => res.json())
      .then((group) => {
        const sortedPlayers = group.players.sort((a, b) => {
          if (a.most_recent_rating && b.most_recent_rating) {
            return b.most_recent_rating - a.most_recent_rating
          } else {
            return 0
          }
        })
        this.setState({
          groupId,
          sortedPlayers,
          loading: false,
        })
      })
      .catch((e) => console.error(e))
  }
  componentDidMount() {
    this.fetchGroup()
  }
  componentDidUpdate() {
    const { groupId: urlGroupId } = this.props.match.params
    const { groupId: stateGroupId } = this.state

    if (urlGroupId !== stateGroupId) this.fetchGroup()
  }

  render() {
    const { column, direction, sortedPlayers, loading } = this.state
    const { user, groups } = this.props

    return (
      <>
        {!loading && sortedPlayers.length > 0 && groups.length > 0 ? (
          <PlayerTable
            user={user}
            groups={groups}
            column={column}
            direction={direction}
            players={sortedPlayers}
            handleHeaderClick={this.handleHeaderClick}
            handleAddPlayerToGroup={this.handleAddPlayerToGroup}
          />
        ) : (
          <Loader style={{ marginTop: "1rem" }} active inline="centered" />
        )}
      </>
    )
  }
}
