import { Icon } from "semantic-ui-react"

const CloseButton = ({ handleClick }) => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{ padding: "5px", cursor: "pointer" }} onClick={handleClick}>
        <Icon name="close" />
      </div>
    </div>
  )
}

export default CloseButton
