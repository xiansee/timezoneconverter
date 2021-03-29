import React, { useEffect } from 'react';

var timeout = null;

function Notification(props) {
  //props
  // - infoMessage: message to display as INFO type
  // - successMessage: message to display as SUCCESS type
  // - failureMessage: message to display as FAILURE type
  // - status: boolean indicating whether success (true) or failure (false), if null then render as INFO type
  // - position: whether to display notification on top or bottom
  // - closeCallback: callback when notification is closed
  const infoMessage = props.infoMessage || null,
        successMessage = props.successMessage || null,
        failureMessage = props.failureMessage || null,
        status = props.status || null,
        position = props.position || "top",
        closeCallback = props.closeCallback;

  //-------------------useEffect-------------------
  useEffect(() => {
    timeout = setTimeout(() => {
      animateAndClose();
    }, 5000)
    //cleanup
    return () => clearTimeout(timeout);
  }, [])
  //-----------------------------------------------

  //-------------------Functions-------------------
  //Force notification to close
  const forceClose = () =>  {
    //clear timeout to close notification
    clearTimeout(timeout);
    //close notification
    animateAndClose();
  }

  //Close notification
  function animateAndClose () {
    const elem = document.getElementsByClassName("notification")[0]
    if (elem) {
      if (position === "top") {
        //If notification position is at top, display a slide up animation
        elem.style.animation = "slideup 0.4s ease-in forwards";
      } else {
        //If notification position is at bottom, display a slide down animation
        elem.style.animation = "slidedown 0.4s ease-in forwards";
      }
      //When animation ends, call closeCallback
      elem.onanimationend = () => closeCallback(false);
    } else {
      closeCallback(false);
    }
  }
  //-----------------------------------------------

  return (
    <div className={"notification" + " " + (position === "bottom" && "notification-bottom") + " " + (infoMessage ? "notification-info" : (status ? "notification-success" : "notification-failed"))}>
      {
        infoMessage ?
        <div className="notification-text">
          <i className="fas fa-info-circle"></i>
          <p>{infoMessage}</p>
        </div> :
        (
          status ?
          <div className="notification-text">
            <i className="fas fa-check-circle"></i>
            <p>{successMessage}</p>
          </div> :
          <div className="notification-text">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{failureMessage}</p>
          </div>
        )
      }
      <i className="notification-cross fas fa-times" onClick={forceClose}></i>
    </div>
  )
}

export default Notification;
