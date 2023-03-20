const hostname =
  process.env.HOSTNAME ||
  Math.random()
    .toString(16)
    .slice(2)

const rabbitMQ = (() => {
  const rabbitHost = 'rabbitmq'
  const pass = process.env.RABBITMQ_MANAGER_PASS || 'guest'
  const user = process.env.RABBITMQ_MANAGER_USER || 'guest'

  return {
    rabbitHost: user + ':' + pass + '@' + rabbitHost
  }
})()

const rabbitResponseQueue = {
  exchange: '',
  queue: 'data.receive.' + hostname,
  type: 'direct',
  options: { autoDelete: true, durable: false, exclusive: true }
}

const rabbitQueues = {
  dataSave: {
    exchange: 'data.save',
    type: 'topic'
  },
  dataUpdate: {
    exchange: 'data.update',
    type: 'topic'
  },
  dataGet: {
    exchange: 'data.get',
    type: 'topic'
  },
  dataRemove: {
    exchange: 'data.remove',
    type: 'topic'
  },
  dataOptions: {
    exchange: 'data.settings',
    type: 'topic'
  }
}
module.exports = {
  rabbitQueues,
  rabbitMQ,
  hostname,
  rabbitResponseQueue
}
