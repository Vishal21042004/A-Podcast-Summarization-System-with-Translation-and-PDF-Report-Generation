import nltk
from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch

# Ensure 'punkt' tokenizer is available
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    print("Downloading 'punkt' tokenizer...")
    nltk.download('punkt')

nltk.data.path.append('path_to_custom_directory')

# Use GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Device set to: {device}")

# Load pre-trained model and tokenizer for QG
model_name = "iarfmoose/t5-base-question-generator"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name).to(device)

def generate_qa(text):
    """Generates Q&A pairs from the input text using a question-generation T5 model."""
    if not text.strip():
        raise ValueError("No input text provided for QA generation.")

    try:
        # Prepare the prompt for question generation
        prompt = f"generate questions: {text.strip()}"

        inputs = tokenizer(
            prompt,
            return_tensors="pt",
            max_length=1024,
            truncation=True,
            padding="max_length"
        ).to(device)

        outputs = model.generate(
            inputs["input_ids"],
            max_length=256,
            num_beams=5,
            no_repeat_ngram_size=2,
            early_stopping=True
        )

        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        print("Raw model output:\n", generated_text)

        # Parse output into questions (this model generates Qs only)
        questions = [q.strip() for q in generated_text.split("?") if q.strip()]
        qa_pairs = []

        for question in questions:
            q = question + "?"
            # Use extractive method for answer (simple baseline: first sentence)
            # In production, replace this with a QA model or answer extraction logic
            answer = extract_answer(q, text)
            qa_pairs.append({"question": q, "answer": answer})

        print(f"Extracted {len(qa_pairs)} Q&A pairs.")
        return qa_pairs

    except Exception as e:
        print(f"Q&A generation failed: {e}")
        return [{"question": "Q&A generation failed", "answer": str(e)}]

def extract_answer(question, context):
    """Basic heuristic to return first relevant sentence as answer."""
    sentences = nltk.sent_tokenize(context)
    for sent in sentences:
        if any(word.lower() in sent.lower() for word in question.split()):
            return sent
    return sentences[0] if sentences else "Answer not found."

# Sample run
if __name__ == "__main__":
    sample_text = """
    Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy.
    This chemical energy is stored in carbohydrate molecules, such as sugars, which are synthesized from carbon dioxide and water.
    In most cases, oxygen is also released as a waste product. Most plants, algae, and cyanobacteria perform photosynthesis.
    Photosynthesis is largely responsible for producing and maintaining the oxygen content of the Earth's atmosphere.
    """
    print("Generating Q&A from sample text...\n")
    results = generate_qa(sample_text)
    for i, pair in enumerate(results, 1):
        print(f"{i}. Q: {pair['question']}\n   A: {pair['answer']}\n")
