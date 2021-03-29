import config from "../config/config.js";
import { getDateFromString } from "./date-time-helpers.js"

//Check if city is defined
//@[params] {object} city - city object where city details (e.g. id, cityName, countryCode etc.) are stored as properties
//@[return] {boolean} - to indicate if city is defined
function cityIsDefined(city) {
  return Object.keys(city).length > 0;
}

//Fetch backend for a city object
//@[params] {number} cityDataId - unique id for each city within the database
//@[return] {promise} - promise object that will resolve with the city object
function getNewCity(cityDataId) {
  return new Promise((resolve, reject) => {
    if (cityDataId === null) {
      reject({});
      return;
    };
    const url = `${config.backendTimeZoneApi}?cityId=${cityDataId}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (typeof data === "object") {
          const newCity = data;
          resolve(newCity);
        } else {
          throw TypeError(`Data is of type ${typeof data}.`)
        }
      })
      .catch(err => {
        console.error(err);
        resolve({});
      })
  })
}

//Determine the new master date time
//@[params] {string} newDateTime - date time string of the new time
//@[params] {number} cityLatitude - latitude of city
//@[params] {number} cityLongitude - longitude of City
//@[params] {string} cityUtcOffset - utc offset of the city where date time string should be assigned with
//@[return] {promise} - promise object that will resolve with the new master date time object
function getNewMasterDateTime(newDateTime, cityLatitude, cityLongitude, cityUtcOffset) {
  return new Promise((resolve, reject) => {
    const defineUtcTime = (dateTime, utcOffset) => {
      return dateTime.toString().split("GMT")[0] + ` GMT${utcOffset}`;
    }

    //appends utc offset to a date string:
    //this utc offset is only an estimate as it may not be the actual utc offset at the new time
    newDateTime = defineUtcTime(newDateTime, cityUtcOffset);

    //The following code fetches the backend for the actual utc offset and makes correction if necessary:
    //get newDateTime in seconds
    let time = Math.trunc(new Date(newDateTime).getTime()/1000);
    //create URL with queries
    const url = `${config.backendUtcOffsetApi}?latitude=${cityLatitude}&longitude=${cityLongitude}&time=${time}`;

    //Fetch from backend
    fetch(url)
      .then(res => res.json())
      .then(data => {
        try {
          if (typeof data === "object") {
            //Verify if previously guessed utc offset is correct
            if (data.utcOffset !== cityUtcOffset) {
              //make correction if initial utc offset is incorrect
              newDateTime = defineUtcTime(newDateTime, data.utcOffset);
              resolve([newDateTime, data.utcOffset])
            } else {
              //resolve if no correction required
              resolve([newDateTime, null]);
            }
          } else {
            throw TypeError(`Data is of type ${typeof data}.`)
          }
        } catch (e) {
          console.error(e);
          resolve(newDateTime)
          alert("Time zone conversion was not successful.");
        }
      })
  })
}

//Fetches backend for city photo URL
//@[params] {string} cityName - name of city
//@[params] {string} countryName - name of country
//@[return] {promise} - promise object that will resolve with a city photo URL
function getCityPhoto(cityName, countryName) {
  return new Promise((resolve, reject) => {
    const url = `${config.backendCityPhotoApi}?cityName=${cityName}&countryName=${countryName}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const photoURL = data.photoURL;
        resolve(photoURL);
      })
      .catch(err => {
        console.error(err);
        resolve("");
      })
  })
}

//Fetches backend for country flag image
//@[params] {string} countryCode - code of country
//@[return] {promise} - promise object that will resolve with a country flag image URL
function getCountryFlag(countryCode) {
  return new Promise((resolve, reject) => {
    const url = `${config.backendCountryFlagApi}?countryCode=${countryCode}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const flagURL = data.flagURL;
        resolve(flagURL);
      })
      .catch(err => {
        console.error(err);
        resolve("");
      })
  })
}

//Get a summary of the city time data
//@[params] {string} cityName - name of city
//@[params] {string} countryCode - code of country
//@[params] {string} gmtOffset - utc offset of city
//@[params] {string} dateTimeString - date time string of the city's time
//@[return] {object} - object with data stored in its properties
function getDataSummary(cityName, countryCode, gmtOffset, dateTimeString) {
  const get12HrTime = (dateTimeString) => {
    //extracts the time component in HH:MM AM/PM format of a datetime string (note only works if string does not contain seconds)
    let timeString = dateTimeString.split(" ");
    return `${timeString[timeString.length-2]} ${timeString[timeString.length-1]}`
  }
  let dataSummary = {};

  dataSummary.city = `${cityName}, ${countryCode}`;
  dataSummary.gmtOffset = `${gmtOffset}`;
  dataSummary.date = `${getDateFromString(dateTimeString)}`;
  dataSummary.time = `${get12HrTime(dateTimeString)}`
  return dataSummary;
}

export { cityIsDefined, getNewCity, getNewMasterDateTime, getCityPhoto, getCountryFlag, getDataSummary };
