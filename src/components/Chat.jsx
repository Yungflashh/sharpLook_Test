import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./ChatRoom.css";

const generateRoomId = (userA, userB) => [userA, userB].sort().join("_");

export default function ChatRoom({ currentUserId, chatPartnerId, token }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [incomingCall, setIncomingCall] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [screenSharing, setScreenSharing] = useState(false);

  const socket = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenPreviewRef = useRef(null);

  const roomId = generateRoomId(currentUserId, chatPartnerId);

  // ✅ Fetch previous messages
  useEffect(() => {
    fetch(`https://sharplook-backend.onrender.com/api/v1/messages/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMessages(data.data);
      })
      .catch(console.error);
  }, [roomId, token]);

  // ✅ Fetch current user info
  useEffect(() => {
    fetch("https://sharplook-backend.onrender.com/api/v1/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCurrentUserName(data.data?.firstName))
      .catch(console.error);
  }, [token]);

  // ✅ Socket setup
  useEffect(() => {
    socket.current = io("https://sharplook-backend.onrender.com", {
      transports: ["websocket"],
      query: { userId: currentUserId },
    });

    socket.current.emit("join-room", { roomId, userId: currentUserId });

    socket.current.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.current.on("call:incoming", ({ fromUserId, offer }) => {
      setIncomingCall({ fromUserId, offer });
    });

    socket.current.on("call:answer", async ({ answer }) => {
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.current.on("ice-candidate", async ({ candidate }) => {
      await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      endCall();
      socket.current.disconnect();
    };
  }, [roomId, currentUserId]);

  // ✅ WebRTC functions
  const createPeerConnection = (userId) => {
    const pc = new RTCPeerConnection();

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.current.emit("ice-candidate", {
          toUserId: userId,
          fromUserId: currentUserId,
          candidate: e.candidate,
        });
      }
    };

    pc.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.current);
      });
    }

    return pc;
  };

  const startCall = async () => {
    localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = localStream.current;

    const pc = createPeerConnection(chatPartnerId);
    peerConnection.current = pc;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.current.emit("call:offer", {
      toUserId: chatPartnerId,
      fromUserId: currentUserId,
      offer,
    });

    setCallActive(true);
  };

  const acceptCall = async ({ fromUserId, offer }) => {
    localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = localStream.current;

    const pc = createPeerConnection(fromUserId);
    peerConnection.current = pc;

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.current.emit("call:answer", {
      toUserId: fromUserId,
      fromUserId: currentUserId,
      answer,
    });

    setCallActive(true);
    setIncomingCall(null);
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenSharing(true);
      screenPreviewRef.current.srcObject = screenStream;

      const screenTrack = screenStream.getVideoTracks()[0];
      const sender = peerConnection.current
        ?.getSenders()
        .find((s) => s.track.kind === "video");
      if (sender) sender.replaceTrack(screenTrack);

      screenTrack.onended = () => {
        setScreenSharing(false);
        const localTrack = localStream.current.getVideoTracks()[0];
        if (sender && localTrack) sender.replaceTrack(localTrack);
      };
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  const endCall = () => {
    peerConnection.current?.close();
    peerConnection.current = null;

    localStream.current?.getTracks().forEach((track) => track.stop());
    localStream.current = null;

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setCallActive(false);
    setScreenSharing(false);

    socket.current?.emit("call:ended", { toUserId: chatPartnerId });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg = {
      senderId: currentUserId,
      receiverId: chatPartnerId,
      roomId,
      message: newMessage.trim(),
    };

    socket.current.emit("sendMessage", msg);
    setMessages((prev) => [
      ...prev,
      { ...msg, id: Date.now(), createdAt: new Date().toISOString() },
    ]);
    setNewMessage("");
  };

  return (
    <div className="chatroom">
      <h2>💬 Chat with {currentUserName}</h2>

      {incomingCall && (
        <div className="incoming-call">
          <p>📞 Incoming call...</p>
          <button onClick={() => acceptCall(incomingCall)}>Accept</button>
          <button onClick={() => setIncomingCall(null)}>Reject</button>
        </div>
      )}

      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted className="local-video" />
        <video ref={remoteVideoRef} autoPlay className="remote-video" />
        {screenSharing && (
          <video ref={screenPreviewRef} autoPlay muted className="screen-preview" />
        )}
      </div>

      <div className="controls">
        {!callActive && <button onClick={startCall}>📞 Start Call</button>}
        {callActive && (
          <>
            <button onClick={startScreenShare}>🖥 Share Screen</button>
            <button onClick={endCall}>❌ End Call</button>
          </>
        )}
      </div>

      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.senderId === currentUserId ? "You" : "Them"}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <div className="send-box">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
