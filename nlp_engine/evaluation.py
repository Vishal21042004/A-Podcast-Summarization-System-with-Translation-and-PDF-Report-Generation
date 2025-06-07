# evaluation.py

from jiwer import wer
from rouge_score import rouge_scorer
from sacrebleu import corpus_bleu

# --- Transcription Accuracy (WER) ---
def transcription_accuracy(reference, hypothesis):
    """
    reference: ground truth transcript (string)
    hypothesis: system transcript (string)
    """
    error = wer(reference, hypothesis)
    accuracy = 1 - error
    print(f"WER: {error:.2%}, Accuracy: {accuracy:.2%}")
    return accuracy

# --- Summarization Accuracy (ROUGE) ---
def summarization_accuracy(reference_summary, generated_summary):
    """
    reference_summary: human summary (string)
    generated_summary: system summary (string)
    """
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
    scores = scorer.score(reference_summary, generated_summary)
    print("ROUGE-1:", scores['rouge1'].fmeasure)
    print("ROUGE-2:", scores['rouge2'].fmeasure)
    print("ROUGE-L:", scores['rougeL'].fmeasure)
    return scores

# --- Translation Accuracy (BLEU) ---
def translation_accuracy(reference_translations, system_translations):
    """
    reference_translations: list of reference translations (list of strings)
    system_translations: list of system translations (list of strings)
    """
    bleu = corpus_bleu(system_translations, [reference_translations])
    print(f"BLEU score: {bleu.score:.2f}")
    return bleu.score

# Example usage:
if __name__ == "__main__":
    # Transcription
    ref = "This is a test transcription."
    hyp = "This is test transcription."
    transcription_accuracy(ref, hyp)

    # Summarization
    ref_sum = "Photosynthesis converts light energy into chemical energy."
    gen_sum = "Photosynthesis changes light into chemical energy."
    summarization_accuracy(ref_sum, gen_sum)

    # Translation
    refs = ["La energía solar es importante."]
    hyps = ["La energía solar es importante."]
    translation_accuracy(refs, hyps)