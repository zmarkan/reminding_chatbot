import React, { Component } from 'react';

class MessageList extends Component {
    render() {
        return (
            <ul className="message-list">
                {this.props.messages.map((message, index) => (
                    <li key={index}>
                        <h4 className="message-sender">{`${message.sender.name} @ ${new Date(message.createdAt).toTimeString()}`  }</h4>
                        <p className="message-text">{message.parts[0].payload.content}</p>
                    </li>
                ))}
                <li></li>
            </ul>
        )
    }
}
export default MessageList;