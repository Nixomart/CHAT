import "./App.css";
import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { FiMoon } from "react-icons/fi";
import {BsFillSunFill } from 'react-icons/bs'
const socket = io("http://localhost:4000/");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState(null);
  const [moon, setMoon] =useState(false)

  //creamos el useRef
  const divRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("messageFront", message);
    const newMessage = {
      body: message,
      author: "Me",
    };
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  useEffect(() => {
    const receiveMesagge = (message) => {
      setMessages([...messages, message]);
    };
    socket.on("responseBack", receiveMesagge);
    //usamos aca el devRef porque esperamos al ultimo mensaje traido del servidor para poder setear al div
    divRef.current.scrollTop = divRef.current.scrollHeight;

    return () => {
      socket.off("responseBack", receiveMesagge);
    };
  }, [messages]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(()=>{
    if(window.matchMedia('{prefers-colors-scheme: dark').matches){
      setTheme('dark')

    }else{
      setTheme('light')
    }
  },[])

  //dark mode
  const handleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    setMoon(moon === 'dark' ? 'light' : 'dark' )
  };

  return (
    <div className="App flex flex-col  bg-gray-100 dark:bg-slate-900  justify-center h-screen items-center">
      
      <button onClick={handleTheme}>

        {moon === 'dark' ? (<BsFillSunFill size={'30'} color='white' />) :  (<FiMoon size={'30'}   /> )  }

      </button>
      {/* ref para mover el div hacia el ultimo mensaje */}
      <div
        ref={divRef}
        className="overflow-auto dark:boder-white shadow-2xl dark:shadow-gray-900 bg-white dark:bg-slate-800 dark:text-white max-h-3/4 h-3/4 w-2/3 rounded-xl border dark:border-none border-violet-700 "
      >
        <div className="fixed w-2/3 bg-violet-200 dark:bg-violet-900 shadow-xl rounded-xl  h-12 items-center flex justify-center">
          <h1 className=" top-0  text-center">
            Bienvenido al chat con vos solo
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="pt-10 justify-center">
          {messages.map((message, index) =>
            message.author === "Me" ? (
              <div className="px-10 flex justify-end">
                <div
                  className="shadow-lg text-white bg-blue-400 rounded-xl w-1/2 items-center py-2 px-3 mt-3"
                  key={index}
                >
                  <p className="text-white">
                    {message.author}: {message.body}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex px-10  justify-start">
                <div
                  className="bg-gray-400  rounded-xl py-2 px-3 mt-3 w-1/2 shadow-lg text-white"
                  key={index}
                >
                  <p>
                    {message.author}: {message.body}
                  </p>
                </div>
              </div>
            )
          )}
          <div className="flex justify-end mt-3 fixed top-10   z-50">
            <input
              type="text"
              placeholder="Write your messagge.."
              className="shadow appearance-none border border-violet-600 rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button className=" py-1 px-3 bg-violet-400 text-white rounded-lg hover:bg-violet-500 focus:border-violet-600">
              send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
