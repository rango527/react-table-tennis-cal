import React, { useState } from "react"
import { Route } from "react-router-dom"
import GroupListTable from "./GroupListTable"
import GroupPlayerTable from "./GroupPlayerTable"
import ErrorMessage from "../../components/ErrorMessage"
import { Loader } from "semantic-ui-react"
import { useQuery } from "react-query"
import { fetchGroups } from "../../api"

export default function GroupContainer({ user, history }) {
  const [activeItem, setActiveItem] = useState(null)
  const { data: groups, error, isLoading, isError } = useQuery(
    "groups",
    fetchGroups
  )

  const handleGroupClick = (e, group_id) => {
    if (groups.length > 0) {
      setActiveItem(group_id)
      history.push(`/groups/${group_id}`)
    }
  }

  if (isLoading) {
    return <Loader style={{ marginTop: "1rem" }} active inline="centered" />
  }

  if (isError) {
    return <ErrorMessage message={error} />
  }

  return (
    <>
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

      <Route
        path={`/groups/:groupId`}
        render={(props) => (
          <GroupPlayerTable
            user={user}
            groups={groups}
            activeItem={activeItem}
            {...props}
          />
        )}
      ></Route>
    </>
  )
}
