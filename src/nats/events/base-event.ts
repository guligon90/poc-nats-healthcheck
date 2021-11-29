import Subjects from '../subjects';

interface BaseEvent {
  subject: Subjects;
  data: BaseEventData | HealthCheckEventData;
}

export default BaseEvent;
