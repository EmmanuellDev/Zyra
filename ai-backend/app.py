import os
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq
from langdetect import detect

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=getattr(logging, os.getenv('LOG_LEVEL', 'INFO')),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
cors_origins = os.getenv('CORS_ORIGINS', '*').split(',')
CORS(app, origins=cors_origins, methods=['GET', 'POST', 'OPTIONS'], allow_headers=['Content-Type'])

# Configure Groq client
groq_client = None
if os.getenv('GROQ_API_KEY'):
    groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

@dataclass
class AnalysisResult:
    """Data structure for AI analysis results"""
    fairness_analysis: str
    impact_analysis: str
    resource_analysis: str
    sustainability_analysis: str
    disadvantages: str
    ai_suggestion: str
    truthfulness_percentage: int
    language: str
    confidence_score: float
    timestamp: str

class AIAnalyzer:
    """AI Analysis Engine with multilingual support"""
    
    def __init__(self):
        self.supported_languages = {
            'en': 'English',
            'ta': 'Tamil',
            'kn': 'Kannada', 
            'te': 'Telugu',
           
        }
        
        self.language_prompts = {
            'en': {
                'fairness': "Analyze the fairness aspects of",
                'impact': "Evaluate the potential impact of",
                'resource': "Assess the resource requirements and utilization for",
                'sustainability': "Examine the sustainability implications of",
                'disadvantages': "Identify potential disadvantages and risks of"
            },
            'ta': {
                'fairness': "இதன் நியாயத்தன்மையை பகுப்பாய்வு செய்யவும்",
                'impact': "இதன் சாத்தியமான தாக்கத்தை மதிப்பிடவும்",
                'resource': "இதற்கான வளத் தேவைகளை மதிப்பிடவும்",
                'sustainability': "இதன் நிலைத்தன்மையை ஆராயவும்",
                'disadvantages': "இதன் தீமைகளை அடையாளம் காணவும்"
            },
            'kn': {
                'fairness': "ಇದರ ನ್ಯಾಯಸಮ್ಮತತೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
                'impact': "ಇದರ ಸಂಭಾವ್ಯ ಪ್ರಭಾವವನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ",
                'resource': "ಇದಕ್ಕೆ ಬೇಕಾದ ಸಂಪನ್ಮೂಲಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ",
                'sustainability': "ಇದರ ಸಮರ್ಥನೀಯತೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ",
                'disadvantages': "ಇದರ ಅನಾನುಕೂಲತೆಗಳನ್ನು ಗುರುತಿಸಿ"
            },
            'te': {
                'fairness': "దీని న్యాయమైన అంశాలను విశ్లేషించండి",
                'impact': "దీని సంభావ్య ప్రభావాన్ని అంచనా వేయండి",
                'resource': "దీనికి అవసరమైన వనరులను అంచనా వేయండి",
                'sustainability': "దీని స్థిరత్వ అంశాలను పరిశీలించండి",
                'disadvantages': "దీని ప్రతికూల అంశాలను గుర్తించండి"
            }
        }

    def detect_language(self, text: str) -> str:
        """Detect the language of the input text"""
        try:
            detected = detect(text)
            return detected if detected in self.supported_languages else 'en'
        except:
            return 'en'

    def analyze_with_groq(self, user_input: str, language: str) -> AnalysisResult:
        """Perform analysis using Groq API"""
        try:
            prompts = self.language_prompts.get(language, self.language_prompts['en'])
            
            # Create structured analysis prompts with formatting requirements
            system_prompt = f"""You are an expert analyst providing insights in {self.supported_languages[language]}. 
            IMPORTANT FORMATTING RULES:
            - Use proper markdown formatting with # for main heading
            - Use bullet points (-) for each point
            - Provide EXACTLY 2 bullet points only
            - Keep each bullet point to 1-2 lines maximum
            - Use clear, concise language
            - No long paragraphs or extensive explanations"""
            
            analysis_prompts = {
                'fairness': f"{prompts['fairness']} '{user_input}'. Format as:\n# Fairness Analysis\n- [First key fairness point in 1-2 lines]\n- [Second key fairness point in 1-2 lines]",
                'impact': f"{prompts['impact']} '{user_input}'. Format as:\n# Impact Analysis\n- [First key impact point in 1-2 lines]\n- [Second key impact point in 1-2 lines]",
                'resource': f"{prompts['resource']} '{user_input}'. Format as:\n# Resource Analysis\n- [First key resource point in 1-2 lines]\n- [Second key resource point in 1-2 lines]",
                'sustainability': f"{prompts['sustainability']} '{user_input}'. Format as:\n# Sustainability Analysis\n- [First key sustainability point in 1-2 lines]\n- [Second key sustainability point in 1-2 lines]",
                'disadvantages': f"{prompts['disadvantages']} '{user_input}'. Format as:\n# Potential Disadvantages\n- [First key disadvantage in 1-2 lines]\n- [Second key disadvantage in 1-2 lines]",
                'ai_suggestion': f"Analyze the truthfulness and provide AI suggestion for: '{user_input}'. Format as:\n# AI Suggestion\n- [Truthfulness assessment and credibility factors in 1-2 lines]\n- [Recommended actions or next steps in 1-2 lines]"
            }
            
            results = {}
            truthfulness_percentage = 50  # Default
            
            for analysis_type, prompt in analysis_prompts.items():
                if analysis_type == 'ai_suggestion':
                    # Special handling for AI suggestion with truthfulness analysis
                    truthfulness_prompt = f"""Analyze the truthfulness of this statement: '{user_input}'. 
                    Consider factors like:
                    - Consistency of information provided
                    - Presence of verifiable details  
                    - Plausibility of the scenario
                    - Potential red flags or inconsistencies
                    
                    Provide a truthfulness percentage (0-100) and brief reasoning. Format as:
                    # AI Suggestion
                    - [Brief truthfulness assessment in 1-2 lines]
                    - [Recommended next steps or actions in 1-2 lines]
                    
                    Also provide a single number (0-100) representing truthfulness percentage at the end: TRUTHFULNESS: XX"""
                    
                    response = groq_client.chat.completions.create(
                        model=os.getenv('DEFAULT_MODEL', 'llama3-8b-8192'),
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": truthfulness_prompt}
                        ],
                        temperature=float(os.getenv('TEMPERATURE', 0.3)),
                        max_tokens=int(os.getenv('MAX_TOKENS', 200))
                    )
                    content = response.choices[0].message.content.strip()
                    
                    # Extract truthfulness percentage
                    if "TRUTHFULNESS:" in content:
                        try:
                            percentage_part = content.split("TRUTHFULNESS:")[-1].strip()
                            truthfulness_percentage = int(percentage_part.split()[0])
                            # Remove the percentage line from the content
                            content = content.split("TRUTHFULNESS:")[0].strip()
                        except:
                            truthfulness_percentage = 50  # Default if parsing fails
                    
                    results[analysis_type] = content
                else:
                    response = groq_client.chat.completions.create(
                        model=os.getenv('DEFAULT_MODEL', 'llama3-8b-8192'),
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt}
                        ],
                        temperature=float(os.getenv('TEMPERATURE', 0.3)),
                        max_tokens=int(os.getenv('MAX_TOKENS', 150))
                    )
                    results[analysis_type] = response.choices[0].message.content.strip()
            
            return AnalysisResult(
                fairness_analysis=results['fairness'],
                impact_analysis=results['impact'],
                resource_analysis=results['resource'],
                sustainability_analysis=results['sustainability'],
                disadvantages=results['disadvantages'],
                ai_suggestion=results['ai_suggestion'],
                truthfulness_percentage=truthfulness_percentage,
                language=language,
                confidence_score=0.9,
                timestamp=datetime.now().isoformat()
            )
            
        except Exception as e:
            logger.error(f"Groq analysis failed: {str(e)}")
            return self.analyze_with_fallback(user_input, language)

    def analyze_with_fallback(self, user_input: str, language: str) -> AnalysisResult:
        """Fallback analysis when external APIs are not available"""
        
        # Predefined analysis templates for different topics
        analysis_templates = {
            'en': {
                'fairness': f"# Fairness Analysis\n- Equal access and unbiased treatment for all stakeholders involved\n- Transparent decision-making processes with accountability measures",
                'impact': f"# Impact Analysis\n- Positive effects include improved efficiency and innovation potential\n- Challenges may involve adaptation costs and potential disruptions",
                'resource': f"# Resource Analysis\n- Financial investment requirements and human capital needs assessment\n- Infrastructure demands with focus on cost-effectiveness and optimization",
                'sustainability': f"# Sustainability Analysis\n- Environmental responsibility with long-term viability considerations\n- Economic stability balanced with social acceptance factors",
                'disadvantages': f"# Potential Disadvantages\n- Implementation complexity and resistance to change challenges\n- Unintended consequences and resource constraint limitations",
                'ai_suggestion': f"# AI Suggestion\n- The provided information appears to have moderate credibility based on available context\n- Recommend verification through additional sources and systematic fact-checking"
            },
            'ta': {
                'fairness': f"# நியாயமான அம்சங்கள் ஆய்வு\n- அனைத்து பங்குதாரர்களுக்கும் சமமான அணுகல் மற்றும் பாரபட்சமற்ற நடத்தை\n- வெளிப்படையான முடிவெடுக்கும் செயல்முறைகளுடன் பொறுப்புணர்வு நடவடிக்கைகள்",
                'impact': f"# தாக்க ஆய்வு\n- நேர்மறையான விளைவுகளில் மேம்பட்ட செயல்திறன் மற்றும் புதுமை சாத்தியம்\n- சவால்களில் தழுவல் செலவுகள் மற்றும் சாத்தியமான குழப்பங்கள் அடங்கும்",
                'resource': f"# வள ஆய்வு\n- நிதி முதலீட்டு தேவைகள் மற்றும் மனித மூலதன தேவைகள் மதிப்பீடு\n- செலவு-செயல்திறன் மற்றும் உகந்த பயன்பாட்டில் கவனம் செலுத்தும் கட்டமைப்பு தேவைகள்",
                'sustainability': f"# நிலைத்தன்மை ஆய்வு\n- நீண்டகால நம்பகத்தன்மை கருத்துகளுடன் சுற்றுச்சூழல் பொறுப்பு\n- சமூக ஏற்றுக்கொள்ளல் காரணிகளுடன் சமநிலையான பொருளாதார ஸ்திரத்தன்மை",
                'disadvantages': f"# சாத்தியமான தீமைகள்\n- செயல்படுத்தல் சிக்கலானது மற்றும் மாற்றத்திற்கு எதிர்ப்பு சவால்கள்\n- எதிர்பாராத விளைவுகள் மற்றும் வள கட்டுப்பாடு வரம்புகள்",
                'ai_suggestion': f"# AI பரிந்துரை\n- வழங்கப்பட்ட தகவல் மிதமான நம்பகத்தன்மை கொண்டதாக தோன்றுகிறது\n- கூடுதல் ஆதாரங்கள் மூலம் சரிபார்ப்பு மற்றும் முறையான உண்மை சரிபார்ப்பு பரிந்துரைக்கப்படுகிறது"
            },
            'kn': {
                'fairness': f"# ನ್ಯಾಯಸಮ್ಮತತೆ ವಿಶ್ಲೇಷಣೆ\n- ಎಲ್ಲಾ ಪಾಲುದಾರರಿಗೆ ಸಮಾನ ಪ್ರವೇಶ ಮತ್ತು ಪಕ್ಷಪಾತರಹಿತ ವರ್ತನೆ\n- ಹೊಣೆಗಾರಿಕೆ ಕ್ರಮಗಳೊಂದಿಗೆ ಪಾರದರ್ಶಕ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವ ಪ್ರಕ್ರಿಯೆಗಳು",
                'impact': f"# ಪರಿಣಾಮ ವಿಶ್ಲೇಷಣೆ\n- ಧನಾತ್ಮಕ ಪರಿಣಾಮಗಳಲ್ಲಿ ಸುಧಾರಿತ ದಕ್ಷತೆ ಮತ್ತು ನಾವೀನ್ಯತೆ ಸಾಮರ್ಥ್ಯ\n- ಸವಾಲುಗಳಲ್ಲಿ ಹೊಂದಾಣಿಕೆ ವೆಚ್ಚಗಳು ಮತ್ತು ಸಂಭಾವ್ಯ ಅಡಚಣೆಗಳು ಸೇರಿರಬಹುದು",
                'resource': f"# ಸಂಪನ್ಮೂಲ ವಿಶ್ಲೇಷಣೆ\n- ಹಣಕಾಸಿನ ಹೂಡಿಕೆ ಅವಶ್ಯಕತೆಗಳು ಮತ್ತು ಮಾನವ ಬಂಡವಾಳ ಅಗತ್ಯಗಳ ಮೌಲ್ಯಮಾಪನ\n- ವೆಚ್ಚ-ಪರಿಣಾಮಕಾರಿತ್ವ ಮತ್ತು ಅನುಕೂಲತೆಯ ಮೇಲೆ ಗಮನ ಹರಿಸುವ ಮೂಲಸೌಕರ್ಯ ಬೇಡಿಕೆಗಳು",
                'sustainability': f"# ಸಮರ್ಥನೀಯತೆ ವಿಶ್ಲೇಷಣೆ\n- ದೀರ್ಘಕಾಲೀನ ಕಾರ್ಯಸಾಧ್ಯತೆ ಪರಿಗಣನೆಗಳೊಂದಿಗೆ ಪರಿಸರ ಜವಾಬ್ದಾರಿ\n- ಸಾಮಾಜಿಕ ಸ್ವೀಕಾರ ಅಂಶಗಳೊಂದಿಗೆ ಸಮತೋಲಿತ ಆರ್ಥಿಕ ಸ್ಥಿರತೆ",
                'disadvantages': f"# ಸಂಭಾವ್ಯ ಅನಾನುಕೂಲತೆಗಳು\n- ಅನುಷ್ಠಾನದ ಸಂಕೀರ್ಣತೆ ಮತ್ತು ಬದಲಾವಣೆಗೆ ಪ್ರತಿರೋಧ ಸವಾಲುಗಳು\n- ಅನಪೇಕ್ಷಿತ ಪರಿಣಾಮಗಳು ಮತ್ತು ಸಂಪನ್ಮೂಲ ನಿರ್ಬಂಧ ಮಿತಿಗಳು",
                'ai_suggestion': f"# AI ಸಲಹೆ\n- ಒದಗಿಸಿದ ಮಾಹಿತಿಯು ಮಧ್ಯಮ ವಿಶ್ವಾಸಾರ್ಹತೆಯನ್ನು ಹೊಂದಿರುವಂತೆ ಕಂಡುಬರುತ್ತದೆ\n- ಹೆಚ್ಚುವರಿ ಮೂಲಗಳ ಮೂಲಕ ಪರಿಶೀಲನೆ ಮತ್ತು ವ್ಯವಸ್ಥಿತ ಸತ್ಯ ಪರೀಕ್ಷೆಯನ್ನು ಶಿಫಾರಸು ಮಾಡಲಾಗುತ್ತದೆ"
            },
            'te': {
                'fairness': f"# న్యాయమైన అంశాల విశ్లేషణ\n- అన్ని వాటాదారులకు సమాన ప్రవేశం మరియు పక్షపాతం లేని వ్యవహారం\n- జవాబుదారీతనం చర్యలతో పారదర్శక నిర్ణయాధిక ప్రక్రియలు",
                'impact': f"# ప్రభావ విశ్లేషణ\n- సానుకూల ప్రభావాలలో మెరుగైన సామర్థ్యం మరియు ఆవిష్కరణ సంభావ్యత\n- సవాళ్లలో అనుసరణ ఖర్చులు మరియు సంభావ్య అంతరాయాలు ఉండవచ్చు",
                'resource': f"# వనరుల విశ్లేషణ\n- ఆర్థిక పెట్టుబడి అవసరాలు మరియు మానవ మూలధన అవసరాల అంచనా\n- వ్యయ-ప్రభావం మరియు అనుకూలీకరణపై దృష్టి పెట్టే మౌలిక సదుపాయాల డిమాండ్లు",
                'sustainability': f"# స్థిరత్వ విశ్లేషణ\n- దీర్ఘకాలిక మనుగడ పరిగణనలతో పర్యావరణ బాధ్యత\n- సామాజిక ఆమోదం కారకాలతో సమతుల్య ఆర్థిక స్థిరత్వం",
                'disadvantages': f"# సంభావ్య ప్రతికూలతలు\n- అమలు సంక్లిష్టత మరియు మార్పుకు ప్రతిఘటన సవాళ్లు\n- అనాలోచిత పరిణామాలు మరియు వనరుల పరిమితి పరిమితులు",
                'ai_suggestion': f"# AI సూచన\n- అందించిన సమాచారం మధ్యస్థ విశ్వసనీయత కలిగి ఉన్నట్లు కనిపిస్తుంది\n- అదనపు మూలాల ద్వారా ధ్రువీకరణ మరియు వ్యవస్థాపిత వాస్తవ తనిఖీని సిఫార్సు చేస్తున్నాము"
            }
        }
        
        lang_templates = analysis_templates.get(language, analysis_templates['en'])
        
        return AnalysisResult(
            fairness_analysis=lang_templates['fairness'],
            impact_analysis=lang_templates['impact'],
            resource_analysis=lang_templates['resource'],
            sustainability_analysis=lang_templates['sustainability'],
            disadvantages=lang_templates['disadvantages'],
            ai_suggestion=lang_templates['ai_suggestion'],
            truthfulness_percentage=75,  # Default percentage for fallback
            language=language,
            confidence_score=0.8,
            timestamp=datetime.now().isoformat()
        )

    def analyze(self, user_input: str, preferred_language: Optional[str] = None) -> AnalysisResult:
        """Main analysis method"""
        # Detect or use preferred language
        if preferred_language and preferred_language in self.supported_languages:
            language = preferred_language
        else:
            language = self.detect_language(user_input)
        
        logger.info(f"Analyzing input in {language}: {user_input[:50]}...")
        
        # Try Groq first, fallback to template-based analysis
        if os.getenv('GROQ_API_KEY') and groq_client:
            try:
                return self.analyze_with_groq(user_input, language)
            except Exception as e:
                logger.warning(f"Groq analysis failed, using fallback: {str(e)}")
                return self.analyze_with_fallback(user_input, language)
        else:
            logger.info("Using fallback analysis (no Groq API key)")
            return self.analyze_with_fallback(user_input, language)

# Initialize analyzer
analyzer = AIAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'supported_languages': list(analyzer.supported_languages.keys())
    })

@app.route('/analyze', methods=['POST'])
def analyze_text():
    """Main analysis endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_input = data['message'].strip()
        preferred_language = data.get('language', None)
        
        if not user_input:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Perform analysis
        result = analyzer.analyze(user_input, preferred_language)
        
        # Convert to dict for JSON response
        response_data = asdict(result)
        
        logger.info(f"Analysis completed for language: {result.language}")
        
        return jsonify({
            'success': True,
            'analysis': response_data
        })
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error occurred'
        }), 500

@app.route('/languages', methods=['GET'])
def get_supported_languages():
    """Get list of supported languages"""
    return jsonify({
        'supported_languages': analyzer.supported_languages
    })

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    """Simple chat endpoint for basic conversations"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_input = data['message'].strip()
        language = data.get('language', 'en')
        
        if not user_input:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # For simple chat, provide a basic response
        if user_input.lower() in ['hello', 'hi', 'hey', 'வணக்கம்', 'ನಮಸ್ಕಾರ', 'నమస్కారం']:
            responses = {
                'en': "Hello! I'm an AI assistant that can analyze various aspects of your questions including fairness, impact, resources, sustainability, and potential disadvantages. How can I help you today?",
                'ta': "வணக்கம்! நான் உங்கள் கேள்விகளின் நியாயத்தன்மை, தாக்கம், வளங்கள், நிலைத்தன்மை மற்றும் சாத்தியமான தீமைகள் உட்பட பல்வேறு அம்சங்களை பகுப்பாய்வு செய்யக்கூடிய AI உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
                'kn': "ನಮಸ್ಕಾರ! ನಾನು ನ್ಯಾಯಸಮ್ಮತತೆ, ಪರಿಣಾಮ, ಸಂಪನ್ಮೂಲಗಳು, ಸಮರ್ಥನೀಯತೆ ಮತ್ತು ಸಂಭಾವ್ಯ ಅನಾನುಕೂಲತೆಗಳು ಸೇರಿದಂತೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳ ವಿವಿಧ ಅಂಶಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಬಲ್ಲ AI ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
                'te': "నమస్కారం! నేను న్యాయమైన అంశాలు, ప్రభావం, వనరులు, స్థిరత్వం మరియు సంభావ్య ప్రతికూలతలతో సహా మీ ప్రశ్నల యొక్క వివిధ అంశాలను విశ్లేషించగల AI సహాయకుడను. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?"
            }
            
            return jsonify({
                'success': True,
                'response': responses.get(language, responses['en']),
                'language': language
            })
        
        # For other messages, perform full analysis
        result = analyzer.analyze(user_input, language)
        
        # Format as a conversational response
        response_text = f"""Based on your message about "{user_input}", here's my comprehensive analysis:

🔍 **Fairness Analysis**: {result.fairness_analysis}

📊 **Impact Analysis**: {result.impact_analysis}

💰 **Resource Analysis**: {result.resource_analysis}

🌱 **Sustainability Analysis**: {result.sustainability_analysis}

⚠️ **Potential Disadvantages**: {result.disadvantages}

🤖 **AI Suggestion**: {result.ai_suggestion}

📈 **Truthfulness Assessment**: {result.truthfulness_percentage}% credibility based on available information

Would you like me to elaborate on any specific aspect?"""
        
        return jsonify({
            'success': True,
            'response': response_text,
            'detailed_analysis': asdict(result),
            'language': result.language
        })
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error occurred'
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    debug = os.getenv('DEBUG', 'True').lower() == 'true'
    
    logger.info(f"Starting AI Analysis Server on {host}:{port}")
    logger.info(f"Supported languages: {list(analyzer.supported_languages.keys())}")
    logger.info(f"Groq API configured: {'Yes' if groq_client else 'No (using fallback analysis)'}")
    
    app.run(host=host, port=port, debug=debug)