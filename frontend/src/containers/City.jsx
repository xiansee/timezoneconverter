import React, { useState, useEffect } from "react";
import { cityIsDefined, getNewCity, getNewMasterDateTime, getCityPhoto, getCountryFlag, getDataSummary } from "../utils/city-helpers.js";
import { getLocalCityDateTimeString, getDateString, getTimeString } from "../utils/date-time-helpers.js";
import CityPicker from "../components/CityPicker.jsx";
import DateTimePicker from "../components/DateTimePicker.jsx";

function City(props) {
  //props
  // - cityId: id of city card
  // - isMasterCity: boolean indicating whether this city component is the master city
  // - masterCity: master city object (initialized with user's city upon successful location detection)
  // - listIndex: index of city card within cityList
  // - updateDataSummary: callback to update data summary for a single city card
  // - allowRemove: whether this card can be deleted
  // - removeCity: callback to remove this city card
  // - masterDateTime: date object to be converted to local city time
  // - updateMasterDateTime: callback to update masterDateTime
  // - currentDateTime: current date object constantly updated in interval
  const cityId = props.cityId,
        isMasterCity = props.isMasterCity,
        masterCity = props.masterCity,
        listIndex = props.listIndex,
        updateDataSummary = props.updateDataSummary,
        allowRemove = props.allowRemove,
        removeCity = props.removeCity,
        masterDateTime = props.masterDateTime,
        updateMasterDateTime = props.updateMasterDateTime,
        currentDateTime = props.currentDateTime;

  //states
  // - cityPhotoSrc: URL for landmark photo of city
  // - countryFlagSrc: URL for country flag of city
  // - city: city object containig details of the selected city (e.g. city name, country code, utc offset etc.)
  // - cityDateTime: date time string indicating local city time (converted from masterDateTime)
  const [cityPhotoSrc, setCityPhotoSrc] = useState(""),
        [countryFlagSrc, setCountryFlagSrc] = useState(""),
        [city, setCity] = useState({}),
        [cityDateTime, setCityDateTime] = useState(null);

  //------------------useEffect()------------------
  //Code to run on mount
  useEffect(() => {
    //If mastercity is available, set city as masterCity
    if (isMasterCity) setCity(masterCity)
  }, [])

  //Code to run when city state is changed
  useEffect(() => {
    //If city is defined (i.e. non-empty)
    if (cityIsDefined(city)) {
      //Fetch and update city photo and country flag
      setCityPhotoSrc("");
      setCountryFlagSrc("");
      updateCityPhotoSrc();
      updateCountryFlagSrc();

      //If master city has been changed, define new master date time
      if (isMasterCity) {
        if (cityDateTime) {
          updateDateTime(cityDateTime)
          return
        }
      }

      //If non-master city has been changed, convert master date time to local city time
      const newCityDateTime = getLocalCityDateTimeString(masterDateTime, city.timeZone);
      const newDateSummary = getDataSummary(city.cityName, city.countryCode, city.utcOffset, newCityDateTime);
      setCityDateTime(newCityDateTime);
      updateDataSummary(listIndex, newDateSummary)
    }
  }, [city])

  //Code to run when masterDateTime is changed
  useEffect(() => {
    //If city is defined (i.e. non-empty)
    if (cityIsDefined(city)) {
      //If master date time has been changed, update local city time by converting to local time zone
      const newCityDateTime = getLocalCityDateTimeString(masterDateTime, city.timeZone);
      const newDateSummary = getDataSummary(city.cityName, city.countryCode, city.utcOffset, newCityDateTime);
      setCityDateTime(newCityDateTime);
      updateDataSummary(listIndex, newDateSummary)
    }
  }, [masterDateTime])
  //------------------------------------------------

  //------------------Functions--------------------
  //Fetch and update city photo
  // @[async]
  async function updateCityPhotoSrc () {
    const newCityPhotoSrc = await getCityPhoto(city.cityName, city.countryName);
    setCityPhotoSrc(newCityPhotoSrc);
  };

  //Fetch and update country flag
  //@[async]
  async function updateCountryFlagSrc () {
    const newCountryFlagSrc = await getCountryFlag(city.countryCode);
    setCountryFlagSrc(newCountryFlagSrc);
  };

  //Update the selected city, called when user selects a new city
  //@[async]
  const updateCity = async (cityDataId) => {
    if (cityDataId) {
      const newCity = await getNewCity(cityDataId);
      setCity(newCity);
      return;
    }
    //If cityDataId is not defined, set city as empty
    setCity({});
  }

  //Update master date time, called when user adjusts any date or time
  //@[async]
  const updateDateTime = async (newDateTime) => {
    const [newMasterDateTime, newUtcOffset] = await getNewMasterDateTime(newDateTime, city.latitude, city.longitude, city.utcOffset);
    if (newUtcOffset) city.utcOffset = newUtcOffset;
    updateMasterDateTime(newMasterDateTime);
  }
  //------------------------------------------------

  return (
    <div className={"city-container frosted-glass " + (!cityIsDefined(city) && "justify-align-center")}>
      { isMasterCity ? null : (allowRemove && <i className="fas fa-trash-alt card-delete" onClick={() => removeCity(cityId)}></i>) }

      {
        cityIsDefined(city) &&
        <div className="city-partial-container">
          <div className="city-image-container">
            { cityPhotoSrc ? <img className="city-image" alt={city.cityName} src={cityPhotoSrc}/> : null }
          </div>
          <div className="city-content">
            <img className="country-flag" alt={city.countryCode} src={countryFlagSrc}/>
            <p>{city.cityName}, {city.countryCode}<br/>(GMT{city.utcOffset})</p>
          </div>
        </div>
      }

      {/* Render only the city picker if city is undefined */}
      <div className="dropdown-menu-container">
        { cityIsDefined(city) ? null : <p className="add-instruction">Add a city to convert</p> }
        <CityPicker isMasterCity={isMasterCity} masterCity={masterCity} updateCity={updateCity}/>
      </div>

      {
        cityIsDefined(city) &&
        <div className="city-partial-container">
          <div className="date-time-picker">
            <DateTimePicker type="date" cityId={cityId} cityDateTime={cityDateTime} updateDateTime={updateDateTime}/>
            <DateTimePicker type="time" cityId={cityId} cityDateTime={cityDateTime} updateDateTime={updateDateTime}/>
          </div>
          <div className="current-time-container">
            <p className="current-time current-time-label">Right now in {city.cityName}</p>
            <p className="current-time">{getDateString(currentDateTime, city.timeZone)}</p>
            <p className="current-time">{getTimeString(currentDateTime, city.timeZone)}</p>
          </div>
        </div>
      }

    </div>
  )

}

export default City;
