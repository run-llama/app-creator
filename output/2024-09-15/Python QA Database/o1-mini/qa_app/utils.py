from difflib import SequenceMatcher

def similarity(a, b):
    """
    Calculate the similarity ratio between two strings.
    """
    return SequenceMatcher(None, a, b).ratio()

def get_close_match(user_question, questions, threshold=0.7):
    """
    Find the closest matching question from a list of questions based on similarity threshold.
    """
    best_match = None
    highest_sim = 0
    for q in questions:
        sim = similarity(user_question.lower(), q.lower())
        if sim > highest_sim:
            highest_sim = sim
            best_match = q
    if highest_sim >= threshold:
        return best_match
    return None
