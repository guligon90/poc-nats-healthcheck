import { NATS_SERVER_SETTINGS } from './common/constants';
import { buildStan } from './nats/stan';
import HealthcheckCreatedListener from './nats/listeners/healthcheck-created-listener';

console.clear();

const {
  clusterID,
  subscriber: {
    prefix,
  },
  url,
} = NATS_SERVER_SETTINGS;

// NATS Client (STAN) for the listener
const stan = buildStan(clusterID, prefix, url.dockerCompose);

stan.on('connect', () => {
  console.log(`Listener connected to NATS!`);
  
  // Graceful shutdown
  stan.on('close', () => {
    console.log(`NATS listener connection closed!`);
    process.exit(); // Generates SIGTERM
  });

  new HealthcheckCreatedListener(stan).listen();
});

// Graceful shutdown. i.e., closes connection when ...
process.on('SIGINT', () => stan.close());   // ... interop signal is intercepted
process.on('SIGTERM', () => stan.close());  // ... terminate signal is intercepted
