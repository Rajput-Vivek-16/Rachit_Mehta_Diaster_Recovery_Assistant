import flask
import joblib

from flask import Flask, request, render_template
import joblib
import numpy as np

# Create a Flask app
app = Flask(__name__)

# Load the pre-trained linear regression model
model = joblib.load('linear_regression_model.pkl')


# Define the route for the home page
@app.route('/')
def home():
    return render_template('index.html')


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


# Run the app
if __name__ == "__main__":
    app.run(debug=True)
