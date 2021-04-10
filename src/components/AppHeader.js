import React from "react"
import { Link } from "react-router-dom"
import { Header, Segment, Button, Message } from "semantic-ui-react"
import Nav from "./Nav"

export default function AppHeader({ location, handleLogout }) {
  return (
    <header>
      <Segment clearing>
        <Header as="h1" floated="left">
          WDCTT Ratings
        </Header>

        {localStorage.getItem("token") ? (
          <Link
            to="/login"
            onClick={handleLogout}
            component={Button}
            style={{ float: "right" }}
          >
            Log Out
          </Link>
        ) : (
          <Link to="/login" component={Button} style={{ float: "right" }}>
            Log In
          </Link>
        )}
      </Segment>
      <Nav location={location} />
      <Message
        style={{ marginBottom: "1rem" }}
        content="If you see something wrong, or have questions, email Oren Magid at oren.michael.magid@gmail.com."
      />
    </header>
  )
}
