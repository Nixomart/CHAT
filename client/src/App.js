import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
const socket = io("http://localhost:4000/");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("messageFront", message);
    const newMessage = {
      body: message,
      author: "Me",
    };
    setMessages([...messages, newMessage ]);
    setMessage("");
  };

  useEffect(() => {
    const receiveMesagge = (message) => {
      setMessages([...messages, message ]);
    };
    socket.on("responseBack", receiveMesagge);
    return () => {
      socket.off("responseBack", receiveMesagge);
    };
  }, [messages]);

  return (
    <div className="App flex justify-center h-screen">
      <div className="overflow-auto max-h-3/4 h-3/4 w-3/4 rounded-xl border border-violet-700 ">
        <h1 className="">Hello world</h1>
        <form onSubmit={handleSubmit}>
          {messages.map((message, index) =>
            message.author === "Me" ? (
              <div className="flex justify-end">

              <div
                className="bg-blue-400 rounded-xl w-1/2 items-center py-2 px-3 mt-3"
                key={index}
                >
                <p className="text-white">
                  {message.author}: {message.body}
                </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">

              <div
                className="bg-gray-400 rounded-xl py-2 px-3 mt-3"
                key={index}
                >
                <p>
                  {message.author}: {message.body}
                </p>
              </div>
                </div>
            )
          )}
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button>send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
