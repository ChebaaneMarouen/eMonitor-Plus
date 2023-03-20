const Rx = require('rxjs')
const RxOp = require('rxjs/operators')
const uuidv4 = require('uuid/v4')

const myRabbit = require('@localPackages/rabbit')
const { rabbitResponseQueue, rabbitQueues } = require('./config')

exports.createRequest = createRequest

Object.values(rabbitQueues).forEach((exchange) =>
  myRabbit.ensureExchange(exchange)
)

myRabbit.ensureQueue(rabbitResponseQueue)

const resultReceived = new Rx.Subject()
myRabbit.consume(rabbitResponseQueue, (msg) => {
  resultReceived.next(msg)
})

function createRequest (data) {
  let queue = null
  switch (data.action) {
    case 'save':
      queue = rabbitQueues['dataSave']
      break
    case 'update':
      queue = rabbitQueues['dataUpdate']
      break
    case 'count':
    case 'getOne':
    case 'get':
      queue = rabbitQueues['dataGet']
      break
    case 'remove':
      queue = rabbitQueues['dataRemove']
      break
    case 'describe':
    case 'option':
      queue = rabbitQueues['dataOptions']
      break
  }
  if (!queue) return Promise.reject(new Error('Undefined Action'))
  const replyTo = '.' + rabbitResponseQueue.queue
  const correlationId = uuidv4()
  return myRabbit
    .publish(queue.exchange, data.db, Buffer.from(JSON.stringify(data)), {
      replyTo,
      correlationId
    })
    .then(() => {
      return resultReceived
        .pipe(
          RxOp.filter((msg) => msg.properties.correlationId === correlationId),
          RxOp.timeout(10000),
          RxOp.map((msg) => JSON.parse(msg.content)),
          RxOp.take(1)
        )
        .toPromise()
        .then((value) => {
          if (!value) throw new Error('undefined result')
          if (value.success) {
            return value.result
          } else {
            throw value.error
          }
        })
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}
