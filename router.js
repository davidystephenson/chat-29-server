const express = require('express')

const { Router } = express

const Message = require('./model')

function factory (stream) {
  const router = new Router()

  async function onStream (
    request, response
  ) {
    const messages = await Message
      .findAll()
    const data = JSON.stringify(messages)
    console.log('data test:', data)

    stream.updateInit(data)
    return stream.init(request, response)
  }

  router.get('/stream', onStream)

  async function onMessage (
    request, response
  ) {
    const { text } = request.body

    // messages.push(text)

    const message = await Message
      .create({ text })

    const messages = await Message
      .findAll()

    const data = JSON.stringify(messages)

    stream.send(data)

    return response.send(message)
  }

  router.post('/message', onMessage)

  return router
}

module.exports = factory
