import React, { useState } from 'react';
import axios from 'axios';

async function chatbotRequest(messages) { // <-- Add 'messages' parameter here
    const options = {
      method: 'POST',
      url: 'https://open-ai21.p.rapidapi.com/conversationgpt35',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '075247818fmshafb071848ec291cp101e1fjsne9596a653981',
        'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com',
      },
      data: {
        messages,
        web_access: false,
        system_prompt: '',
        temperature: 0.9,
        top_k: 5,
        top_p: 0.9,
        max_tokens: 256,
      },
    };

  try {
    const response = await axios.request(options);

    // Log the full response for debugging
    console.log(response.data.result);
    return response.data.result;

    // Check if response has choices and the first choice is available
   /* if (response.data && response.data.choices && response.data.choices.length > 0) {
      const chatbotResponse = response.data.choices[0].message.content;
      //return chatbotResponse;
      return response.data.result;
    } else {
      console.error('Invalid chatbot response:', response.data);
      throw new Error('Invalid chatbot response');
    }
   // return(response.data.result);*/
  } catch (error) {
    console.error('Error making chatbot request:', error);

    // Check if the error object has a response property
    if (error.response) {
      // Log the full response for debugging
      console.log('Full error response:', error.response);
    }

    // Handle errors
    throw error;
  }
}
function ChatDialog() {
    const [conversation, setConversation] = useState([]);
    const [userMessage, setUserMessage] = useState('');
  
    const sendMessageToChatbot = async () => {
      try {
        const updatedConversation = [
          ...conversation,
          { role: 'user', content: userMessage },
        ];
  
        setConversation(updatedConversation);
  
        const chatbotResponse = await chatbotRequest(updatedConversation);
  
        setConversation([...updatedConversation, { role: 'chatbot', content: chatbotResponse }]);
        setUserMessage('');
      } catch (error) {
        console.error('Failed to get chatbot response:', error);
      }
    };
  
    return (
      <div>
        <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
          {conversation.map((msg, index) => (
            <div key={index} style={{ marginBottom: '10px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              <strong>{msg.role === 'user' ? 'You' : 'Chatbot'}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessageToChatbot}>Send</button>
        </div>
      </div>
    );
  }
  
  
  function Logout() {
    return (
      <div>
        <h1>Chatbot Demo</h1>
        <ChatDialog />
      </div>
    );
  }
  
  export default Logout;


  