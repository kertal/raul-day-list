import { getTimestampRangeByDate } from './getTimestampRangeByDate';

describe('getTimestampRangeByDate', () => {
  it('returns start and end ISO strings for a given date', () => {
    const dateValue = new Date('2019-06-15T12:00:00.000Z').getTime();
    const result = getTimestampRangeByDate(dateValue);
    expect(result).toHaveProperty('start');
    expect(result).toHaveProperty('end');
    expect(typeof result.start).toBe('string');
    expect(typeof result.end).toBe('string');
  });

  it('start is before end', () => {
    const dateValue = new Date('2019-06-15T12:00:00.000Z').getTime();
    const result = getTimestampRangeByDate(dateValue);
    expect(result.start < result.end).toBe(true);
  });

  it('start and end are on the same date', () => {
    const dateValue = new Date('2019-06-15T12:00:00.000Z').getTime();
    const result = getTimestampRangeByDate(dateValue);
    const startDate = new Date(result.start);
    const endDate = new Date(result.end);
    expect(startDate.getDate()).toBe(endDate.getDate());
    expect(startDate.getMonth()).toBe(endDate.getMonth());
    expect(startDate.getFullYear()).toBe(endDate.getFullYear());
  });

  it('end time is at 23:59:59.999', () => {
    const dateValue = new Date('2019-06-15T12:00:00.000Z').getTime();
    const result = getTimestampRangeByDate(dateValue);
    const endDate = new Date(result.end);
    expect(endDate.getHours()).toBe(23);
    expect(endDate.getMinutes()).toBe(59);
    expect(endDate.getSeconds()).toBe(59);
    expect(endDate.getMilliseconds()).toBe(999);
  });

  it('returns valid JSON date strings', () => {
    const dateValue = new Date('2019-01-01T00:00:00.000Z').getTime();
    const result = getTimestampRangeByDate(dateValue);
    expect(() => new Date(result.start)).not.toThrow();
    expect(() => new Date(result.end)).not.toThrow();
    expect(new Date(result.start).getTime()).toBeGreaterThan(0);
    expect(new Date(result.end).getTime()).toBeGreaterThan(0);
  });
});
