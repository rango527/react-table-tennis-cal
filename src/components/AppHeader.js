import React from "react"
import { Link } from "react-router-dom"
import { Header, Segment, Button } from "semantic-ui-react"

export default function AppHeader({ handleLogout }) {
  return (
    <Segment clearing>
      <Header as="h1" floated="left">
        WDCTT Ratings
      </Header>

      {localStorage.getItem("token") ? (
        <Link to="/login" onClick={handleLogout}>
          <Button floated="right">Log Out</Button>
        </Link>
      ) : (
        <Link to="/login">
          <Button floated="right">Log In</Button>
        </Link>
      )}
    </Segment>
  )
}
