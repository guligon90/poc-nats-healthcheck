import { formatDateTime, secsToHMS } from './common/utils';
import { NATS_SERVER_SETTINGS } from './common/constants';
import Subjects from './nats/subjects';
import { buildStan } from './nats/stan';

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
  
  setInterval(() => {
    // A gotcha from NATS is that it does not accept object
    // payloads in events' messages, only strings.
    const data = JSON.stringify({
      pid: process.pid,
      title: process.title,
      upTime: secsToHMS(process.uptime()),
    });

    stan.publish(Subjects.HealthCheckCreated, data, () => {
      console.log(`Event published at ${formatDateTime(Date())}`);
    });
  }, interval * 1e3);
});

// Graceful shutdown. i.e., closes connection when ...
process.on('SIGINT', () => stan.close());   // ... interop signal is intercepted
process.on('SIGTERM', () => stan.close());  // ... terminate signal is intercepted
