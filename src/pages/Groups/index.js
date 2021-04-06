import React, { useState } from "react"
import { Route } from "react-router-dom"
import GroupListTable from "./GroupListTable"
import GroupPlayerTable from "./GroupPlayerTable"
import { Loader } from "semantic-ui-react"

export default function GroupContainer({
  user,
  groups,
  handleAddPlayerToGroup,
  history,
}) {
  const [activeItem, setActiveItem] = useState(null)

  const handleGroupClick = (e, group_id) => {
    if (groups.length > 0) {
      setActiveItem(group_id)
      history.push(`/groups/${group_id}`)
    }
  }

  return (
    <>
      {groups.length > 0 ? (
        <Route
          path={`/groups`}
          render={(props) => (
            <GroupListTable
              groups={groups}
              activeItem={activeItem}
              handleGroupClick={handleGroupClick}
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
