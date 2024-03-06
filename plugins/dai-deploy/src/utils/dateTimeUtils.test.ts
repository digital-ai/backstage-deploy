import { formatTimestamp } from './dateTimeUtils';

describe('dateTimeUtils', () => {
  it('formatTimestamp should return valid formatted string', () => {
    expect(formatTimestamp('2024-02-23T09:27:14.277+0000')).toBe(
      'Feb 23, 2024 - 9:27 AM',
    );
  });

  it("formatTimestamp should return 'Invalid date' for non date input", () => {
    expect(formatTimestamp('test')).toBe('Invalid date');
  });

  it("formatTimestamp should return '' for null input", () => {
    expect(formatTimestamp(null)).toBe('');
  });

  it("formatTimestamp should return '' for undefined input", () => {
    expect(formatTimestamp(undefined)).toBe('');
  });
});
