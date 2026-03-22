import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add mode button to difficultyModal
difficulty_modal_search = """                <!-- Sigma Mode -->
                <div id="sigmaModeBtn" class="mode-card simple col-span-2" style="--main-color: #374151; --shadow-color: #111827;">
                    <h3 class="flex flex-col items-center gap-2">
                        <span class="text-5xl">⚡</span>
                        <span>Sigma</span>
                    </h3>
                </div>"""

difficulty_modal_replace = """                <!-- Sigma Mode -->
                <div id="sigmaModeBtn" class="mode-card simple col-span-2" style="--main-color: #374151; --shadow-color: #111827;">
                    <h3 class="flex flex-col items-center gap-2">
                        <span class="text-5xl">⚡</span>
                        <span>Sigma</span>
                    </h3>
                </div>
                <!-- Document Drag & Drop Mode -->
                <div id="fillBlankModeBtn" class="mode-card simple col-span-2 md:col-span-3" style="--main-color: transparent; --shadow-color: #9a3412; background: linear-gradient(to right, #f59e0b, #ea580c);">
                    <h3 class="flex flex-col items-center gap-2">
                        <span class="text-5xl">📜</span>
                        <span>Document Drag & Drop</span>
                    </h3>
                </div>"""

content = content.replace(difficulty_modal_search, difficulty_modal_replace)

# 2. Add fillBlankRulesModal
sigma_rules_modal_search = """    <div id="sigmaRulesModal" class="modal-overlay hidden">
        <div class="modal-content">
            <h2 class="text-4xl font-bold mb-4">Welcome to Sigma Mode!</h2>
            <div class="space-y-4 text-lg">
                <p>This is a test of speed and knowledge. Here are the rules:</p>
                <ul class="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Beat the Clock:</strong> You start with only <strong>60 seconds</strong>. There is no time limit!</li>
                    <li><strong>Advance Through Stages:</strong> Survive three increasingly difficult stages.</li>
                    <li><strong>Stage 1 (Easy):</strong> Answer all Easy questions. Earn <strong>+15 seconds</strong> per correct answer.</li>
                    <li><strong>Stage 2 (Hard):</strong> Answer all Hard questions. Earn <strong>+20 seconds</strong> per correct answer.</li>
                    <li><strong>Stage 3 (Skibidi):</strong> Answer all Skibidi (typed) questions. Earn <strong>+25 seconds</strong> per correct answer.</li>
                </ul>
                <p class="font-bold text-center mt-4">Can you survive the ultimate challenge?</p>
            </div>
            <div class="flex justify-center mt-6">
                <button id="acceptSigmaBtn" class="modal-button bg-green-500 text-white" style="box-shadow: 4px 4px 0px #111827;">I Accept</button>
                <button id="declineSigmaBtn" class="modal-button bg-gray-500 text-white" style="box-shadow: 4px 4px 0px #111827;">Go Back</button>
            </div>
        </div>
    </div>"""

sigma_rules_modal_replace = sigma_rules_modal_search + """

    <div id="fillBlankRulesModal" class="modal-overlay hidden">
        <div class="modal-content">
            <h2 class="text-4xl font-bold mb-4">Welcome to Document Drag & Drop! 📜</h2>
            <div class="space-y-4 text-lg">
                <p>Test your knowledge with primary sources and historical documents.</p>
                <ul class="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Fill in the Blanks:</strong> Drag words from the word bank and drop them into the correct blanks in the text.</li>
                    <li><strong>Mobile Play:</strong> Tap a word chip, then tap an empty blank to place it.</li>
                    <li><strong>Submit:</strong> Once all blanks are filled, click "Submit Answer" to check your work.</li>
                </ul>
                <p class="font-bold text-center mt-4">Ready to analyze history?</p>
            </div>
            <div class="flex justify-center mt-6">
                <button id="acceptFillBlankBtn" class="modal-button bg-green-500 text-white" style="box-shadow: 4px 4px 0px #111827;">I Accept</button>
                <button id="declineFillBlankBtn" class="modal-button bg-gray-500 text-white" style="box-shadow: 4px 4px 0px #111827;">Go Back</button>
            </div>
        </div>
    </div>"""

content = content.replace(sigma_rules_modal_search, sigma_rules_modal_replace)


# 3. Add fillBlankArea HTML
answer_area_search = """                <!-- NEW: Fact or Myth buttons -->
                <div id="mythAnswerButtons" class="hidden flex justify-center gap-4 mt-4">
                    <button id="factBtn" class="modal-button bg-blue-500 text-white" style="box-shadow: 4px 4px 0px #111827;">Fact</button>
                    <button id="mythBtn" class="modal-button bg-red-500 text-white" style="box-shadow: 4px 4px 0px #111827;">Myth</button>
                </div>"""

answer_area_replace = answer_area_search + """

                <div id="fillBlankArea" class="hidden w-full flex flex-col gap-4 items-center justify-center p-4">
                    <div id="fill-blank-text" class="text-xl md:text-2xl leading-loose font-medium w-full text-center bg-white p-4 rounded-lg border-4 border-gray-800">
                    </div>
                    <div id="fill-blank-wordbank" class="flex flex-wrap justify-center gap-3 w-full bg-slate-200 p-4 rounded-lg border-4 border-gray-600 min-h-[80px]">
                    </div>
                    <button id="fill-blank-submit" class="modal-button bg-green-500 text-white mt-4 opacity-50 cursor-not-allowed" style="box-shadow: 4px 4px 0px #111827;" disabled>Submit Answer</button>
                </div>"""

content = content.replace(answer_area_search, answer_area_replace)


# 4. Add CSS
css_search = """        #storeTooltip {
            position: fixed;
            background-color: #fffbeb;
            color: #111827;
            padding: 1.25rem;
            border-radius: 1rem;
            font-size: 1.2rem;
            font-weight: 900;
            font-family: 'Montserrat', sans-serif;
            pointer-events: none;
            z-index: 2000;
            display: none;
            max-width: 320px;
            box-shadow: 8px 8px 0px #111827;
            border: 4px solid #111827;
        }"""

css_replace = css_search + """

        .blank-slot {
            display: inline-block;
            min-width: 100px;
            height: 35px;
            border-bottom: 3px dashed #111827;
            margin: 0 5px;
            vertical-align: bottom;
            text-align: center;
            font-weight: bold;
            color: #b45309;
            background-color: #fef3c7;
            transition: all 0.2s;
        }

        .blank-slot.drag-over {
            background-color: #fde047;
            border-bottom: 3px solid #ca8a04;
        }

        .word-chip {
            background-color: #f59e0b;
            color: white;
            border: 3px solid #92400e;
            box-shadow: 4px 4px 0px #92400e;
            padding: 0.5rem 1rem;
            border-radius: 0.75rem;
            font-weight: 900;
            cursor: grabbing;
            user-select: none;
            transition: transform 0.1s, box-shadow 0.1s;
        }

        .word-chip:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px #92400e;
        }

        .word-chip.dragging {
            opacity: 0.5;
        }

        .word-chip.selected {
            background-color: #b45309;
            border-color: #78350f;
            transform: scale(1.05);
        }

        .blank-slot .word-chip {
            margin: 0;
            padding: 0.2rem 0.5rem;
            box-shadow: none;
            border: none;
            background-color: transparent;
            color: #b45309;
            font-size: inherit;
        }

        .blank-slot.locked {
            background-color: #86efac;
            color: #14532d;
            border-bottom: 3px solid #15803d;
            pointer-events: none;
        }
"""

content = content.replace(css_search, css_replace)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
