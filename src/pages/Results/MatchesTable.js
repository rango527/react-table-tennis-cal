import React from "react"
import { useQuery } from "react-query"
import { Table, Loader, Message } from "semantic-ui-react"
import CloseButton from "../../components/elements/CloseButton"
import ErrorMessage from "../../components/ErrorMessage"
import { fetchSession } from "../../api"
import { getFormattedDate } from "../../utilities"

export default function MatchesTable({ match }) {
  const { data: session, error, isLoading, isError } = useQuery(
    ["session", match.params.sessionId],
    () => fetchSession(match.params.sessionId)
  )

  if (isLoading) {
    return <Loader style={{ marginTop: "1rem" }} active inline="centered" />
  }

  if (isError) {
    return <ErrorMessage message={error} />
  }

  return (
    <>
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
            {session.matches.map((match) => {
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
                    <span style={{ color: winner_color }}>{winner_change}</span>
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
    </>
  )
}
