import Subjects from '../subjects';

interface BaseEvent {
  subject: Subjects;
  data: unknown;
}

export default BaseEvent;
