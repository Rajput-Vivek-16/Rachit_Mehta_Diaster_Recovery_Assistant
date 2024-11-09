from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from pymongo.errors import ServerSelectionTimeoutError
from flask_cors import CORS  # Import CORS
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from transformers import T5Tokenizer, T5ForConditionalGeneration
from flask_cors import CORS
import joblib

from flask import Flask, request, render_template
import joblib
import numpy as np
model_name = "google/flan-t5-large" 
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

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



from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo


# Route to handle form submission
@app.route('/submit-form', methods=['POST'])
def submit_form():
    try:
        # Get form data from request
        data = request.json
        
        # Extracting data
        name = data.get('name')
        country = data.get('country')
        age = data.get('age')
        family_members = data.get('familyMembers')
        injuries = data.get('injuries')

        # Optional: validate data (check for missing values, etc.)
        if not name or not country or not age or not family_members:
            return jsonify({"error": "All fields are required"}), 400
        
        # Prepare data to insert into MongoDB
        form_data = {
            'name': name,
            'country': country,
            'age': age,
            'family_members': family_members,
            'injuries': injuries
        }

        # Insert into MongoDB
        mongo.db.forms.insert_one(form_data)

        return jsonify({"message": "Form submitted successfully!"}), 201

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "Something went wrong"}), 500
# def get_disaster_advice(user_input):
#     # Define a structured prompt for serious, step-by-step advice
#     structured_prompt = f"Provide detailed, step-by-step safety instructions for a disaster situation, including preparation, immediate actions, and post-disaster advice: {user_input}"

#     # Encode the prompt
#     inputs = tokenizer.encode(structured_prompt, return_tensors="pt")

#     # Generate response with parameters to ensure seriousness and structure
#     outputs = model.generate(
#         inputs,
#         min_length = 20,
#         max_length=500,               # Increased max length for more detailed response
#         num_beams=10,                 # More beams for focused, structured output
#         do_sample = True,
#         no_repeat_ngram_size=3,       # Avoid repetitive n-grams for better flow
#         temperature=0.7,              # Moderate creativity with relevance
#         top_p=0.9,                    # Nucleus sampling for diverse yet structured output
#         early_stopping=True           # Stop when a complete response is generated
#     )

#     # Decode and return the response
#     response = tokenizer.decode(outputs[0], skip_special_tokens=True)
#     return response

# @app.route('/chat' , methods=['POST'])
# def chat():
#     # Get the input text from the user
#     user_input = request.json.get('text')
    
#     # Get the disaster advice from the model
#     response = get_disaster_advice(user_input)
    
#     # Return the response as JSON
#     return jsonify({"response": response})

model = joblib.load('linear_regression_model.pkl')
CORS(app)


# Define the route for making predictions
@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        # Get the input data from the form
        input_data = [float(request.form['feature1']), float(request.form['feature2'])]

        # Reshape input data for prediction (assuming the model expects two features)
        input_data = np.array(input_data).reshape(1, -1)

        # Make prediction using the loaded model
        prediction = model.predict(input_data)

        # Return the prediction to the user
        return render_template('index.html', prediction_text='Required Supply: {:.2f}'.format(prediction[0]))
   # Replace with the path to your columns file if necessary


from flask import Flask, jsonify
from pymongo import MongoClient
import pandas as pd
import joblib


# Load your pre-trained model and any other necessary objects
model = joblib.load("linear_regression_model.pkl")  # Replace with the path to your trained model
   # Replace with the path to your columns file if necessary

# MongoDB setup (ensure MongoDB is running and replace with your actual URI)
@app.route('/predict_supplies', methods=['GET'])
def predict_supplies():
    try:
        # Connect to the MongoDB collection
        db = mongo.db.forms
        documents = db.find({})  # Fetch all documents in the forms collection
        predicted_supplies=0
        results = []

        # Loop through each document and predict supplies
        for document in documents:
            total_affected = document.get('total_affected', 0)
            country = document.get('country', 'Unknown')  # Default to 'Unknown' if missing

            input_data=pd.DataFrame()

            # Set values based on document data
            input_data['Total Affected'] = [total_affected]
            input_data['country']=country
            input_data['Disaster_type']=1

            # Convert to DataFrame
            input_df = pd.DataFrame(input_data, columns=input_data.columns, index=[0])

            # Predict the required supplies
            predicted_supplies+=  model.predict(input_df)

            # Ensure non-negative predictions
          # In kg

        print(predicted_supplies)

        # Return the predictions as JSON
        return jsonify({"predicted_supplies": predicted_supplies})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


   
if __name__ == '__main__':
    app.run(debug=True)
