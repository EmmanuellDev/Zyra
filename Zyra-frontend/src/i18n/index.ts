import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Home Page
      title: "AI Analysis Assistant",
      subtitle: "Your intelligent analysis partner",
      description: "Experience comprehensive analysis with our advanced AI assistant. Get detailed insights on fairness, impact, resources, sustainability, and potential disadvantages.",
      startChatting: "Start Analysis",
      features: {
        title: "Analysis Features",
        intelligent: {
          title: "Comprehensive Analysis",
          description: "Get detailed analysis covering fairness, impact, resources, and sustainability"
        },
        multilingual: {
          title: "Multi-language Support",
          description: "Analyze in Tamil, English, Kannada, and Telugu with real-time translation"
        },
        realtime: {
          title: "Instant Insights",
          description: "Receive immediate comprehensive analysis with structured insights"
        }
      },
      // Chat Interface
      chat: {
        title: "AI Analysis Assistant",
        placeholder: "Type your message for analysis...",
        send: "Analyze",
        typing: "AI is analyzing...",
        newChat: "New Analysis",
        backToHome: "Back to Home",
        language: "Language",
        welcome: "Hello! I'm your AI Analysis Assistant. I can provide comprehensive analysis covering fairness, impact, resources, sustainability, and potential disadvantages. How can I help you today?"
      }
    }
  },
  ta: {
    translation: {
      // Home Page
      title: "AI பகுப்பாய்வு உதவியாளர்",
      subtitle: "உங்கள் அறிவார்ந்த பகுப்பாய்வு பங்குதாரர்",
      description: "எங்கள் மேம்பட்ட AI உதவியாளருடன் விரிவான பகுப்பாய்வை அனுபவிக்கவும். நியாயத்தன்மை, தாக்கம், வளங்கள், நிலைத்தன்மை மற்றும் சாத்தியமான தீமைகள் குறித்த விரிவான நுண்ணறிவுகளைப் பெறுங்கள்.",
      startChatting: "பகுப்பாய்வு தொடங்கு",
      features: {
        title: "பகுப்பாய்வு அம்சங்கள்",
        intelligent: {
          title: "விரிவான பகுப்பாய்வு",
          description: "நியாயத்தன்மை, தாக்கம், வளங்கள் மற்றும் நிலைத்தன்மையை உள்ளடக்கிய விரிவான பகுப்பாய்வைப் பெறுங்கள்"
        },
        multilingual: {
          title: "பல மொழி ஆதரவு",
          description: "தமிழ், ஆங்கிலம், கன்னடம் மற்றும் தெலுங்கில் நிகழ்நேர மொழிபெயர்ப்புடன் பகுப்பாய்வு செய்யுங்கள்"
        },
        realtime: {
          title: "உடனடி நுண்ணறிவுகள்",
          description: "கட்டமைக்கப்பட்ட நுண்ணறிவுகளுடன் உடனடி விரிவான பகுப்பாய்வைப் பெறுங்கள்"
        }
      },
      // Chat Interface
      chat: {
        title: "AI பகுப்பாய்வு உதவியாளர்",
        placeholder: "பகுப்பாய்வுக்காக உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...",
        send: "பகுப்பாய்வு செய்",
        typing: "AI பகுப்பாய்வு செய்கிறது...",
        newChat: "புதிய பகுப்பாய்வு",
        backToHome: "முகப்புக்கு திரும்பு",
        language: "மொழி",
        welcome: "வணக்கம்! நான் உங்கள் AI பகுப்பாய்வு உதவியாளர். நியாயத்தன்மை, தாக்கம், வளங்கள், நிலைத்தன்மை மற்றும் சாத்தியமான தீமைகளை உள்ளடக்கிய விரிவான பகுப்பாய்வை வழங்க முடியும். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?"
      }
    }
  },
  kn: {
    translation: {
      // Home Page
      title: "AI ವಿಶ್ಲೇಷಣೆ ಸಹಾಯಕ",
      subtitle: "ನಿಮ್ಮ ಬುದ್ಧಿವಂತ ವಿಶ್ಲೇಷಣೆ ಪಾಲುದಾರ",
      description: "ನಮ್ಮ ಮುಂದುವರಿದ AI ಸಹಾಯಕದೊಂದಿಗೆ ಸಮಗ್ರ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಅನುಭವಿಸಿ. ನ್ಯಾಯಸಮ್ಮತತೆ, ಪರಿಣಾಮ, ಸಂಪನ್ಮೂಲಗಳು, ಸಮರ್ಥನೀಯತೆ ಮತ್ತು ಸಂಭಾವ್ಯ ಅನಾನುಕೂಲತೆಗಳ ಬಗ್ಗೆ ವಿವರವಾದ ಒಳನೋಟಗಳನ್ನು ಪಡೆಯಿರಿ.",
      startChatting: "ವಿಶ್ಲೇಷಣೆ ಪ್ರಾರಂಭಿಸಿ",
      features: {
        title: "ವಿಶ್ಲೇಷಣೆ ವೈಶಿಷ್ಟ್ಯಗಳು",
        intelligent: {
          title: "ಸಮಗ್ರ ವಿಶ್ಲೇಷಣೆ",
          description: "ನ್ಯಾಯಸಮ್ಮತತೆ, ಪರಿಣಾಮ, ಸಂಪನ್ಮೂಲಗಳು ಮತ್ತು ಸಮರ್ಥನೀಯತೆಯನ್ನು ಒಳಗೊಂಡ ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪಡೆಯಿರಿ"
        },
        multilingual: {
          title: "ಬಹು ಭಾಷಾ ಬೆಂಬಲ",
          description: "ತಮಿಳು, ಇಂಗ್ಲಿಷ್, ಕನ್ನಡ ಮತ್ತು ತೆಲುಗಿನಲ್ಲಿ ನೈಜ-ಸಮಯ ಅನುವಾದದೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸಿ"
        },
        realtime: {
          title: "ತಕ್ಷಣದ ಒಳನೋಟಗಳು",
          description: "ರಚನಾತ್ಮಕ ಒಳನೋಟಗಳೊಂದಿಗೆ ತಕ್ಷಣದ ಸಮಗ್ರ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಸ್ವೀಕರಿಸಿ"
        }
      },
      // Chat Interface
      chat: {
        title: "AI ವಿಶ್ಲೇಷಣೆ ಸಹಾಯಕ",
        placeholder: "ವಿಶ್ಲೇಷಣೆಗಾಗಿ ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
        send: "ವಿಶ್ಲೇಷಿಸಿ",
        typing: "AI ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
        newChat: "ಹೊಸ ವಿಶ್ಲೇಷಣೆ",
        backToHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
        language: "ಭಾಷೆ",
        welcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ವಿಶ್ಲೇಷಣೆ ಸಹಾಯಕ. ನ್ಯಾಯಸಮ್ಮತತೆ, ಪರಿಣಾಮ, ಸಂಪನ್ಮೂಲಗಳು, ಸಮರ್ಥನೀಯತೆ ಮತ್ತು ಸಂಭಾವ್ಯ ಅನಾನುಕೂಲತೆಗಳನ್ನು ಒಳಗೊಂಡ ಸಮಗ್ರ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಒದಗಿಸಬಲ್ಲೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?"
      }
    }
  },
  te: {
    translation: {
      // Home Page
      title: "AI విశ్లేషణ సహాయకుడు",
      subtitle: "మీ తెలివైన విశ్లేషణ భాగస్వామి",
      description: "మా అధునాతన AI సహాయకుడుతో సమగ్ర విశ్లేషణను అనుభవించండి. న్యాయమైన అంశాలు, ప్రభావం, వనరులు, స్థిరత్వం మరియు సంభావ్య ప్రతికూలతలపై వివరణాత్మక అంతర్దృష్టులను పొందండి.",
      startChatting: "విశ్లేషణ ప్రారంభించండి",
      features: {
        title: "విశ్లేషణ లక్షణాలు",
        intelligent: {
          title: "సమగ్ర విశ్లేషణ",
          description: "న్యాయమైన అంశాలు, ప్రభావం, వనరులు మరియు స్థిరత్వాన్ని కలిగి ఉన్న వివరణాత్మక విశ్లేషణను పొందండి"
        },
        multilingual: {
          title: "బహుభాషా మద్దతు",
          description: "తమిళం, ఇంగ్లీష్, కన్నడ మరియు తెలుగులో నిజ-సమయ అనువాదంతో విశ్లేషించండి"
        },
        realtime: {
          title: "తక్షణ అంతర్దృష్టులు",
          description: "నిర్మాణాత్మక అంతర్దృష్టులతో తక్షణ సమగ్ర విశ్లేషణను స్వీకరించండి"
        }
      },
      // Chat Interface
      chat: {
        title: "AI విశ్లేషణ సహాయకుడు",
        placeholder: "విశ్లేషణ కోసం మీ సందేశాన్ని టైప్ చేయండి...",
        send: "విశ్లేషించండి",
        typing: "AI విశ్లేషిస్తోంది...",
        newChat: "కొత్త విశ్లేషణ",
        backToHome: "హోమ్‌కు తిరిగి వెళ్ళండి",
        language: "భాష",
        welcome: "నమస్కారం! నేను మీ AI విశ్లేషణ సహాయకుడను. న్యాయమైన అంశాలు, ప్రభావం, వనరులు, స్థిరత్వం మరియు సంభావ్య ప్రతికూలతలను కలిగి ఉన్న సమగ్ర విశ్లేషణను అందించగలను. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?"
      }
    }
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;