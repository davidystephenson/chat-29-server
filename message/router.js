const express = require('express')

const { Router } = express

const Message = require('./model')

function factory (update) {
  const router = new Router()

  async function onMessage (
    request, response
  ) {
    const {
      text, channelId
    } = request.body

    // messages.push(text)

    const message = await Message
      .create({ text, channelId })

    await update()

    return response.send(message)
  }

  router.post('/message', onMessage)

  async function onDelete (
    request, response
  ) {
    const destroyed = await Message
      .destroy({
        where: {},
        truncate: true
      })

    await update()

    response.send({ destroyed })
  }

  router.delete('/message', onDelete)

  return router
}

module.exports = factory
