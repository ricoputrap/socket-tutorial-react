import './App.css'
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001", {
  transports: ["websocket"]
})

socket.on("connect_error", (err) => {
  console.log("===== ERROR:", err)
})

function App() {

  const sendMessage = () => {
    
  }

  return (
    <main>
      <input type="text" placeholder='Message...'/>
      <button onClick={sendMessage}>Send Message</button>
    </main>
  )
}

export default App
