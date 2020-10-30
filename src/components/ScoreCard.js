import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'
import ChoiceOfWinner from './ChoiceOfWinner'

export default class ScoreCard extends Component {
  state = {}

  componentDidMount() {}

  render() {
    const { players } = this.props
    return (
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
                      {index !== i ? (
                        <ChoiceOfWinner index={index} i={i} />
                      ) : (
                        <div
                          style={{
                            backgroundColor: 'grey',
                            width: '4rem',
                            height: '4rem',
                          }}
                        ></div>
                      )}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }
}