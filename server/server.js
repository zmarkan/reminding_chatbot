const express = require("express")
const Chatkit = require("@pusher/chatkit-server")
const config = require("../config")

const chatkit = new Chatkit.default({
  instanceLocator: config.CHATKIT_INSTANCE_ID,
  key: config.CHATKIT_KEY
})

console.log(config)