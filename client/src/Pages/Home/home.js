import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import "./home.scss";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import LogoutIcon from "@mui/icons-material/Logout";

function Home() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [showTopicWindow, setShowTopicWindow] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const inputRef = useRef(null);

  const fetchData = async () => {
    console.log("fetching data", currentUser.email);
    try {
      const response = await fetch(
        "http://localhost:8800/api/translate/getData"
      );
      const data = await response.json();
      const tasks = data.map((item) => ({
        name: item.word,
        completed: false,
        tran: item.translation,
      }));
      setTasks(tasks);

      console.log("Data fetched:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  async function translate(newTask) {
    try {
      const response = await axios.post("http://localhost:8800/api/translate", {
        lang: "he",
        text: newTask,
      });
      console.log(response.data);
      return response.data;
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
        setTasks((prevTasks) => [
          ...prevTasks,
          {
            name: newTask,
            completed: false,
            tran: tran.translation,
          },
        ]);
        setNewTask("");
      } catch (error) {
        console.error("Translation failed:", error);
      }
    }
  };

  const englishTest = () => {
    navigate("/logout");
  };

  const handleDeleteTask = async (index) => {
    // console.log(tasks);
    // console.log(index);
    const updatedTasks = [...tasks];
    const taskToDelete = updatedTasks[index];
    //console.log("Task to delete:", taskToDelete.name);

    const response = await axios.delete(
      `http://localhost:8800/api/translate/remove`,
      {
        data: { taskName: taskToDelete.name },
      }
    );

    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const taskToDelete = updatedTasks[index];
      console.log("Task to delete:", taskToDelete.name);
      updatedTasks.splice(index, 1);
      return updatedTasks;
    });
  };

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

  const topicsList = [
    "Astronomy",
    "Politics",
    "World War II",
    "NBA",
    "Traveling",
    "Movies",
    "Books",
    "Olympics",
    "Animals",
    "Fitness & Wellness",
  ];

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [conversation, setConversation] = useState([]);

  const handleTopicClick = async (topic) => {
    setSelectedTopic(topic);
    setShowTopicWindow(false);
    try {
      const response = await axios.post("http://localhost:8800/api/chatbot", {
        topic,
      });
      setConversation((prev) => [
        ...prev,
        { text: response.data, sender: "bot" },
      ]);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const [lastMessage, setLastMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsWaitingForResponse(true);
    setConversation((prev) => [...prev, { text: userInput, sender: "user" }]);
    setUserInput("");
    await handleUserInput(userInput);
  };

  useEffect(() => {
    if (lastMessage === "If you want to continue  - REGISTER\n") {
      setIsWaitingForResponse(true);
      console.log("User wants to continue");
    } else {
      setIsWaitingForResponse(false);
    }
  }, [lastMessage]);

  const handleUserInput = async (content) => {
    try {
      console.log("user content: ", content);
      const response = await axios.post("http://localhost:8800/api/chatbot2", {
        content: content,
      });
      setLastMessage(response.data.message);
      console.log("last message", lastMessage);
      setConversation((prev) => [
        ...prev,
        // { text: content, sender: "user" },
        { text: response.data, sender: "bot" },
      ]);
      setIsWaitingForResponse(false);
    } catch (err) {
      console.log(err);
      setIsWaitingForResponse(false);
    }
  };
  const [userInput, setUserInput] = useState("");

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setIsWaitingForResponse(true);
  //   setConversation((prev) => [...prev, { text: userInput, sender: "user" }]);
  //   setUserInput("");
  //   await handleUserInput(userInput);
  // };

  var dialog = document.getElementById("dialog");

  function openDialog() {
    dialog.showModal();
  }

  function closeDialog() {
    dialog.close();
  }

  return (
    <>
      <div className="header">
        <div className="info">
          <h5>User: {currentUser.username}</h5>
          <h5>English Level: {currentUser.level}</h5>
          <button className="primary" onClick={openDialog}>
            Explanation English Levels
          </button>
          <dialog id="dialog">
            <h2>
              There are 6 English <br></br>levels in our website
            </h2>
            <p>A1 English (Beginner/Elementary)</p>
            <p>A2 English (Pre Intermediate)</p>
            <p>B1 English (Intermediate)</p>
            <p>B2 English (Upper Intermediate)</p>
            <p>C1 English (Advanced)</p>
            <p>C2 English (Proficient)</p>
            <button onClick={closeDialog} className="close">
              ❌
            </button>
          </dialog>
        </div>
        <button onClick={handleLogOut} className="logout">
          <LogoutIcon className="icon" />
        </button>
      </div>
      <div className="container">
        <div className="top">
          <h1>Learning English</h1>
          {!currentUser.level && (
            <div className="level-test">
              <h2>Do English level test to determine your start level</h2>
              <button onClick={englishTest}>Start test</button>
            </div>
          )}
          {showTopicWindow && (
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
          {selectedTopic && (
            <div className="select">
              <p>
                Selected Topic: <br /> {selectedTopic}{" "}
              </p>
            </div>
          )}
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
            {currentUser.email !== "generaluser@gmail.com" && (
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
            )}
          </div>
          <div className="chatbot">
            {selectedTopic && (
              <div className="chat">
                {conversation.map((message, index) => (
                  <div key={index} className={`${message.sender}-message`}>
                    {message.sender === "user" && <strong>You</strong>}
                    {message.sender === "bot" && <strong>AI</strong>}
                    <div className="message-content">
                      {typeof message.text === "object"
                        ? message.text.message
                        : message.text}
                    </div>
                  </div>
                ))}
                <form onSubmit={handleSubmit}>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message..."
                  ></textarea>
                  <button type="submit" disabled={isWaitingForResponse}>
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
