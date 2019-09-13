const express = require('express')

const { Router } = express

const messages = ['hello world', 'goodbye']

function factory (stream) {
  const router = new Router()

  function onStream (request, response) {
    const data = JSON.stringify(messages)
    console.log('data test:', data)

    stream.updateInit(data)
    stream.init(request, response)
  }

  router.get('/stream', onStream)

  return router
}

module.exports = factory
