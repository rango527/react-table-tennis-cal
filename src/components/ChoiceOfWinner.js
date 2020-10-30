import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'

export default class ChoiceOfWinner extends Component {
  state = {}
  handleChange = (e, { value }) => this.setState({ value })

  render() {
    const { index, i } = this.props
    return (
      <div>
        <Icon
          // loading
          // size={index > i ? 'small' : 'large'}
          name={index > i ? 'pointing up' : 'pointing left'}
          value="expected"
          checked={this.state.value === 'expected'}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}
