#!/usr/bin/env python3
"""
Test the AI suggestion and truthfulness analysis with a specific scenario
"""

import requests
import json
import time

def test_specific_scenario():
    """Test with the banking complaint scenario"""
    
    url = "http://localhost:5000/chat"
    payload = {
        "message": "I have not received the money in my account. My account number is 1234567890. My name is Ramesh Kumar. My address is 45 Green Park, New Delhi. Please check and let me know.",
        "language": "en"
    }
    
    try:
        print("🔄 Testing AI suggestion with banking complaint scenario...")
        print(f"📝 Input: {payload['message']}")
        print("\n" + "="*70)
        
        response = requests.post(url, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('success'):
                response_text = data.get('response', '')
                detailed_analysis = data.get('detailed_analysis', {})
                
                print("✅ Analysis Response:")
                print(response_text)
                print("\n" + "="*70)
                
                # Show detailed AI suggestion and truthfulness
                if detailed_analysis:
                    print("📊 DETAILED BREAKDOWN:")
                    print(f"🤖 AI Suggestion: {detailed_analysis.get('ai_suggestion', 'N/A')}")
                    print(f"📈 Truthfulness Score: {detailed_analysis.get('truthfulness_percentage', 'N/A')}%")
                    print(f"🎯 Confidence: {detailed_analysis.get('confidence_score', 'N/A')}")
                    print(f"🗣️ Language: {detailed_analysis.get('language', 'N/A')}")
                
            else:
                print(f"❌ API Error: {data.get('error', 'Unknown error')}")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Starting backend server first...")
        print("Please run: cd ai-backend && python app.py")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_specific_scenario()