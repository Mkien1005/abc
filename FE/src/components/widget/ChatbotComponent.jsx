import { useEffect, useRef, useState } from 'react';
import { FaHeadset, FaMicrophone } from 'react-icons/fa';
import { IoChatboxOutline, IoClose, IoSend } from 'react-icons/io5';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const messageCache = {};

const ChatBotComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn?', timestamp: new Date() },
  ]);
  const { transcript, listening, resetTranscript, startListening, stopListening } = useSpeechRecognition();
  const [inputMessage, setInputMessage] = useState('');
  const messageContainerRef = useRef(null);


  useEffect(() => {
    setInputMessage(transcript);

  }, [transcript]);


  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserMessage = async (message) => {
    if (messageCache[message]) {
      console.log(`Using cached response for: "${message}"`);
      return messageCache[message];
    }

    console.log(`Sending new request for: "${message}"`);
    setLoading(true);
    try {
      const response = await axios.post('https://medicin-lang.codetifytech.io.vn/ask', {
        question: message,
      });

      let answer = response.data.answer || 'Không có phản hồi từ máy chủ!';
      let httpsLinks = [];

      const linkRegex = /(https?:\/\/[^\s]+)/g;
      const foundLinks = answer.match(linkRegex);
      if (foundLinks) {
        httpsLinks = foundLinks;
        answer = answer.replace(linkRegex, '');
      }

      console.log(answer);
      console.log(httpsLinks);

      messageCache[message] = { answer, httpsLinks };

      setLoading(false);
      return { answer, httpsLinks };
    } catch (error) {
      const errorMsg = 'Có lỗi xảy ra, thử lại sau!';
      messageCache[message] = { answer: errorMsg, httpsLinks: [] };
      setLoading(false);
      return { answer: errorMsg, httpsLinks: [] };
    }
  };


  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const userMessage = inputMessage.trim();
    const now = new Date();
    setMessages((prev) => [...prev, { type: 'user', text: userMessage, timestamp: now }]);
    setInputMessage('');
    const botResponse = await handleUserMessage(userMessage);
    setMessages((prev) => [...prev, { type: 'bot', text: botResponse.answer, httpsLinks: botResponse.httpsLinks, timestamp: new Date() }]);
  };

  return (
    <>
      {!isOpen && (
        <div className="chatbot-closed">
          
          <div className="chatbot-toggle" onClick={() => setIsOpen(true)}>
            <IoChatboxOutline size={26} />
          </div>
        </div>
      )}

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span>Trợ lý AI <p>Microphone: {listening ? 'bật' : 'tắt'}</p></span>
            <button onClick={() => setIsOpen(false)}>
              <IoClose size={18} />
            </button>
          </div>

          <div className="message-container" ref={messageContainerRef}>
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type === 'bot' ? 'bot-message' : 'user-message'}`}>
                {message.type === 'bot' ? (
                  <>
                    {message.text}
                    {message.httpsLinks && message.httpsLinks.length > 0 && (
                      <div>
                        {message.httpsLinks.map((link, linkIndex) => (
                          <a key={linkIndex} href={link} target="_blank" rel="noopener noreferrer">
                            {link}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  message.text
                )}
                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>
            ))}

            {loading && (
              <div className="loading">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
          </div>
          <form className="input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập tin nhắn của bạn..."
              disabled={loading}
            />
            <div className="button-group">
              <button type="button" onClick={SpeechRecognition.startListening}>
                <FaMicrophone size={18} />
              </button>
              <button type="submit" disabled={loading || (!inputMessage.trim() && !transcript.trim())}>
                <IoSend size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBotComponent;