#!/usr/bin/env python3
"""
Simple test script for CI/CD pipeline
Tests basic functionality of the prototype pollution CTF challenge
"""

import requests
import sys
import time

def test_basic_functionality():
    """Test basic application functionality"""
    base_url = "http://localhost:3206"
    
    try:
        # Test 1: Basic connectivity
        print("Testing basic connectivity...")
        response = requests.get(base_url, timeout=10)
        if response.status_code == 200:
            print("✓ Basic connectivity: OK")
        else:
            print(f"✗ Basic connectivity failed: {response.status_code}")
            return False
        
        # Test 2: Login functionality
        print("Testing login functionality...")
        login_data = {"username": "user1", "password": "password123"}
        response = requests.post(f"{base_url}/login", json=login_data, timeout=10)
        if response.status_code == 200:
            print("✓ Login functionality: OK")
        else:
            print(f"✗ Login failed: {response.status_code}")
            return False
        
        # Test 3: API documentation
        print("Testing API documentation...")
        response = requests.get(f"{base_url}/api-docs", timeout=10)
        if response.status_code == 200:
            print("✓ API documentation: OK")
        else:
            print(f"✗ API documentation failed: {response.status_code}")
            return False
        
        print("\n🎉 All basic tests passed!")
        return True
        
    except Exception as e:
        print(f"✗ Test failed with error: {e}")
        return False

if __name__ == "__main__":
    # Wait a bit for the application to start
    time.sleep(2)
    
    success = test_basic_functionality()
    sys.exit(0 if success else 1)
