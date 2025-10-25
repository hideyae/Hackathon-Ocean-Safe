import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Waves, Camera, Mic, Image } from 'lucide-react';

const MarineChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I'm your virtual assistant specialized in marine activities and weather. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const marineKnowledge = {
    diving: {
      keywords: ['diving', 'dive', 'scuba', 'snorkel', 'underwater', 'mask', 'tank'],
      response: "🤿 **Scuba Diving**:\n\n• **Ideal Conditions**: Visibility >10m, temperature >18°C, calm sea\n• **Essential Equipment**: Mask, fins, wetsuit, BCD, regulator\n• **Safety**: Always dive with a buddy, respect decompression stops\n• **Best Spots**: Coral reefs, wrecks, marine caves\n• **Certification**: PADI, SSI, CMAS recommended"
    },
    surfing: {
      keywords: ['surf', 'surfing', 'wave', 'board', 'bodyboard', 'swell'],
      response: "🏄 **Surfing & Wave Sports**:\n\n• **Optimal Conditions**: Swell 1-3m, light offshore wind, rising tide\n• **Wave Levels**: Beginner (<1m), Intermediate (1-2m), Expert (>2m)\n• **Equipment**: Board suited to your level, leash, wax, wetsuit\n• **Forecasts**: Check swell reports 48h in advance\n• **Safety**: Know the currents, respect swimming zones"
    },
    sailing: {
      keywords: ['sail', 'sailing', 'boat', 'yacht', 'catamaran', 'navigation'],
      response: "⛵ **Sailing**:\n\n• **Favorable Weather**: Wind 10-20 knots, slight to moderate seas\n• **Boat Types**: Dinghy, keelboat, catamaran, monohull\n• **Coastal Navigation**: Marine charts, VHF, GPS, life jackets\n• **License**: Coastal permit (<6 miles), offshore (unlimited)\n• **Rules**: Right of way, buoyage system, anchoring zones"
    },
    fishing: {
      keywords: ['fish', 'fishing', 'catch', 'hook', 'rod', 'angling'],
      response: "🎣 **Sea Fishing**:\n\n• **Types**: Casting, trolling, jigging, fly fishing\n• **Common Species**: Bass, bream, tuna, mackerel, pollock\n• **Tides**: Best fishing 2h before/after high tide\n• **Regulations**: Minimum sizes, quotas, protected areas\n• **Gear**: Rods, reels, lures adapted to target species"
    },
    kayak: {
      keywords: ['kayak', 'paddle', 'paddling', 'canoe'],
      response: "🛶 **Sea Kayaking**:\n\n• **Conditions**: Calm sea, wind <15 knots, good visibility\n• **Equipment**: Stable kayak, paddle, PFD, spray skirt\n• **Routes**: Coastal (near shore), expedition (long distance)\n• **Safety**: Know how to roll, carry whistle and light\n• **Best Season**: Spring/summer, early morning (calm sea)"
    },
    weather: {
      keywords: ['weather', 'forecast', 'wind', 'temperature', 'conditions', 'climate'],
      response: "🌊 **Marine Weather**:\n\n• **Key Parameters**: Wind force, direction, sea state, visibility\n• **Beaufort Scale**: 0-3 (calm), 4-5 (moderate), 6+ (strong)\n• **Water Temperature**: Varies by season (15-25°C / 59-77°F)\n• **Reliable Sources**: NOAA Marine, Windy, Windguru\n• **Alerts**: Follow marine weather warnings\n• **Tides**: Check tide times and coefficients"
    },
    wildlife: {
      keywords: ['wildlife', 'animals', 'dolphins', 'whales', 'fish', 'turtles', 'shark', 'marine life'],
      response: "🐋 **Marine Wildlife**:\n\n• **Mammals**: Dolphins, whales, seals, orcas\n• **Fish**: Over 20,000 species in the oceans\n• **Observation**: Maintain safe distance (100m from cetaceans)\n• **Season**: Whale migration (winter/spring)\n• **Protection**: Endangered species, marine protected areas\n• **Safety**: Don't touch, don't feed wildlife"
    },
    tides: {
      keywords: ['tide', 'tides', 'tidal', 'current', 'high tide', 'low tide'],
      response: "🌊 **Tides**:\n\n• **Range**: Neap tides (small), spring tides (large)\n• **Cycles**: 2 high and 2 low tides per day (~6h interval)\n• **Moon Influence**: Full moon and new moon = spring tides\n• **Activity Impact**: Fishing (better on spring tides), surfing (spot dependent)\n• **Calculation**: Rule of twelfths for water height\n• **Useful Apps**: Tide charts, marine apps"
    }
  };

  const getBotResponse = (userMessage: string) => {
    const msg = userMessage.toLowerCase();
    
    for (const [, data] of Object.entries(marineKnowledge)) {
      if (data.keywords.some(keyword => msg.includes(keyword))) {
        return data.response;
      }
    }

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! 👋 I can provide information on:\n• Scuba Diving 🤿\n• Surfing & Wave Sports 🏄\n• Sailing ⛵\n• Sea Fishing 🎣\n• Sea Kayaking 🛶\n• Marine Weather 🌊\n• Marine Wildlife 🐋\n• Tides & Currents 🌊\n\nWhat would you like to know?";
    }

    if (msg.includes('help') || msg.includes('?')) {
      return "I'm your marine activities expert! Ask me about:\n\n🤿 Diving\n🏄 Surfing\n⛵ Sailing\n🎣 Fishing\n🛶 Kayaking\n🌊 Weather\n🐋 Marine Wildlife\n🌊 Tides\n\nExample: \"What are the conditions for surfing?\"";
    }

    return "I didn't find specific information on that topic. Try asking me about:\n• Marine activities (diving, surfing, sailing, fishing, kayaking)\n• Weather and sea conditions\n• Marine wildlife\n• Tides\n\nOr simply ask 'help' for more information! 🌊";
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        sender: 'bot',
        text: getBotResponse(inputText),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMediaClick = (type: string) => {
    const mediaMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: `[${type === 'photo' ? '📷 Photo' : type === 'audio' ? '🎤 Voice message' : '🖼 Image'} sent]`,
      timestamp: new Date(),
      isMedia: true
    };
    setMessages([...messages, mediaMessage]);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        sender: 'bot',
        text: `I received your ${type === 'photo' ? 'photo' : type === 'audio' ? 'voice message' : 'image'}! As a text-based assistant, I can best help with written questions about marine activities and weather. Feel free to ask me anything! 🌊`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden" style={{ height: '600px' }}>
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Marine Assistant</h1>
            <p className="text-sm text-blue-100">Marine Activities & Weather</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-br from-cyan-500 to-blue-500'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <div className={`rounded-2xl p-3 shadow-md ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex items-center space-x-2 mb-3">
          <button
            onClick={() => handleMediaClick('photo')}
            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            title="Send photo"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleMediaClick('audio')}
            className="p-2 bg-cyan-100 text-cyan-600 rounded-full hover:bg-cyan-200 transition-colors"
            title="Send audio"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleMediaClick('image')}
            className="p-2 bg-teal-100 text-teal-600 rounded-full hover:bg-teal-200 transition-colors"
            title="Send image"
          >
            <Image className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your question about marine activities..."
            className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={inputText.trim() === ''}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarineChatbot;
