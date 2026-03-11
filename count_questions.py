
import re

def count_questions(content):
    # This is a bit naive but should work for these files
    # Count occurrences of '{ question:' or '{question:'
    return len(re.findall(r'\{\s*question:', content))

files = ['index.html', 'GameQuestions6th.js', 'GameQuestions7th.js', 'GameQuestions8th.js']

for f in files:
    with open(f, 'r') as file:
        content = file.read()
        print(f"{f}: {count_questions(content)} questions total")

# Check index.html structure more deeply
import json

def analyze_index_html(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Extract the gameQuestions object. It's between 'const gameQuestions = {' and '};'
    match = re.search(r'const gameQuestions = (\{.*?\});', content, re.DOTALL)
    if not match:
        print("Could not find gameQuestions in index.html")
        return

    # The object in JS isn't perfect JSON (unquoted keys, etc.)
    # But we can try to find the units and count them manually or with regex

    for mode in ['EASY', 'HARD', 'SKIBIDI', 'MYTH']:
        for grade in ['grade6', 'grade7', 'grade8']:
            for unit in ['unit1', 'unit2', 'unit3', 'unit4', 'unit5']:
                # Find the unit array
                # Look for something like unit1: [ ... ]
                # This is tricky with regex due to nesting
                pass

analyze_index_html('index.html')
