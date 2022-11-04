/** This function is used to convert a normal string to a title string,
 * e.g. this is my string => This Is My String.
 * @param  {string} aLongString A string, e.g. I'm a developer => I'm A Developer.
 */
const toTitle = aLongString => {
  if (aLongString) {
    return aLongString
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return '';
};

/** This function is used to convert a normal string to a string whose first character is an uppercase character,
 * e.g. this is my string => This is my string.
 * @param  {string} aLongString The string, e.g. we are developers => We are developers.
 */
const capitalize = aLongString => {
  if (aLongString) {
    return aLongString[0].toUpperCase() + aLongString.slice(1)?.toLowerCase();
  }
  return '';
};

/** This function is used to convert raw string to a phone number.
 * @param  {string} original A raw string, e.g. 0373798xyz => 0373 798 xyz.
 */
const formatPhoneNumber = original => {
  if (original) {
    return original
      .replace(/\D+/g, '')
      .replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  return '';
};

/** This function is used to convert raw m to km.
 * @param  {number} value A raw number.
 */
const formatDistance = value => {
  let distance = `${((value < 100 ? 100 : value) / 1000).toFixed(1)} km`;
  return distance;
};

const String = {
  toTitle,
  capitalize,
  formatPhoneNumber,
  formatDistance,
};

export default String;
