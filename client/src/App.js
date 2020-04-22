import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import io from "socket.io-client";
import Peer from "simple-peer";
import {Row, Col, Dropdown} from 'react-bootstrap';
import {ChatRoom, 
        TextArea, 
        ButtonCustom, FormCustom, 
        MyRow, MyMessage,
        PartnerRow, PartnerMessage} from './components/ChatRoom';
// const Row = styled.div`
//   display: flex;
//   width: 100%;
// `;

// const Video = styled.video`
//   border: 1px solid blue;
//   width: 50%;
//   height: 50%;
// `;

function App() {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect("/");
    // navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    //   setStream(stream);
    //   if (userVideo.current) {
    //     userVideo.current.srcObject = stream;
    //   }
    // })

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (users) => {
      setUsers(users);
    })
    socket.current.on("message", (message) => {
      console.log("here");
      receivedMessage(message);
    })
    // socket.current.on("hey", (data) => {
    //   setReceivingCall(true);
    //   setCaller(data.from);
    //   setCallerSignal(data.signal);
    // })
  }, []);

  const receivedMessage=(message) => {
    setMessages(oldMsgs => [...oldMsgs, message]);
  }

  const sendMessage =(e) => {
    e.preventDefault();
    const messageObject = {
      body: message,
      id: yourID,
    };
    setMessage("");
    socket.current.emit("send message", messageObject);
  }
  const handleChange = (e) => {
    setMessage(e.target.value);
  }
  const me = "<me>";
  const you = "<you>";
  const elmMessages = messages.map((message, index) => {
    if (message.id === yourID) {
      return (
        <MyRow key={index}>
          <MyMessage>
            {message.body} {me}
          </MyMessage>
        </MyRow>
      )
    }
    return (
      <PartnerRow key={index}>
        <PartnerMessage>
          {you} {message.body}
        </PartnerMessage>
      </PartnerRow>
    )
  })
  const elmUsers = Object.keys(users).map(key => {
    if (key === yourID) {
      return null;
    }
    return (
      <Dropdown className="ml-3">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {key}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="">Chat</Dropdown.Item>
          <Dropdown.Item href="">Video Call</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  })
  console.log('all users', users);
  return (
    <div>
      <div>
        <h1>Welcome to Chat App</h1>
      </div>
      <div>
        <Row>
          <Col xs={3} className="p-0 border-right">
            <h3 className="bg-success text-center p-0">Online Users</h3>
            <div>
              {elmUsers}
            </div>
          </Col>
          <Col xs={3}className="p-0 border-right">
            <h3 className="bg-success text-center p-0">Chat Rooms</h3>
              <ChatRoom>
                {elmMessages}
              </ChatRoom>
              <FormCustom onSubmit={sendMessage}>
                <TextArea value={message} onChange={handleChange} placeholder="Say something..." />
                <ButtonCustom>Send</ButtonCustom>
              </FormCustom>
          </Col>
          <Col xs={3} className="p-0 border-right">
            <h3 className="bg-success text-center p-0">Video call</h3>
          </Col>
          <Col xs={3} className="p-0 border-right">
            <h3 className="bg-success text-center p-0">Video Room</h3>
          </Col>
        </Row>
      </div>
        
    </div>
    
    
  );
}

export default App;
