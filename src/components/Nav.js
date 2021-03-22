import React, { Component } from "react"
import { Link } from "react-router-dom"
import { Menu } from "semantic-ui-react"
import { isAdmin } from "../utilities"

export default class Nav extends Component {
  render() {
    const { activeItem, handleNavClick } = this.props
    return (
      <Menu tabular stackable>
        <Link to="/players" onClick={() => handleNavClick("players")}>
          <Menu.Item name="players" active={activeItem === "players"} />
        </Link>
        <Link to="/groups" onClick={() => handleNavClick("groups")}>
          <Menu.Item name="groups" active={activeItem === "groups"} />
        </Link>
        <Link to="/sessions" onClick={() => handleNavClick("sessions")}>
          <Menu.Item name="sessions" active={activeItem === "sessions"} />
        </Link>
        {isAdmin() ? (
          <Link
            to="/record-results"
            onClick={() => handleNavClick("record-results")}
          >
            <Menu.Item
              name="record results"
              icon="calculator"
              active={activeItem === "record-results"}
            />
          </Link>
        ) : null}
      </Menu>
    )
  }
}
