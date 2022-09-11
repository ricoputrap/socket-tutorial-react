import './App.css'
import io from "socket.io-client";
import { useState } from 'react';
import { useEffect } from 'react';

function App() {

  const [socket, setSocket] = useState();
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  const [room, setRoom] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");

  const sendMessage = () => {
    socket.emit("send_message", {
      message,
      room: joinedRoom
    });

    setMessage("");
  }

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }

    setRoom("");
    setJoinedRoom(room);
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
      <div id="roombox">
        <input
          type="text"
          placeholder='Room...'
          value={ room }
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button onClick={joinRoom}>Join</button>
      </div>
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
        <h3>{ joinedRoom }</h3>

        {receivedMessages.map(msg => (
          <div key={msg}>{ msg }</div>
        ))}
      </div>
    </main>
  )
}

export default App
