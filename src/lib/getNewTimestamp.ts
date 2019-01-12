import { TimeEntry } from '../react-app-env';

/**
 * returns initial timestamp of a new time entry
 * if configured, minutes are adapted to the defaultTimeUnitInMin value
 * Reason: not everyone wants the accuracy of a single minute in his workflow
 */
export function getNewTimestamp(
  date: number,
  timeEntryList: TimeEntry[] = [],
  defaultTimeUnitInMin: number = 1,
  nowTime: number = 0
): string {
  const now = nowTime ? new Date(nowTime) : new Date();
  const previousEntry = timeEntryList[timeEntryList.length - 1];
  const previousEntryTimestamp = previousEntry ? previousEntry.timestamp : 0;

  let dateObj = new Date(date);
  let minutes = now.getMinutes();

  if (minutes % defaultTimeUnitInMin >= 1) {
    // depending on the configured defaultTimeUnitInMin, round minutes floor or ceil
    minutes =
      previousEntry && previousEntry.taskId
        ? Math.ceil(minutes / defaultTimeUnitInMin) * defaultTimeUnitInMin
        : Math.floor(minutes / defaultTimeUnitInMin) * defaultTimeUnitInMin;
  }
  dateObj.setHours(now.getHours(), minutes, 0, 0);

  if (
    (!previousEntryTimestamp || previousEntryTimestamp < dateObj.toJSON()) &&
    now.toDateString() === dateObj.toDateString()
  ) {
    // the given date is today, so the new timestamp is the current time
    return String(dateObj.toJSON());
  }

  if (previousEntry) {
    const marginInMin = defaultTimeUnitInMin < 5 ? 5 : defaultTimeUnitInMin;
    const prevDate = new Date(previousEntry.timestamp);
    dateObj = new Date(prevDate.getTime() + marginInMin * 60000);
  }

  return dateObj.toJSON();
}
