const elasticsearchUrl = 'http://elasticsearch:9200';
const rabbitMQ = (() => {
  const rabbitHost = 'rabbitmq';
  const pass = process.env.RABBITMQ_MANAGER_PASS || 'guest';
  const user = process.env.RABBITMQ_MANAGER_USER || 'guest';

  return {
    rabbitHost: user + ':' + pass + '@' + rabbitHost,
  };
})();

const rabbitQueues = {
  dataSave: {
    exchange: 'data.save',
    type: 'topic',
    queue: 'elasticsearch-manager',
    binding: 'elasticsearch',
  },
  dataUpdate: {
    exchange: 'data.update',
    type: 'topic',
    queue: 'elasticsearch-manager',
    binding: 'elasticsearch',
  },
  dataGet: {
    exchange: 'data.get',
    type: 'topic',
    queue: 'elasticsearch-manager',
    binding: 'elasticsearch',
  },
  dataRemove: {
    exchange: 'data.remove',
    type: 'topic',
    queue: 'elasticsearch-manager',
    binding: 'elasticsearch',
  },
  dataOptions: {
    exchange: 'data.settings',
    type: 'topic',
    queue: 'elasticsearch-manager',
    binding: 'elasticsearch',
  },
};

module.exports = {
  rabbitMQ,
  rabbitQueues,
  elasticsearchUrl,
};
