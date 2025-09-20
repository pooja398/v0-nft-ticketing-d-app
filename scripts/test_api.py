#!/usr/bin/env python3
"""
Test script for the NFT Ticketing API
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_api():
    """Test the API endpoints"""
    print("🧪 Testing NFT Ticketing API")
    print("=" * 50)
    
    # Test health check
    print("1. Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    if response.status_code == 200:
        print("✅ Health check passed")
    else:
        print("❌ Health check failed")
        return
    
    # Test events endpoint
    print("\n2. Testing events endpoint...")
    response = requests.get(f"{BASE_URL}/events")
    if response.status_code == 200:
        events = response.json()["events"]
        print(f"✅ Found {len(events)} events")
        for event in events[:2]:  # Show first 2 events
            print(f"   - {event['name']} on {event['date']}")
    else:
        print("❌ Events endpoint failed")
        return
    
    # Test specific event
    print("\n3. Testing specific event...")
    response = requests.get(f"{BASE_URL}/events/1")
    if response.status_code == 200:
        event = response.json()
        print(f"✅ Event details: {event['name']}")
        print(f"   Price: {event['price']}, Capacity: {event['capacity']}")
    else:
        print("❌ Specific event endpoint failed")
    
    # Test nonce generation
    print("\n4. Testing nonce generation...")
    test_address = "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c"
    response = requests.get(f"{BASE_URL}/auth/nonce", params={"address": test_address})
    if response.status_code == 200:
        nonce_data = response.json()
        print(f"✅ Nonce generated: {nonce_data['nonce'][:16]}...")
    else:
        print("❌ Nonce generation failed")
    
    # Test ticket verification (should fail for non-existent ticket)
    print("\n5. Testing ticket verification...")
    response = requests.get(f"{BASE_URL}/verify/999999")
    if response.status_code == 200:
        verification = response.json()
        if not verification["is_valid"]:
            print("✅ Verification correctly returned invalid for non-existent ticket")
        else:
            print("❌ Verification should have failed for non-existent ticket")
    else:
        print("❌ Verification endpoint failed")
    
    # Test verification page
    print("\n6. Testing verification HTML page...")
    response = requests.get(f"{BASE_URL}/verify/999999/page")
    if response.status_code == 200 and "Invalid Ticket" in response.text:
        print("✅ Verification HTML page working")
    else:
        print("❌ Verification HTML page failed")
    
    print("\n🎉 API testing completed!")
    print("\nTo test authenticated endpoints:")
    print("1. Connect your wallet in the frontend")
    print("2. Get a JWT token through the auth flow")
    print("3. Use the token in Authorization header")

if __name__ == "__main__":
    try:
        test_api()
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server")
        print("Make sure the server is running at http://localhost:8000")
        print("Run: cd backend && python main.py")
