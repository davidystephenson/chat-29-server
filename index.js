const express = require('express')
const Sse = require('json-sse')
const bodyParser = require('body-parser')
const factory = require('./router')

const stream = new Sse()

const app = express()

const jsonParser = bodyParser.json()
app.use(jsonParser)

const router = factory(stream)
app.use(router)

const port = process.env.PORT || 4000

function onListen () {
  console.log(`Listening on :${port}`)
}

app.listen(port, onListen)
