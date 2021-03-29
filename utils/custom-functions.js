function getUtcOffsetString(utcOffset) {
  const utcOffsetSign = Math.sign(utcOffset);
  const utcOffsetInMilliseconds = Math.abs(utcOffset*1000);
  let utcOffsetString = new Date(utcOffsetInMilliseconds).toISOString().substr(11,5);
  if (utcOffsetSign < 0) {utcOffsetString = "-" + utcOffsetString}
  else {utcOffsetString = "+" + utcOffsetString}
  return utcOffsetString
}

export { getUtcOffsetString };
