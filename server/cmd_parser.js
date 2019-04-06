module.exports = (command) => {
    let parsed = {}

    let actionAndTime = command.split(' to ')[1].split(' in ')
    let action = actionAndTime[0].trim()
    let time = actionAndTime[1].trim()

    let quantity = time.split(' ')[0]
    let unit = time.split(' ')[1]
   
    parsed.action = action
    parsed.timeDescriptor = time
    parsed.duration = calcDuration(quantity, unit)
    
    return parsed
}

//Duration of wait in seconds
const calcDuration = (quantity, unit) => {
    if (unit.startsWith("second")) return quantity
    if (unit.startsWith("minute")) return quantity * 60
    if (unit.startsWith("hour")) return  quantity * 60 * 60 
    if (unit.startsWith("day")) return quantity * 24 * 60 * 60
    return -1
}