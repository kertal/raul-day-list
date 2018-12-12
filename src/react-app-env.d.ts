/// <reference types="react-scripts" />

declare interface ITask {
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

declare interface ITimeEntry {
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

export interface ITimeEntryPersist {
  _id: string;
  activityId: string;
  comment: string;
  taskId: string;
  taskName: string;
  timestamp: string;
}

declare interface IUserSettingsProps {
  redmineEnabled?: boolean;
  redmineUri?: string;
  redmineToken?: string;
  defaultTimeUnitInMin?: number;
}

export interface IActivity {
  id: string;
  name: string;
}
