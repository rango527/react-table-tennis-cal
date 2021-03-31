import React, { Component } from "react"
import { Link } from "react-router-dom"
import { Menu } from "semantic-ui-react"
import { isAdmin } from "../utilities"

export default class Nav extends Component {
  render() {
    const { location } = this.props

    return (
      <Menu tabular stackable>
        <Link to="/players">
          <Menu.Item
            name="players"
            active={location.pathname.indexOf("/players") > -1}
          />
        </Link>
        <Link to="/groups">
          <Menu.Item
            name="groups"
            active={location.pathname.indexOf("/groups") > -1}
          />
        </Link>
        <Link to="/results">
          <Menu.Item
            name="results"
            active={location.pathname.indexOf("/results") > -1}
          />
        </Link>
        {isAdmin() ? (
          <Link to="/record-results">
            <Menu.Item
              name="record results"
              icon="calculator"
              active={location.pathname.indexOf("/record-results") > -1}
            />
          </Link>
        ) : null}
      </Menu>
    )
  }
}
