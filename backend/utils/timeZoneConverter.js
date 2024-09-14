const moment = require("moment-timezone");

/**
 * Converts a datetime from one timezone to another
 * @param {string} dateTime - The date and time to convert (ISO 8601 format)
 * @param {string} fromTimeZone - The source time zone
 * @param {string} toTimeZone - The target time zone
 * @returns {string} The converted date and time in ISO 8601 format
 */
exports.convertTimeZone = (dateTime, fromTimeZone, toTimeZone) => {
  try {
    const convertedTime = moment.tz(dateTime, fromTimeZone).tz(toTimeZone);
    return convertedTime.toISOString();
  } catch (error) {
    console.error("Error converting time zone:", error);
    throw new Error("Invalid date, time, or time zone provided");
  }
};

/**
 * Converts client's datetime to admin's timezone (assumed to be Asia/Kolkata)
 * @param {string} clientDateTime - The client's date and time (ISO 8601 format)
 * @param {string} clientTimeZone - The client's time zone
 * @returns {string} The converted date and time in ISO 8601 format
 */
exports.convertToAdminTimeZone = (clientDateTime, clientTimeZone) => {
  const adminTimeZone = "Asia/Kolkata"; // Assuming admin is always in IST
  return this.convertTimeZone(clientDateTime, clientTimeZone, adminTimeZone);
};

exports.convertAdminToClientTimeZone = (
  adminDateTime,
  AdminTimeZone,
  clientTimeZone
) => {
  // Convert admin's time to UTC, then convert to the client's timezone
  return moment
    .tz(adminDateTime, AdminTimeZone)
    .tz(clientTimeZone)
    .format("YYYY-MM-DD HH:mm:ss");
};
/**
 * Validates if the provided time zone is valid
 * @param {string} timeZone - The time zone to validate
 * @returns {boolean} True if the time zone is valid, false otherwise
 */
exports.isValidTimeZone = (timeZone) => {
  return moment.tz.zone(timeZone) !== null;
};

/**
 * Gets the current date and time in a specific time zone
 * @param {string} timeZone - The time zone to get the current time for
 * @returns {string} The current date and time in ISO 8601 format
 */
exports.getCurrentTimeInZone = (timeZone) => {
  try {
    return moment.tz(timeZone).toISOString();
  } catch (error) {
    console.error("Error getting current time in zone:", error);
    throw new Error("Invalid time zone provided");
  }
};

/**
 * Formats a date and time for a specific time zone
 * @param {string} dateTime - The date and time to format (ISO 8601 format)
 * @param {string} timeZone - The time zone to format the date and time in
 * @param {string} format - The desired output format (moment.js format)
 * @returns {string} The formatted date and time string
 */
exports.formatDateTimeForZone = (
  dateTime,
  timeZone,
  format = "YYYY-MM-DD HH:mm:ss z"
) => {
  try {
    return moment.tz(dateTime, timeZone).format(format);
  } catch (error) {
    console.error("Error formatting date and time:", error);
    throw new Error("Invalid date, time, or time zone provided");
  }
};
