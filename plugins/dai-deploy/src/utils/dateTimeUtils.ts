import moment from 'moment';

export const beginDateFormat = 'YYYY-MM-DDT00:00:00.000ZZ';
export const endDateFormat = 'YYYY-MM-DDT23:59:59.999ZZ';

export const genericDateFormat = 'MMM D, YYYY';
export const genericTimeFormat = 'h:mm A';
export const genericTimeFormatWithSeconds = 'h:mm:ss A';
export const genericTimestampFormat = `${genericDateFormat} - ${genericTimeFormat}`;

export const formatTimestamp = (arg: any) =>
  arg ? moment(arg).format(genericTimestampFormat) : '';
