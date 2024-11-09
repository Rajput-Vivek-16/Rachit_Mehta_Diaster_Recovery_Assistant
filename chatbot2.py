from transformers import T5Tokenizer, T5ForConditionalGeneration

# Choose a suitable model; `flan-t5-large` for higher quality responses
model_name = "google/flan-t5-large" 
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

def get_disaster_advice(user_input):
    # Define a structured prompt for serious, step-by-step advice
    structured_prompt = f"Provide detailed, step-by-step safety instructions for a disaster situation, including preparation, immediate actions, and post-disaster advice: {user_input}"

    # Encode the prompt
    inputs = tokenizer.encode(structured_prompt, return_tensors="pt")

    # Generate response with parameters to ensure seriousness and structure
    outputs = model.generate(
        inputs,
        min_length = 60,
        max_length=500,               # Increased max length for more detailed response
        num_beams=10,                 # More beams for focused, structured output
        do_sample = True,
        no_repeat_ngram_size=3,       # Avoid repetitive n-grams for better flow
        temperature=0.7,              # Moderate creativity with relevance
        top_p=0.9,                    # Nucleus sampling for diverse yet structured output
        early_stopping=True           # Stop when a complete response is generated
    )

    # Decode and return the response
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response

# Test the model
user_input = "How to response to an flood?"
response = get_disaster_advice(user_input)
print(f"Disaster Advice: {response}")

