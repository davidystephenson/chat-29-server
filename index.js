const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const Sse = require('json-sse')

const factory = require(
  './message/router'
)
const Message = require(
  './message/model'
)

const stream = new Sse()

const app = express()

const middleware = cors()
app.use(middleware)

const jsonParser = bodyParser.json()
app.use(jsonParser)

async function update () {
  const messages = await Message
    .findAll()

  const data = JSON.stringify(messages)

  stream.send(data)
}

async function onStream (
  request, response
) {
  const messages = await Message
    .findAll()
  const data = JSON.stringify(messages)

  stream.updateInit(data)

  return stream.init(request, response)
}

app.get('/stream', onStream)

const router = factory(update)
app.use(router)

const port = process.env.PORT || 4000

function onListen () {
  console.log(`Listening on :${port}`)
}

app.listen(port, onListen)
