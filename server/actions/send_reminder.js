const { Task } = require("zenaton")
const Chatkit = require("@pusher/chatkit-server")

module.exports = Task("SendReminderTask", {

    init(reminderDetails, chatkit){
        this.reminderDetails = reminderDetails
        this.chatkit = chatkit
    },

    async handle(){

        const chatkit = new Chatkit.default({
          instanceLocator: process.env.CHATKIT_INSTANCE_ID,
          key: process.env.CHATKIT_KEY
        })

        chatkit.sendSimpleMessage({
          roomId: this.reminderDetails.roomId,
          userId: "reminder_bot",
          text:
            `Hey ${this.reminderDetails.userId}, you asked me to remind you to ${this.reminderDetails.command.action}, so here it is! 😉 Have a great day!`
            
        })
    }

})