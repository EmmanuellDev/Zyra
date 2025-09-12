# AI Analysis Backend

A Flask-based AI backend that provides comprehensive analysis capabilities including fairness, impact, resource, sustainability analysis, and disadvantages identification. Supports multiple languages including Tamil, English, Kannada, and Telugu.

## 🚀 Features

### 📊 Analysis Capabilities
- **Fairness Analysis**: Evaluates equity, bias, and fair treatment aspects
- **Impact Analysis**: Assesses positive and negative impacts on stakeholders
- **Resource Analysis**: Examines resource requirements and utilization
- **Sustainability Analysis**: Analyzes environmental, economic, and social sustainability
- **Disadvantages Identification**: Identifies potential risks and drawbacks

### 🌍 Multi-language Support
- **Tamil (ta)**: தமிழ் - Complete analysis in Tamil
- **English (en)**: Full English analysis
- **Kannada (kn)**: ಕನ್ನಡ - Comprehensive Kannada support
- **Telugu (te)**: తెలుగు - Complete Telugu analysis

### 🔧 Technical Features
- **Flask Framework**: Lightweight and scalable web framework
- **Groq Integration**: Fast AI inference with Groq's Llama models
- **Language Detection**: Automatic language detection for input text
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Fallback Analysis**: Template-based analysis when external APIs unavailable
- **Structured Responses**: Consistent JSON response format
- **Error Handling**: Comprehensive error handling and logging

## 📁 Project Structure

```
ai-backend/
├── app.py              # Main Flask application
├── .env               # Environment configuration
├── requirements.txt   # Python dependencies
└── README.md         # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- pip install -r requirements.txt

### Installation

1. **Navigate to the backend directory**:
   ```bash
   cd ai-backend
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   - Copy `.env` file and update with your API keys
   - For Groq integration, add your `GROQ_API_KEY`
   - Other APIs (Google, Hugging Face) are optional

5. **Run the server**:
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## 🔧 API Endpoints

### Health Check
```http
GET /health
```
Returns server status and supported languages.

### Chat Endpoint
```http
POST /chat
Content-Type: application/json

{
  "message": "Your message here",
  "language": "en"  // Optional: en, ta, kn, te, es, fr, de
}
```

### Analysis Endpoint
```http
POST /analyze
Content-Type: application/json

{
  "message": "Text to analyze",
  "language": "en"  // Optional language preference
}
```

### Supported Languages
```http
GET /languages
```
Returns list of all supported languages.

## 📊 Response Format

### Chat Response
```json
{
  "success": true,
  "response": "AI response text",
  "detailed_analysis": {
    "fairness_analysis": "...",
    "impact_analysis": "...",
    "resource_analysis": "...",
    "sustainability_analysis": "...",
    "disadvantages": "...",
    "language": "en",
    "confidence_score": 0.9,
    "timestamp": "2025-09-12T10:30:00"
  },
  "language": "en"
}
```

### Analysis Response
```json
{
  "success": true,
  "analysis": {
    "fairness_analysis": "Detailed fairness evaluation...",
    "impact_analysis": "Comprehensive impact assessment...",
    "resource_analysis": "Resource utilization analysis...", 
    "sustainability_analysis": "Sustainability implications...",
    "disadvantages": "Potential risks and drawbacks...",
    "language": "en",
    "confidence_score": 0.9,
    "timestamp": "2025-09-12T10:30:00"
  }
}
```

## 🌟 Usage Examples

### Basic Chat
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the implications of renewable energy adoption?", "language": "en"}'
```

### Tamil Analysis
```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "புதுப்பிக்கத்தக்க ஆற்றல் பற்றி பகுப்பாய்வு செய்யுங்கள்", "language": "ta"}'
```

### Kannada Analysis
```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "ನವೀಕರಿಸಬಹುದಾದ ಶಕ್ತಿಯ ಬಗ್ಗೆ ವಿಶ್ಲೇಷಿಸಿ", "language": "kn"}'
```

## ⚙️ Configuration

### Environment Variables
- `GROQ_API_KEY`: Groq API key for enhanced analysis
- `PORT`: Server port (default: 5000)
- `DEBUG`: Debug mode (default: True)
- `CORS_ORIGINS`: Allowed CORS origins

### Language Support
The system automatically detects input language but you can specify:
- `en`: English
- `ta`: Tamil (தமிழ்)
- `kn`: Kannada (ಕನ್ನಡ)
- `te`: Telugu (తెలుగు)












































































































































## 🔒 Security Features
- Input validation and sanitization
- Rate limiting configuration
- CORS protection
- Error handling without exposing internal details
- Environment-based configuration

## 🚀 Deployment

### Production Deployment
1. Use `gunicorn` for production:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. Set environment variables:
   ```bash
   export DEBUG=False
   export GROQ_API_KEY=your_key_here
   ```

### Docker Deployment
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the React TypeScript frontend. Make sure:

1. Frontend makes requests to `http://localhost:5000`
2. CORS is properly configured
3. Error handling is implemented on frontend
4. Language preferences are passed correctly

## 📝 Development Notes

- Uses Flask for lightweight, fast development
- Implements fallback analysis when external APIs unavailable
- Supports multiple AI providers (Groq, Google, Hugging Face)
- Language detection using `langdetect` library
- Structured logging for debugging and monitoring
- Modular design for easy extension

---

**Note**: This backend provides comprehensive analysis capabilities and can be extended with additional AI providers or analysis types as needed.