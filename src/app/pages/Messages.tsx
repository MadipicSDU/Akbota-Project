import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Send, ArrowLeft } from 'lucide-react';
import { mockConversations } from '../data/mockData';
import type { Message } from '../types';

export default function Messages() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(conversationId || null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      senderId: '2',
      senderName: 'Sarah Johnson',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      receiverId: '1',
      content: 'Hi! I saw your application for the e-commerce project. Your portfolio looks great!',
      timestamp: '2026-04-07T10:15:00Z',
      read: true,
    },
    {
      id: 'm2',
      senderId: '1',
      senderName: 'John Smith',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      receiverId: '2',
      content: 'Thank you! I have extensive experience with React and Node.js. When would be a good time to discuss the project requirements in detail?',
      timestamp: '2026-04-07T10:20:00Z',
      read: true,
    },
    {
      id: 'm3',
      senderId: '2',
      senderName: 'Sarah Johnson',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      receiverId: '1',
      content: 'Great! When can you start the project?',
      timestamp: '2026-04-07T10:30:00Z',
      read: false,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      setSelectedConversation(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation || !user) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      receiverId: selectedConversation,
      content: messageText,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const selectedConv = mockConversations.find((c) => c.id === selectedConversation);
  const conversationMessages = messages.filter(
    (m) =>
      (m.senderId === user?.id && m.receiverId === selectedConv?.participantId) ||
      (m.senderId === selectedConv?.participantId && m.receiverId === user?.id)
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div
        className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col ${
          selectedConversation ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockConversations.length > 0 ? (
            mockConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition border-b border-gray-100 ${
                  selectedConversation === conversation.id ? 'bg-indigo-50' : ''
                }`}
              >
                {conversation.participantAvatar && (
                  <img
                    src={conversation.participantAvatar}
                    alt={conversation.participantName}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                )}
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-gray-900 truncate">
                      {conversation.participantName}
                    </p>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {new Date(conversation.lastMessageTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  {conversation.unreadCount > 0 && (
                    <span className="inline-block mt-1 bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-600">
              <p>No conversations yet</p>
              <Link to="/projects" className="text-indigo-600 hover:text-indigo-700 text-sm mt-2 inline-block">
                Browse projects to get started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation && selectedConv ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
            <button
              onClick={() => setSelectedConversation(null)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {selectedConv.participantAvatar && (
              <img
                src={selectedConv.participantAvatar}
                alt={selectedConv.participantName}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900">{selectedConv.participantName}</p>
              <p className="text-sm text-gray-600">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversationMessages.map((message) => {
              const isOwnMessage = message.senderId === user?.id;

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {message.senderAvatar && !isOwnMessage && (
                    <img
                      src={message.senderAvatar}
                      alt={message.senderName}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-md ${
                      isOwnMessage ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900'
                    } rounded-lg p-3 shadow`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-indigo-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        !selectedConversation && (
          <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-600">
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
