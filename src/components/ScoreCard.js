import React, { Component } from 'react'
import { Table, Button, Message, Segment, Icon } from 'semantic-ui-react'
import ChoiceOfWinner from './ChoiceOfWinner'

export default class ScoreCard extends Component {
  state = { matches: [] }

  handleClick = (matchIndex) => {
    console.log('ScoreCard -> handleClick -> matchIndex', matchIndex)
    // let { name, size } = this.state

    // if (name === 'pointing up') {
    //   name = 'pointing left'
    // } else {
    //   name = 'pointing up'
    // }

    // if (size === 'large') {
    //   size = 'huge'
    // } else {
    //   size = 'large'
    // }
    // this.setState({ name, size })
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
          matches.push({ winner, loser, icon, size })
        }
      })
    })
    this.setState({ matches })
  }

  componentDidMount = () => {
    this.setMatches()
  }

  render() {
    const { players, handleRemoveGroup } = this.props
    const { matches } = this.state
    return (
      <Segment>
        <Button icon labelPosition="left" onClick={handleRemoveGroup}>
          <Icon name="close" />
          Cancel Session
        </Button>

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
                            handleClick={this.handleRemoveGroup}
                            // icon={index > i ? 'pointing up' : 'pointing left'}
                            // size="large"
                            // winner={index < i ? players[index] : players[i]}
                            // loser={index > i ? players[index] : players[i]}
                          />
                        ) : (
                          <ChoiceOfWinner
                            index={index}
                            i={i}
                            matchIndex={players.length * index + i - index - 1}
                            match={
                              matches[players.length * index + i - index - 1]
                            }
                            handleClick={this.handleRemoveGroup}

                            // icon={index > i ? 'pointing up' : 'pointing left'}
                            // size="large"
                            // winner={index < i ? players[index] : players[i]}
                            // loser={index > i ? players[index] : players[i]}
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
