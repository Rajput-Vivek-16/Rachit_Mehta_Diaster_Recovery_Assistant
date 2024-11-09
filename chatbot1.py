from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load the pre-trained model (DialoGPT or GPT-2 for chatbot tasks)
model_name = "microsoft/DialoGPT-medium"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

def get_earthquake_response(user_input):
    # Clear and constrained prompt to guide response tone and style
    structured_prompt = (
        "You are a trained disaster response assistant. Respond seriously and professionally. "
        "List clear and practical steps for someone during an earthquake emergency. "
        f"User's question: {user_input}"
    )

    # Encode the structured prompt with EOS token
    inputs = tokenizer.encode(structured_prompt + tokenizer.eos_token, return_tensors='pt')

    # Tighter control on response parameters
    outputs = model.generate(
        inputs,
        max_length=120,             # Keep responses concise but complete
        min_length=50,              # Ensure a fuller response
        num_return_sequences=1,     # Generate one response
        pad_token_id=tokenizer.eos_token_id,
        do_sample=False,            # Disable sampling for more deterministic output
        temperature=0.5,            # Lower creativity for more factual responses
        top_p=0.5,                  # Restrict sampling range
        repetition_penalty=2.5      # Strong penalty to reduce quirky repetitions
    )

    # Decode and return the response
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response

# Test the chatbot with an earthquake-related query
user_input = "What should I do during an earthquake?"
response = get_earthquake_response(user_input)
print(f"Chatbot: {response}")

