export function dateUtilityFunction(date, isTimeIncluded) {
  const datepresent = new Date(Date.now());
  const diff = Math.floor(datepresent - date);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60)) - days * 24;
  const minutes = Math.floor(diff / (1000 * 60)) - days * 24 * 60 - hours * 60;
  //console.log(days, hours, minutes);
  if (days === 0 && hours === 0 && minutes < 1) {
    return "Now";
  } else if (days < 1) {
    return hours + "h " + minutes + "m";
  } else if (days < 7) {
    return days + "d " + hours + "h ";
  }
  return (
    date.toLocaleDateString() +
    ", " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

export function UTCDateStringToDate(string) {
  if (!string || typeof string !== "string") {
    return null;
  }
  let t = string.split(/[- :]/);
  // Apply each element to the Date function
  return new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
}

export function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export function UTCDateStringToLocalTimeChakraString(utcTimeString) {
  const utcDate = new Date(utcTimeString + "Z");
  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000,
  );
  return localDate.toISOString().slice(0, 16); //Chops seconds off
  // return localDate.toISOString().slice(0, 19);
}

export function DateToUTCDateString(date) {
  var pad = function (num) {
    return ("00" + num).slice(-2);
  };
  return (
    date.getUTCFullYear() +
    "-" +
    pad(date.getUTCMonth() + 1) +
    "-" +
    pad(date.getUTCDate()) +
    " " +
    pad(date.getUTCHours()) +
    ":" +
    pad(date.getUTCMinutes()) +
    ":" +
    pad(date.getUTCSeconds())
  );
}

export function DateToUTCDateWithoutSecondsString(date) {
  var pad = function (num) {
    return ("00" + num).slice(-2);
  };
  return (
    date.getUTCFullYear() +
    "-" +
    pad(date.getUTCMonth() + 1) +
    "-" +
    pad(date.getUTCDate()) +
    " " +
    pad(date.getUTCHours()) +
    ":" +
    pad(date.getUTCMinutes())
  );
}

export function DateToDateString(date) {
  var pad = function (num) {
    return ("00" + num).slice(-2);
  };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
}

export function DateToDateStringNoSeconds(date) {
  var pad = function (num) {
    return ("00" + num).slice(-2);
  };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

export function DateToDisplayDateString(date) {
  var pad = function (num) {
    return ("00" + num).slice(-2);
  };
  return (
    pad(date.getMonth() + 1) +
    "/" +
    pad(date.getDate()) +
    "/" +
    date.getFullYear() +
    " " +
    formatAMPM(date)
  );
}
