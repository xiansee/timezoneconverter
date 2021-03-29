import React, { useEffect, useRef, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from "@material-ui/pickers";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { makeStyles } from "@material-ui/core/styles";
import { dateTimeStringChanged } from "../utils/date-time-helpers.js";

//Material-ui styling and config
const useStyles = makeStyles({
  inputStyles: {
    fontFamily: "inherit",
    color: "inherit",
    width: "95%",
    left: "7px",
    padding: "7px"
  }
});

function DateTimePicker(props) {
  //props
  // - type: indicating if this picker should be rendered as "date" or "time"
  // - cityId: unique id associated with the parent city
  // - cityDateTime: date time string indicating local city time (converted from masterDateTime)
  // - updateDateTime: callback to update master date time
  const type = props.type,
        cityId = props.cityId,
        cityDateTime = props.cityDateTime,
        updateDateTime = props.updateDateTime;

  //state
  // - pickerOpen: boolean indicating if the date/time picker should be opened
  const [pickerOpen, setPickerOpen] = useState(false);

  //material ui styling
  const classes = useStyles();

  //previous cityDateTime
  const prevCityDateTime = usePrevious(cityDateTime);

  //------------------------useEffect-----------------------
  useEffect(() => {
    if (prevCityDateTime && cityDateTime) {
      const stringChanged = dateTimeStringChanged(type, prevCityDateTime, cityDateTime);
      if (stringChanged) {
        let elem = null;
        if (type === "date") {
          elem = document.getElementById(`DP${cityId}`);
        } else {
          elem = document.getElementById(`TP${cityId}`);
        }
        if (elem) elem.style.animation = "highlight ease-out 0.6s 3"
      }
    }
  }, [cityDateTime])
  //-------------------------------------------------------

  //-----------------------Functions-----------------------
  //Provide the previous state value
  function usePrevious (value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  //Call updateDateTime when user has submitted a new date or time
  const handleChange = (userInput) => {
    if (userInput !== null && userInput.getTime()) updateDateTime(userInput);
  }

  //Remove animation of an element
  const removeAnimation = (event) => {
    event.target.style.animation = "";
  }
  //-------------------------------------------------------

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {
        type === "date" ?
        <KeyboardDatePicker
          id={`DP${cityId}`}
          className="no-user-select"
          format={"EEE, MMM dd, yyyy"}
          onClick={() => setPickerOpen(true)}
          onClose={() => setPickerOpen(false)}
          open={pickerOpen}
          value={cityDateTime}
          onChange={handleChange}
          keyboardIcon={<CalendarTodayIcon />}
          InputProps={{className: classes.inputStyles}}
          onAnimationEnd={removeAnimation}
          KeyboardButtonProps={{
              'aria-label': 'change date',
          }}/> :
        <KeyboardTimePicker
          id={`TP${cityId}`}
          className="no-user-select"
          onClick={() => setPickerOpen(true)}
          onClose={() => setPickerOpen(false)}
          open={pickerOpen}
          value={cityDateTime}
          onChange={handleChange}
          keyboardIcon={<AccessTimeIcon />}
          InputProps={{className: classes.inputStyles}}
          onAnimationEnd={removeAnimation}
          KeyboardButtonProps={{
              'aria-label': 'change time',
          }}/>
      }

    </MuiPickersUtilsProvider>
  )
}

export default DateTimePicker;
