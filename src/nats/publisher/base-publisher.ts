import { Stan } from 'node-nats-streaming';
import { formatDateTime } from '../../common/utils';

import BaseEvent from '../events/base-event';

abstract class BasePublisher<T extends BaseEvent> {
  abstract subject: T['subject'];

  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  private _publishCallback(
    err: Error | undefined,
    resolve: (value: void | PromiseLike<void>) => void,
    reject: (reason?: Error | undefined) => void
  ) {
    if (err) {
      return reject(err);
    }
    
    console.log(`[${this.subject}][${formatDateTime(Date())}] Event published!`);
    
    resolve();
  }

  publish(data: T['data']): Promise<void> {    
    return new Promise((resolve, reject) => {
      this.client.publish(
        this.subject,
        JSON.stringify(data),
        (err) => this._publishCallback(err, resolve, reject)
      );
    });
  }
}

export default BasePublisher;
