import nats, { Stan } from 'node-nats-streaming';

import { generateClientID } from '../../common/utils';

const buildStan = (clusterID: string, clientPrefix: string, url: string): Stan => {

  const clientID = generateClientID(clientPrefix);

  return nats.connect(
    clusterID,
    clientID, {
    url,
  });
}

export { buildStan };
