import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'

export default class ChoiceOfWinner extends Component {
  render() {
    const { match, handleClick, index, i } = this.props

    const { size, icon, hide } = match
    return (
      <div>
        {!hide ? (
          <Icon
            // loading
            size={size}
            name={icon}
            onClick={() => handleClick(index, i)}
          />
        ) : null}
      </div>
    )
  }
}
