import React, { Component } from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import Input from './Input';
import MessageList from './MessageList';
import Config from '../config'

class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            currentRoom: null,
            messages: [],
            users: []
        }
        this.addMessage = this.addMessage.bind(this);
    }

    componentDidMount() {
        const chatManager = new ChatManager({
            instanceLocator: `${Config.CHATKIT_INSTANCE_LOCATOR}`,
            userId: this.props.currentId,
            tokenProvider: new TokenProvider({
                url: `${Config.SERVER_LOCATION}/auth`
            })
        })

        chatManager
            .connect()
            .then(currentUser => {
                
                console.log(currentUser.rooms)

                this.setState({ currentUser: currentUser })
                if (currentUser.rooms.length >= 1) {
                    this.setState({ currentRoom: currentUser.rooms[0]})
                    currentUser.subscribeToRoomMultipart({
                        roomId: this.state.currentRoom.id,
                        hooks: {
                            onMessage: message => {
                                console.log(message)
                                this.setState({
                                    messages: [...this.state.messages, message],
                                })
                            }
                        }
                    })
                }
                else console.log("No rooms!")
            })
            .catch(error => console.log(error))
        }


    addMessage(text) {
        console.log(this.state);
        this.state.currentUser.sendSimpleMessage({
            text,
            roomId: this.state.currentRoom.id
        })
            .catch(error => console.error('error', error));
    }

    render() {
        return (
            <div>
                <h2 className="header">{ this.state.currentRoom ? this.state.currentRoom.name : "Let's Talk"}</h2>
                <MessageList messages={this.state.messages} />
                <Input className="input-field" onSubmit={this.addMessage} />
            </div>
        )
    }
}

export default ChatApp;
