import json

g6 = json.load(open('grade6_questions.json'))
g7 = json.load(open('grade7_questions.json'))
g8 = json.load(open('grade8_questions.json'))

combined = {}
for mode in ['EASY', 'HARD', 'SKIBIDI', 'MYTH']:
    combined[mode] = {}

    # 6th
    if mode in g6 and 'grade6' in g6[mode]:
        combined[mode]['grade6'] = g6[mode]['grade6']

    # 7th
    if mode in g7 and 'grade7' in g7[mode]:
        combined[mode]['grade7'] = g7[mode]['grade7']

    # 8th
    if mode in g8 and 'grade8' in g8[mode]:
        combined[mode]['grade8'] = g8[mode]['grade8']

with open('new_questions.json', 'w') as f:
    json.dump(combined, f, indent=4)
print("Combined and saved to new_questions.json")
