import React, { useState, useEffect } from "react"
import { Route } from "react-router-dom"
import SessionTable from "../components/SessionTable"
import MatchesTable from "../components/MatchesTable"
import { Loader } from "semantic-ui-react"
import { baseUrl } from "../constants"

export default function SessionContainer(props) {
  const [sessions, setSessions] = useState([])
  const [activeItem, setActiveItem] = useState(null)

  const fetchSessions = () => {
    fetch(baseUrl + "/sessions", {})
      .then((res) => res.json())
      .then((sessions) => {
        setSessions(sessions)
      })
      .catch((e) => console.error(e))
  }

  const handleSessionClick = (e, session_id) => {
    props.history.push(`/results/${session_id}`)
  }

  useEffect(() => fetchSessions(), [])

  return (
    <>
      <Route
        path={`/results/:sessionId`}
        render={(props) => <MatchesTable {...props} />}
      ></Route>

      {sessions.length > 0 ? (
        <Route
          exact
          path={`/results`}
          render={(props) => (
            <SessionTable
              sessions={sessions}
              activeItem={activeItem}
              handleSessionClick={handleSessionClick}
              {...props}
            />
          )}
        ></Route>
      ) : (
        <Loader style={{ marginTop: "1rem" }} active inline="centered" />
      )}
    </>
  )
}
