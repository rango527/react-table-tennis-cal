import React from "react"
import { useQuery } from "react-query"
import { Route } from "react-router-dom"
import ResultsTable from "./ResultsTable"
import MatchesTable from "./MatchesTable"
import { Loader } from "semantic-ui-react"
import ErrorMessage from "../../components/ErrorMessage"
import { fetchSessions } from "../../api"

export default function SessionContainer(props) {
  const { data: sessions, error, isLoading, isError } = useQuery(
    "sessions",
    fetchSessions
  )

  const handleSessionClick = (e, session_id) => {
    props.history.push(`/results/${session_id}`)
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
        path={`/results/:sessionId`}
        render={(props) => <MatchesTable {...props} />}
      ></Route>
      <Route
        exact
        path={`/results`}
        render={(props) => (
          <ResultsTable
            sessions={sessions}
            handleSessionClick={handleSessionClick}
            {...props}
          />
        )}
      ></Route>
    </>
  )
}
