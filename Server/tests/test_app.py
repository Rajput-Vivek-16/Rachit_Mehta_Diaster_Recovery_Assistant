# tests/test_app.py

from app import app

def test_home_page():
    response = app.test_client().get('/')
    assert response.status_code == 200
    assert b'Welcome to the disaster recovery platform!' in response.data

def test_login():
    response = app.test_client().post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })
    assert response.status_code == 200
    assert b'Login attempt for testuser' in response.data
