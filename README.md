# Chatbot Reminderer

An example chatbot 🤖showcasing a "remind me" feature - similar to the one in Slack.

Under the hood it uses [Zenaton](https://zenaton.com) to manage long running reminders, and [Pusher Chatkit](https://pusher.com/chatkit) to run the chat application.
The web client is made in React, and the server is made with Node and Express.

## Prerequisites for running the demo

- A reasonably recent versions of Node and NPM. Node version 8.12 or above  should work fine.
- A [Zenaton](https://zenaton.com) account and application configured, as well as the Zenaton worker.
- A [Pusher Chatkit](https://dash.pusher.com/chatkit) account and instance created.
- [Ngrok](https://ngrok.com/) installed to set up the Webhook for the chatbot locally

## Running the app locally

- Clone this repository and `cd` into it
- `cd server` and `npm install`
- From the [Zenaton dashboard](https://zenaton.com/app/api) copy over the Application ID and API token into `.env`
- From the [Chatkit dashboard](https://dash.pusher.com/chatkit) copy over the Instance Locator and Key into `.env`
- Run `npm start`
- In a separate terminal tab, run `ngrok http 4000`.
Once Ngrok starts up, copy the URL it gives you (it should be in the format of: http://a9e16858.ngrok.io). Keep the terminal with ngrok running.
- Paste the URL into the Settings tab in the Chatkit dashboard - to create a new webhook - make sure to append `/message` to the end of the URL, and make the webhook handle the `Message Created` event.
Once 

![Adding a webhook](https://i.imgur.com/tc5jxI0.png)

- From the same directory, run `zenaton start; zenaton listen --boot=zenaton_boot.js`
- Run `cd` into `../client` and run `npm install`
- Copy the Chatkit Instance Locator into `config.js`.
- Run `npm start`. This will start the React app and should open the browser window.

## Using the chatbot

Once the app runs (it should be available in `http://localhost:3000`), you can enter your name into the prompt, and a room will be created for you and the chatbot.

You can then type a message like `remind me to buy flowers in 1 hour`, which will queue the reminder in Zenaton, and once the time passes the bot will post what you want to be reminded of back into the chatroom (provided the Zenaton agent is still running).

### Limitations: 

- Messages must be formatted exactly like that in order to work:
`remind me to [some command] in [INTEGER] [second/minute/hour/day(s)`.

# License

Licensed under MIT.


