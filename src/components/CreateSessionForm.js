import React, { Component } from "react"
import { Route } from "react-router-dom"
import { Container, Form, Segment, Message, Loader } from "semantic-ui-react"
import Scorecard from "./ScoreCard"

import { baseUrl, HEADERS } from "../constants"

export default class CreateSessionForm extends Component {
  state = {
    date: null,
    group_id: null,
    loading: false,
  }
  handleDateChange = (date) => {
    this.setState({
      date,
    })
  }
  handleGroupChange = (e, { value }) => {
    const { groups } = this.props

    const group_id = value
    const group = group_id
      ? groups.find((group) => group_id === group.id)
      : null
    const todayDayOfWeek = new Date().getDay()

    let groupDayOfWeek = group_id ? group.day_of_week : null

    groupDayOfWeek =
      groupDayOfWeek > todayDayOfWeek ? groupDayOfWeek - 7 : groupDayOfWeek

    const defaultDate = group_id
      ? Date.now() - (todayDayOfWeek - groupDayOfWeek) * (3600 * 1000 * 24)
      : null

    this.setState({ group_id: group_id, date: defaultDate })
    this.props.history.push(`/record-results/${group_id}`)
  }

  handleRemoveGroup = () => {
    this.setState({ group_id: null })
  }

  handleCreateSessionClick = (matches, group_id) => {
    this.setState({ loading: true })
    const { date } = this.state
    const uniqueMatches = matches.filter((match) => match.count && match.played)

    let data = {
      matches: uniqueMatches,
      group_id,
      date: new Date(date),
    }

    fetch(`${baseUrl}/sessions`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        this.setState({ loading: false })
      })
    this.props.history.push(`/groups/${group_id}`)
  }

  render() {
    const { group_id, date, loading } = this.state

    const { groups } = this.props

    const group = group_id
      ? groups.find((group) => group_id === group.id)
      : null

    const groupOptions = groups.map((group) => {
      return { key: group.name, text: group.name, value: group.id }
    })

    return (
      <>
        <Container>
          <div>
            {!group && !loading ? (
              <Form>
                <Message
                  attached
                  header="Not yet functional"
                  content="Select a group to see a sample scorecard. If you're on mobile it'll look like crap. I'll come up with a mobile design soon."
                />
                <Segment stacked>
                  <Form.Field>
                    <Form.Dropdown
                      placeholder="Select Group"
                      fluid
                      selection
                      options={groupOptions}
                      onChange={this.handleGroupChange}
                    />
                  </Form.Field>
                </Segment>
                <div className="ui error message" />
              </Form>
            ) : null}

            {group && !loading ? (
              <>
                <Route
                  path={`/record-results/:groupId`}
                  render={(props) => (
                    <Scorecard
                      date={date}
                      handleDateChange={this.handleDateChange}
                      handleCreateSessionClick={this.handleCreateSessionClick}
                      handleRemoveGroup={this.handleRemoveGroup}
                      group_id={group_id}
                      {...props}
                    />
                  )}
                ></Route>
              </>
            ) : null}
            {loading ? <Loader active inline="centered" /> : null}
          </div>
        </Container>
      </>
    )
  }
}
