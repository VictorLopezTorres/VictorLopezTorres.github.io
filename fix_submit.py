with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the handler missing from outside interaction_logic block
search = """        function checkFillBlankSubmitState() {
            const slots = document.querySelectorAll('.blank-slot');
            let allFilled = true;
            slots.forEach(slot => {
                if (slot.children.length === 0) allFilled = false;
            });

            if (allFilled) {
                fillBlankSubmitBtn.disabled = false;
                fillBlankSubmitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                fillBlankSubmitBtn.disabled = true;
                fillBlankSubmitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }

        fillBlankSubmitBtn.addEventListener('click', (e) => {"""

replace = """        function checkFillBlankSubmitState() {
            const slots = document.querySelectorAll('.blank-slot');
            let allFilled = true;
            slots.forEach(slot => {
                if (slot.children.length === 0) allFilled = false;
            });

            if (allFilled) {
                fillBlankSubmitBtn.disabled = false;
                fillBlankSubmitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                fillBlankSubmitBtn.disabled = true;
                fillBlankSubmitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }

        fillBlankSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();"""

if search in content:
    content = content.replace(search, replace)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
