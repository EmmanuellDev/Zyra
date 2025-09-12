import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Home, 
  Bot, 
  User, 
  Languages,
  RotateCcw,
  Loader
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface AIChatProps {
  onBackToHome?: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ onBackToHome }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  ];

  const translations = {
    en: {
      title: 'AI Assistant',
      backToHome: 'Back to Home',
      newChat: 'New Chat',
      language: 'Language',
      placeholder: 'Type your message here...',
      typing: 'AI is typing...',
      welcome: "Hello! I'm your AI assistant. How can I help you today?"
    },
    ta: {
      title: 'AI உதவியாளர்',
      backToHome: 'முகப்புக்கு திரும்பு',
      newChat: 'புதிய அரட்டை',
      language: 'மொழி',
      placeholder: 'உங்கள் செய்தியை இங்கே தட்டச்சு செய்யுங்கள்...',
      typing: 'AI தட்டச்சு செய்கிறது...',
      welcome: 'வணக்கம்! நான் உங்கள் AI உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?'
    }
  };

  const t = (key: string) => {
    const lang = currentLanguage as keyof typeof translations;
    return translations[lang]?.[key as keyof typeof translations['en']] || translations.en[key as keyof typeof translations['en']];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        sender: 'ai',
        text: t('welcome'),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [currentLanguage]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's an interesting question! Let me help you with that.",
        "I understand what you're asking. Here's my perspective on this topic.",
        "Thank you for sharing that with me. I'd be happy to assist you further.",
        "Based on what you've told me, I think I can provide some useful insights.",
        "I appreciate you bringing this up. Let me give you a comprehensive answer."
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  const newChat = () => {
    setMessages([]);
    setInput('');
    setLoading(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const chatWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    margin: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 30px',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)'
  };

  const headerSectionStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  };

  const headerCenterStyle: React.CSSProperties = {
    ...headerSectionStyle,
    flex: 1,
    justifyContent: 'center'
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    margin: 0
  };

  const messagesContainerStyle: React.CSSProperties = {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  };

  const messageWrapperStyle = (sender: 'user' | 'ai'): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '16px',
    flexDirection: sender === 'user' ? 'row-reverse' : 'row'
  });

  const avatarStyle = (sender: 'user' | 'ai'): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: sender === 'user' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    margin: sender === 'user' ? '0 0 0 12px' : '0 12px 0 0'
  });

  const messageBubbleStyle = (sender: 'user' | 'ai'): React.CSSProperties => ({
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: sender === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
    background: sender === 'user' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : '#f8f9fa',
    color: sender === 'user' ? 'white' : '#333',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    animation: 'messageSlide 0.3s ease-out'
  });

  const messageTextStyle: React.CSSProperties = {
    margin: 0,
    lineHeight: '1.5'
  };

  const messageTimeStyle: React.CSSProperties = {
    fontSize: '12px',
    opacity: 0.7,
    marginTop: '4px',
    display: 'block'
  };

  const inputContainerStyle: React.CSSProperties = {
    padding: '20px 30px',
    background: '#fff',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)'
  };

  const inputWrapperStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    background: '#f8f9fa',
    borderRadius: '25px',
    padding: '8px'
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '20px'
  };

  const sendButtonStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    marginTop: '8px',
    minWidth: '150px',
    zIndex: 1000
  };

  const dropdownItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    width: '100%',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
    transition: 'background-color 0.2s ease'
  };

  const typingIndicatorStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#666'
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
      
      <div style={chatWrapperStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={headerSectionStyle}>
            <button 
              style={buttonStyle}
              onClick={onBackToHome}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Home size={20} />
              <span>{t('backToHome')}</span>
            </button>
            
            <button 
              style={{...buttonStyle, background: 'rgba(255, 255, 255, 0.15)'}}
              onClick={newChat}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <RotateCcw size={20} />
              <span>{t('newChat')}</span>
            </button>
          </div>

          <div style={headerCenterStyle}>
            <Bot size={24} />
            <h1 style={titleStyle}>{t('title')}</h1>
          </div>

          <div style={headerSectionStyle}>
            <div style={{position: 'relative'}}>
              <button 
                style={buttonStyle}
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Languages size={20} />
                <span>{t('language')}</span>
              </button>
              
              {showLanguageDropdown && (
                <div style={dropdownStyle}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      style={{
                        ...dropdownItemStyle,
                        background: currentLanguage === lang.code ? 'rgba(79, 172, 254, 0.1)' : 'transparent'
                      }}
                      onClick={() => changeLanguage(lang.code)}
                      onMouseEnter={(e) => {
                        if (currentLanguage !== lang.code) {
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = currentLanguage === lang.code ? 'rgba(79, 172, 254, 0.1)' : 'transparent';
                      }}
                    >
                      <span style={{fontSize: '16px'}}>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={messagesContainerStyle}>
          {messages.map((message) => (
            <div key={message.id} style={messageWrapperStyle(message.sender)}>
              <div style={avatarStyle(message.sender)}>
                {message.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div style={messageBubbleStyle(message.sender)}>
                <p style={messageTextStyle}>{message.text}</p>
                <span style={messageTimeStyle}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={messageWrapperStyle('ai')}>
              <div style={avatarStyle('ai')}>
                <Bot size={20} />
              </div>
              <div style={messageBubbleStyle('ai')}>
                <div style={typingIndicatorStyle}>
                  <Loader size={16} className="spinning" />
                  <span>{t('typing')}</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={inputContainerStyle}>
          <div style={inputWrapperStyle}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('placeholder')}
              disabled={loading}
              style={inputStyle}
            />
            <button
              style={{
                ...sendButtonStyle,
                opacity: loading || !input.trim() ? 0.5 : 1,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
              }}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              onMouseEnter={(e) => {
                if (!loading && input.trim()) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;