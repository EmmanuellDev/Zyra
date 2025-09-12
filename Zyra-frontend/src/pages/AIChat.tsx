import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Brain, Globe, Zap, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onStartChat: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartChat }) => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const features = [
    {
      icon: Brain,
      title: t('features.intelligent.title'),
      description: t('features.intelligent.description')
    },
    {
      icon: Globe,
      title: t('features.multilingual.title'),
      description: t('features.multilingual.description')
    },
    {
      icon: Zap,
      title: t('features.realtime.title'),
      description: t('features.realtime.description')
    }
  ];

  return (
    <div className="home-page">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-shapes">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`shape shape-${i + 1}`}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="home-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div className="hero-section" variants={itemVariants}>
          <motion.div 
            className="hero-icon"
            animate={{
              y: [-10, 10, -10]
            }}
            transition={{
              duration: 3,
              repeat: Infinity
            }}
          >
            <MessageCircle size={80} className="main-icon" />
          </motion.div>
          
          <motion.h1 className="hero-title" variants={itemVariants}>
            {t('title')}
          </motion.h1>
          
          <motion.p className="hero-subtitle" variants={itemVariants}>
            {t('subtitle')}
          </motion.p>
          
          <motion.p className="hero-description" variants={itemVariants}>
            {t('description')}
          </motion.p>
          
          <motion.button
            className="cta-button"
            variants={itemVariants}
            onClick={onStartChat}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0, 123, 255, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{t('startChatting')}</span>
            <ArrowRight size={20} className="button-icon" />
          </motion.button>
        </motion.div>

        {/* Features Section */}
        <motion.div className="features-section" variants={itemVariants}>
          <motion.h2 className="features-title" variants={itemVariants}>
            {t('features.title')}
          </motion.h2>
          
          <motion.div className="features-grid" variants={containerVariants}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="feature-icon"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon size={40} />
                </motion.div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;