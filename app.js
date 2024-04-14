const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbpath = path.join(__dirname, 'cricketTeam.db')
let db = null
const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}
intializeDBAndServer()

function playersDetails(players) {
  return {
    playerId: players.player_id,
    playerName: players.player_name,
    jerseyNumber: players.jersey_number,
    role: players.role,
  }
}

app.get('/players/', async (request, response) => {
  const getAllPlayersQuery = `SELECT * FROM cricket_team;`
  const playersDb = await db.all(getAllPlayersQuery)
  response.send(playersDetails(playersDb))
})


module.exports = app
