const NATS_SERVER_SETTINGS = {
  clusterID: 'healthcheck',
  publisher: {
    interval: 30.0, // seconds,
    prefix: 'hc-pub',
  },
  subscriber: {
    // A queue group definition allows the NATS server to broadcast
    // the incoming events randomly to the available subscriber instances,
    // preventing parallel processing of the same event/message
    queueGroupName: 'hcQueueGroup',
    prefix: 'hc-sub',
    ackWait: 5.0, // seconds
  },
  url: {
    dockerCompose: 'http://localhost:4222',
    kubernetes: 'http://nats-healthcheck',
  },
}

export {
  NATS_SERVER_SETTINGS,
};
