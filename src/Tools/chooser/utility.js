export function formatTimestamp(date) {  
  let delta = Math.round((new Date - new Date(date)) / 1000);

  let minute = 60;
  let hour = minute * 60;
  let day = hour * 24;
  let week = day * 7;
  let month = 30 * day;
  let year = 52 * week;

  let result = "";

  if (delta < minute) {
    result = 'Just now';
  } else if (delta < hour) {
    result = Math.floor(delta / minute) + ' minute(s) ago';
  } else if (delta < day) {
    result = Math.floor(delta / hour) + ' hour(s) ago';
  } else if (delta < day * 2) {
    result = 'Yesterday';
  } else if (delta < week) {
    result = Math.floor(delta / day) + ' day(s) ago';
  } else if (delta < month) {
    let weekNumber = Math.floor(delta / week);
    let dayNumber = Math.floor((delta - (weekNumber * week)) / day);
    if (dayNumber !== 0) result = `${weekNumber} week(s) and ${dayNumber} day(s) ago`;
    else result = `${weekNumber} week(s) ago`;
  } else if (delta < year) {
    let monthNumber = Math.floor(delta / month);
    let dayNumber = Math.floor((delta - (monthNumber * month)) / day);
    if (dayNumber !== 0) result = `${monthNumber} month(s) and ${dayNumber} day(s) ago`;
    else result = `${monthNumber} month(s) ago`;
  } else {  // years
    let yearNumber = Math.floor(delta / year);
    let monthNumber = Math.floor((delta - (yearNumber * year)) / month);
    if (monthNumber !== 0) result = `${yearNumber} year(s) and ${monthNumber} month(s) ago`;
    else result = `${yearNumber} year(s) ago`;
  }
  return result;
}