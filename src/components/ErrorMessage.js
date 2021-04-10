import React from "react"
import { Message } from "semantic-ui-react"

export default function ErrorMessage(error) {
  return (
    <Message attached>
      <div className="content">
        <div className="header">Error Fetching Data</div>
        <p>
          {/* {error.message} */}
          Something went wrong with a network request. Please try again.
        </p>
      </div>
    </Message>
  )
}
