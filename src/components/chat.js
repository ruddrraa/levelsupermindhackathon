import React, { useState } from 'react';

// Define the runLangflow function
async function runLangflow(inputValue) {
  const url = "/api/lf/85d1d502-59c7-48c7-ada0-6cfb71fa7839/api/v1/run/dad37511-223e-4485-b33b-2d55e8e9083b?stream=false";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer AstraCS:QWsAPbjEHowvUYgZCMhmUsTq:33978159c2188aa043938d264e3740a2da85c484f1bb6c0678a3b4401431cd68`
  };
  const body = {
    input_value: inputValue,
    output_type: "chat",
    input_type: "chat",
    tweaks: {
      "ChatInput-Pbs56": {},
      "ParseData-Tc67o": {},
      "Prompt-fpcAu": {},
      "SplitText-YeCPB": {},
      "ChatOutput-frJqY": {},
      "AstraDB-wxdvr": {},
      "AstraDB-XT11N": {},
      "File-icSdP": {},
      "MistalAIEmbeddings-OSlJY": {},
      "MistalAIEmbeddings-WWgxD": {},
      "GroqModel-rqeeT": {}
    }
  };

  try {
    console.log('Sending request to:', url);
    console.log('Request headers:', headers);
    console.log('Request body:', body);

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
    }

    const responseData = await response.json();
    console.log('Full Response:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      setLoading(true);

      try {
        const response = await runLangflow(input);
        console.log('Parsed Response:', response);

        // Ensure safe access to nested properties
        const botMessage = response.outputs?.[0]?.outputs?.[0]?.artifacts?.message;
        
        if (botMessage) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: botMessage, sender: 'bot' },
          ]);
        } else {
          console.error('Bot message not found in response');
        }
      } catch (error) {
        console.error('Error getting response from Langflow:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="bg-black text-white/40 p-4 text-center">
        <h1 className="text-xl font-bold">Team DCODE Chatbot</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-4 relative">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-violet-500 font-medium text-white' : 'bg-blue-600 text-white font-medium'}`}>
              {msg.text}
            </span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <p className="text-gray-400 font-semibold">Levelsupermind Hackathon Pre Qualifier</p>
        </div>
        {loading && (
          <div className="text-start bg-blue-500 inline-block p-2 rounded-lg">
            <span className="text-white font-semibold">Bot is typing</span>
            <div className="loading-dots inline-flex ml-2">
              <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
              <div className="h-2 w-2 bg-white rounded-full animate-pulse mx-1"></div>
              <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-black flex items-center">
        <input
          type="text"
          className="flex-grow p-3 px-6 border rounded-3xl text-black focus:outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-gray-100/10 text-white p-3 font-semibold px-6 rounded-3xl"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
