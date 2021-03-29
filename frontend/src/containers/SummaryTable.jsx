import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Notification from "../components/Notification.jsx";
import ClearIcon from "@material-ui/icons/Clear";
import { getTextSummary } from "../utils/summary-table-helpers.js"

//Material-ui styling and config
const useStyles = makeStyles({
  table: {
    width: "95%",
    minWidth: "0px"
  },
  tableHeader: {
    fontFamily: "inherit",
    fontSize: "1rem"
  },
  tableRow: {
    fontFamily: "inherit",
    fontSize: "0.95rem"
  },
});

function SummaryContainer(props) {

  //props
  // - cityList: list of city cards (both defined and empty cities)
  const cityList = props.cityList;

  //states
  // - showSummary: user selectable boolean to indicate whether summary should be rendered
  // - showNotification: boolean that determines if notification should be shown (whether clipboard copy is successful)
  const [showSummary, setShowSummary] = useState(false),
        [showNotification, setShowNotification] = useState(false);

  //material ui styling
  const classes = useStyles();

  //number of defined cities
  const numOfDefinedCities = cityList.filter(elem => Object.keys(elem.dataSummary).length > 0).length;

  //--------------------useEffect--------------------
  //Code to run when showSummary is toggled
  useEffect(() => {
    //if user wishes summary to be shown, scroll to the summary table
    const summaryTable = document.getElementsByClassName("summary-table")[0];

    if (showSummary && summaryTable) {
      summaryTable.scrollIntoView({ behavior: "smooth", alignToTop: true })
    }
  }, [showSummary])
  //------------------------------------------------

  //--------------------Functions--------------------

  //toggle between showing and hiding summary table
  const toggleSummaryTable = () => {
    if (showSummary) {
      //if summary table is already shown, play a disappearing animation
      const summaryTable = document.getElementsByClassName("summary-table")[0];
      if (summaryTable) {summaryTable.style.animation = "popout ease-out 0.3s forwards"}
      summaryTable.onanimationend = () => setShowSummary(prev => !prev);
    } else {
      //if summary table is not shown, set showSummary to true
      setShowSummary(prev => !prev);
    }
  }

  //Copy table summary content to clipboard
  const copyToClipboard = () => {
    //create a string that contains the details of each non-blank city within cityList and copy to user's clipboard
    const summaryTable = document.getElementsByClassName("summary-table")[0];
    if (summaryTable) {
      //create a textarea element
      const textArea = document.createElement("textarea");
      //hide element by setting its position to far left
      textArea.style.position = "absolute";
      textArea.style.left = "-99999px"
      //fill textArea.innerHTML with text summary
      textArea.innerHTML = getTextSummary(cityList)
      //append textArea to document
      document.body.appendChild(textArea);
      //select and copy to clipboard
      textArea.select();
      document.execCommand("copy");
      //remove textArea
      document.body.removeChild(textArea);

      //toggle showNotification to render notification indicating copy has been successful
      setShowNotification(true);
    }
  }

  //--------------------------------------------------

  if (numOfDefinedCities < 2) {
    //if there aren't at least two non-blank cities, do not display summary container
    return <div/>
  }

  return (
    <div className="summary-container">
      {showNotification && <Notification infoMessage="Copied to clipboard." closeCallback={setShowNotification} position="bottom"/>}
      {
        showSummary ?
        <ClearIcon className="hide-table frosted-glass" onClick={toggleSummaryTable} /> :
        <button className="show-summary-btn frosted-glass" onClick={toggleSummaryTable}>
          <i className="fas fa-table table-icon"></i> Get Table Summary
        </button>
      }
      {
        showSummary &&
        <TableContainer className="summary-table frosted-glass">
          <Table className={classes.table}>

            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeader}>City</TableCell>
                <TableCell className={classes.tableHeader} align="right">GMT Offset</TableCell>
                <TableCell className={classes.tableHeader} align="right">Date</TableCell>
                <TableCell className={classes.tableHeader} align="right">Time</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* loop through cityList and render a row for each defined city*/}
              {cityList.map(elem => {
                const dataSummary = elem.dataSummary;
                if (Object.keys(dataSummary).length > 0) {
                  return (
                    <TableRow key={elem.id}>
                      <TableCell component="th" scope="row" className={classes.tableRow}>{dataSummary.city}</TableCell>
                      <TableCell className={classes.tableRow} align="right">{dataSummary.gmtOffset}</TableCell>
                      <TableCell className={classes.tableRow} align="right">{dataSummary.date}</TableCell>
                      <TableCell className={classes.tableRow} align="right">{dataSummary.time}</TableCell>
                    </TableRow>
                  )
                }
                return null;
              })}
            </TableBody>

          </Table>
          <div className="copy-btn" onClick={copyToClipboard}><i className="far fa-copy copy-icon" ></i><p>Copy as plain text</p></div>
        </TableContainer>
      }
    </div>
  )
}

export default SummaryContainer;
