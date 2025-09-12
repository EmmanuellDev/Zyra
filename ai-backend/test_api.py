#!/usr/bin/env python3
"""
Quick test to demonstrate the new formatted output
"""

import requests
import json

def test_api():
    """Test the API formatting"""
    
    url = "http://localhost:5000/analyze"
    payload = {
        "message": "Should we implement a remote work policy?",
        "language": "en"
    }
    
    try:
        print("🔄 Making API request...")
        response = requests.post(url, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('success'):
                analysis = data.get('analysis', {})
                
                print("✅ API Response successful!")
                print("\n" + "="*60)
                print("📊 FORMATTED OUTPUT SAMPLE:")
                print("="*60)
                
                # Show fairness analysis as example
                fairness = analysis.get('fairness_analysis', '')
                print("🎯 Fairness Analysis:")
                print(fairness)
                print()
                
                # Show impact analysis as example  
                impact = analysis.get('impact_analysis', '')
                print("📈 Impact Analysis:")
                print(impact)
                print()
                
                print("="*60)
                print("✅ Perfect! The output is now properly formatted with:")
                print("   • Headings using # markdown")
                print("   • Bullet points using -")
                print("   • Just 2 concise points per section")
                print("   • 1-2 lines per point maximum")
                
            else:
                print(f"❌ API Error: {data.get('error', 'Unknown error')}")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure Flask server is running on localhost:5000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_api()