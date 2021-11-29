import BasePublisher from "./base-publisher";
import { HealthCheckCreatedEvent } from '../events/healthcheck-created-event';
import Subjects from "../subjects";

class HealthcheckCreatedPublisher extends BasePublisher<HealthCheckCreatedEvent> {
  readonly subject = Subjects.HealthCheckCreated;
};

export default HealthcheckCreatedPublisher;
