import { Message } from 'node-nats-streaming';

import { NATS_SERVER_SETTINGS } from '../../common/constants';
import { HealthCheckCreatedEvent } from '../events/healthcheck-created-event';
import Subjects from '../subjects';
import BaseListener from './base-listener';

const {
  subscriber: {
    queueGroupName: hcQueueGroup,
  },
} = NATS_SERVER_SETTINGS;


class HealthcheckCreatedListener extends BaseListener<HealthCheckCreatedEvent> {
  readonly subject = Subjects.HealthCheckCreated;
  queueGroupName = hcQueueGroup;
  
  onMessage(data: HealthCheckCreatedEvent['data'], msg: Message): void {
    const text = `Data for event with seqNum ${msg.getSequence()}:
    \tpid:    ${data.pid}
    \ttitle:  ${data.title}
    \tupTime: ${data.upTime}`;
    
    console.log(text);

    msg.ack();
  }
}

export default HealthcheckCreatedListener;
