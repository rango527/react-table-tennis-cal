import React, { useState, useEffect } from "react"
import { Table, Loader, Message } from "semantic-ui-react"
import CloseButton from "./elements/CloseButton"
import { baseUrl } from "../constants"
import { getFormattedDate } from "../utilities"

export default function MatchesTable({ match }) {
  // const [sessionId, setSessionId] = useState(null)
  const [session, setsession] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchSession = () => {
    const { sessionId } = match.params
    fetch(baseUrl + `/sessions/${sessionId}`, {})
      .then((res) => res.json())
      .then((session) => {
        // setSessionId(sessionId)
        setsession(session)
        setLoading(false)
      })
      .catch((e) => console.error(e))
  }

  useEffect(() => {
    fetchSession()
  }, [match.params.sessionId])

  const { matches } = session

  return (
    <>
      {!loading && matches.length > 0 ? (
        <>
          <CloseButton handleClick={() => window.history.back()} />
          <Message
            attached
            header={`Results for ${getFormattedDate(session.date, true)}`}
          />
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Winner</Table.HeaderCell>
                <Table.HeaderCell>Loser</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {matches.map((match) => {
                const winner = match.players.find(
                  (player) => player.id === match.winner_id
                )
                const loser = match.players.find(
                  (player) => player.id !== match.winner_id
                )
                let winner_change
                let winner_color
                let loser_change
                let loser_color

                if (match.rating_change > 0) {
                  winner_change = `+${match.rating_change}`
                  winner_color = "#008F47"
                  loser_change = `-${match.rating_change}`
                  loser_color = "#F71735"
                } else if (match.rating_change === null) {
                  winner_change = ``
                  winner_color = "inherit"
                  loser_change = ``
                  loser_color = "inherit"
                } else {
                  winner_change = `0`
                  winner_color = "inherit"
                  loser_change = `0`
                  loser_color = "inherit"
                }
                return (
                  <Table.Row key={match.id}>
                    <Table.Cell>
                      {winner.name} {match.rating_change !== null ? "(" : ""}
                      <span style={{ color: winner_color }}>
                        {winner_change}
                      </span>
                      {match.rating_change !== null ? ")" : ""}
                    </Table.Cell>
                    <Table.Cell>
                      {loser.name} {match.rating_change !== null ? "(" : ""}
                      <span style={{ color: loser_color }}>{loser_change}</span>
                      {match.rating_change !== null ? ")" : ""}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        </>
      ) : (
        <Loader style={{ marginTop: "1rem" }} active inline="centered" />
      )}
    </>
  )
}
