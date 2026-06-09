import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Headphones } from 'lucide-react';

const SupportChatWidget = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your Hungry virtual assistant. Please choose an option below or type your issue.",
      sender: 'agent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: ["Track Order", "Cancel Order", "Payment Issue", "Food Quality Issue", "Something Else"]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textInput = null) => {
    const textToSend = textInput || inputText;
    if (!textToSend.trim()) return;

    // Remove options from the last bot message so they disappear upon successful selection
    setMessages(prev => {
       const updated = [...prev];
       if (updated.length > 0 && updated[updated.length - 1].sender === 'agent') {
           updated[updated.length - 1] = { ...updated[updated.length - 1], options: null };
       }
       return updated;
    });

    const newUserMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newUserMessage]);
    if (!textInput) setInputText('');
    setIsTyping(true);

    // Simulate Agent Delay for processing
    setTimeout(() => {
      const replyData = getAutoReply(newUserMessage.text);
      const autoReply = {
        id: Date.now() + 1,
        text: replyData.text,
        sender: 'agent',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: replyData.options || null
      };
      setMessages((prev) => [...prev, autoReply]);
      setIsTyping(false);
    }, 1200);
  };

  const getAutoReply = (text) => {
    const lowerText = text.toLowerCase().trim();
    
    // Exact Flow Matching for Quick Replies
    if (lowerText === 'track order') {
       return { 
           text: "Sure! Are you looking to track a recently placed order or an older one?", 
           options: ["Recent Order", "Past Order", "Main Menu"] 
       };
    }
    if (lowerText === 'recent order') {
       return {
           text: "Your recent order (ORD-8821) is currently out for delivery and will reach you in approximately 12 minutes. You can view the live map in the 'My Orders' tab.",
           options: ["Okay, thanks!", "Main Menu"]
       };
    }
    if (lowerText === 'cancel order') {
       return {
           text: "Orders can only be cancelled within 60 seconds of placing them or if the restaurant hasn't accepted them yet. Why do you want to cancel?",
           options: ["Ordered by mistake", "Taking too long", "Changed my mind", "Main Menu"]
       };
    }
    if (lowerText === 'ordered by mistake' || lowerText === 'changed my mind' || lowerText === 'taking too long') {
       return {
           text: "I understand. I'll need to transfer you to a Live Agent who can check if your specific order can still be cancelled. Hold on...",
           options: ["Connect to Agent", "Main Menu"]
       };
    }
    if (lowerText === 'payment issue') {
       return {
           text: "Did you face an issue where money was deducted but the order wasn't placed, or something else?",
           options: ["Money Deducted, No Order", "Refund Not Received", "Main Menu"]
       };
    }
    if (lowerText === 'connect to agent') {
        return {
            text: "Transferring to a Human Support Executive... (Please note this is a simulated environment. In a live app, you would be connected to our team now!)",
            options: ["Main Menu"]
        };
    }
    if (lowerText === 'main menu' || lowerText === 'something else' || lowerText === 'okay, thanks!') {
        return {
            text: "How else can I assist you today? Please choose an option below or type your query.",
            options: ["Track Order", "Cancel Order", "Payment Issue", "Food Quality Issue", "Connect to Agent"]
        };
    }
    
    // Fallback logic for free text input
    if (lowerText.includes('order') || lowerText.includes('track') || lowerText.includes('where is')) {
      return { text: "To help you with tracking, I need your Order ID. You can also track active orders from the 'My Orders' section.", options: ["Main Menu"] };
    }
    if (lowerText.includes('refund') || lowerText.includes('cancel')) {
      return { text: "Refunds typically process within 3-5 business days. Can I connect you to an agent for order-specific refund inquiries?", options: ["Connect to Agent", "Main Menu"] };
    }
    if (lowerText.includes('missing') || lowerText.includes('wrong') || lowerText === 'food quality issue') {
      return { text: "I'm sorry to hear about the quality issue. We take this very seriously. Please upload a picture of the received item and we will issue an immediate refund or replacement.", options: ["Connect to Agent", "Main Menu"] };
    }
    
    // Deep fallback
    return { 
        text: "I didn't quite catch that. Would you like me to connect you to a Live Agent or return to the Main Menu?",
        options: ["Connect to Agent", "Main Menu"]
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-[100] border border-gray-100 animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-warmOrange to-orange-600 text-white p-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Headphones size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">Live Support</h3>
            <p className="text-xs text-orange-100 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
              Virtual Assistant
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full cursor-pointer">
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-4">
        {messages.map((msg, index) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in zoom-in-95 duration-200`}>
            {/* Bubble */}
            <div className="flex">
               {msg.sender === 'agent' && (
                  <div className="w-8 h-8 rounded-full bg-peach-100 flex items-center justify-center mr-2 flex-shrink-0 mt-auto">
                    <Headphones size={14} className="text-warmOrange" />
                  </div>
               )}
               <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                 msg.sender === 'user' 
                   ? 'bg-warmOrange text-white rounded-br-sm' 
                   : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
               }`}>
                 <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                 <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                   {msg.time}
                 </p>
               </div>
            </div>
            
            {/* Quick Reply Options mapped below the bubble */}
            {msg.options && index === messages.length - 1 && !isTyping && (
               <div className="flex flex-wrap gap-2 mt-3 ml-10 animate-in fade-in slide-in-from-top-2">
                  {msg.options.map((opt, optIdx) => (
                     <button 
                       key={optIdx} 
                       onClick={() => handleSend(opt)}
                       className="bg-white border-2 border-warmOrange text-warmOrange font-bold text-xs py-2 px-4 rounded-full hover:bg-warmOrange hover:text-white transition-all shadow-sm transform hover:scale-105"
                     >
                        {opt}
                     </button>
                  ))}
               </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
             <div className="w-8 h-8 rounded-full bg-peach-100 flex items-center justify-center mr-2 flex-shrink-0">
               <Headphones size={14} className="text-warmOrange" />
             </div>
             <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center space-x-1 h-10">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-warmOrange/20 focus-within:border-warmOrange transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 py-1"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="ml-2 w-8 h-8 bg-warmOrange text-white rounded-full flex items-center justify-center hover:bg-peach-600 disabled:opacity-50 transition-colors flex-shrink-0 cursor-pointer shadow-sm"
          >
            <Send size={14} className="-ml-0.5 mt-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportChatWidget;
