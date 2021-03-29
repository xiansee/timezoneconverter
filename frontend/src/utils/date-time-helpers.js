//Convert utc time to local time
//@[param] {date} dateTime - date object to be converted
//@[param] {string} timeZone - time zone name (e.g. "America/Toronto")
//@[return] {string} - local date time string (without seconds)
function getLocalCityDateTimeString(dateTime, timeZone) {
  return dateTime.toLocaleString("en-us", {
    timeZone: timeZone,
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h12"
  });
}

//Convert utc time to local date only
//@[param] {date} dateTime - date object to be converted
//@[param] {string} timeZone - time zone name (e.g. "America/Toronto")
//@[return] {string} - local date string (without time)
function getDateString(dateTime, timeZone) {
  let dateString = dateTime.toLocaleString("en-us", {
    timeZone: timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return `${dateString}`;
}

//Convert utc time to local time only
//@[param] {date} dateTime - date object to be converted
//@[param] {string} timeZone - time zone name (e.g. "America/Toronto")
//@[return] {string} - local time string (without date)
function getTimeString(dateTime, timeZone) {
  let timeString = dateTime.toLocaleString("en-us", {
    timeZone: timeZone
  });

  timeString = timeString.split(" ");
  return `${timeString[timeString.length-2]} ${timeString[timeString.length-1]}`;
}

//Takes a date string in the format of "{Weekday}, {Date}, {Time}" and return the "{Weekday}, {Date}"
//@[param] {string} dateTimeString - date time string
//@[return] {string} - weekday and date of string
function getDateFromString(dateTimeString) {

  const splittedString = dateTimeString.split(",");

  //Remove time component, now splittedString is left with just the weekday and date component
  splittedString.pop();

  //Return joined array of strings
  return splittedString.join(",");
}

//Takes a dateTimeString in the format of "{Weekday}, {Date}, {Time}" and return the {Time}
//@[param] {string} dateTimeString - date time string
//@[return] {string} - time of string
function getTimeFromString(dateTimeString) {
  //Takes a dateTimeString in the format of "{Weekday}, {Date}, {Time}" and return the {Time}
  const splittedString = dateTimeString.split(",");
  //Gets the time component
  let timeComponent = splittedString[splittedString.length-1];

  //Removes the seconds
  timeComponent = timeComponent.split(":")
  timeComponent.pop();

  //Return joined array of hour and minute
  return timeComponent.join(":");
}

//Compare if two date strings are equal
//@[param] {string} compareType - compare either the "date" or "time"
//@[param] {string} prevDateTime - first date time string
//@[param] {string} currentDateTime - second date time string
//@[return] {boolean} - true if both strings are not equal, false otherwise
function dateTimeStringChanged(compareType, prevDateTime, currentDateTime) {
  if (compareType !== "date" && compareType !== "time") throw Error("compareType ('date' or 'time') needs to be specified");

  if (compareType === "date") {
    const prev = getDateFromString(prevDateTime);
    const current = getDateFromString(currentDateTime);
    if (prev !== current) return true;
  } else {
    const prev = getTimeFromString(prevDateTime);
    const current = getTimeFromString(currentDateTime);
    if (prev !== current) return true;
  }
  return false
}

export { getLocalCityDateTimeString, getDateString, getTimeString, getDateFromString, dateTimeStringChanged }
