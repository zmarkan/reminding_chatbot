
import React, { Component } from 'react';
import ChatMessage from './Components/ChatMessage';
import Signup from './Components/Signup';
import ChatApp from './Components/ChatApp';
import Config from './config'



// import { default as Chatkit } from '@pusher/chatkit-server';

// const chatkit = new Chatkit({
//   instanceLocator: "v1:us1:6d6aa2bf-c2be-4620-8430-52605b28fa1a",
//   key: "5f6dcc12-f6a9-47b3-ac8e-95d0c0fa93fa:HHeggaTeK/0/TUYPyj4I5lvaL7utAZXsIa7fiXIQOO8="
// })


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsername: '',
      currentId: '',
      currentView: 'signup'
    }
    this.changeView = this.changeView.bind(this);
    this.login = this.login.bind(this);
  }

  login(username) {
    fetch(`${Config.SERVER_LOCATION}/login`, {
      method: 'POST',
      body: JSON.stringify({ userId: username }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( response => response.json())
    .catch( error => console.log(error))
    .then( response => {

      this.setState({
        currentUsername: username,
        currentId: username,
        currentView: 'chatApp'
      })
    })
  }

  changeView(view) {
    this.setState({
      currentView: view
    })
  }

  render() {
    let view = '';

    if (this.state.currentView === "ChatMessage") {
      view = <ChatMessage changeView={this.changeView} />
    } else if (this.state.currentView === "signup") {
      view = <Signup onSubmit={this.login} />
    } else if (this.state.currentView === "chatApp") {
      view = <ChatApp currentId={this.state.currentId} />
    }
    return (
      <div className="App">
        {view}
      </div>
    );
  }
}
export default App;
