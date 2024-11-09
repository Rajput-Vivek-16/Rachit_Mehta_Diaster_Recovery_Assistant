# tests/test_auth.py
import pytest
from app import app, mongo
from flask import json

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture(autouse=True)
def setup_teardown():
    # Setup: Drop the test database collections
    mongo.db.users.drop()
    yield
    # Teardown: Clean up after each test

def test_signup(client):
    # Test the signup functionality
    response = client.post('/signup', json={
        'username': 'testuser',
        'password': 'testpass',
        'role': 'community_user'
    })
    data = json.loads(response.data)
    assert response.status_code == 201
    assert data['message'] == "User created successfully"

def test_login(client):
    # First, create a user to log in with
    client.post('/signup', json={
        'username': 'testuser',
        'password': 'testpass'
    })

    # Test the login functionality
    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'testpass'
    })
    data = json.loads(response.data)
    assert response.status_code == 200
    assert 'access_token' in data
