import React, { useState } from "react"
import { Route } from "react-router-dom"
import { Container, Form, Segment, Message, Loader } from "semantic-ui-react"
import Scorecard from "./ScoreCard"

import { baseUrl, HEADERS } from "../../constants"

export default function CreateSessionForm({ history, groups }) {
  const [date, setDate] = useState(null)
  const [group_id, set_group_id] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleDateChange = (date) => {
    setDate(date)
  }

  const handleGroupChange = (e, { value }) => {
    const groupId = value
    const group = groupId ? groups.find((group) => groupId === group.id) : null
    const todayDayOfWeek = new Date().getDay()

    let groupDayOfWeek = groupId ? group.day_of_week : null

    groupDayOfWeek =
      groupDayOfWeek > todayDayOfWeek ? groupDayOfWeek - 7 : groupDayOfWeek

    const defaultDate = groupId
      ? Date.now() - (todayDayOfWeek - groupDayOfWeek) * (3600 * 1000 * 24)
      : null

    set_group_id(groupId)
    setDate(defaultDate)
    history.push(`/record-results/${groupId}`)
  }

  const handleRemoveGroup = () => {
    set_group_id(null)
  }

  const handleCreateSessionClick = (matches, group_id) => {
    setLoading(true)
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
        setLoading(false)
        history.push(`/groups/${group_id}`)
      })
  }

  const group = group_id ? groups.find((group) => group_id === group.id) : null

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
                content="Select a group to see a sample scorecard. If you're on mobile it'll look like crap. I'll come up with a mobile design soon."
              />
              <Segment stacked>
                <Form.Field>
                  <Form.Dropdown
                    placeholder="Select Group"
                    fluid
                    selection
                    options={groupOptions}
                    onChange={handleGroupChange}
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
                    handleDateChange={handleDateChange}
                    handleCreateSessionClick={handleCreateSessionClick}
                    handleRemoveGroup={handleRemoveGroup}
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
