import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'

export default class ChoiceOfWinner extends Component {
  render() {
    const { match, handleClick } = this.props
    console.log('ChoiceOfWinner -> render -> match', match)
    const { size, icon } = match
    return (
      <div>
        <Icon
          // loading
          size={size}
          name={icon}
          onClick={this.handleClick}
        />
      </div>
    )
  }
}
