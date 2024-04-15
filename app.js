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

app.get('/players/', async (request, response) => {
  const playersQuery = `SELECT * FROM cricket_team;`
  const playersDb = await db.all(playersQuery)
  response.send(
    playersDb.map(eachPlayer => ({
      playerId: eachPlayer.player_id,
      playerName: eachPlayer.player_name,
      jerseyNumber: eachPlayer.jersey_number,
      role: eachPlayer.role,
    })),
  )
})

app.use(express.json())

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addPlayerQuery = `INSERT INTO cricket_team(player_name, jersey_number, role) 
    VALUES('${playerName}', '${jerseyNumber}', '${role}');`
  await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})

app.use(express.json())

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerQuery = `SELECT * FROM cricket_team WHERE player_id = '${playerId}';`
  const player = await db.get(playerQuery)
  function convertPlayerObj(player) {
    return {
      playerId: player.player_id,
      playerName: player.player_name,
      jerseyNumber: player.jersey_number,
      role: player.role,
    }
  }
  response.send(convertPlayerObj(player))
})

app.use(express.json())

app.put('players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updateQuery = `UPDATE cricket_team 
  SET player_name = '${playerName}',jersey_number = '${jerseyNumber}', role = '${role}'
  WHERE player_id = ${playerId};`
  await db.run(updateQuery)
  response.send('Player Details Update')
})

app.use(express.json())

app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const deleteQuery = `DELETE FROM cricket_team 
  WHERE player_id = ${playerId};`
  await db.run(deleteQuery)
  response.send('Player Removed')
})

module.exports = app
