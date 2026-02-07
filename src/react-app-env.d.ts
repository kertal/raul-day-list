/// <reference types="react-scripts" />

export interface Task {
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
  type: string;
}

export interface TimeEntry {
  _id: string;
  activityId?: string;
  comment?: string;
  duration?: number;
  externalData?: any;
  taskId?: string;
  taskName?: string;
  timestamp: string;
}

export interface UserSettingsProps {
  redmineEnabled?: boolean;
  redmineUri?: string;
  redmineToken?: string;
  defaultTimeUnitInMin?: number;
}

export interface Activity {
  id: string;
  name: string;
}
