/// <reference types="react-scripts" />

declare interface Task {
  _id: string;
  active: boolean;
  activityInput?: {
    defaultId: string;
    list: Array<{ id: string; name: string }>;
  };
  data?: any;
  duration?: number;
  name?: string;
  subject: string;
  taskName?: string; // TODO: remove
  type: string;
}

declare interface TimeEntry {
  _id: string;
  _rev?: string;
  activityId?: string;
  comment?: string;
  duration?: number;
  externalData?: any;
  taskId?: string;
  taskName?: string;
  timestamp: string;
}

declare interface UserSettingsProps {
  redmineEnabled?: boolean;
  redmineUri?: string;
  redmineToken?: string;
  defaultTimeUnitInMin?: number;
}

export interface Activity {
  id: string;
  name: string;
}
