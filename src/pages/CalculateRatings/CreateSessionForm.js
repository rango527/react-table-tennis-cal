import React, { useState } from "react"
import { Route } from "react-router-dom"
import { useMutation, useQueryClient } from "react-query"
import { Container, Form, Segment, Message, Loader } from "semantic-ui-react"
import ErrorMessage from "../../components/ErrorMessage"
import Scorecard from "./ScoreCard"
import { createSession } from "../../api"

export default function CreateSessionForm({ history, groups }) {
  const [date, setDate] = useState(null)
  const [group_id, set_group_id] = useState(null)

  const queryClient = useQueryClient()

  const {
    mutate: createSessionMutate,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation((data) => createSession(data), {
    onSuccess: (session) => {
      queryClient.refetchQueries({ stale: true })
      history.push(`/groups/${session.group_id}`)
    },
  })

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
    const uniqueMatches = matches.filter((match) => match.count && match.played)

    let data = {
      matches: uniqueMatches,
      group_id,
      date: new Date(date),
    }

    createSessionMutate(data)
  }

  const group = group_id ? groups.find((group) => group_id === group.id) : null

  const groupOptions = groups.map((group) => {
    return { key: group.name, text: group.name, value: group.id }
  })

  if (isLoading) {
    return <Loader style={{ marginTop: "1rem" }} active inline="centered" />
  }

  if (isError) {
    return <ErrorMessage message={error} />
  }

  return (
    <>
      <Container>
        <div>
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
        </div>
      </Container>
    </>
  )
}
