import React, { Component } from "react"
import CreateSessionForm from "../components/CreateSessionForm"
import { baseUrl } from "../constants"

export default class SessionContainer extends Component {
  state = {
    groups: [],
  }

  fetchGroups = () => {
    let token = localStorage.getItem("token")
    if (token) {
      fetch(baseUrl + "/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((groups) => {
          this.setState({ groups })
        })
        .catch((e) => console.error(e))
    }
  }

  handleClick = () => {}
  componentDidMount() {
    this.fetchGroups()
  }

  render() {
    const { groups } = this.state

    return (
      <>
        <CreateSessionForm groups={groups} />
      </>
    )
  }
}
