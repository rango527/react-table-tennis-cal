import React from "react"
import CreateSessionForm from "./CreateSessionForm"
import ErrorMessage from "../../components/ErrorMessage"
import { Loader } from "semantic-ui-react"
import { useQuery } from "react-query"
import { fetchGroups } from "../../api"

export default function SessionContainer(props) {
  const { data: groups, error, isLoading, isError } = useQuery(
    "groups",
    fetchGroups
  )

  if (isLoading) {
    return <Loader style={{ marginTop: "1rem" }} active inline="centered" />
  }

  if (isError) {
    return <ErrorMessage message={error} />
  }

  return (
    <>
      <CreateSessionForm groups={groups} {...props} />
    </>
  )
}
