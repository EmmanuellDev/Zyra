import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Send, 
  Home, 
  Bot, 
  User, 
  Languages,
  RotateCcw,
  Loader,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Leaf,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import './AIChat.css';

interface AnalysisData {
  fairness_analysis: string;
  impact_analysis: string;
  resource_analysis: string;
  sustainability_analysis: string;
  disadvantages: string;
  ai_suggestion: string;
  truthfulness_percentage: number;
  language: string;
  confidence_score: number;
  timestamp: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  analysisData?: AnalysisData;
  showButtons?: boolean;
  selectedAnalysis?: string;
}

interface AIChatProps {
  onBackToHome: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ onBackToHome, initialInput }) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  ];

  const analysisButtons = [
    { 
      key: 'fairness_analysis', 
      label: 'Fairness Analysis', 
      icon: CheckCircle, 
      color: 'bg-blue-500', 
      emoji: '🔍' 
    },
    { 
      key: 'impact_analysis', 
      label: 'Impact Analysis', 
      icon: TrendingUp, 
      color: 'bg-purple-500', 
      emoji: '📊' 
    },
    { 
      key: 'resource_analysis', 
      label: 'Resource Analysis', 
      icon: DollarSign, 
      color: 'bg-green-500', 
      emoji: '💰' 
    },
    { 
      key: 'sustainability_analysis', 
      label: 'Sustainability Analysis', 
      icon: Leaf, 
      color: 'bg-emerald-500', 
      emoji: '🌱' 
    },
    { 
      key: 'disadvantages', 
      label: 'Potential Disadvantages', 
      icon: AlertTriangle, 
      color: 'bg-red-500', 
      emoji: '⚠️' 
    },
    { 
      key: 'ai_suggestion', 
      label: 'AI Suggestion', 
      icon: Lightbulb, 
      color: 'bg-orange-500', 
      emoji: '🤖' 
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        sender: 'ai',
        text: t('chat.welcome') || 'Hello! I\'m your AI assistant. How can I help you today?',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [t, messages.length]);

  // Prefill input only when initialInput changes (i.e., when Ask AI is clicked)
  useEffect(() => {
    if (initialInput) {
      setInput(initialInput);
    }
  }, [initialInput]);

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

    try {
      // Call the backend API for detailed analysis
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          language: i18n.language
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();

      if (data.success) {
        // Create AI message with analysis data and buttons
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'I\'ve analyzed your message. Please select which aspect you\'d like to explore:',
          timestamp: new Date(),
          analysisData: data.analysis,
          showButtons: true
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error calling backend:', error);
      
      // Fallback response if backend is not available
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `I understand you said: "${userMessage.text}". I'm currently experiencing connectivity issues with my analysis engine. Please ensure the backend server is running on http://localhost:5000, or I can provide a basic response. Would you like me to try again?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    }

    setLoading(false);
  };

  const handleAnalysisButtonClick = (messageId: string, analysisType: string) => {
    const sourceMessage = messages.find(m => m.id === messageId);
    if (!sourceMessage || !sourceMessage.analysisData) return;
    
    const analysisData = sourceMessage.analysisData;
    let analysisText = '';
    let truthfulnessText = '';

    // Get the specific analysis based on the button clicked
    switch (analysisType) {
      case 'fairness_analysis':
        analysisText = analysisData.fairness_analysis;
        break;
      case 'impact_analysis':
        analysisText = analysisData.impact_analysis;
        break;
      case 'resource_analysis':
        analysisText = analysisData.resource_analysis;
        break;
      case 'sustainability_analysis':
        analysisText = analysisData.sustainability_analysis;
        break;
      case 'disadvantages':
        analysisText = analysisData.disadvantages;
        break;
      case 'ai_suggestion':
        analysisText = analysisData.ai_suggestion;
        truthfulnessText = `\n\n📈 **Truthfulness Assessment**: ${analysisData.truthfulness_percentage}% credibility based on available information`;
        break;
      default:
        analysisText = 'Analysis not available';
    }

    // Create a new message with the specific analysis
    const newMessage: Message = {
      id: (Date.now() + Math.random()).toString(),
      sender: 'ai',
      text: analysisText + truthfulnessText,
      timestamp: new Date(),
      analysisData: analysisData,
      showButtons: true,
      selectedAnalysis: analysisType
    };

    // Add the new message to the conversation
    setMessages(prev => [...prev, newMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
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

  return (
  <div className="chat-container" style={{ background: 'rgba(0,0,0,0.85)', color: '#fff', borderRadius: '16px', boxShadow: '0 4px 32px rgba(0,0,0,0.2)', border: '1px solid #fff' }}>
      {/* Header */}
      <motion.div 
        className="chat-header"
        style={{ background: 'rgba(0,0,0,0.85)', color: '#fff', borderBottom: '1px solid #fff', borderRadius: '16px 16px 0 0' }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
  <div className="header-left" style={{ color: '#fff' }}>
          <motion.button
            className="header-button"
            onClick={onBackToHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home size={20} />
            <span>{t('chat.backToHome')}</span>
          </motion.button>
          
          <motion.button
            className="header-button secondary"
            onClick={newChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={20} />
            <span>{t('chat.newChat')}</span>
          </motion.button>
        </div>

  <div className="header-center" style={{ color: '#fff' }}>
          <Bot size={24} className="header-icon" />
          <h1 className="header-title">{t('chat.title')}</h1>
        </div>

  <div className="header-right" style={{ color: '#fff' }}>
          <div className="language-selector">
            <motion.button
              className="language-button"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Languages size={20} />
              <span>{t('chat.language')}</span>
            </motion.button>
            
            <AnimatePresence>
              {showLanguageDropdown && (
                <motion.div
                  className="language-dropdown"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
                      onClick={() => changeLanguage(lang.code)}
                      whileHover={{ backgroundColor: 'rgba(0, 123, 255, 0.1)' }}
                    >
                      <span className="flag">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <motion.div 
        className="messages-container"
        style={{ background: 'rgba(0,0,0,0.85)', color: '#fff', borderRadius: '0 0 16px 16px', border: '1px solid #fff', borderTop: 'none' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
  <div className="messages-list" style={{ color: '#fff' }}>
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`message-wrapper ${message.sender}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div className="message-avatar" style={{ color: '#fff' }}>
                  {message.sender === 'user' ? (
                    <User size={20} />
                  ) : (
                    <Bot size={20} />
                  )}
                </div>
                <div className="message-content">
                  <div className="message-bubble" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid #fff', borderRadius: '8px' }}>
                    <p className="message-text" style={{ color: '#fff' }}>{message.text}</p>
                    <span className="message-time" style={{ color: '#fff' }}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  {/* Analysis Buttons */}
                  {message.showButtons && message.analysisData && (
                    <motion.div 
                      className="analysis-buttons"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      <div className="buttons-grid">
                        {analysisButtons.map((button) => {
                          const IconComponent = button.icon;
                          return (
                            <motion.button
                              key={button.key}
                              className={`analysis-btn ${button.color}`}
                              onClick={() => handleAnalysisButtonClick(message.id, button.key)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              <span className="btn-emoji">{button.emoji}</span>
                              <IconComponent size={16} className="btn-icon" />
                              <span className="btn-label">{button.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                      
                      {/* Show truthfulness percentage for AI suggestion */}
                      {message.analysisData && (
                        <div className="truthfulness-indicator">
                          <span className="truthfulness-text">
                            🎯 Truthfulness: {message.analysisData.truthfulness_percentage}%
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div
              className="message-wrapper ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="message-avatar">
                <Bot size={20} />
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <Loader size={16} className="spinning" />
                    <span>{t('chat.typing')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </motion.div>

      {/* Input Area */}
      <motion.div 
        className="input-container"
        style={{ background: 'rgba(0,0,0,0.85)', color: '#fff', borderRadius: '0 0 16px 16px', border: '1px solid #fff', borderTop: 'none' }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
  <div className="input-wrapper" style={{ color: '#fff' }}>
          <div className="input-field" style={{ color: '#fff' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chat.placeholder')}
              disabled={loading}
              className="message-input"
              rows={3}
              style={{ resize: 'vertical', minHeight: '3em', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid #fff', borderRadius: '8px' }}
            />
            <motion.button
              className="send-button"
              style={{ background: 'rgba(0,0,0,0.85)', color: '#fff', border: '1px solid #fff', borderRadius: '6px', fontWeight: 'bold', letterSpacing: '0.5px', fontSize: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', cursor: 'pointer', transition: 'background 0.2s, color 0.2s', padding: '0.4rem 1rem' }}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              whileHover={{ scale: 1.05, background: '#fff', color: '#000' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Send size={20} style={{ color: 'inherit' }} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIChat;