import React, { useEffect, useState } from "react";
import Backdrop from "../components/Backdrop.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import Notification from "../components/Notification.jsx";
import City from "../containers/City.jsx";
import SummaryTable from "../containers/SummaryTable.jsx";
import { getUserCity, addEmptyCityToList, removeCityFromList, createCityList  } from "../utils/simple-main-helpers.js";

function SimpleMain() {
  //States
  // - masterDateTime: user modifiable date object that gets converted to other time zones
  // - currentDateTime: current date object constantly updated in interval
  // - nextCityId: a unique id representing each city card, incremented every time a new city is added, discarded when city is removed
  // - cityList: list containing the id and data summary of each city card
  // - masterCity: first and main city card, initialized with user's city (upon successful location detection)
  // - showNotification: boolean that determines if notification should be shown (whether location detection was successful)
  const [masterDateTime, setMasterDateTime] = useState(new Date()),
        [currentDateTime, setCurrentDateTime] = useState(new Date()),
        [nextCityId] = useState({ counter: 0 }),
        [cityList, setCityList] = useState([]),
        [masterCity, setMasterCity] = useState(null),
        [showNotification, setShowNotification] = useState(false);

  //------------------useEffect()-------------------
  //Code to run on mount
  useEffect(() => {
    //Fetch default city
    const getMasterCity = async () => {
      const newMasterCity = await getUserCity();
      setMasterCity(newMasterCity);
      setShowNotification(true);
    }
    getMasterCity();

    //Set interval to update currentDateTime
    const interval = setInterval(() => setCurrentDateTime(new Date()), 500);

    //Initialize cityList
    const initialNumOfCities = 2;
    let newCityList = [];
    [nextCityId.counter, newCityList] = createCityList(nextCityId.counter, initialNumOfCities);
    setCityList([ ...newCityList ])

    //Cleanup
    return () => clearInterval(interval);
  }, [])
  //-------------------------------------------------

  //--------------------Functions--------------------

  //Adds a new city card
  const addCity = () => {
    let newCityList = [];
    [nextCityId.counter, newCityList] = addEmptyCityToList(nextCityId.counter, cityList);
    setCityList([ ...newCityList ]);
  }

  //Removes an existing city card
  const removeCity = (idToRemove) => {
    const newCityList = removeCityFromList(idToRemove, cityList);
    setCityList([ ...newCityList ]);
  }

  //Updates master date time
  const updateMasterDateTime = (newMasterDateTime) => {
    setMasterDateTime(new Date(newMasterDateTime));
  }

  //Updates data summary for a single city
  const updateDataSummary = (listIndex, dataSummary) => {
    let newCityList = cityList;
    newCityList[listIndex].dataSummary = dataSummary;
    setCityList([ ...newCityList ])
  }
  //----------------------------------------------

  //Render loading screen if master city has not been defined
  if (masterCity === null) {
    return (
      <div className="app-main full-height">
        <div className="heading">Time Zone Converter</div>
        <div className="loading-main">
          <Backdrop />
          <LoadingScreen />
        </div>
      </div>
    )
  }

  return (
    <div className="app-main">
      {
        showNotification &&
        <Notification
          closeCallback={setShowNotification}
          status={Object.keys(masterCity).length > 0}
          successMessage={`Detected location as ${masterCity.cityName}, ${masterCity.countryCode}.`}
          failureMessage="Unable to detect your location."/>
      }

      <Backdrop />
      <div className="heading">Time Zone Converter</div>
      <div className="sub-heading">Convert time between cities the simple way.<br/> Daylight savings are accounted for.</div>
      <div className="swipe-instruction"><i className="fas fa-arrow-circle-right swipe-icon"></i>Swipe to add more cities </div>
      <div className="city-list">

        {/* render list of cities selectable by the user */}
        {cityList.map((elem, listIndex) => {
          return (
            <div key={elem.id} className="horizontal-scroll-unit">
              <City
                cityId={elem.id}
                isMasterCity={elem.id === 0}
                masterCity={elem.id === 0 ? masterCity : {}}
                listIndex={listIndex}
                updateDataSummary={updateDataSummary}
                allowRemove={cityList.length > 2}
                removeCity={removeCity}
                masterDateTime={masterDateTime}
                updateMasterDateTime={updateMasterDateTime}
                currentDateTime={currentDateTime}
              />
            </div>
          )
        })}

        {/* add city button */}
        <div className="horizontal-scroll-unit">
          <div className="add-card frosted-glass" onClick={addCity}><i className="far fa-plus-square"></i></div>
        </div>

    </div>
    {/* Table summary for all defined cities */}
    <SummaryTable cityList={cityList}/>
  </div>
  );
}

export default SimpleMain;
