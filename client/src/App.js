import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import io from "socket.io-client";
import Peer from "simple-peer";
import { v1 as uuid } from "uuid";
import {Row, Col, Dropdown, Button, InputGroup, FormControl} from 'react-bootstrap';
import {ChatRoom, 
        TextArea, 
        ButtonCustom, FormCustom, 
        MyRow, MyMessage,
        PartnerRow, PartnerMessage,
        Video} from './components/ChatRoom';
const App = (props) => {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const [roomsVideo, setRoomsVideo]=useState([]);
  const [createRoomButton, setCreateRoomButton] = useState("Create");
  const [defaultValue, setDefaultValue] = useState("");
  const [socketCurrent, setSocketCurrent] = useState();
  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const roomID = useRef("");

  useEffect(() => {
    socket.current = io.connect("/");
    setSocketCurrent(socket.current);
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })
    .catch((err) => {
      console.log(err.name + ": " + err.message);
    });
    socket.current.on("create room IDs", room=>{
      setRoomsVideo(room);
    })

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (users) => {
      setUsers(users);
    })
    socket.current.on("user disconnect", user =>{
      console.log('user', user);
      setUsers(user);
    })
    socket.current.on("message", (message) => {
      console.log("here");
      receivedMessage(message);
    })
    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, []);
  /// nhan tin chung
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
  const you = "<your>";
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
  const createRoomVideoCall = () => {
    if(createRoomButton === "Create"){
      const roomIds = uuid();
      setDefaultValue(roomIds);
      socketCurrent.emit("create room ID", roomIds);
      setCreateRoomButton("Connect");
      console.log('socketCurrent', socketCurrent);
    }
    else {
      props.history.push(`/room/${defaultValue}`);
    }
  } 
  
  ///video call 2 ng
  const  callPeer =(id)=> {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <Video playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div className="text-center">
        <p className="bg-success mb-2"><span className="text-danger">{caller}</span> is calling you</p>
        <Button variant="success " onClick={acceptCall}>Accept</Button>
      </div>
    )
  }

  //// display all user online
  const elmUsers = Object.keys(users).map(key => {
    if (key === yourID) {
      return null;
    }
    return (
      <Dropdown className="ml-3 mb-2">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {key}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => callPeer(key)} href="">Video Call</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  })
  const elmRoomsId = roomsVideo.map(key=>{
    return(
      <div> Join Room Video: <Button onClick={()=>{
        props.history.push(`/room/${key}`);
      }}>{key}</Button> </div>
    )
  })
  return (
    <div>
      <div className="bg-warning  text-center ">
        <Row>
          <Col><h1 className="m-0">Welcome to Chat App</h1></Col>
          <Col className="m-auto">
          <div class="input-group mb-3 m-auto">
            <input type="text" class="form-control" ref={roomID}
                    defaultValue={defaultValue}
                    placeholder="Please Click Create To Create Video Room" 
                    aria-label="Recipient's username" 
                    aria-describedby="basic-addon2"/>
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" onClick={createRoomVideoCall} type="button">{createRoomButton}</button>
            </div>
          </div>
          </Col>
          <Col className="m-auto">
            <p className="m-auto">User name: <span className="font-weight-bold text-danger">{yourID}</span>
          </p></Col>
        </Row>
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
            <div>
              {UserVideo}
              {PartnerVideo}
              {incomingCall}
            </div>
          </Col>


          <Col xs={3} className="p-0 border-right">
            <h3 className="bg-success text-center p-0">Video Room</h3>
            <div>
              {elmRoomsId}
            </div>
          </Col>
        </Row>
      </div>
        
    </div>
    
    
  );
}

export default App;
