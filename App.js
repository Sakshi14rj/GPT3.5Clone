import { useState , useEffect } from "react"

const App = () => {
  const[value ,setvalue] = useState(null)
  const [message , setMessage] = useState(null)
  const [previousChats ,setPreviousChats] = useState([])
  const [currentTitle , setCurrentTitle] = useState(null)
  const createNewChat =() => {
    setMessage(null)
    setvalue("")
    setCurrentTitle(null)
  }
  const getMessage = async () => {
    const option ={
      method: "POST",
      body : JSON.stringify({
        message: value
      }),
      headers :{
        "Content-Type": "application/json"
      }
    }
    try {
    const response =  await fetch('http://localhost:8000/completions' , option)
      const data = await response.json()
      console.log(data)
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
  }

useEffect(()  => {
  console.log(currentTitle , value , message)
  if(!currentTitle && value && message){
    setCurrentTitle(value)
  }
  if(currentTitle && value && message){
    setPreviousChats(prevChats => (
      [...prevChats , {
title : currentTitle,
role : "users",
content : value
      }, 
    {
title: currentTitle,
role: message.role,
content: message.content
    }
  ]
    ))
  }

} ,[message , currentTitle])

console.log(previousChats)

const currentChat = previousChats.filter(previousChats => previousChats.title == currentTitle)

const uniqueTitles = Array.from(new Set(previousChats.map(previousChats => previousChats.title)))
console.log(uniqueTitles)
  return(
    <div className= "app">
    <section className="side-bar">
    <button onClick={createNewChat}>+New Chat
    </button>
    <ul className="history"></ul>
   {uniqueTitles?.map((uniqueTitles , index) => <li key ={index}>{uniqueTitles}</li>)}
    <nav>
    <p>Made by Sakshi</p>
    </nav>
    </section>
    <section className="main">
   {!currentTitle && <h1>GrowKnow</h1>}
    <ul className="feed">
    {currentChat?.map((chatMessage , index) => <li key = {index}>
    <p className="role">{chatMessage.role}</p>
    <p>{chatMessage.message}</p>
    </li>)}
    </ul>
    <div className="bottom-section">
    <div className="input-container">
    <input value={value} onChange={(e) => setvalue(e.target.value)}/>
    <div id ="submit " onClick={getMessage}>➤</div>
    <p className="info">
    This is a ChatBot created with OpenAI's GPT 3.5 TURBO by Sakshi.</p>
    </div>
    </div>
    </section></div>
  )
}
export default App