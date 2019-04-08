module.exports = command => {
  let parsed = {}

  //Expecting the format `cancel 1234456`
  let cancelAndReminderId = command.split(" ")
  if (cancelAndReminderId[1]) {
    parsed.reminderId = cancelAndReminderId[1]
  }

  return parsed
}
