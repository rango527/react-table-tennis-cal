import React, { Component, Fragment } from 'react'
import { Container, Form, Button, Segment, Message } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

export default class CreateSessionForm extends Component {
  state = {
    date: null,
    group_id: null,
  }
  handleDateChange = (date) => {
    this.setState({
      date: date,
    })
  }
  handleGroupChange = (e, { value }) => this.setState({ group_id: value })

  render() {
    const { date, group_id } = this.state

    const { handleCreateSession, groups } = this.props

    const groupOptions = groups.map((group) => {
      return { key: group.name, text: group.name, value: group.id }
    })

    const todayDayOfWeek = new Date().getDay()

    let groupDayOfWeek = group_id
      ? groups.find((group) => group_id === group.id).day_of_week
      : null

    groupDayOfWeek =
      groupDayOfWeek < todayDayOfWeek ? groupDayOfWeek + 7 : groupDayOfWeek

    const defaultDate = group_id
      ? Date.now() + (groupDayOfWeek - todayDayOfWeek) * (3600 * 1000 * 24)
      : null

    return (
      <Fragment>
        <Container>
          <Message
            attached
            header="Not yet functional"
            content="Session creation isn't yet functional. Once it is, a scorecard will appear, with groups members, etc."
          />
          <Form onSubmit={handleCreateSession}>
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
              <Form.Field>
                <DatePicker
                  placeholderText="Click to select"
                  selected={defaultDate}
                  onChange={this.handleDateChange}
                  minDate={Date.now()}
                  // showTimeSelect
                  dateFormat="MM/dd/yyyy"
                />
              </Form.Field>
              <Button>Create Session</Button>
            </Segment>

            <div className="ui error message" />
          </Form>
        </Container>
      </Fragment>
    )
  }
}
