import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from "@material-ui/core/styles";

//Material-ui styling and config
const useStyles = makeStyles({
  circle: {
    color: "#097eaa"
  }
});

function LoadingScreen() {
  //material ui styling
  const classes = useStyles();

  return (
    <div className="loading-container">
      <CircularProgress className={classes.circle} size="4rem" />
      <div className="loading-text">Fetching your city and time zone ...</div>
    </div>
  )
}

export default LoadingScreen;
