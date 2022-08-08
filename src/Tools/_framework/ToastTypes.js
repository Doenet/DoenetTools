export const toastType = Object.freeze({
  //Color contrast with accessibility -- no text on color
  ERROR: {
    // process failed or error occured, user must dissmis
    timeout: -1,
    background: 'rgba(193, 41, 46, 1)',
    gradientEnd: 'rgba()',
  },
  ALERT: {
    // user attetion reqired to dissmiss
    timeout: -1,
    background: 'rgba(255, 230, 0, 1)',
  },
  ACTION: {
    // requires user interaction
    timeout: -1,
    background: 'rgba()',
  },
  INFO: {
    // non-interactive information
    timeout: 3000,
    background: 'rgba(26, 90, 153,1)',
  },
  SUCCESS: {
    // confirm action
    timeout: 3000,
    background: 'rgba(41, 193, 67,  1)',
  },
  CONFIRMATION: {
    //confirm action and offer undo
    timeout: 5000,
    background: 'rgba(26,90,153,1)',
  },
});
