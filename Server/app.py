from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from pymongo.errors import ServerSelectionTimeoutError
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Enable CORS for all routes and all domains
CORS(app)

app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config["MONGO_URI"] = "mongodb://localhost:27017/Disaster_Recovery"

bcrypt = Bcrypt(app)
jwt = JWTManager(app)
mongo = PyMongo(app)

@app.route('/home')
def home():
    try:
        # Attempt to check the MongoDB connection
        mongo.db.command('ping')  # This is a simple command to check MongoDB status
        return "MongoDB connected successfully!"
    except ServerSelectionTimeoutError:
        return "Failed to connect to MongoDB."

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data['username']
    password = data['password']
    role = data.get('role', 'community_user')
    country= data['Country']

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Insert the new user into the MongoDB collection
    user = {
        "username": username,
        "password": hashed_password,
        "role": role,
        "Country": country,
    }

    # Check if the user already exists
    existing_user = mongo.db.users.find_one({"username": username})
    if existing_user:
        return jsonify({"message": "Username already exists"}), 400

    mongo.db.users.insert_one(user)

    return jsonify({"message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    # Find user by username
    user = mongo.db.users.find_one({"username": username})

    # Verify user and password
    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    # Get the current user's ID
    current_user_id = get_jwt_identity()

    # Fetch user data based on the ID from MongoDB
    user = mongo.db.users.find_one({"_id": ObjectId(current_user_id)})

    return jsonify({"user": {"username": user['username'], "role": user['role']}}), 200

# Import necessary libraries
import requests
from flask import Flask, request, jsonify


# Replace with your LocationIQ API key
LOCATIONIQ_API_KEY = 'pk.ac36f8fe4a35ed3d9cd59131b2f55e87'

@app.route('/nearest_healthcare', methods=['POST'])
def nearest_healthcare():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    # Define parameters for LocationIQ Nearby API request
    url = f'https://us1.locationiq.com/v1/nearby.php'
    params = {
        'key': LOCATIONIQ_API_KEY,
        'lat': latitude,
        'lon': longitude,
        'tag': 'hospital',  # Specify 'hospital' tag to find healthcare facilities
        'radius': 5000,     # Search within a 5km radius
        'format': 'json'    # Get results in JSON format
    }

    # Make the API request
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return jsonify({"error": "Failed to fetch data"}), 500







if __name__ == '__main__':
    app.run(debug=True)
