import { secsToHMS } from './common/utils';
import { NATS_SERVER_SETTINGS } from './common/constants';
import { buildStan } from './nats/stan';
import HealthcheckCreatedPublisher from './nats/publisher/healthcheck-created-publisher';

console.clear();

const {
  clusterID,
  publisher: {
    interval,
    prefix,
  },
  url,
} = NATS_SERVER_SETTINGS;

const stan = buildStan(clusterID, prefix, url.dockerCompose);

stan.on('connect', () => {
  console.log(`Publisher connected to NATS!`);

  // Graceful shutdown
  stan.on('close', () => {
    console.log(`NATS publisher connection closed!`);
    process.exit(); // Generates SIGTERM
  });

  const publisher = new HealthcheckCreatedPublisher(stan);

  setInterval(async () => {
    try {
      const data = {
        pid: process.pid,
        title: process.title,
        upTime: secsToHMS(process.uptime()),
      };
  
      await publisher.publish(data);
    } catch (error) {
      console.error(error);
    }
  }, interval * 1e3);
});

// Graceful shutdown. i.e., closes connection when ...
process.on('SIGINT', () => stan.close());   // ... interop signal is intercepted
process.on('SIGTERM', () => stan.close());  // ... terminate signal is intercepted
