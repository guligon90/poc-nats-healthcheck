import { Message, Stan, SubscriptionOptions } from "node-nats-streaming";

import { formatDateTime } from "../../common/utils";
import { NATS_SERVER_SETTINGS } from '../../common/constants';
import BaseEvent from "../events/base-event";

const { subscriber: { ackWait: subAckWait } } = NATS_SERVER_SETTINGS;

abstract class BaseListener<T extends BaseEvent> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;

  private client: Stan;
  protected ackWait: number = (subAckWait || 5.0) * 1e3;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions(): SubscriptionOptions {
    // Option chaining object for the subscriber
    return this.client.subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true) // Forces the subscriber to perform manual acknowledgment to NATS
      .setAckWait(this.ackWait) // Retains event history. Useful when the subscriber goes down and has to be restarted, loading missing events
      .setDurableName(this.queueGroupName); // Associates the event history to a (durable) subscription, to prevent event reprocessing
  }

  listen(): void {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`[${this.subject}/${this.queueGroupName}][${formatDateTime(Date())}] Message received!`);

      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message): unknown {
    const data = msg.getData();

    return typeof data === 'string'
      ? JSON.parse(data) // Parses string to JSON
      : JSON.parse(data.toString('utf8')); // Parses Buffer to JSON
  }
}

export default BaseListener;
