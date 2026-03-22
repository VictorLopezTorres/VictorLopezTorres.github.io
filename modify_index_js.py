import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Variables
vars_search = """        const sigmaModeBtn = document.getElementById('sigmaModeBtn');
        const acceptSigmaBtn = document.getElementById('acceptSigmaBtn');
        const declineSigmaBtn = document.getElementById('declineSigmaBtn');"""

vars_replace = vars_search + """
        const fillBlankModeBtn = document.getElementById('fillBlankModeBtn');
        const acceptFillBlankBtn = document.getElementById('acceptFillBlankBtn');
        const declineFillBlankBtn = document.getElementById('declineFillBlankBtn');
        const fillBlankRulesModal = document.getElementById('fillBlankRulesModal');
        const fillBlankAreaEl = document.getElementById('fillBlankArea');
        const fillBlankTextEl = document.getElementById('fill-blank-text');
        const fillBlankWordbankEl = document.getElementById('fill-blank-wordbank');
        const fillBlankSubmitBtn = document.getElementById('fill-blank-submit');
"""

content = content.replace(vars_search, vars_replace)

# 2. startGame logic
start_game_search = """            if (gameMode === 'SIGMA') {
                sigmaStage = 1;
                sigmaCorrectInStage = 0;
                sigmaProgressContainer.classList.remove('hidden');
                // Start with easy questions for stage 1
                activeQuestionSet = getQuestions('EASY', activeQuestionSetKey);
                questionsCopy = [...activeQuestionSet];
                initialNotification = "SIGMA MODE: Stage 1 - Easy Questions. Good luck!";
            } else {
                activeQuestionSet = getQuestions(gameMode, activeQuestionSetKey);
                questionsCopy = [...activeQuestionSet];
                shuffleArray(questionsCopy);
            }

            shuffleArray(questionsCopy);
            // UI setup based on game mode
            const isSkibidi = gameMode === 'SKIBIDI';
            answerGridEl.classList.toggle('hidden', isSkibidi);
            skibidiFormEl.classList.toggle('hidden', !isSkibidi);
            mythAnswerButtons.classList.add('hidden'); // Hide myth buttons by default
            hunchAbilityEl.classList.toggle('hidden', isSkibidi);
            firstLetterBtn.classList.toggle('hidden', !isSkibidi);"""

start_game_replace = start_game_search.replace("""            const isSkibidi = gameMode === 'SKIBIDI';
            answerGridEl.classList.toggle('hidden', isSkibidi);
            skibidiFormEl.classList.toggle('hidden', !isSkibidi);
            mythAnswerButtons.classList.add('hidden'); // Hide myth buttons by default
            hunchAbilityEl.classList.toggle('hidden', isSkibidi);
            firstLetterBtn.classList.toggle('hidden', !isSkibidi);""", """            const isSkibidi = gameMode === 'SKIBIDI';
            const isFillBlank = gameMode === 'FILL_BLANK';
            answerGridEl.classList.toggle('hidden', isSkibidi || isFillBlank);
            skibidiFormEl.classList.toggle('hidden', !isSkibidi);
            fillBlankAreaEl.classList.toggle('hidden', !isFillBlank);
            mythAnswerButtons.classList.add('hidden'); // Hide myth buttons by default
            hunchAbilityEl.classList.toggle('hidden', isSkibidi || isFillBlank);
            firstLetterBtn.classList.toggle('hidden', !isSkibidi);""")

content = content.replace(start_game_search, start_game_replace)


# 3. displayNextQuestion logic
display_next_question_search = """                const isMythTypeQuestion = gameMode === 'MYTH';
                const isSkibidiTypeQuestion = gameMode === 'SKIBIDI' || (gameMode === 'SIGMA' && sigmaStage === 3);

                // Reset UI elements for all modes
                answerGridEl.classList.add('hidden');
                skibidiFormEl.classList.add('hidden');
                mythAnswerButtons.classList.add('hidden');
                hintBtn.classList.add('hidden'); // Hide by default, then show if applicable
                firstLetterBtn.classList.add('hidden'); // Hide by default, then show if applicable
                dokLabel.classList.add('hidden'); // Hide by default, then show if applicable"""

display_next_question_replace = display_next_question_search.replace("""                const isMythTypeQuestion = gameMode === 'MYTH';
                const isSkibidiTypeQuestion = gameMode === 'SKIBIDI' || (gameMode === 'SIGMA' && sigmaStage === 3);""", """                const isMythTypeQuestion = gameMode === 'MYTH';
                const isSkibidiTypeQuestion = gameMode === 'SKIBIDI' || (gameMode === 'SIGMA' && sigmaStage === 3);
                const isFillBlankTypeQuestion = gameMode === 'FILL_BLANK';""")

display_next_question_replace = display_next_question_replace.replace("""                mythAnswerButtons.classList.add('hidden');""", """                mythAnswerButtons.classList.add('hidden');
                fillBlankAreaEl.classList.add('hidden');""")

content = content.replace(display_next_question_search, display_next_question_replace)

display_next_question_part2_search = """                if (isMythTypeQuestion) {
                    // --- MYTH DEBUNKER LOGIC ---
                    mythAnswerButtons.classList.remove('hidden');
                    factBtn.disabled = false;
                    mythBtn.disabled = false;
                } else if (isSkibidiTypeQuestion) {
                    // --- TYPED ANSWER LOGIC (SKIBIDI/SIGMA-SKIBIDI) ---
                    skibidiFormEl.classList.remove('hidden');
                    hintBtn.classList.remove('hidden'); // Show the standard hint button
                    firstLetterBtn.classList.remove('hidden'); // Show letter hint button for skibidi
                } else {
                    // --- MULTIPLE CHOICE LOGIC (EASY/HARD/SIGMA-MC) ---
                    answerGridEl.classList.remove('hidden');
                    hintBtn.classList.remove('hidden'); // Show the standard hint button
                }


                if(!isSkibidiTypeQuestion && !isMythTypeQuestion) {"""

display_next_question_part2_replace = """                if (isMythTypeQuestion) {
                    // --- MYTH DEBUNKER LOGIC ---
                    mythAnswerButtons.classList.remove('hidden');
                    factBtn.disabled = false;
                    mythBtn.disabled = false;
                } else if (isSkibidiTypeQuestion) {
                    // --- TYPED ANSWER LOGIC (SKIBIDI/SIGMA-SKIBIDI) ---
                    skibidiFormEl.classList.remove('hidden');
                    hintBtn.classList.remove('hidden'); // Show the standard hint button
                    firstLetterBtn.classList.remove('hidden'); // Show letter hint button for skibidi
                } else if (isFillBlankTypeQuestion) {
                    // --- FILL BLANK LOGIC ---
                    fillBlankAreaEl.classList.remove('hidden');
                    hintBtn.classList.remove('hidden');

                    // Setup text and word bank
                    fillBlankTextEl.innerHTML = '';
                    fillBlankWordbankEl.innerHTML = '';
                    fillBlankSubmitBtn.disabled = true;
                    fillBlankSubmitBtn.classList.add('opacity-50', 'cursor-not-allowed');

                    let parts = question.text.split(/\[BLANK_\d+\]/);
                    let blankCount = parts.length - 1;

                    let newHtml = '';
                    for (let i = 0; i < parts.length; i++) {
                        newHtml += `<span>${parts[i]}</span>`;
                        if (i < blankCount) {
                            newHtml += `<span class="blank-slot" data-index="${i}" ondragover="allowDrop(event)" ondrop="dropToBlank(event)" onclick="handleBlankClick(event)"></span>`;
                        }
                    }
                    fillBlankTextEl.innerHTML = newHtml;

                    let bankWords = [...question.wordBank];
                    shuffleArray(bankWords);

                    bankWords.forEach(word => {
                        let chip = document.createElement('div');
                        chip.className = 'word-chip';
                        chip.draggable = true;
                        chip.textContent = word;
                        chip.ondragstart = dragStart;
                        chip.ondragend = dragEnd;
                        chip.onclick = handleChipClick;
                        fillBlankWordbankEl.appendChild(chip);
                    });

                } else {
                    // --- MULTIPLE CHOICE LOGIC (EASY/HARD/SIGMA-MC) ---
                    answerGridEl.classList.remove('hidden');
                    hintBtn.classList.remove('hidden'); // Show the standard hint button
                }


                if(!isSkibidiTypeQuestion && !isMythTypeQuestion && !isFillBlankTypeQuestion) {"""

content = content.replace(display_next_question_part2_search, display_next_question_part2_replace)


display_next_question_part3_search = """                // For Skibidi and Myth mode, clear and enable input/buttons
                if (isSkibidiTypeQuestion) {
                    skibidiInputEl.value = '';
                    skibidiInputEl.disabled = false;
                    skibidiInputEl.focus();
                    skibidiInputEl.classList.remove('correct', 'incorrect');
                }

                adjustFontSize(questionTextEl);"""

display_next_question_part3_replace = """                // For Skibidi and Myth mode, clear and enable input/buttons
                if (isSkibidiTypeQuestion) {
                    skibidiInputEl.value = '';
                    skibidiInputEl.disabled = false;
                    skibidiInputEl.focus();
                    skibidiInputEl.classList.remove('correct', 'incorrect');
                }

                if (!isFillBlankTypeQuestion) {
                    adjustFontSize(questionTextEl);
                    questionTextEl.style.display = 'flex';
                } else {
                    questionTextEl.style.display = 'none';
                }"""

content = content.replace(display_next_question_part3_search, display_next_question_part3_replace)


# 4. Fill Blank Interaction Logic & Events
interaction_logic = """
        // --- FILL BLANK INTERACTION LOGIC ---
        let selectedChip = null;

        function dragStart(e) {
            e.dataTransfer.setData('text/plain', e.target.textContent);
            setTimeout(() => e.target.classList.add('dragging'), 0);
            e.target.dataset.sourceId = e.target.parentElement.id || 'blank';
            if (e.target.parentElement.classList.contains('blank-slot')) {
                e.target.dataset.blankIndex = e.target.parentElement.dataset.index;
            }
        }

        function dragEnd(e) {
            e.target.classList.remove('dragging');
            document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        }

        function allowDrop(e) {
            e.preventDefault();
            if (e.target.classList.contains('blank-slot') && !e.target.classList.contains('locked')) {
                e.target.classList.add('drag-over');
            }
        }

        fillBlankWordbankEl.ondragover = (e) => { e.preventDefault(); };
        fillBlankWordbankEl.ondrop = (e) => {
            e.preventDefault();
            const text = e.dataTransfer.getData('text/plain');
            const draggingEl = document.querySelector('.dragging');
            if (draggingEl) {
                fillBlankWordbankEl.appendChild(draggingEl);
                checkFillBlankSubmitState();
            }
        };

        function dropToBlank(e) {
            e.preventDefault();
            const slot = e.currentTarget;
            slot.classList.remove('drag-over');

            if (slot.classList.contains('locked')) return;

            const text = e.dataTransfer.getData('text/plain');
            const draggingEl = document.querySelector('.dragging');

            if (draggingEl) {
                // If slot already has a chip, put it back to word bank
                if (slot.children.length > 0) {
                    fillBlankWordbankEl.appendChild(slot.children[0]);
                }
                slot.appendChild(draggingEl);
                checkFillBlankSubmitState();
            }
        }

        function handleChipClick(e) {
            const chip = e.currentTarget;

            // If chip is in a blank slot, return to word bank
            if (chip.parentElement.classList.contains('blank-slot')) {
                 if (chip.parentElement.classList.contains('locked')) return;
                 fillBlankWordbankEl.appendChild(chip);
                 checkFillBlankSubmitState();
                 return;
            }

            // Otherwise, it's in the word bank. Select it.
            if (selectedChip) {
                selectedChip.classList.remove('selected');
            }

            if (selectedChip === chip) {
                selectedChip = null;
            } else {
                selectedChip = chip;
                chip.classList.add('selected');
            }
        }

        function handleBlankClick(e) {
            const slot = e.currentTarget;
            if (slot.classList.contains('locked')) return;

            if (selectedChip) {
                if (slot.children.length > 0) {
                    fillBlankWordbankEl.appendChild(slot.children[0]);
                }
                slot.appendChild(selectedChip);
                selectedChip.classList.remove('selected');
                selectedChip = null;
                checkFillBlankSubmitState();
            }
        }

        function checkFillBlankSubmitState() {
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
            e.preventDefault();
            const question = activeQuestionSet[currentQuestionIndex];
            const slots = document.querySelectorAll('.blank-slot');

            let isCorrect = true;
            slots.forEach((slot, index) => {
                if (!slot.children[0] || slot.children[0].textContent !== question.blanks[index]) {
                    isCorrect = false;
                }
            });

            hintBtn.disabled = true;
            fillBlankSubmitBtn.disabled = true;
            document.querySelectorAll('.word-chip').forEach(c => c.style.pointerEvents = 'none');

            slots.forEach((slot, index) => {
                if (slot.children[0]) {
                    if (slot.children[0].textContent === question.blanks[index]) {
                        slot.children[0].style.backgroundColor = '#22c55e'; // Green
                    } else {
                        slot.children[0].style.backgroundColor = '#ef4444'; // Red
                    }
                }
            });

            handleAnswer(isCorrect, null);
        });
"""

events_search = """        easyModeBtn.addEventListener('click', () => {
            playClickSound();
            gameMode = 'EASY';
            difficultyModal.classList.add('hidden');
            easyRulesModal.classList.remove('hidden');
        });"""

events_replace = interaction_logic + """
""" + events_search + """
        fillBlankModeBtn.addEventListener('click', () => {
            playClickSound();
            gameMode = 'FILL_BLANK';
            difficultyModal.classList.add('hidden');
            fillBlankRulesModal.classList.remove('hidden');
        });
        acceptFillBlankBtn.addEventListener('click', () => {
            playClickSound();
            fillBlankRulesModal.classList.add('hidden');
            gradeModal.classList.remove('hidden');
        });
        declineFillBlankBtn.addEventListener('click', () => {
            playClickSound();
            fillBlankRulesModal.classList.add('hidden');
            difficultyModal.classList.remove('hidden');
        });
"""

content = content.replace(events_search, events_replace)

# 5. showHint & Lore Master Logic
hint_search = """        function showHint() {
            playClickSound();
            if (currentQuestionIndex > -1) {
                if (abilities.diplomatsPass) {
                    abilities.diplomatsPass = false;
                    updateNotification("Diplomat's Pass used! The timer will not pause.");
                } else {
                    isGamePaused = true;
                }
                const hint = activeQuestionSet[currentQuestionIndex].hint;
                hintTextEl.textContent = hint;
                hintModal.classList.remove('hidden');
            }
        }"""

hint_replace = """        function showHint() {
            playClickSound();
            if (currentQuestionIndex > -1) {
                if (gameMode === 'FILL_BLANK' && abilities.loreMasterActive) {
                    const question = activeQuestionSet[currentQuestionIndex];
                    const slots = document.querySelectorAll('.blank-slot');
                    let targetIndex = -1;

                    // Find first empty or incorrect slot
                    for (let i = 0; i < slots.length; i++) {
                        if (!slots[i].classList.contains('locked')) {
                            targetIndex = i;
                            break;
                        }
                    }

                    if (targetIndex !== -1) {
                        const correctWord = question.blanks[targetIndex];
                        // Find the chip with this word
                        const chips = document.querySelectorAll('.word-chip');
                        let targetChip = null;
                        for (let chip of chips) {
                            if (chip.textContent === correctWord && !chip.parentElement.classList.contains('locked')) {
                                targetChip = chip;
                                break;
                            }
                        }

                        if (targetChip) {
                            // Move whatever is currently in the slot back to the bank
                            if (slots[targetIndex].children.length > 0) {
                                fillBlankWordbankEl.appendChild(slots[targetIndex].children[0]);
                            }
                            // Move the target chip into the slot
                            slots[targetIndex].appendChild(targetChip);
                            slots[targetIndex].classList.add('locked');
                            targetChip.style.pointerEvents = 'none';
                            targetChip.style.backgroundColor = '#16a34a';
                            targetChip.style.borderColor = '#14532d';
                            checkFillBlankSubmitState();

                            updateNotification("Lore Master's Scroll: One correct word snapped and locked!");
                            return; // Don't show hint modal
                        }
                    }
                }

                if (abilities.diplomatsPass) {
                    abilities.diplomatsPass = false;
                    updateNotification("Diplomat's Pass used! The timer will not pause.");
                } else {
                    isGamePaused = true;
                }
                const hint = activeQuestionSet[currentQuestionIndex].hint;
                hintTextEl.textContent = hint;
                hintModal.classList.remove('hidden');
            }
        }"""

content = content.replace(hint_search, hint_replace)

# Setup New Turn Reset Fix
setup_new_turn_search = """            if(gameMode !== 'SKIBIDI') {
                answerChoices.forEach(choice => {
                    choice.querySelector('p').textContent = '';
                    choice.classList.remove('correct', 'incorrect');
                });
            } else {"""

setup_new_turn_replace = """            if(gameMode !== 'SKIBIDI' && gameMode !== 'FILL_BLANK') {
                answerChoices.forEach(choice => {
                    choice.querySelector('p').textContent = '';
                    choice.classList.remove('correct', 'incorrect');
                });
            } else if (gameMode === 'SKIBIDI') {"""

content = content.replace(setup_new_turn_search, setup_new_turn_replace)

setup_new_turn_2_search = """                });
                skibidiInputEl.value = '';
            }"""

setup_new_turn_2_replace = """                });
                skibidiInputEl.value = '';
            }
            if (typeof fillBlankTextEl !== 'undefined') fillBlankTextEl.innerHTML = '';
            if (typeof fillBlankWordbankEl !== 'undefined') fillBlankWordbankEl.innerHTML = '';
            questionTextEl.style.display = 'flex';"""

content = content.replace(setup_new_turn_2_search, setup_new_turn_2_replace)


with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
