import re

def get_block(text, start_pattern, open_char='{', close_char='}'):
    match = re.search(start_pattern, text)
    if not match: return None
    start_idx = match.end() - 1
    stack = 0
    for i in range(start_idx, len(text)):
        if text[i] == open_char: stack += 1
        elif text[i] == close_char:
            stack -= 1
            if stack == 0:
                return text[start_idx+1:i]
    return None

def validate_file(filepath, is_html=False):
    with open(filepath, 'r') as f:
        content = f.read()

    if is_html:
        game_questions_block = get_block(content, r'const gameQuestions = \{')
    else:
        game_questions_block = get_block(content, r'const grade[678]Questions = \{')

    if not game_questions_block:
        print(f"FAILED to find gameQuestions block in {filepath}")
        return

    modes = ['EASY', 'HARD', 'SKIBIDI', 'MYTH']
    grades = ['grade6', 'grade7', 'grade8'] if is_html else [os.path.basename(filepath)[13:14]] # Extract 6, 7 or 8

    for mode in modes:
        mode_block = get_block(game_questions_block, f'{mode}:')
        if not mode_block:
            print(f"  MISSING MODE {mode} in {filepath}")
            continue

        for g in grades:
            grade_key = g if is_html else f"grade{g}"
            if is_html:
                grade_block = get_block(mode_block, f'{grade_key}:')
            else:
                grade_block = mode_block # Standalone files don't have nested grade keys

            if not grade_block:
                print(f"  MISSING GRADE {grade_key} in {mode} in {filepath}")
                continue

            for u in range(1, 6):
                unit_key = f'unit{u}'
                unit_block = get_block(grade_block, f'{unit_key}:', '[', ']')
                if not unit_block:
                    print(f"  MISSING UNIT {unit_key} in {grade_key} {mode} in {filepath}")
                    continue

                count = unit_block.count('question:')
                if count != 10:
                    print(f"  COUNT ERROR: {filepath} {mode} {grade_key} {unit_key} has {count} questions")
                # else:
                #    print(f"  OK: {filepath} {mode} {grade_key} {unit_key}")

import os
print("Validating Standalone Files...")
validate_file('GameQuestions6th.js')
validate_file('GameQuestions7th.js')
validate_file('GameQuestions8th.js')
print("\nValidating index.html...")
validate_file('index.html', True)
