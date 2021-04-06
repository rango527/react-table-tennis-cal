import React, { useState, useEffect } from "react"
import CreateSessionForm from "../components/CreateSessionForm"
import { baseUrl } from "../constants"

export default function SessionContainer(props) {
  const [groups, setGroups] = useState([])

  const fetchGroups = () => {
    let token = localStorage.getItem("token")
    if (token) {
      fetch(baseUrl + "/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((groups) => {
          setGroups(groups)
        })
        .catch((e) => console.error(e))
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  return (
    <>
      <CreateSessionForm groups={groups} {...props} />
    </>
  )
}
