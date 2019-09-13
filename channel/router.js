const express = require('express')

const { Router } = express

const Channel = require('./model')

function factory (update) {
  const router = new Router()

  async function onChannel (
    request, response
  ) {
    const { name } = request.body

    const channel = await Channel
      .create({ name })

    await update()

    return response.send(channel)
  }

  router.post('/channel', onChannel)

  return router
}

module.exports = factory
