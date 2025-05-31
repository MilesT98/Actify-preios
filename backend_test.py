import requests
import json
import time

# Base URL for the API
BASE_URL = "http://localhost:8001/api"

def test_health_endpoint():
    """Test the health endpoint"""
    print("\n=== Testing Health Endpoint ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    print("✅ Health endpoint test passed")

def test_user_registration():
    """Test user registration endpoint"""
    print("\n=== Testing User Registration ===")
    
    # Test data
    user_data = {
        "username": "testuser2",  # Using a different username to avoid conflicts
        "password": "password123",
        "email": "test2@example.com",
        "full_name": "Test User 2"
    }
    
    # Send registration request
    response = requests.post(f"{BASE_URL}/users", json=user_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test duplicate registration (should fail)
    print("\n--- Testing Duplicate Registration ---")
    response_duplicate = requests.post(f"{BASE_URL}/users", json=user_data)
    print(f"Status Code: {response_duplicate.status_code}")
    print(f"Response: {response_duplicate.json()}")
    
    assert response_duplicate.status_code == 400
    assert "already exists" in response_duplicate.json()["detail"]
    print("✅ Duplicate registration test passed")

def test_login_success():
    """Test successful login"""
    print("\n=== Testing Successful Login ===")
    
    # Test data
    login_data = {
        "username": "testuser",
        "password": "password123"
    }
    
    # Send login request
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    assert response.status_code == 200
    assert "session_id" in response.json()
    assert response.json()["message"] == "Login successful"
    assert response.json()["user"]["username"] == login_data["username"]
    print("✅ Successful login test passed")
    
    return response.json()["session_id"]

def test_login_failure():
    """Test login with invalid credentials"""
    print("\n=== Testing Failed Login ===")
    
    # Test with invalid password
    login_data_invalid_password = {
        "username": "testuser",
        "password": "wrongpassword"
    }
    
    response = requests.post(f"{BASE_URL}/login", json=login_data_invalid_password)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"]
    print("✅ Invalid password test passed")
    
    # Test with invalid username
    login_data_invalid_username = {
        "username": "nonexistentuser",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/login", json=login_data_invalid_username)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"]
    print("✅ Invalid username test passed")

def run_all_tests():
    """Run all authentication tests"""
    print("\n🔍 Starting Authentication Tests for ACTIFY Backend")
    print("=" * 50)
    
    try:
        # Test health endpoint
        test_health_endpoint()
        
        # Test user registration
        try:
            test_user_registration()
        except Exception as e:
            print(f"❌ User registration test failed: {str(e)}")
        
        # Test login success
        try:
            session_id = test_login_success()
            print(f"Session ID from successful login: {session_id}")
        except Exception as e:
            print(f"❌ Login success test failed: {str(e)}")
        
        # Test login failure
        try:
            test_login_failure()
        except Exception as e:
            print(f"❌ Login failure test failed: {str(e)}")
        
        print("\n✅ All tests completed")
        
    except Exception as e:
        print(f"\n❌ Error during testing: {str(e)}")

if __name__ == "__main__":
    run_all_tests()