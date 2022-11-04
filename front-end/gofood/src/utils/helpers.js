/**
 * Format file name
 * @param {*} fileName
 * @input "hình- -ảnh"
 * @output "hinh-anh"
 */
export const fileNameNormalize = fileName => {
  const parsed = fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/([^\w]+|\s+)/g, '-') // Replace space and other characters by hyphen
    .replace(/\-\-+/g, '-') // Replaces multiple hyphens by one hyphen
    .replace(/(^-+|-+$)/g, ''); // Remove extra hyphens from beginning or end of the string

  return parsed;
};

export const formatTextNumber = number => {
  if (isNaN(number) || number === null) {
    return '0';
  }
  return `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '';
};

/// random GuidId
export const randomGuid = () => {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
};

/// Run the function in next tick
export const executeAfter = (ms, callback) => {
  clearTimeout(window.searchTimeout);
  return new Promise(resolve => {
    window.searchTimeout = setTimeout(() => {
      callback();
      resolve();
    }, ms);
  });
};

/*
  ROUND NUMBER
  Params:
  @number: number to round
  @precision: precision of round
*/
export const roundNumber = (number, precision) => {
  if (precision === undefined || precision === null || precision < 1) {
    precision = 1;
  } else {
    precision = Math.pow(10, precision);
  }

  return Math.round(number * precision) / precision;
};
