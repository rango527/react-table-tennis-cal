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

export default class PlayerStats extends Component {
  getFormattedDate = (date) => {
    var year = date.getFullYear()

    var month = (1 + date.getMonth()).toString()
    month = month.length > 1 ? month : '0' + month

    var day = date.getDate().toString()
    day = day.length > 1 ? day : '0' + day

    return month + '/' + day + '/' + year
  }
  render() {
    const { player } = this.props

    const data = player.ratings.map((rating) => {
      if (rating.session) {
        console.log(
          'PlayerStats -> render -> rating.session.date',
          this.getFormattedDate(new Date(rating.session.date))
        )
      }

      return {
        date: rating.session
          ? this.getFormattedDate(new Date(rating.session.date))
          : 'start',
        rating: rating.value,
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
