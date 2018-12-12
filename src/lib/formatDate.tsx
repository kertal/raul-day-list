/**
 * convert a given date in unixtime (ms since 1.1.1970) to YYYY-MM-DD
 * @param time
 */
export function formatDate(time: number): string {
  const date = new Date(time);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [
    date.getFullYear(),
    month < 10 ? `0${month}` : month,
    day < 10 ? `0${day}` : day,
  ].join('-');
}