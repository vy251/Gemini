import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { URl } from "./constants";
import Answers from "./components/Answers";
function App() {
  const [question, setquestion] = useState("");
  const [result, setresult] = useState([]);
  const [history, sethistory] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const payload = {
    contents: [
      {
        parts: [
          {
            text: question,
          },
        ],
      },
    ],
  };
  useEffect(() => {
    const savedItem = localStorage.getItem("chatHistory");
    if (savedItem) {
      sethistory(JSON.parse(savedItem));
    }
  }, []);
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(history));
    }
  }, [history]);
  async function Ask() {
    if(question=="") alert("Ask something");
    else {
    let response = await fetch(URl, {
      method: "Post",
      body: JSON.stringify(payload),
    });
    response = await response.json();
    let datastring = response.candidates[0].content.parts[0].text;
    datastring = datastring.split("* ");
    datastring = datastring.map((item) => item.trim());
    console.log(datastring);
    const newentry = {
      question: question,
      answer: datastring,
    };
    sethistory([...history, newentry]);
    setresult([...result, newentry]);
    setquestion("");
  }
  }
  function deletebutton(index){
    const updatedlist=history.filter((_,i)=>i!=index);
    sethistory(updatedlist);
    setresult([]);
    localStorage.setItem("chatHistory",JSON.stringify(updatedlist));
  }
  console.log(result);
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 h-screen text-center">
      <button
        className="md:hidden p-2 m-2 text-white bg-zinc-700 rounded fixed top-2 left-2 z-50"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        &#9776;
      </button>
      <div className={`bg-zinc-800 fixed top-0 left-0 z-40 h-screen w-64 overflow-y-auto transform transition-transform
    ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
    md:relative md:translate-x-0 md:h-full md:w-full
    pt-12 md:pt-2`}>
        <div className="flex items-center justify-between mb-3 px-2 mt-2">
        <h2 className="text-lg font-bold mb-3 text-white text-center">
          History
        </h2>
        <button  className="bg-red-600 text-white px-3 py-1 mb-3 rounded hover:bg-red-700" onClick={()=>{
          sethistory([]);
          setresult([]);
          localStorage.setItem("chatHistory",JSON.stringify([]));
        }}>
          Clear All
        </button>
        </div>
        <ul className="space-y-2 text-left">
          {history.map((item, index) =>
           (
              <div className="flex" key={index}>
                <li
                  className="cursor-pointer hover:bg-zinc-700 p-2 rounded text-zinc-400 flex-1"
                  onClick={() => setresult([item])}
                >
                  {item.question}
                </li>
                <button className="text-red-300 text-right mr-2 hover:opacity-80 " onClick={()=>deletebutton(index)}>
                  Delete
                </button>
              </div>
            )
          )}
        </ul>
      </div>
      <div className={`transition-all duration-300
    ${showSidebar ? "ml-64" : "ml-0"} col-span-1 md:col-span-4 p-4 md:p-10`}>
        <div className="container h-110 overflow-scroll overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="text-zinc-300">
            <ul>
              {result.map((item, index) => (
                <div key={index}>
                <div
                  className="flex justify-end"
                >
                    <li
                      key={index}
                      className="text-right p-1 border-8 bg-zinc-700 border-zinc-700 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit"
                    >
                      <Answers
                        answers={item.question}
                        index={index}
                        totalresult={1}
                        type="q"
                      ></Answers>
                    </li>
                    </div> 
                    {item.answer.map((ansitem, ansindex) => (
                      <li key={ansindex} className="text-left p-1">
                        <Answers
                          answers={ansitem}
                          index={ansindex}
                          totalresult={item.answer.length}
                          type="a"
                        ></Answers>
                      </li>
                    ))} 
                </div>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-zinc-800 w-full md:w-1/2 p-1 pr-5 text-white m-auto rounded-4xl border-zinc-700 border flex h-16 mt-4">
          <input
            type="text"
            className="w-full h-full p-3 outline-none"
            value={question}
            onChange={(event) =>setquestion(event.target.value)}
            onKeyDown={(e) => {
              e.key == "Enter"? question==""?alert("Ask something"):Ask():null;
            }}
            placeholder="Ask me anything"
          />
          <button onClick={Ask}>Ask</button>
        </div>
      </div>
    </div>
  );
}

export default App;
