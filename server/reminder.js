const { Client } = require("zenaton")
const RemindWorkflow = require("./workflows/remind_workflow")

Client.init(
  process.env.ZENATON_APP_ID,
  process.env.ZENATON_API_TOKEN,
  process.env.ZENATON_APP_ENV
)

module.exports  = (reminderDetails, chatkit) => {
    return new RemindWorkflow(reminderDetails, chatkit).dispatch()
}




