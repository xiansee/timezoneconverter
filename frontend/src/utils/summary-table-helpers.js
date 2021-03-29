//Extract summary data from city array as a string
//@[param] {array} cityList - array of city containing data to be summarized
//@[return] {string} - string of summarized data
function getTextSummary(cityList) {
  //loop through cityList and append information into list
  let htmlText = [];
  cityList.map(elem => {
    const dataSummary = elem.dataSummary;
    if (Object.keys(dataSummary).length > 0) htmlText.push(`${dataSummary.city} (GMT${dataSummary.gmtOffset}) - ${dataSummary.date} at ${dataSummary.time}`);
    return null;
  });

  //join array of strings with newline and append to textArea element
  htmlText = htmlText.join("\n");

  return htmlText;
}

export { getTextSummary };
