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
  render() {
    const { player } = this.props
    console.log('PlayerStats -> render -> player.ratings', player.ratings)

    const data = sortPlayerRatings(player).map((rating) => {
      if (rating.session) {
        console.log(
          'PlayerStats -> render -> rating.session.date',
          getFormattedDate(new Date(rating.session.date))
        )
      }

      return {
        date: rating.session
          ? getFormattedDate(new Date(rating.session.date))
          : 'start',
        rating: rating.value,
      }
    })

    console.log('PlayerStats -> render -> data', data)

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
          <Tooltip />
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
