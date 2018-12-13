import {TimeEntry} from '../react-app-env';

/**
 * returns initial timestamp of a new time entry
 * if configured, minutes are adapted to the defaultTimeUnitInMin value
 * reason: not everyone wants the accuracy of a single minute in his workflow
 * @param date
 * @param timeEntryList[]
 * @param defaultTimeUnitInMin - if higher than 1 the minutes of the returned timestamp are adapted
 * @param nowTime - just for testing
 * @returns {number}
 */
export function getNewTimestamp(
  date: number,
  timeEntryList: TimeEntry[] = [],
  defaultTimeUnitInMin: number = 1,
  nowTime: number = 0
) {
  const now = nowTime ? new Date(nowTime) : new Date();
  const previousEntry = timeEntryList[timeEntryList.length - 1];
  const previousEntryTimestamp = previousEntry ? previousEntry.timestamp : 0;

  let dateObj = new Date(date);
  let minutes = now.getMinutes();

  if (minutes % defaultTimeUnitInMin >= 1) {
    // depending on the configuted defaultTimeUnitInMin round minutes floor or ciel
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