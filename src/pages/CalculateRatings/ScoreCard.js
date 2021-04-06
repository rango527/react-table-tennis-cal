import React, { useState, useEffect } from "react"
import { baseUrl } from "../../constants"
import { Link } from "react-router-dom"
import { Button, Message, Segment, Icon, Form } from "semantic-ui-react"
import ScoreCardTable from "./ScoreCardTable"
import ResultsTable from "./ResultsTable"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "react-datepicker/dist/react-datepicker-cssmodules.css"

export default function ScoreCard({
  match,
  handleRemoveGroup,
  handleCreateSessionClick,
  group_id,
  handleDateChange,
  date,
}) {
  const [loading, setLoading] = useState(true)
  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])
  const [inactivePlayerIds, setInactivePlayerIds] = useState([])

  const handleClick = (index, i) => {
    const stateMatches = [...matches]
    let oneMatchIndex
    let anotherMatchIndex
    if (index < i) {
      oneMatchIndex = players.length * index + i - index - 1
      anotherMatchIndex = players.length * i + index - i
    } else {
      oneMatchIndex = players.length * i + index - i - 1
      anotherMatchIndex = players.length * index + i - index
    }

    const anotherMatchProgression = {
      "pointing up": { icon: "pointing left", size: "huge", played: true },
      "pointing left": { icon: "close", size: "huge", played: false },
      close: { icon: "pointing up", size: "large", played: true },
    }

    const oneMatchProgression = {
      "pointing left": { icon: "pointing up", size: "huge", played: true },
      "pointing up": { icon: "close", size: "huge", played: false },
      close: { icon: "pointing left", size: "large", played: true },
    }

    const oneMatch = stateMatches[oneMatchIndex]

    oneMatch.size = oneMatchProgression[oneMatch.icon].size
    oneMatch.played = oneMatchProgression[oneMatch.icon].played
    oneMatch.icon = oneMatchProgression[oneMatch.icon].icon
    if (oneMatch.icon !== "close") {
      ;[oneMatch.winner, oneMatch.loser] = [oneMatch.loser, oneMatch.winner]
    }

    stateMatches[oneMatchIndex] = oneMatch

    const anotherMatch = stateMatches[anotherMatchIndex]

    anotherMatch.size = anotherMatchProgression[anotherMatch.icon].size
    anotherMatch.played = anotherMatchProgression[anotherMatch.icon].played
    anotherMatch.icon = anotherMatchProgression[anotherMatch.icon].icon
    if (anotherMatch.icon !== "close") {
      ;[anotherMatch.winner, anotherMatch.loser] = [
        anotherMatch.loser,
        anotherMatch.winner,
      ]
    }
    stateMatches[anotherMatchIndex] = anotherMatch

    setMatches(stateMatches)
  }

  const handleInactivate = (player) => {
    let filteredInactivePlayerIds = [...inactivePlayerIds]
    if (filteredInactivePlayerIds.indexOf(player.id) > -1) {
      filteredInactivePlayerIds = filteredInactivePlayerIds.filter((pid) => {
        return pid !== player.id
      })
    } else {
      filteredInactivePlayerIds.push(player.id)
    }

    const mappedMatches = matches.map((match) => {
      if (
        filteredInactivePlayerIds.indexOf(match.winner.id) > -1 ||
        filteredInactivePlayerIds.indexOf(match.loser.id) > -1
      ) {
        return { ...match, played: false, hide: true }
      } else {
        return { ...match, played: true, hide: false }
      }
    })
    setInactivePlayerIds(filteredInactivePlayerIds)
    setMatches(mappedMatches)
  }

  const setInitialMatches = (players) => {
    const matches = []

    players.forEach((player, index) => {
      players.forEach((p, i) => {
        if (index !== i) {
          const winner = index < i ? player : p
          const loser = index > i ? player : p
          const icon = index > i ? "pointing up" : "pointing left"
          const size = "large"
          const count = index < i ? true : false
          const played = true
          const hide = false
          matches.push({
            winner,
            loser,
            icon,
            size,
            count,
            played,
            hide,
          })
        }
      })
    })

    setMatches(matches)
  }

  const fetchGroupAndSetMatches = () => {
    const { groupId } = match.params
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
        setLoading(false)
        setPlayers(sortedPlayers)
        setInitialMatches(sortedPlayers)
      })
      .catch((e) => console.error(e))
  }

  useEffect(() => {
    fetchGroupAndSetMatches()
  }, [])

  return (
    <Segment>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/record-results" onClick={handleRemoveGroup}>
          <Button icon labelPosition="left">
            <Icon name="close" />
            Cancel Session
          </Button>
        </Link>
        <Form>
          <Form.Field>
            <DatePicker
              placeholderText="Date of Session"
              selected={date}
              onChange={handleDateChange}
              dateFormat="MM/dd/yyyy"
            />
          </Form.Field>
        </Form>

        <Button
          icon
          labelPosition="right"
          onClick={() => handleCreateSessionClick(matches, group_id)}
        >
          Submit Session and Calculate Ratings
          <Icon name="calculator" />
        </Button>
      </div>

      <Message
        style={{ marginTop: "2rem" }}
        content="The scorecard will default with the expected winners prefilled. You'll then be able to delete players that didn't show, change the winner where the underdog prevailed, and save the session and calculate ratings."
      />

      <ScoreCardTable
        players={players}
        handleInactivate={handleInactivate}
        handleClick={handleClick}
        matches={matches}
      />
      <ResultsTable matches={matches} />
    </Segment>
  )
}
