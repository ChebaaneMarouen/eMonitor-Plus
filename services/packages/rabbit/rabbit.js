const amqp = require('amqplib')

// if the connection is closed or fails to be established at all, we will reconnect
let amqpConn = null
let isConnecting = false

const exchanges = {}
const queues = {}
const consumers = []
const offlinePubQueue = []

let pubChannel = null
let conChannel = null

module.exports = (() => {
  // save configurations to allow reconnect on channel error
  let usedRabbitMqConfig = {}
  function connect (rabbitMqConfig) {
    if (isConnecting) return
    isConnecting = true
    usedRabbitMqConfig = rabbitMqConfig
    return amqp
      .connect('amqp://' + rabbitMqConfig.rabbitHost + '?heartbeat=60')
      .then((conn) => {
        isConnecting = false
        conn.on('error', function (err) {
          if (err.message !== 'Connection closing') {
            console.error('[AMQP] conn error', err.message)
            closeOnErr()
          }
        })
        conn.on('close', function () {
          console.error('[AMQP] reconnecting')
          return setTimeout(() => connect(rabbitMqConfig), 1000)
        })

        console.log('[AMQP] connected')
        amqpConn = conn

        whenConnected()
        return conn
      })
      .catch((err) => {
        console.error('[AMQP][ERROR] ', err)
        return new Promise((resolve) => {
          // try to reconnect after a seccond
          setTimeout(() => resolve(connect(rabbitMqConfig)), 1000)
        })
      })
  }

  async function whenConnected () {
    await createChannels()
    await assertQueues()
    startConsumers()
    startPublisher()
  }

  function assertQueues () {
    return Promise.all(
      Object.values(exchanges).map(({ exchange, type }) => {
        // set exchanges to be all fanout for now
        if (!exchange) return Promise.resolve()
        return pubChannel.assertExchange(exchange, type)
      })
    ).then(() => {
      return Promise.all(
        Object.values(queues).map((q) => {
          return pubChannel.assertQueue(q.queue, q.options).then(() => {
            if (!q.exchange) return Promise.resolve()
            return pubChannel.bindQueue(q.queue, q.exchange, q.binding)
          })
        })
      )
    })
  }

  async function createChannels () {
    const channelCreate = () =>
      amqpConn.createConfirmChannel().then((ch) => {
        ch.on('error', function (err) {
          console.error('[AMQP] error', err.message)
        })
        ch.on('close', function () {
          console.log('[AMQP] channel closed')
          setTimeout(() => {
            connect(usedRabbitMqConfig)
          }, 500)
        })
        return ch
      })

    return Promise.all([channelCreate(), channelCreate()]).then((channels) => {
      pubChannel = channels[0]
      conChannel = channels[1]
    })
  }

  function startPublisher () {
    while (true) {
      const m = offlinePubQueue.shift()
      if (!m) break
      publish(m[0], m[1], m[2], m[3])
    }
  }

  function startConsumers () {
    consumers.forEach((consumer) => {
      conChannel.consume(consumer.queue, consumer.cb, { noAck: true })
    })
  }

  function addConsumer (consumer) {
    consumers.push(consumer)
    if (!pubChannel) return Promise.resolve()
    return conChannel.consume(consumer.queue, consumer.cb, { noAck: true })
  }

  function addExchange ({ exchange, type }) {
    type = type || 'fanout' // default to fanout
    if (!exchange) return Promise.resolve()
    if (!exchanges[exchange]) exchanges[exchange] = { exchange, type }
    if (exchanges[exchange].asserted) return Promise.resolve()

    // if no pubChannel the exchange creation will be defered till connection is created
    if (!pubChannel) return Promise.resolve()
    return pubChannel
      .assertExchange(exchange, exchanges[exchange].type)
      .then(() => (exchanges[exchange].asserted = true))
  }

  function addQueue (queue) {
    queue.options = queue.options || { durable: true }
    queue.binding = queue.binding || ''
    queues[queue.queue] = queue
    if (!pubChannel) return Promise.resolve()
    return pubChannel.assertQueue(queue.queue, queue.options).then(() => {
      if (!queue.exchange) return Promise.resolve()
      return pubChannel.bindQueue(queue.queue, queue.exchange, queue.binding)
    })
  }

  // method to publish a message, will queue messages internally if the connection is down and resend later
  async function publish (exchange, routingKey, content, options = {}) {
    if (typeof exchange === 'string') exchange = { exchange }
    try {
      await addExchange(exchange)
      options = { persistent: true, ...options }

      return pubChannel.publish(
        exchange.exchange,
        routingKey,
        content,
        options,
        function (err, ok) {
          if (err) {
            console.error('[AMQP] publish', err)
            offlinePubQueue.push([exchange, routingKey, content, options])
            pubChannel.connection.close()
          }
        }
      )
    } catch (e) {
      console.error('[AMQP] publish', e.message)
      offlinePubQueue.push([exchange, routingKey, content, options])
    }
  }

  function closeOnErr () {
    amqpConn.close()
    return true
  }

  function consume (data, cb) {
    // rename the queue to start with exchange
    let { exchange, type, queue, options, binding } = data
    queue = exchange + '.' + queue

    addExchange({ exchange, type })
      .then(() => addQueue({ queue, options, exchange, binding }))
      .then(() => addConsumer({ queue, cb }))
      .catch((err) => {
        console.log('[CONSUME]', err)
      })
  }

  function ensureExchange (exchange) {
    if (!exchange.exchange) return Promise.resolve()
    return addExchange(exchange).catch((err) => {
      console.log('[ensure Exchange]', err)
    })
  }

  function ensureQueue (queue) {
    return addQueue(queue)
  }
  function sendToQueue (queue, data, options = {}) {
    return pubChannel.sendToQueue(queue, data, options)
  }

  return {
    connect,
    ensureExchange,
    publish,
    consume,
    ensureQueue,
    sendToQueue
  }
})()
