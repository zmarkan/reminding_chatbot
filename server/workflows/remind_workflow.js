const { Workflow, Wait } = require("zenaton")
const SendReminder = require("../actions/send_reminder")

module.exports = Workflow("remind_workflow", {
  init(reminderDetails) {
    this.reminderDetails = reminderDetails
  },

  async handle() {
    await new Wait().seconds(parseInt(this.reminderDetails.command.duration)).execute()

    await new SendReminder(
      this.reminderDetails,
    ).execute()
  },
})