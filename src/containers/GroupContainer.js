import React, { Component } from "react"
import { Route } from "react-router-dom"
import GroupListTable from "../components/GroupListTable"
import GroupPlayerTable from "../components/GroupPlayerTable"
import { Loader } from "semantic-ui-react"

export default class GroupContainer extends Component {
  state = {
    activeItem: null,
  }

  handleGroupClick = (e, group_id) => {
    const { groups } = this.props
    if (groups.length > 0) {
      this.setState({
        activeItem: group_id,
        // sortedPlayers: groups
        //   .find((group) => group.id === group_id)
        //   .players.sort((a, b) => {
        //     if (a.ratings.length > 0 && b.ratings.length > 0) {
        //       const sortedARatings = a.ratings.sort((a, b) => a.id - b.id)
        //       const sortedBRatings = b.ratings.sort((a, b) => a.id - b.id)

        //       return (
        //         sortedBRatings[sortedBRatings.length - 1].value -
        //         sortedARatings[sortedARatings.length - 1].value
        //       )
        //     } else {
        //       return 0
        //     }
        //   }),
      })
      this.props.history.push(`/groups/${group_id}`)
    }
  }

  render() {
    const { activeItem } = this.state
    const { user, groups, handleAddPlayerToGroup } = this.props

    return (
      <>
        {groups.length > 0 ? (
          <Route
            path={`/groups`}
            render={(props) => (
              <GroupListTable
                groups={groups}
                activeItem={activeItem}
                handleGroupClick={this.handleGroupClick}
                {...props}
              />
            )}
          ></Route>
        ) : (
          <Loader style={{ marginTop: "1rem" }} active inline="centered" />
        )}

        <Route
          path={`/groups/:groupId`}
          render={(props) => (
            <GroupPlayerTable
              user={user}
              groups={groups}
              handleAddPlayerToGroup={handleAddPlayerToGroup}
              activeItem={activeItem}
              {...props}
            />
          )}
        ></Route>
      </>
    )
  }
}
