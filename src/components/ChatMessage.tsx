import { ChatMessage as ChatMessageType } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${isUser ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-gradient-to-br from-teal-500 to-emerald-600'}
        text-white
      `}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div className={`
        max-w-[80%] rounded-2xl px-4 py-3
        ${isUser
          ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
          : 'bg-white border-2 border-gray-200 text-gray-800'
        }
      `}>
        <p className="text-sm leading-relaxed">
          {message.content}
        </p>
        <span className={`text-xs mt-1 block ${isUser ? 'text-cyan-100' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};
