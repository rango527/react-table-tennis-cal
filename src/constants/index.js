export const baseUrl = "http://localhost:3000/api/v1"
// export const baseUrl = 'https://wdctt-ratings-backend.herokuapp.com/api/v1'

export const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
}
