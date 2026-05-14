import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "plantdoc.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Table for search history
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS search_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            term TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Optional: Table for diagnosis history if needed later
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS diagnosis_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_name TEXT,
            prediction TEXT,
            confidence REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ SQLite database initialized!")

def save_search(term):
    if not term or len(term.strip()) < 2:
        return
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Avoid duplicate recent searches by deleting old one first
    cursor.execute("DELETE FROM search_history WHERE term = ?", (term.strip(),))
    cursor.execute("INSERT INTO search_history (term) VALUES (?)", (term.strip(),))
    conn.commit()
    conn.close()

def get_recent_searches(limit=6):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT term FROM search_history ORDER BY timestamp DESC LIMIT ?", (limit,))
    results = [row[0] for row in cursor.fetchall()]
    conn.close()
    return results

def save_diagnosis(image_name, prediction, confidence):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO diagnosis_history (image_name, prediction, confidence) VALUES (?, ?, ?)",
        (image_name, prediction, confidence)
    )
    conn.commit()
    conn.close()

# Initialize when this file is imported
init_db()