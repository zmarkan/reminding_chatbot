require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const Chatkit = require("@pusher/chatkit-server")
const parseCmd = require("./cmd_parser")
const { Client } = require("zenaton")
const RemindWorkflow = require("./workflows/remind_workflow")

//Init Chatkit server
const chatkit = new Chatkit.default({
  instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
  key: process.env.CHATKIT_KEY
})

//Init Zenaton
Client.init(
  process.env.ZENATON_APP_ID,
  process.env.ZENATON_API_TOKEN,
  process.env.ZENATON_APP_ENV
)

//Check if the bot exists in the instance and create it if not.
chatkit
  .getUser({ id: "reminder_bot" })
  .then(user => {
    console.log("Bot user exists, continuing.")
  })
  .catch(error => {
    if (error.error === "services/chatkit/not_found/user_not_found") {
      chatkit
        .createUser({
          id: "reminder_bot",
          name: "🤖"
        })
        .then("Bot user didn't exist, so I created it.")
    }
  })

const app = express()
app.use(bodyParser.json())
app.use(cors())

//This is the interesting bit - webhook handling, command parsing and Zenaton reminder dispatching 🚀
app.post("/message", (req, res) => {
  const message = req.body.payload.messages[0]
  console.log(message)

  if (
    message.user_id != "reminder_bot" &&
    message.parts[0].type === "text/plain" &&
    message.parts[0].content.startsWith("remind me ")
  ) {
    const command = parseCmd(message.parts[0].content)
    if (command.duration >= 0) {
      const reminderDetails = {
        command,
        userId: message.user_id,
        messageId: message.id,
        roomId: message.room_id
      }

      console.log(reminderDetails)

      new RemindWorkflow(reminderDetails)
        .dispatch()
        .then(() => {
          chatkit.sendSimpleMessage({
            roomId: reminderDetails.roomId,
            userId: "reminder_bot",
            text: `Excellent! I scheduled your reminder! You can cancel it at any time by messaging cancel ${
              reminderDetails.messageId
            }!`
          })
        })
        .catch(error => {
          console.log(error)
          chatkit.sendSimpleMessage({
            roomId: this.reminderDetails.roomId,
            userId: "reminder_bot",
            text: `Oh no! Something terrible has happened!`
          })
        })
    }
    if (
      message.user_id != "reminder_bot" &&
      message.parts[0].type === "text/plain" &&
      message.parts[0].content.startsWith("cancel ")
    ) {
      const command = parseCancelationCmd(message.parts[0].content)

      RemindWorkflow.whereId(command.messageId)
        .kill()
        .then(() => {
          chatkit.sendSimpleMessage({
            roomId: this.reminderDetails.roomId,
            userId: "reminder_bot",
            text: `Sure thing! found your reminder with ID ${
              command.messageId
            } and canceled it!`
          })
        })
        .catch(error => {
          console.log(error)
          chatkit.sendSimpleMessage({
            roomId: this.reminderDetails.roomId,
            userId: "reminder_bot",
            text: `Oh no! Something terrible has happened!`
          })
        })
    } else {
      chatkit.sendSimpleMessage({
        roomId: message.room_id,
        userId: "reminder_bot",
        text:
          "Bleep, blop - I don't yet know how to help with that! Try saying 'remind me to {do something} in {number} seconds/minutes/days!"
      })
    }
  }

  res.sendStatus(200)
})

//Login & user management for Chatkit
app.post("/login", (req, res) => {
  let { userId } = req.body

  chatkit
    .getUser({ id: userId })
    .then(user => {
      res.sendStatus(200)
    })
    .catch(error => {
      if (error.error === "services/chatkit/not_found/user_not_found") {
        chatkit
          .createUser({
            id: userId,
            name: userId
          })
          .then(
            chatkit.createRoom({
              creatorId: userId,
              name: `${userId}'s room`,
              userIds: [userId, "reminder_bot"]
            })
          )
          .then(room => {
            console.log(`Created room ${room.id}. `)
            res.sendStatus(201)
          })
      } else {
        console.log(error)
        res.status(500).send(error)
      }
    })
})

//Chatkit auth endpoint
app.post("/auth", (req, res) => {
  const authData = chatkit.authenticate({
    userId: req.query.user_id
  })

  res.status(authData.status).send(authData.body)
})

app.listen(4000, () => {
  console.log("Server listening at http://localhost:4000")
})
