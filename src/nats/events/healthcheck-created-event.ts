import Subjects from "../subjects";

export interface HealthCheckCreatedEvent {
  subject: Subjects.HealthCheckCreated;
  data: {
    pid: number;
    title: string;
    upTime: string;
  };
}
