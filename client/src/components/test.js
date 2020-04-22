// function callPeer(id) {
  //   const peer = new Peer({
  //     initiator: true,
  //     trickle: false,
  //     stream: stream,
  //   });

  //   peer.on("signal", data => {
  //     socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
  //   })

  //   peer.on("stream", stream => {
  //     if (partnerVideo.current) {
  //       partnerVideo.current.srcObject = stream;
  //     }
  //   });

  //   socket.current.on("callAccepted", signal => {
  //     setCallAccepted(true);
  //     peer.signal(signal);
  //   })

  // }

  // function acceptCall() {
  //   setCallAccepted(true);
  //   const peer = new Peer({
  //     initiator: false,
  //     trickle: false,
  //     stream: stream,
  //   });
  //   peer.on("signal", data => {
  //     socket.current.emit("acceptCall", { signal: data, to: caller })
  //   })

  //   peer.on("stream", stream => {
  //     partnerVideo.current.srcObject = stream;
  //   });

  //   peer.signal(callerSignal);
  // }

  // let UserVideo;
  // if (stream) {
  //   UserVideo = (
  //     <Video playsInline muted ref={userVideo} autoPlay />
  //   );
  // }

  // let PartnerVideo;
  // if (callAccepted) {
  //   PartnerVideo = (
  //     <Video playsInline ref={partnerVideo} autoPlay />
  //   );
  // }

  // let incomingCall;
  // if (receivingCall) {
  //   incomingCall = (
  //     <div>
  //       <h1>{caller} is calling you</h1>
  //       <button onClick={acceptCall}>Accept</button>
  //     </div>
  //   )
  // }


  // <Container>
    //   <Row>
    //     {UserVideo}
    //     {PartnerVideo}
    //   </Row>
    //   <Row>
    //     {Object.keys(users).map(key => {
    //       if (key === yourID) {
    //         return null;
    //       }
    //       return (
    //         <button onClick={() => callPeer(key)}>Call {key}</button>
    //       );
    //     })}
    //   </Row>
    //   <Row>
    //     {incomingCall}
    //   </Row>
    // </Container>