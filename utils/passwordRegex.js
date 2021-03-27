// Password Requirements
// Require the string to be 7 - 50 characters long
// Allow the string to be contain A-Z, a-z, 0-9, and !@#$%^&*()_[\]{},.<>+=- characters
// Require at least one character from any three of the following cases
// English uppercase alphabet characters A–Z
// English lowercase alphabet characters a–z
// Base 10 digits 0–9
// Non-alphanumeric characters !@#$%^&*()_[]{},.<>+=-

const passwordRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,32}$'
);

module.exports = passwordRegex;
