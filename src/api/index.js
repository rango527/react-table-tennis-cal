import { baseUrl, HEADERS } from "../constants"

export const fetchPlayers = async () => {
  const response = await fetch(baseUrl + "/players")

  if (!response.ok) {
    throw new Error("Something went wrong!")
  }
  const players = await response.json()
  const sortedPlayers = players.sort((a, b) => {
    if (a.most_recent_rating && b.most_recent_rating) {
      return b.most_recent_rating - a.most_recent_rating
    } else {
      return 0
    }
  })

  return sortedPlayers
}

export const fetchPlayer = async (playerId) => {
  const response = await fetch(baseUrl + `/players/${playerId}`)

  if (!response.ok) {
    throw new Error("Something went wrong!")
  }
  const player = await response.json()

  return player
}

export const fetchGroups = async () => {
  const response = await fetch(baseUrl + "/groups")

  if (!response.ok) {
    throw new Error("Something went wrong!")
  }
  return await response.json()
}

export const fetchGroup = async (groupId) => {
  const response = await fetch(baseUrl + `/groups/${groupId}`)

  if (!response.ok) {
    throw new Error("Something went wrong!")
  }
  const group = await response.json()
  const sortedPlayers = group.players.sort((a, b) => {
    if (a.most_recent_rating && b.most_recent_rating) {
      return b.most_recent_rating - a.most_recent_rating
    } else {
      return 0
    }
  })
  group.players = sortedPlayers
  return group
}

export const fetchSessions = async () => {
  const response = await fetch(baseUrl + "/sessions")

  if (!response.ok) {
    throw new Error("Something went wrong!")
  }
  const sessions = await response.json()
  return sessions
}

export const fetchSession = async (sessionId) => {
  const response = await fetch(baseUrl + `/sessions/${sessionId}`)

  if (!response.ok) {
    throw new Error("Something went wrong!")
  }

  const session = await response.json()
  return session
}

export const addPlayerToGroup = async (groupId, playerId, addOrRemove) => {
  let data = {
    player_id: playerId,
    add_or_remove: addOrRemove,
  }

  const response = await fetch(`${baseUrl}/groups/${groupId}`, {
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify(data),
  })

  const group = await response.json()

  return { group, groupId, playerId }
}

export const createSession = async (data) => {
  const response = await fetch(`${baseUrl}/sessions`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(data),
  })

  const session = await response.json()
  return session
}
