# Fix the duplicate FILL_BLANK issue
import re
import os

for filename in ['GameQuestions6th.js', 'GameQuestions7th.js', 'GameQuestions8th.js']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Count occurrences of 'FILL_BLANK:'
    count = content.count('FILL_BLANK:')

    if count > 1:
        # Find the first occurrence and the second occurrence
        # Since it's appended at the end, we can just split by 'FILL_BLANK:'
        parts = content.split('FILL_BLANK:')

        # Keep everything before the first FILL_BLANK
        # and just ONE FILL_BLANK block
        # The easiest way is to find the last index of 'FILL_BLANK:'
        # and remove everything from there to the end, since the last one is the duplicate.
        last_idx = content.rfind(',\n    FILL_BLANK:')
        if last_idx != -1:
            new_content = content[:last_idx] + '\n}'
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)

# Fix Review Mistakes logic for FILL_BLANK
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

search = """            } else if (!question.choices) { // Check if it's a skibidi-type question
                reviewUserAnswerEl.classList.add('hidden'); // Not tracking user's typed answer for now
                const correctAnswerText = Array.isArray(question.answer) ? question.answer.join(' / ') : question.answer;
                reviewChoicesEl.innerHTML = `<div class="p-3 rounded-lg bg-green-200 border-2 border-green-700 text-green-800 font-bold">Correct Answer: ${correctAnswerText}</div>`;
            } else { // Standard multiple-choice question"""

replace = """            } else if (question.blanks) { // Check if it's a fill-in-the-blank question
                reviewUserAnswerEl.classList.add('hidden');
                const correctAnswerText = question.blanks.join(' | ');
                reviewChoicesEl.innerHTML = `<div class="p-3 rounded-lg bg-green-200 border-2 border-green-700 text-green-800 font-bold">Correct Answers (in order): ${correctAnswerText}</div>`;
            } else if (!question.choices) { // Check if it's a skibidi-type question
                reviewUserAnswerEl.classList.add('hidden'); // Not tracking user's typed answer for now
                const correctAnswerText = Array.isArray(question.answer) ? question.answer.join(' / ') : question.answer;
                reviewChoicesEl.innerHTML = `<div class="p-3 rounded-lg bg-green-200 border-2 border-green-700 text-green-800 font-bold">Correct Answer: ${correctAnswerText}</div>`;
            } else { // Standard multiple-choice question"""

if search in content:
    content = content.replace(search, replace)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
