import requests
import json
import time
import random
import string
from datetime import datetime

# Base URL for the API - using the URL from frontend/.env
BASE_URL = "https://afe3c817-c7e0-4fb6-9826-96c72e5a1209.preview.emergentagent.com/api"

# Generate unique usernames to avoid conflicts
def generate_unique_username(prefix="testuser"):
    timestamp = int(time.time())
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
    return f"{prefix}_{timestamp}_{random_suffix}"

# Test users
TEST_USER1 = {
    "username": generate_unique_username("testuser1"),
    "password": "password123",
    "email": f"{generate_unique_username('testuser1')}@example.com",
    "full_name": "Test User 1"
}

TEST_USER2 = {
    "username": generate_unique_username("testuser2"),
    "password": "password123",
    "email": f"{generate_unique_username('testuser2')}@example.com",
    "full_name": "Test User 2"
}

def test_health_endpoint():
    """Test the health endpoint"""
    print("\n=== Testing Health Endpoint ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    print("✅ Health endpoint test passed")
    return True

def test_user_registration(user_data):
    """Test user registration endpoint"""
    print(f"\n=== Testing User Registration for {user_data['username']} ===")
    
    # Send registration request
    response = requests.post(f"{BASE_URL}/users", json=user_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["username"] == user_data["username"]
    print(f"✅ User registration test passed for {user_data['username']}")
    
    return response.json()

def test_login_success(username, password):
    """Test successful login"""
    print(f"\n=== Testing Successful Login for {username} ===")
    
    # Test data
    login_data = {
        "username": username,
        "password": password
    }
    
    # Send login request
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    assert response.status_code == 200
    assert "session_id" in response.json()
    assert response.json()["message"] == "Login successful"
    assert response.json()["user"]["username"] == login_data["username"]
    print(f"✅ Successful login test passed for {username}")
    
    return response.json()

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
    
    return True

def test_user_search(query):
    """Test user search endpoint"""
    print(f"\n=== Testing User Search for '{query}' ===")
    response = requests.get(f"{BASE_URL}/users/search?q={query}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    assert response.status_code == 200
    print("✅ User search test passed")
    return response.json()

def test_follow_user(user_id, follower_id):
    """Test follow user endpoint"""
    print(f"\n=== Testing Follow User (user_id: {user_id}, follower_id: {follower_id}) ===")
    data = {"follower_id": follower_id}
    response = requests.post(f"{BASE_URL}/users/{user_id}/follow", data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    assert response.status_code == 200
    assert response.json()["success"] == True
    print("✅ Follow user test passed")
    return response.json()

def test_unfollow_user(user_id, follower_id):
    """Test unfollow user endpoint"""
    print(f"\n=== Testing Unfollow User (user_id: {user_id}, follower_id: {follower_id}) ===")
    data = {"follower_id": follower_id}
    response = requests.post(f"{BASE_URL}/users/{user_id}/unfollow", data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    assert response.status_code == 200
    assert response.json()["success"] == True
    print("✅ Unfollow user test passed")
    return response.json()

def test_get_following(user_id):
    """Test get following endpoint"""
    print(f"\n=== Testing Get Following for user_id: {user_id} ===")
    response = requests.get(f"{BASE_URL}/users/{user_id}/following")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    assert response.status_code == 200
    print("✅ Get following test passed")
    return response.json()

def test_get_followers(user_id):
    """Test get followers endpoint"""
    print(f"\n=== Testing Get Followers for user_id: {user_id} ===")
    response = requests.get(f"{BASE_URL}/users/{user_id}/followers")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    assert response.status_code == 200
    print("✅ Get followers test passed")
    return response.json()

def test_follow_status(user_id, target_user_id):
    """Test follow status endpoint"""
    print(f"\n=== Testing Follow Status (user_id: {user_id}, target_user_id: {target_user_id}) ===")
    response = requests.get(f"{BASE_URL}/users/{user_id}/follow-status/{target_user_id}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    assert response.status_code == 200
    print("✅ Follow status test passed")
    return response.json()

def test_daily_global_activity():
    """Test daily global activity endpoint"""
    print("\n=== Testing Daily Global Activity ===")
    response = requests.get(f"{BASE_URL}/daily-global-activity/current")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    assert response.status_code == 200
    print("✅ Daily global activity test passed")
    return response.json()

def test_initialize_activities():
    """Test initialize activities endpoint"""
    print("\n=== Testing Initialize Activities ===")
    response = requests.post(f"{BASE_URL}/admin/initialize-activities")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    assert response.status_code == 200
    assert response.json()["success"] == True
    print("✅ Initialize activities test passed")
    return response.json()

def run_all_tests():
    """Run all tests for ACTIFY Backend"""
    print("\n🔍 Starting Tests for ACTIFY Backend")
    print("=" * 80)
    
    results = {
        "health_endpoint": False,
        "user_registration": False,
        "user_login": False,
        "user_search": False,
        "follow_functionality": False,
        "daily_global_activity": False,
        "initialize_activities": False
    }
    
    try:
        # Test health endpoint
        results["health_endpoint"] = test_health_endpoint()
        
        # Test user registration and login
        try:
            user1 = test_user_registration(TEST_USER1)
            user2 = test_user_registration(TEST_USER2)
            results["user_registration"] = True
            
            user1_login = test_login_success(TEST_USER1["username"], TEST_USER1["password"])
            user2_login = test_login_success(TEST_USER2["username"], TEST_USER2["password"])
            results["user_login"] = True
            
            user1_id = user1["id"]
            user2_id = user2["id"]
            
            # Test user search
            search_results = test_user_search(TEST_USER1["username"][:5])
            results["user_search"] = True
            
            # Test follow/unfollow functionality
            follow_result = test_follow_user(user1_id, user2_id)  # user2 follows user1
            
            # Test get following/followers
            following = test_get_following(user2_id)  # Who is user2 following? Should include user1
            followers = test_get_followers(user1_id)  # Who follows user1? Should include user2
            
            # Test follow status
            follow_status = test_follow_status(user2_id, user1_id)  # Is user2 following user1? Should be true
            assert follow_status["is_following"] == True
            
            # Test unfollow
            unfollow_result = test_unfollow_user(user1_id, user2_id)  # user2 unfollows user1
            
            # Test follow status after unfollow
            follow_status_after = test_follow_status(user2_id, user1_id)  # Is user2 following user1? Should be false
            assert follow_status_after["is_following"] == False
            
            results["follow_functionality"] = True
            
        except Exception as e:
            print(f"❌ User/Follow tests failed: {str(e)}")
        
        # Test daily global activity
        try:
            daily_activity = test_daily_global_activity()
            results["daily_global_activity"] = True
        except Exception as e:
            print(f"❌ Daily global activity test failed: {str(e)}")
        
        # Test initialize activities
        try:
            activities = test_initialize_activities()
            results["initialize_activities"] = True
        except Exception as e:
            print(f"❌ Initialize activities test failed: {str(e)}")
        
        # Print summary
        print("\n" + "=" * 80)
        print("TEST RESULTS SUMMARY")
        print("=" * 80)
        for test_name, passed in results.items():
            status = "✅ PASSED" if passed else "❌ FAILED"
            print(f"{test_name.replace('_', ' ').title()}: {status}")
        print("=" * 80)
        
        all_passed = all(results.values())
        if all_passed:
            print("\n✅ All tests completed successfully!")
        else:
            print("\n❌ Some tests failed. See details above.")
        
        return all_passed
        
    except Exception as e:
        print(f"\n❌ Error during testing: {str(e)}")
        return False

if __name__ == "__main__":
    run_all_tests()