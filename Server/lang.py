from transformers import MBartForConditionalGeneration, MBart50TokenizerFast

# Load mBART model (supports 50 languages)
model_name = "facebook/mbart-large-50-many-to-many-mmt"
tokenizer = MBart50TokenizerFast.from_pretrained(model_name, force_download=True)

model = MBartForConditionalGeneration.from_pretrained(model_name)

def get_chatbot_response(user_input, target_language):
    # Tokenize input text with target language setting
    tokenizer.src_lang = "en_XX"  # assuming the source language is English
    tokenizer.tgt_lang = target_language  # dynamically set target language
    
    inputs = tokenizer(user_input, return_tensors="pt", padding=True, truncation=True, max_length=512)
    
    # Generate response
    output_ids = model.generate(inputs['input_ids'], max_length=150, num_return_sequences=1)
    
    # Decode the response
    response = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return response

# Chat loop
print("Multilingual Disaster Assistance Chatbot (type 'exit' to end)")

while True:
    user_input = input("You: ")
    if user_input.lower() == 'exit':
        print("Chatbot: Stay safe! Goodbye!")
        break
    
    # Ask the user for the target language
    target_language = input("Enter target language (e.g., 'es' for Spanish, 'hi' for Hindi, 'fr' for French): ")
    
    # Get the response in the specified target language
    response = get_chatbot_response(user_input, target_language)
    
    # Display the chatbot's response
    print(f"Chatbot: {response}")
