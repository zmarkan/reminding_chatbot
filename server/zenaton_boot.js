require("dotenv").config()
const { Client } = require("zenaton")
Client.init(
  process.env.ZENATON_APP_ID,
  process.env.ZENATON_API_TOKEN,
  process.env.ZENATON_APP_ENV
)

require('./workflows/remind_workflow')
