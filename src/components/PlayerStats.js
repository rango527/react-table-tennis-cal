import React, { Component, Fragment } from 'react'
import { Header } from 'semantic-ui-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { sortPlayerRatings, getFormattedDate } from '../utilities'

export default class PlayerStats extends Component {
  renderTooltip = (props) => {
    if (!props.active) {
      return null
    } else {
      const date = props.payload[0].payload.date
      const rating = props.payload[0].payload.rating
      const adjustment = props.payload[0].payload.adjustment

      // we render the default, but with our overridden payload
      return (
        <div
          style={{
            background: 'white',
            border: '1px solid rgb(136, 132, 216)',
            padding: '.75rem .5rem',
            borderRadius: '2px',
          }}
        >
          <div>{date}</div>
          <div style={{ color: 'rgb(136, 132, 216)' }}>
            rating: {rating}
            {adjustment ? ', adjusted: ' + adjustment : null}
          </div>
        </div>
      )
    }
  }
  render() {
    const { player } = this.props

    const data = sortPlayerRatings(player).map((rating) => {
      return {
        date: rating.session
          ? getFormattedDate(new Date(rating.session.date))
          : 'start',
        rating: rating.value,
        adjustment: rating.adjustment,
      }
    })

    const sortedRatings = player.ratings.sort((a, b) => {
      return b.value - a.value
    })

    const max = sortedRatings[0].value + 100

    const min = sortedRatings[sortedRatings.length - 1].value - 100

    return (
      <Fragment>
        <Header as="h2">{player.name}</Header>

        <LineChart
          width={500}
          height={300}
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
          <Tooltip content={this.renderTooltip} />
          <Legend />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </Fragment>
    )
  }
}
