import { generateUuid } from './generateUuid';

describe('generateUuid', () => {
  it('returns a string', () => {
    expect(typeof generateUuid()).toBe('string');
  });

  it('returns a uuid-like format with dashes', () => {
    const uuid = generateUuid();
    // UUID format: 8-4-4-4-12 hex chars
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('generates unique values', () => {
    const uuids = new Set(Array.from({ length: 100 }, () => generateUuid()));
    expect(uuids.size).toBe(100);
  });
});
