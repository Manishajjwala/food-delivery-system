import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageCircle, X, Minus } from 'lucide-react';
import io from 'socket.io-client';

const OrderChat = ({ orderId, senderRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socketRef.current = io('food-delivery-system-xb0m.onrender.com');
    
    socketRef.current.emit('joinOrder', orderId);

    socketRef.current.on('receiveChatMessage', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => socketRef.current.disconnect();
  }, [orderId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const chatData = {
      orderId,
      sender: senderRole,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socketRef.current.emit('sendChatMessage', chatData);
    setMessage('');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-warmOrange text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[9999]"
      >
        <MessageCircle size={32} />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-80 sm:w-96 h-[32rem] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500 z-[9999] border border-[#f7e8da]">
      {/* Header */}
      <div className="p-6 bg-[#fffcf9] border-b border-[#f7e8da] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-warmOrange/10 rounded-xl flex items-center justify-center text-warmOrange">
            <User size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">Order Support</h4>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Live Link Active</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition-colors"><Minus size={18}/></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
        {messages.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                 <MessageCircle size={32} className="text-gray-300" />
              </div>
              <p className="text-xs font-bold text-gray-400 max-w-[150px]">Secure channel opened. Start a conversation with your partner.</p>
           </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.sender === senderRole ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs font-bold shadow-sm ${
                msg.sender === senderRole 
                  ? 'bg-warmOrange text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {msg.message}
              </div>
              <span className="text-[9px] font-black text-gray-300 uppercase mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-6 bg-[#fffcf9] border-t border-[#f7e8da]">
        <div className="relative">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full pl-6 pr-14 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-warmOrange/30 transition-all shadow-inner"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 w-10 h-10 bg-warmOrange hover:bg-orange-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-warmOrange/20 active:scale-90"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderChat;
