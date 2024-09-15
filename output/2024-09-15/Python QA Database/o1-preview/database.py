import sqlite3

class Database:
    """A class to handle database operations for question-answer pairs."""

    def __init__(self, db_name):
        """Initialize the database connection and create the table if it doesn't exist."""
        self.conn = sqlite3.connect(db_name)
        self.create_table()

    def __enter__(self):
        """Enter the runtime context related to this object."""
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        """Exit the runtime context and close the database connection."""
        self.close()

    def create_table(self):
        """Create the qa_pairs table if it does not already exist."""
        query = '''CREATE TABLE IF NOT EXISTS qa_pairs (
                    question TEXT PRIMARY KEY,
                    answer TEXT NOT NULL
                   );'''
        self.conn.execute(query)
        self.conn.commit()

    def get_all_questions(self):
        """Retrieve all questions from the database."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT question FROM qa_pairs")
        results = cursor.fetchall()
        return [row[0] for row in results]

    def get_answer(self, question):
        """Retrieve the answer for the given question."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT answer FROM qa_pairs WHERE question = ?", (question,))
        result = cursor.fetchone()
        return result[0] if result else None

    def add_question_answer(self, question, answer):
        """Add a new question and answer pair to the database."""
        cursor = self.conn.cursor()
        cursor.execute("INSERT OR REPLACE INTO qa_pairs (question, answer) VALUES (?, ?)", (question, answer))
        self.conn.commit()

    def close(self):
        """Close the database connection."""
        self.conn.close()
