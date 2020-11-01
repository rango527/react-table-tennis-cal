import React, { Component } from 'react'
import { Table, Button, Message, Segment, Icon, Form } from 'semantic-ui-react'
import ChoiceOfWinner from './ChoiceOfWinner'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

export default class ScoreCard extends Component {
  state = {
    matches: [],
    inactivePlayerIds: [],
  }

  handleClick = (index, i) => {
    const { players } = this.props
    const { matches } = this.state

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
      'pointing up': { icon: 'pointing left', size: 'huge', played: true },
      'pointing left': { icon: 'close', size: 'huge', played: false },
      close: { icon: 'pointing up', size: 'large', played: true },
    }

    const oneMatchProgression = {
      'pointing left': { icon: 'pointing up', size: 'huge', played: true },
      'pointing up': { icon: 'close', size: 'huge', played: false },
      close: { icon: 'pointing left', size: 'large', played: true },
    }

    const oneMatch = matches[oneMatchIndex]

    oneMatch.size = oneMatchProgression[oneMatch.icon].size
    oneMatch.played = oneMatchProgression[oneMatch.icon].played
    oneMatch.icon = oneMatchProgression[oneMatch.icon].icon
    ;[oneMatch.winner, oneMatch.loser] = [oneMatch.loser, oneMatch.winner]
    matches[oneMatchIndex] = oneMatch

    const anotherMatch = matches[anotherMatchIndex]

    anotherMatch.size = anotherMatchProgression[anotherMatch.icon].size
    anotherMatch.played = anotherMatchProgression[anotherMatch.icon].played
    anotherMatch.icon = anotherMatchProgression[anotherMatch.icon].icon
    ;[anotherMatch.winner, anotherMatch.loser] = [
      anotherMatch.loser,
      anotherMatch.winner,
    ]
    matches[anotherMatchIndex] = anotherMatch

    this.setState({ matches })
  }

  handleInactivate = (player) => {
    const { matches } = this.state
    let { inactivePlayerIds } = this.state

    if (inactivePlayerIds.indexOf(player.id) > -1) {
      inactivePlayerIds = inactivePlayerIds.filter((pid) => {
        return pid !== player.id
      })
    } else {
      inactivePlayerIds.push(player.id)
    }
    console.log(
      'ScoreCard -> handleInactivate -> inactivePlayerIds',
      inactivePlayerIds
    )

    const mappedMatches = matches.map((match) => {
      if (
        inactivePlayerIds.indexOf(match.winner.id) > -1 ||
        inactivePlayerIds.indexOf(match.loser.id) > -1
      ) {
        return { ...match, played: false, hide: true }
      } else {
        return { ...match, played: true, hide: false }
      }
    })
    this.setState({
      inactivePlayerIds,
      matches: mappedMatches,
    })
  }

  setMatches = () => {
    const { players } = this.props
    const matches = []

    players.forEach((player, index) => {
      players.forEach((p, i) => {
        if (index !== i) {
          const winner = index < i ? player : p
          const icon = index > i ? 'pointing up' : 'pointing left'
          const loser = index > i ? player : p
          const size = 'large'
          const count = index < i ? true : false
          const played = true
          const hide = false
          matches.push({ winner, loser, icon, size, count, played, hide })
        }
      })
    })
    this.setState({ matches })
  }

  componentDidMount = () => {
    this.setMatches()
  }

  render() {
    const {
      players,
      handleRemoveGroup,
      handleCreateSessionClick,
      group_id,
      handleDateChange,
      date,
    } = this.props

    const { matches } = this.state
    return (
      <Segment>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button icon labelPosition="left" onClick={handleRemoveGroup}>
            <Icon name="close" />
            Cancel Session
          </Button>
          <Form>
            <Form.Field>
              <DatePicker
                placeholderText="Date of Session"
                selected={date}
                onChange={handleDateChange}
                // minDate={Date.now()}
                // showTimeSelect
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
          style={{ marginTop: '2rem' }}
          content="The scorecard will default with the expected winners prefilled. You'll then be able to delete players that didn't show, change the winner where the underdog prevailed, and save the session and calculate ratings."
        />

        <Table unstackable celled fixed size="large">
          <Table.Header>
            <Table.Row key="upper left space" style={{ height: '5rem' }}>
              <Table.Cell
                style={{
                  width: '5rem',
                  borderBottom: '1px solid rgba(34, 36, 38, 0.15)',
                }}
              ></Table.Cell>
              {players.map((player) => {
                return (
                  <Table.Cell
                    key={player.name}
                    style={{
                      position: 'sticky',
                      top: 0,
                      width: '5rem',
                      backgroundColor: 'white',
                      borderBottom: '1px solid rgba(34, 36, 38, 0.15)',
                    }}
                  >
                    <Icon
                      name="close"
                      size="small"
                      style={{ position: 'absolute', top: '.25rem', right: 0 }}
                      onClick={() => this.handleInactivate(player)}
                    />
                    {player.name}
                  </Table.Cell>
                )
              })}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {players.map((player, index) => {
              return (
                <Table.Row key={player.name} style={{ height: '5rem' }}>
                  <Table.Cell>{player.name}</Table.Cell>
                  {players.map((p, i) => {
                    return (
                      <Table.Cell
                        key={p.name}
                        style={{
                          fontSize: '10px',
                          textAlign: 'center',
                        }}
                      >
                        {matches.length === 0 || index === i ? (
                          <div
                            style={{
                              backgroundColor: 'grey',
                              width: '4rem',
                              height: '4rem',
                            }}
                          ></div>
                        ) : index > i ? (
                          <ChoiceOfWinner
                            index={index}
                            i={i}
                            matchIndex={players.length * index + i - index}
                            match={matches[players.length * index + i - index]}
                            handleClick={this.handleClick}
                          />
                        ) : (
                          <ChoiceOfWinner
                            index={index}
                            i={i}
                            matchIndex={players.length * index + i - index - 1}
                            match={
                              matches[players.length * index + i - index - 1]
                            }
                            handleClick={this.handleClick}
                          />
                        )}
                      </Table.Cell>
                    )
                  })}
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </Segment>
    )
  }
}
