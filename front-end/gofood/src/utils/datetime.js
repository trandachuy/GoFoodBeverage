import 'moment/locale/es';
import 'moment/locale/vi';
import i18n from 'i18next';
import moment from 'moment';
import {DateFormat} from '../constants/string.constant';

/** This function is used to convert UTC date to local date string,
 * it will display the current language.
 * @param  {date} dateTimeUtc The UTC date (+0)
 * @param  {string} formatPattern Date pattern, for example: yyyy-MM-dd HH:mm:ss
 */
const utcToLocalDateString = (dateTimeUtc, formatPattern) => {
  if (!formatPattern) {
    formatPattern = DateFormat.INTERNATIONAL_FULL_DATE;
  }

  let languageCode = i18n.language;
  let dateTimeResult = moment
    .utc(dateTimeUtc)
    .locale(languageCode)
    .local()
    .format(formatPattern);
  return dateTimeResult;
};

/** This function is used to convert UTC date to local date.
 * @param  {date} dateTimeUtc The UTC date (+0)
 */
const utcToLocalDate = dateTimeUtc => {
  return moment.utc(dateTimeUtc).local().toDate();
};

/** This method is used to convert local date to date string.
 * @param  {date} dateTime The local date.
 * @param  {string} formatPattern Date pattern, for example: yyyy-MM-dd HH:mm:ss, if the value is null then the default is 'yyyy-MM-DD HH:mm:ss'
 */
const localTimeString = (dateTime, formatPattern) => {
  if (!formatPattern) {
    formatPattern = DateFormat.INTERNATIONAL_FULL_DATE;
  }

  let languageCode = i18n.language;
  let dateTimeResult = moment(dateTime)
    .locale(languageCode)
    .local()
    .format(formatPattern);
  return dateTimeResult;
};

/** This method is used to convert local date to the UTC date string.
 * @param  {date} dateTime The local date.
 * @param  {string} formatPattern Date pattern, for example: yyyy-MM-dd HH:mm:ss, if the value is null then the default is 'yyyy-MM-DD HH:mm:ss'
 */
const getUtcString = (currentDate, format) => {
  if (currentDate) {
    return moment
      .utc(currentDate)
      .format(format ?? DateFormat.INTERNATIONAL_FULL_DATE);
  }
  return undefined;
};

/** This method is used to convert the local date to the start date of UTC.
 * @param  {date} currentDate The local date.
 * @param  {string} formatPattern Date pattern, for example: yyyy-MM-dd HH:mm:ss, if the value is null then the default is 'yyyy-MM-DD HH:mm:ss'
 */
const getUtcStartDateString = (currentDate, format) => {
  if (currentDate) {
    currentDate = getLocalStartDate(currentDate);
    return moment
      .utc(currentDate)
      .format(format ?? DateFormat.INTERNATIONAL_FULL_DATE);
  }
  return undefined;
};

/** This method is used to convert the local date to the end date of UTC.
 * @param  {date} currentDate The local date.
 * @param  {string} formatPattern Date pattern, for example: yyyy-MM-dd HH:mm:ss, if the value is null then the default is 'yyyy-MM-DD HH:mm:ss'
 */
const getUtcEndDateString = (currentDate, format) => {
  if (currentDate) {
    currentDate = getLocalEndDate(currentDate);
    return moment
      .utc(currentDate)
      .format(format ?? DateFormat.INTERNATIONAL_FULL_DATE);
  }
  return undefined;
};

/** This method is used to get the start date of the local date, for example 2022-08-10 00:00:00.
 * @param  {date} currentDate The local date, for example: 2022-08-10 13:00:00.
 */
const getLocalStartDate = (currentDate) => {
  let dateToConvert = currentDate ?? new Date();
  let todayString = moment(dateToConvert).format(DateFormat.START_DATE);

  return moment(todayString).toDate();
};

/** This method is used to get the end date of the local date, for example 2022-08-10 23:59:59.
 * @param  {date} currentDate The local date, for example: 2022-08-10 13:14:15.
 */
const getLocalEndDate = currentDate => {
  return moment(getLocalStartDate(currentDate))
    .add(1, 'd')
    .seconds(-1)
    .toDate();
};

const DateTimeUtil = {
  getUtcString,
  utcToLocalDate,
  localTimeString,
  getLocalEndDate,
  getLocalStartDate,
  getUtcEndDateString,
  utcToLocalDateString,
  getUtcStartDateString,
};

export default DateTimeUtil;
