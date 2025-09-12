#!/usr/bin/env python3
"""
Test script for Groq API integration
Run this to verify the backend is working correctly with Groq
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add current directory to path to import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app import AIAnalyzer
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("📝 Make sure you have installed all requirements:")
    print("   pip install -r requirements.txt")
    sys.exit(1)

def test_groq_integration():
    """Test the Groq API integration with a simple query"""
    
    # Check if API key is available
    groq_api_key = os.getenv('GROQ_API_KEY')
    if not groq_api_key:
        print("❌ GROQ_API_KEY not found in environment variables")
        print("Please add your Groq API key to the .env file:")
        print("GROQ_API_KEY=your_key_here")
        return False
    
    print("✅ Groq API key found")
    
    # Initialize analyzer
    analyzer = AIAnalyzer()
    
    # Test query
    test_query = "Should we implement a recycling program in our office?"
    print(f"\n🧪 Testing with query: '{test_query}'")
    print("🔄 Analyzing with Groq...")
    
    try:
        # Perform analysis
        result = analyzer.analyze(test_query, preferred_language='en')
        
        if result and hasattr(result, 'fairness_analysis'):
            print("✅ Analysis completed successfully!")
            print(f"📊 Language detected: {result.language}")
            print(f"🎯 Confidence score: {result.confidence_score}")
            
            # Show brief results
            print(f"\n📋 Sample output:")
            print(f"Fairness: {result.fairness_analysis[:100]}...")
            print(f"Impact: {result.impact_analysis[:100]}...")
            print(f"AI Suggestion: {result.ai_suggestion[:100]}...")
            print(f"🎯 Truthfulness: {result.truthfulness_percentage}%")
            
            return True
        else:
            print("❌ Analysis failed")
            print(f"Error: Invalid result format")
            return False
            
    except Exception as e:
        print(f"❌ Error during analysis: {str(e)}")
        return False

def main():
    """Main test function"""
    print("🚀 Testing Groq Integration for AI Analysis Backend")
    print("=" * 55)
    
    success = test_groq_integration()
    
    print("\n" + "=" * 55)
    if success:
        print("✅ All tests passed! Your backend is ready to use with Groq.")
        print("💡 You can now start the Flask server with: python app.py")
    else:
        print("❌ Tests failed. Please check your configuration.")
        print("📝 Make sure you have:")
        print("   1. Added GROQ_API_KEY to your .env file")
        print("   2. Installed all requirements: pip install -r requirements.txt")
    
    return success

if __name__ == "__main__":
    main()