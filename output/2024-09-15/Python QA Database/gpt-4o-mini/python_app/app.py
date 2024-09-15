import json
from database import Database

def main():
    db = Database('data/qa_database.json')
    
    while True:
        question = input("Please enter your question (or type 'exit' to quit): ")
        if question.lower() == 'exit':
            break
        
        answer = db.lookup_answer(question)
        if answer:
            print(f"Answer: {answer}")
        else:
            new_answer = input("I don't have an answer for that. Please provide an answer: ")
            db.store_qa_pair(question, new_answer)
            print("Thank you! Your question and answer have been saved.")

if __name__ == "__main__":
    main()
