import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import "./home.scss"
import axios from "axios";
import { AuthContext } from '../../context/authContext';



function Home() {
  const { currentUser } = useContext(AuthContext);
  const [showTopicWindow, setShowTopicWindow] = useState(true);
  /*const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the Express server
    fetch('http://localhost:8800/api/data')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
console.log(data);*/

 const navigate = useNavigate();
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  async function translate(newTask) {
    try {
      //const response = await axios.post('http://localhost:8800/api/translate', { lang: 'he', text: newTask });
     // console.log(response.data);
     // return response.data;
    } catch (error) {
      console.error("axios request failed", error);
      throw error;
    }
  }
  
  const handleAddTask = async () => {
    if (newTask.trim().length === 0) {
      alert("Please Enter a Task");
    } else {
      try {
        const tran = await translate(newTask);
       // console.log("Translation result:", tran);
        setTasks((prevTasks) => [
          ...prevTasks,
          { name: newTask, completed: false, tran:newTask /*tran: tran.translation*/ },
        ]);
        setNewTask("");
      } catch (error) {
        console.error("Translation failed:", error);
      }
    }
  };
  
  const englishTest = () => {
    navigate("/logout");
  }

  const handleDeleteTask = (index) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks.splice(index, 1);
      return updatedTasks;
    });
  };

  const inputRef = useRef(null);

  const handleSpeak = () => {
    const text = inputRef.current.value;
    if (text.trim().length > 0) {
      const speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        speechSynthesisUtterance.voice = selectedVoice;
      }
      window.speechSynthesis.speak(speechSynthesisUtterance);
    } else {
      alert("Please enter text before clicking Speak");
    }
  };

  useEffect(() => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);

    window.speechSynthesis.onvoiceschanged = () => {
      const updatedVoices = window.speechSynthesis.getVoices();
      setVoices(updatedVoices);
    };
  }, []);

  const handleVoiceChange = (event) => {
    const selectedVoiceName = event.target.value;
    const selectedVoice = voices.find(
      (voice) => voice.name === selectedVoiceName
    );
    setSelectedVoice(selectedVoice);
  };

  const handleLogOut = async () => {
    navigate("/login");
  };

    const topicsList = ['Sport', 'Politics', 'Fashion', 'Music', 'Traveling', 'Movies', 'Books', 'Food', 'Animals', 'Fitness & Wellness'];
    const [selectedTopic, setSelectedTopic] = useState(null);
  
    const handleTopicClick = (topic) => {
      // Save the selected topic in a variable or perform any other action
      setSelectedTopic(topic);
      setShowTopicWindow(false); 
    };

    var dialog = document.getElementById("dialog");

  // Function to open the dialog
  function openDialog() {
    dialog.showModal();
  }

  // Function to close the dialog
  function closeDialog() {
    dialog.close();
  }

  return (
    <>
    <div className="header">
      <div className="info">
        <h5>User: {currentUser.username}</h5>
        <h5>English Level: {currentUser.level}</h5>
        <button className="primary" onClick={openDialog}>Explanation English Levels</button>
        <dialog id="dialog">
          <h2>There are 6 English <br></br>levels in our web</h2>
          <p>A0/A1 English (Beginner/Elementary)</p>
          <p>A2 English (Pre Intermediate)</p>
          <p>B1 English (Intermediate)</p>
          <p>B2 English (Upper Intermediate)</p>
          <p>C1 English (Advanced)</p>
          <p>C2 English (Proficient)</p>
          <button onClick={closeDialog} className="close">❌</button>
        </dialog>
      </div>
        <button onClick={handleLogOut} className="logout">logout</button>
    </div>
    <div className="container">
      <div className="top">
        <h1>English Web</h1>
        {!currentUser.level && (
        <div className="level-test">
            <h2>Do English level test to determine your start level</h2>
            <button onClick={englishTest}>Start test</button>
        </div>)}
        {showTopicWindow && ( // Conditionally render topic window
            <div className="topics">
              <h2>Choose a topic for the conversation:</h2>
              <ul>
                {topicsList.map((topic, index) => (
                  <li key={index} onClick={() => handleTopicClick(topic)}>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <>
          {selectedTopic && (
                <p>Selected Topic: {selectedTopic}</p>
              )}
          </>
      
      </div>
      <div className="bottom">
        <div className="left-bottom">
            <div className="speaker">
                    <h5>Try listening to the word:</h5>
                    <div className="header-speaker">
                        <input type="text" ref={inputRef} placeholder="Write text" />
                        <button onClick={handleSpeak}>Speak</button>
                    </div>
                    <div>
                    <label htmlFor="voiceSelect">Voice:</label>
                    <select
                        id="voiceSelect"
                        onChange={handleVoiceChange}
                        value={selectedVoice ? selectedVoice.name : ""}
                    >
                        <option value="">Default</option>
                        {voices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                            {voice.name}
                        </option>
                        ))}
                    </select>
                    </div>
            </div>
            <div className="todolist">
            <h5>My words list:</h5>
                <div id="newtask">
                    <input
                    type="text"
                    placeholder="Add a new word.."
                    value={newTask}
                    onChange={handleInputChange}
                    />
                    <button onClick={handleAddTask}>Add</button>
                </div>
                <div id="tasks">
                    {tasks.map((task, index) => (
                    <div
                        className={`task ${task.completed ? "completed" : ""}`}
                        key={index}
                    >
                        <span id="taskname">{task.name}</span>
                        <hr className="slant-line" />
                        <div className="left">
                        <span id="tasktranslate">{task.tran}</span>
                        <button
                            className="delete"
                            onClick={() => handleDeleteTask(index)}
                        >
                            <i className="far fa-trash-alt">
                            <DeleteForeverRoundedIcon />{" "}
                            </i>
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
          <div className="chatbot">
          {selectedTopic &&(<div className="chat">
                <p>start chat</p>
              </div>)}
        </div>
      </div>
    </div>
    </>
  );
}

export default Home;
