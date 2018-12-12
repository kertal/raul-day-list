/**
 * function to get a dateTime range for a single day
 * usage: in the day view of the application, for getting the time entries
 * for the given day
 * @param {Number} dateValue - time in ms since midnight, January 1, 1970
 * @returns {{start: string, end: string}}
 */
export function getTimestampRangeByDate(dateValue: number): {start: string, end: string} {

        const date = new Date(dateValue);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const dateFormatted = `${date.getFullYear()}-${
            month < 10 ? '0' : ''
            }${month}-${day < 10 ? '0' : ''}${day}`;

        const dateRangeStart = new Date(
            `${dateFormatted}T00:00:00.000`
        ).toJSON();

        const dateRangeEnd = new Date(`${dateFormatted}T23:59:59.999`).toJSON();

        return {
            end: dateRangeEnd,
            start: dateRangeStart,
        };

}
