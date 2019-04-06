const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')

const config = require("./config")

const chatkit = new Chatkit.default({
  instanceLocator: config.CHATKIT_INSTANCE_ID,
  key: config.CHATKIT_KEY
})

const app = express()
app.use(bodyParser.json())
app.use(cors())


//Webhook handling and Zenaton reminder dispatching 🚀
app.post("/message", (req, res) => {


})

//Login & user management for Chatkit
app.post("/login", (req, res) => {
    
    let { userId } = req.body

    chatkit.getUser({id: userId})
    .then( user => {
        res.sendStatus(200)
    })
    .catch( error => {
        if(error.error === "services/chatkit/not_found/user_not_found") {
            chatkit.createUser({
                id: userId,
                name: userId
            }).then( 
                chatkit.createRoom({
                        creatorId: userId,
                        name: `${userId}'s room`,
                        userIds: [ userId, 'reminder_bot']
                })
            ).then( room => {
                console.log(`Created room ${room.id}. `)
                res.sendStatus(201)
            })
        }
        else {
            console.log(error)
            res.status(500).send(error)
        }
    })
})

//Chatkit auth endpoint
app.post("/auth", (req, res) => {
    const authData = chatkit.authenticate({
        userId: req.query.user_id
    });

    res.status(authData.status)
        .send(authData.body);
})

app.listen(4000, () => {
    console.log("Server listening at http://localhost:4000")
})


console.log(config)