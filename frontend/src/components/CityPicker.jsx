import React from "react";
import TextField from '@material-ui/core/TextField';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

//cityOptions is the list of all selectable cities:
//each city option contains a unique id for the app to retrieve more information from the backend
import cityOptions from "../assets/data/city-options.js";

//Material-ui styling and config
const useStyles = makeStyles({
  inputStyles: {
    fontFamily: "inherit",
    fontSize: "1.05rem",
    color: "rgba(20, 20, 20, 1)",
  }
});

const filterOptions = createFilterOptions({
  limit: 50,
});

function CityPicker(props) {
  //props
  // - isMasterCity: boolean indicating whether this city component is the master city
  // - masterCity: master city object (initialized with user's city upon successful location detection)
  // - updateCity: callback to update city when user selects a new city
  const isMasterCity = props.isMasterCity,
        masterCity = props.masterCity,
        updateCity = props.updateCity;

  //material-ui styling
  const classes = useStyles();

  //-----------------------Functions-----------------------
  //Call updateCity when user has submitted a new input
  const handleChange = (userInput) => {
    if (userInput) updateCity(userInput.id)
    else updateCity(null)
  }
  //-------------------------------------------------------

  return (
    <Autocomplete
      options={cityOptions}
      filterOptions={filterOptions}
      getOptionLabel={(option) => option.label}
      getOptionSelected={(option, value) => option.label === value.label}
      onChange={(event, userInput) => handleChange(userInput)}
      defaultValue={isMasterCity ? masterCity : null}
      renderInput={(params) =>
        <TextField {...params}
          className={classes.textField}
          label="Location"
          placeholder="Search for city name ..."
          variant="outlined"
          InputProps={{ ...params.InputProps, classes: { input: classes.inputStyles }}}
        />}
    />
  )
}

export default CityPicker;
