import publicIp from "public-ip";
import config from "../config/config.js";

//Fetch backend for user's city based on user's IP address
//@[async]
//@[return] {promise} - promise object that resolves with user's city object
async function getUserCity() {
  //Fetch city info from client's IP address
  const url = `${config.backendTimeZoneApi}?ip=${await publicIp.v4()}`;
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      clearTimeout(timeout)
      resolve({})
    }, 2000);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (typeof data === "object") {
          const newCity = data;
          resolve(newCity);
        }
        else { throw TypeError(`Data is of type ${typeof data}.`) }
      })
      .catch(err => {
        //if unable to fetch, set user's city as empty
        resolve({});
        console.error(err);
      })
  })
}

//Add empty cities to an array
//@[param] {number} nextId - id to be assigned to the newly created city
//@[param] {array} cityList - array of city to be added to
//@[return] {array} - [incremented nextId, cityList with newly added city]
function addEmptyCityToList(nextId, cityList) {
  const blankSummary = {}
  cityList.push({
    id: nextId,
    dataSummary: blankSummary
  });
  nextId++;
  return [nextId, cityList];
}

//Add empty cities to an array
//@[param] {number} idToRemove - id of city to be removed
//@[param] {array} cityList - array of city to be added to
//@[return] {array} - array of city with one city removed
function removeCityFromList(idToRemove, cityList) {
  const index = cityList.findIndex(elem => elem.id === idToRemove);
  cityList.splice(index, 1);
  return cityList;
}

//Create an array of cities
//@[param] {number} nextId - id to be assigned to the newly created city
//@[param] {number} numOfCities - number of elements to initiate city array with
//@[return] {array} - [incremented nextId, cityList with newly added city(s)]
function createCityList(nextId, numOfCities) {
  let cityList = [];
  for ( var i = 0; i < numOfCities; i++ ) {
    [nextId, cityList] = addEmptyCityToList(nextId, cityList);
  }
  return [nextId, cityList];
}

export { getUserCity, addEmptyCityToList, removeCityFromList, createCityList };
