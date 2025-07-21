from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

# Predefined disaster responses for demonstration
DISASTER_RESPONSES = {
    "earthquake": """
    EARTHQUAKE SAFETY INSTRUCTIONS:
    
    IMMEDIATE ACTIONS:
    1. DROP, COVER, and HOLD ON - Drop to your hands and knees, take cover under a sturdy desk or table, and hold on
    2. If outdoors, move away from buildings, trees, and power lines
    3. If driving, pull over safely and stay in the vehicle
    
    PREPARATION:
    1. Create an emergency kit with water (1 gallon per person per day for 3 days)
    2. Include non-perishable food, flashlight, battery-powered radio, first aid kit
    3. Secure heavy furniture and appliances to walls
    4. Know your evacuation routes
    
    POST-EARTHQUAKE:
    1. Check for injuries and provide first aid
    2. Inspect your home for damage
    3. Be prepared for aftershocks
    4. Listen to emergency broadcasts for updates
    """,
    
    "flood": """
    FLOOD SAFETY INSTRUCTIONS:
    
    IMMEDIATE ACTIONS:
    1. Move to higher ground immediately
    2. Never walk or drive through flood waters - "Turn Around, Don't Drown"
    3. If trapped, go to the highest level of the building
    4. Signal for help from rooftop or upper floors
    
    PREPARATION:
    1. Know your evacuation routes and shelter locations
    2. Keep emergency kit in waterproof container
    3. Elevate utilities and appliances above potential flood levels
    4. Purchase flood insurance (requires 30-day waiting period)
    
    POST-FLOOD:
    1. Wait for authorities to declare area safe
    2. Avoid flood waters - may contain sewage and debris
    3. Document damage with photos for insurance
    4. Throw away contaminated food and water
    """,
    
    "fire": """
    WILDFIRE SAFETY INSTRUCTIONS:
    
    IMMEDIATE ACTIONS:
    1. If ordered to evacuate, leave immediately
    2. Close all windows and doors but leave them unlocked
    3. Remove flammable window coverings and furniture from windows
    4. Connect garden hoses to outside water valves
    
    PREPARATION:
    1. Create defensible space around your home (30-100 feet clear of vegetation)
    2. Use fire-resistant plants in landscaping
    3. Install fire-resistant roofing materials
    4. Prepare emergency evacuation kit and plan
    
    POST-FIRE:
    1. Wait for official all-clear before returning
    2. Check for hazards like downed power lines
    3. Wet down debris to prevent rekindling
    4. Contact insurance company to report damage
    """,
    
    "hurricane": """
    HURRICANE SAFETY INSTRUCTIONS:
    
    IMMEDIATE ACTIONS:
    1. Stay indoors and away from windows
    2. Go to the lowest floor and interior room
    3. If flooding threatens, move to higher ground
    4. Never go outside during the eye of the storm
    
    PREPARATION:
    1. Board up windows with plywood
    2. Stock up on water (1 gallon per person per day for 7 days)
    3. Fill bathtubs with water for sanitation
    4. Charge all electronic devices
    
    POST-HURRICANE:
    1. Wait for authorities to declare area safe
    2. Avoid downed power lines and standing water
    3. Use flashlights, not candles
    4. Be aware of carbon monoxide from generators
    """
}

def get_disaster_advice(user_input):
    """
    Provide disaster advice based on keywords in user input
    """
    user_input_lower = user_input.lower()
    
    # Check for disaster types in user input
    if any(word in user_input_lower for word in ['earthquake', 'quake', 'tremor']):
        return DISASTER_RESPONSES['earthquake']
    elif any(word in user_input_lower for word in ['flood', 'flooding', 'water', 'tsunami']):
        return DISASTER_RESPONSES['flood']
    elif any(word in user_input_lower for word in ['fire', 'wildfire', 'burning', 'smoke']):
        return DISASTER_RESPONSES['fire']
    elif any(word in user_input_lower for word in ['hurricane', 'typhoon', 'cyclone', 'storm']):
        return DISASTER_RESPONSES['hurricane']
    else:
        # General disaster preparedness advice
        return """
        GENERAL DISASTER PREPAREDNESS:
        
        EMERGENCY KIT ESSENTIALS:
        1. Water: 1 gallon per person per day for at least 3 days
        2. Non-perishable food for at least 3 days
        3. Battery-powered or hand crank radio
        4. Flashlight and extra batteries
        5. First aid kit and medications
        6. Cell phone with chargers
        7. Cash in small bills
        8. Emergency contact information
        
        FAMILY EMERGENCY PLAN:
        1. Identify meeting places (local and out-of-area)
        2. Choose out-of-state contact person
        3. Know evacuation routes
        4. Practice emergency drills
        
        STAY INFORMED:
        1. Sign up for local emergency alerts
        2. Monitor weather and emergency broadcasts
        3. Follow official social media accounts
        
        For specific disaster types (earthquake, flood, fire, hurricane), please mention the disaster type for detailed instructions.
        """

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Get the input text from the user
        data = request.get_json()
        user_input = data.get('text', '')
        
        if not user_input:
            return jsonify({"error": "No input provided"}), 400
        
        # Get the disaster advice
        response = get_disaster_advice(user_input)
        
        # Return the response as JSON
        return jsonify({"response": response})
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "message": "Disaster assistance chatbot is running"})

# For local development
if __name__ == '__main__':
    app.run(debug=True)