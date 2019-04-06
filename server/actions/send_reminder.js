const { Task } = require("zenaton")

module.exports = Task("SendReminderTask", {

    init(reminderDetails, chatkit){
        this.reminderDetails = reminderDetails
        this.chatkit = chatkit
    },

    async handle(){
        
        chatkit.sendSimpleMessage({
          roomId: this.reminderDetails.roomId,
          userId: "reminder_bot",
          text:
            `Hey ${this.reminderDetails.userId}, you asked me to remind you to ${this.reminderDetails.command.action}, so here it is! 😉 Have a great day!`
            
        })
    }

})