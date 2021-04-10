import React from "react"
import ErrorMessage from "./ErrorMessage"
import { useQuery } from "react-query"
import { fetchPlayer } from "../api"
import { Header, Loader, Segment } from "semantic-ui-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import CloseButton from "./elements/CloseButton"
import { sortRatings, getFormattedDate } from "../utilities"

export default function PlayerStats({ match }) {
  const { data: player, error, isLoading, isError } = useQuery(
    ["player", match.params.playerId],
    () => fetchPlayer(match.params.playerId)
  )

  const renderTooltip = (props) => {
    if (!props.active) {
      return null
    } else {
      const date = props.payload[0].payload.date
      const rating = props.payload[0].payload.rating
      const adjustment = props.payload[0].payload.adjustment

      return (
        <div
          style={{
            background: "white",
            border: "1px solid rgb(136, 132, 216)",
            padding: ".75rem .5rem",
            borderRadius: "2px",
          }}
        >
          <div>{date}</div>
          <div style={{ color: "rgb(136, 132, 216)" }}>
            rating: {rating}
            {adjustment ? ", adjusted: " + adjustment : null}
          </div>
        </div>
      )
    }
  }

  if (isLoading) {
    return <Loader style={{ marginTop: "1rem" }} active inline="centered" />
  }

  if (isError) {
    return <ErrorMessage message={error} />
  }

  const sortedRatings = player.ratings
    ? player.ratings.sort((a, b) => {
        return b.value - a.value
      })
    : []

  const data = sortRatings(player.ratings ? player.ratings : []).map(
    (rating) => {
      return {
        date: rating.session ? getFormattedDate(rating.session.date) : "start",
        rating: rating.value,
        adjustment: rating.adjustment,
      }
    }
  )

  const max = sortedRatings.length > 0 ? sortedRatings[0].value + 100 : 0

  const min =
    sortedRatings.length > 0
      ? sortedRatings[sortedRatings.length - 1].value - 100
      : 0

  return (
    <Segment>
      <CloseButton handleClick={() => window.history.back()} />
      <div style={{ textAlign: "center" }}>
        <Header as="h2">{player.name}</Header>

        <ResponsiveContainer
          width="95%"
          height={300}
          style={{ margin: "auto" }}
        >
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              type="number"
              domain={[Math.ceil(min / 100) * 100, Math.ceil(max / 100) * 100]}
            />
            <Tooltip content={renderTooltip} />
            <Legend />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Segment>
  )
}
