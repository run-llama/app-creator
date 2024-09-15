import sys
from database import Database
from difflib import get_close_matches

def main():
    """Main function to run the question-answer application."""
    try:
        with Database('questions.db') as db:
            while True:
                try:
                    question = input("Please enter your question (or type 'exit' to quit): ").strip()
                    if question.lower() == 'exit':
                        print("Goodbye!")
                        break
                    if not question:
                        print("Question cannot be empty.")
                        continue

                    questions = db.get_all_questions()
                    matches = get_close_matches(question, questions, n=5, cutoff=0.5)

                    if matches:
                        print("Did you mean:")
                        for idx, match in enumerate(matches, 1):
                            print(f"{idx}. {match}")
                        choice = input("Please enter the number of the closest match or 0 if none: ").strip()
                        if choice.isdigit():
                            choice_num = int(choice)
                            if 1 <= choice_num <= len(matches):
                                selected_question = matches[choice_num - 1]
                                answer = db.get_answer(selected_question)
                                print(f"Answer: {answer}")
                            elif choice_num == 0:
                                print("Sorry, I don't know the answer to that question.")
                                new_answer = input("Please provide the answer so I can learn: ").strip()
                                if not new_answer:
                                    print("Answer cannot be empty.")
                                    continue
                                db.add_question_answer(question, new_answer)
                                print("Thank you! I've learned something new.")
                            else:
                                print("Invalid selection.")
                        else:
                            print("Invalid input. Please enter a number.")
                    else:
                        print("Sorry, I don't know the answer to that question.")
                        new_answer = input("Please provide the answer so I can learn: ").strip()
                        if not new_answer:
                            print("Answer cannot be empty.")
                            continue
                        db.add_question_answer(question, new_answer)
                        print("Thank you! I've learned something new.")
                except KeyboardInterrupt:
                    print("\nGoodbye!")
                    break
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    main()
