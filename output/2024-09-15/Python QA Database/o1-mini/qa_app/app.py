import os
import sys
from database import Database

def main():
    db_path = os.path.join(os.path.dirname(__file__), 'data', 'qa.db')
    try:
        db = Database(db_path)
    except Exception as e:
        print(f"Failed to connect to the database: {e}")
        sys.exit(1)
    
    print("Welcome to the QA App. Type 'exit' to quit.")

    while True:
        try:
            question = input("\nEnter your question: ").strip()
            if question.lower() == 'exit':
                print("Goodbye!")
                break
            if not question:
                print("Please enter a valid question.")
                continue

            answer = db.get_answer(question)
            if answer:
                print(f"Answer: {answer}")
            else:
                # Check for similar questions
                similar_question = db.find_similar_question(question)
                if similar_question:
                    print(f"Did you mean: '{similar_question}'?")
                    user_choice = input("Press 'y' to use the suggested question or 'n' to provide a new answer: ").strip().lower()
                    if user_choice == 'y':
                        answer = db.get_answer(similar_question)
                        print(f"Answer: {answer}")
                        continue

                user_answer = input("I don't have an answer for that. Please provide the answer: ").strip()
                if user_answer:
                    try:
                        db.add_qa_pair(question, user_answer)
                        print("Your answer has been saved. Thank you!")
                    except Exception as e:
                        print(f"Failed to save the answer: {e}")
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()
