// This file will just hold some functions we want to be able to use in any file.
//
// To use any of these functions in a file, in your script tag, just write:
// import { functionName } from '@/utils.js'

// a and b are javascript Date objects
export function dateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// Takes an integer 'daysBefore' and a date 'date', 
// returns a date object
export function dateObjFromDaysBefore(daysBefore, date) {
  var d = date;
  d.setDate(d.getDate() - daysBefore);
  return d;
}

// takes a date object, returns a string
export function getMonthFromDate(date) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return monthNames[date.getMonth()];
}

// Submit two date objects, get the difference in days.
export function getDaysBeforeFromDate(date, hackDate) {
  return Math.floor(( hackDate - date ) / 86400000); 
}