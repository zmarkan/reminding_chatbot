const { Workflow, Wait } = require("zenaton")
const SendReminder = require("../actions/send_reminder")

module.exports = Workflow("remind_workflow", {
  init(reminderDetails, chatkit) {
    this.reminderDetails = reminderDetails
    this.chatkit = chatkit
  },

  async handle() {
    await new Wait().seconds(waitDuration).execute()
    await new SendReminder(
      this.reminderDetails,
      this.chatkit
    ).execute()
  },

  id() {
    return this.reminderDetails.messageId
  }
})