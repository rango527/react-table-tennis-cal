export const sortPlayerRatings = (player) => {
  return player.ratings.sort((a, b) => {
    if (!a.session) {
      return -1
    }
    if (!b.session) {
      return 1
    }
    if (datesAreOnSameDay(new Date(b.session_id), new Date(a.session_id))) {
      return a.session_id - b.session_id
    }
    return new Date(a.session.date) - new Date(b.session.date)
  })
}

export const mostRecentPlayerRating = (player) => {
  const sortedRatings = sortPlayerRatings(player)
  return sortedRatings[sortedRatings.length - 1]
}

export const getFormattedDate = (date) => {
  var year = date.getFullYear()

  var month = (1 + date.getMonth()).toString()
  month = month.length > 1 ? month : '0' + month

  var day = date.getDate().toString()
  day = day.length > 1 ? day : '0' + day

  return month + '/' + day + '/' + year
}

export const datesAreOnSameDay = (first, second) => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}
