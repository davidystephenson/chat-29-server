const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const Sse = require('json-sse')

const messageFactory = require(
  './message/router'
)
const Message = require(
  './message/model'
)

const channelFactory = require(
  './channel/router'
)
const Channel = require(
  './channel/model'
)

const stream = new Sse()

const app = express()

const middleware = cors()
app.use(middleware)

const jsonParser = bodyParser.json()
app.use(jsonParser)

async function update () {
  const channels = await Channel
    .findAll({ include: [Message] })

  channels.map(channel => {
    const string = JSON.stringify(
      channel.dataValues,
      null,
      2
    )

    console.log('string test:', string)
  })

  const data = JSON.stringify(channels)

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

const messageRouter = messageFactory(
  update
)
app.use(messageRouter)

const channelRouter = channelFactory(
  update
)
app.use(channelRouter)

const port = process.env.PORT || 4000

function onListen () {
  console.log(`Listening on :${port}`)
}

app.listen(port, onListen)
