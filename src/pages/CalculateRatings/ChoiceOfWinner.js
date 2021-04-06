import React from "react"
import { Icon } from "semantic-ui-react"

export default function ChoiceOfWinner({ match, handleClick, index, i }) {
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
