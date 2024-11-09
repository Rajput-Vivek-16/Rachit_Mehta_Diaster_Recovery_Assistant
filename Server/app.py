from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_pymongo import PyMongo
from bson.objectid import ObjectId  # To handle MongoDB's object IDs

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = '5e7e8854283ed2224272473d06c06e5883643b8c9a149e8af2bafd8a42d0f89aaf897a011d19d1d8fbe3d2c707b479dfbc4e639c421c36444f114912b7fefe4c81938974b4c592dfb43df8dbde86717fca2839dc1600217afbd0d8d3dc1c86334ccc8c4ca52a28266c99d1856d6c854a3d2e897803817e998bbdae825a4d4525f3e1f8e114e7937152594a1f60ed043b142d9f45e0409cf43a0422cae94f9da9134dbded6e37bc0267addac0bf7cafc3ad7a71d89561e219166e7cab3f05b4065024562cec6a20f9a60b9c1123752a468e1b9fb8eda5bccf92e228d8c57b64e3723e274341b6a62f11eb7082e1c105d94f6213a780c62c5646c8d19ad1b97418'  # Replace with a strong key in production
app.config["MONGO_URI"] = "mongodb://localhost:27017"  # Set up MongoDB URI

bcrypt = Bcrypt(app)
jwt = JWTManager(app)
mongo = PyMongo(app)

@app.route('/')
def home():
    return 'Hello, World!'
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data['username']
    password = data['password']
    role = data.get('role', 'community_user')

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Insert the new user into the MongoDB collection
    user = {
        "username": username,
        "password": hashed_password,
        "role": role
    }
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
if __name__ == '__main__':
    app.run(debug=True)