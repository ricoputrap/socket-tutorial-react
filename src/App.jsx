import './App.css'
import io from "socket.io-client";
import { useState } from 'react';
import { useEffect } from 'react';

const socket = io.connect("http://localhost:3001", {
  transports: ["websocket"]
})

socket.on("connect_error", (err) => {
  console.log("===== ERROR:", err)
})

function App() {

  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");

  const sendMessage = () => {
    socket.emit("send_message", {
      message: message
    });

    setMessage("");
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setReceivedMessage(data.message);
    })
  }, [socket]);

  return (
    <main>
      <div className="chatbox">
        <input
          type="text"
          placeholder='Message...'
          value={ message }
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>

      <div className='messages'>
        { receivedMessage }
      </div>
    </main>
  )
}

export default App
