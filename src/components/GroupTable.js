import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

export default class GroupTable extends Component {
  state = {}

  componentDidMount() {}

  render() {
    const { groups, handleGroupClick, activeItem } = this.props
    return (
      <Table selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Group Name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {groups.map((group) => {
            return (
              <Table.Row
                active={group.id === activeItem}
                key={group.name}
                onClick={(e) => handleGroupClick(e, group.id)}
              >
                <Table.Cell>{group.name}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }
}
