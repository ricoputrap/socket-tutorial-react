import './App.css'
import io from "socket.io-client";
import { useState } from 'react';
import { useEffect } from 'react';

function App() {

  const [socket, setSocket] = useState();
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  const sendMessage = () => {
    socket.emit("send_message", {
      message: message
    });

    setMessage("");
  }

  // @todo use singleton pattern
  useEffect(() => {
    setSocket(io.connect("http://localhost:3001", {
      transports: ["websocket"]
    }));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (data) => {
      setReceivedMessages(prevMessages => [...prevMessages, data.message]);
    })

    socket.on("connect_error", (err) => {
      console.log("===== ERROR:", err)
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
        {receivedMessages.map(msg => (
          <div key={msg}>{ msg }</div>
        ))}
      </div>
    </main>
  )
}

export default App
