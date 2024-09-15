import os
import sqlite3
from utils import get_close_match

class Database:
    def __init__(self, db_path):
        self.db_path = db_path
        self.conn = self.connect()
        self.create_table()

    def connect(self):
        try:
            conn = sqlite3.connect(self.db_path)
            return conn
        except sqlite3.Error as e:
            raise Exception(f"SQLite connection error: {e}")

    def create_table(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS qa (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    question TEXT UNIQUE COLLATE NOCASE,
                    answer TEXT
                )
            ''')
            self.conn.commit()
        except sqlite3.Error as e:
            raise Exception(f"Failed to create table: {e}")

    def get_all_questions(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute("SELECT question, answer FROM qa")
            return cursor.fetchall()
        except sqlite3.Error as e:
            raise Exception(f"Failed to fetch questions: {e}")

    def get_answer(self, user_question, threshold=0.7):
        try:
            questions = [q for q, _ in self.get_all_questions()]
            close_question = get_close_match(user_question, questions, threshold)
            if close_question:
                cursor = self.conn.cursor()
                cursor.execute("SELECT answer FROM qa WHERE question = ?", (close_question,))
                result = cursor.fetchone()
                if result:
                    return result[0]
            return None
        except Exception as e:
            raise Exception(f"Error retrieving answer: {e}")

    def find_similar_question(self, user_question, threshold=0.7):
        try:
            questions = [q for q, _ in self.get_all_questions()]
            return get_close_match(user_question, questions, threshold)
        except Exception as e:
            print(f"Error finding similar question: {e}")
            return None

    def add_qa_pair(self, question, answer):
        try:
            cursor = self.conn.cursor()
            cursor.execute("INSERT INTO qa (question, answer) VALUES (?, ?)", (question, answer))
            self.conn.commit()
        except sqlite3.IntegrityError:
            raise Exception("This question already exists in the database.")
        except sqlite3.Error as e:
            raise Exception(f"Failed to add QA pair: {e}")

    def __del__(self):
        if self.conn:
            self.conn.close()
