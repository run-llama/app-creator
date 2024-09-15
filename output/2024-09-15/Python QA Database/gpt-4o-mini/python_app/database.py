import json
from difflib import get_close_matches

class Database:
    def __init__(self, filepath):
        self.filepath = filepath
        self.load_data()
    
    def load_data(self):
        try:
            with open(self.filepath, 'r') as file:
                self.data = json.load(file)
        except FileNotFoundError:
            self.data = {}
    
    def save_data(self):
        with open(self.filepath, 'w') as file:
            json.dump(self.data, file, indent=4)

    def lookup_answer(self, question):
        questions = list(self.data.keys())
        close_matches = get_close_matches(question, questions)
        if close_matches:
            return self.data[close_matches[0]]
        return None

    def store_qa_pair(self, question, answer):
        self.data[question] = answer
        self.save_data()
