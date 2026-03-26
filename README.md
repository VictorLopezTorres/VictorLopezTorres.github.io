# Classroom History Challenge

## Description

Classroom History Challenge is an interactive, single-page web application designed by Mr. Lopez Torres, a Social Studies teacher at Woodlawn Middle School. It was built to help middle school students study history in a fun, gamified, and engaging way. 

Players test their historical knowledge across various game modes, racing against the clock to earn points, build streaks, and unlock powerful abilities. The game features a dynamic power-up store, comprehensive review mechanisms, and distinct challenge levels tailored specifically for 6th, 7th, and 8th-grade curricula, aligning with state educational standards.

## How to Run

To run the application, simply open the `index.html` file in any modern web browser. No server or special setup is required.
You can also host it via GitHub Pages, Vercel, or any static file hosting service.

## Features

### 🎮 Six Game Modes
*   😊 **Easy:** The classic way to play. Standard multiple-choice questions with a 5:00 minute timer. Perfect for reviewing core concepts.
*   🤔 **Myth Debunker:** Test your knowledge of historical truths by deciding if statements are Fact or Myth. Detailed explanations are provided after each question to debunk common misconceptions.
*   🔥 **Hard:** Face tougher, analytical multiple-choice questions (Depth of Knowledge levels 2-6) with more challenging streak requirements to test deeper comprehension.
*   ⌨️ **Skibidi:** The ultimate challenge! No multiple choice—you must type the correct answers. Spelling counts, but abilities are earned much faster to compensate for the difficulty.
*   🧩 **Fill Blank:** A drag-and-drop interactive mode where students place the correct vocabulary words to complete historical passages.
*   ⚡ **Sigma:** A fast-paced survival mode. You start with only 60 seconds on the clock. Survive three increasingly difficult stages (Easy -> Hard -> Skibidi) by answering questions correctly to add more time.

### 📚 Educational Content
*   **Grade Levels:** Extensive question banks tailored for 6th, 7th, or 8th-grade history.
*   **Learning Targets:** Content is tied directly to detailed learning targets (e.g., covering the Great Depression, WWII, Civil War, Colonial America).
*   **Review Mistakes:** At the end of the game, players can review the questions they answered incorrectly to reinforce learning.

### ⚡ Mechanics & Rewards
*   **Scoring & Streaks:** Correct answers award points. Chaining correct answers builds a streak, unlocking both passive benefits and active abilities.
*   **Passive Abilities:** 
    *   *Historian's Hunch:* Periodically removes a wrong answer choice.
    *   *Time Tinkerer:* Adds bonus time for hitting specific streak milestones.
*   **Active Abilities:** Earn the power to *SKIP* hard questions, *REDO* a batch of wrong answers, or activate a *2x/3x SCORE BOOST*.
*   **Panther Bucks:** An integrated classroom reward system where students earn "Panther Bucks" for achieving high streaks (e.g., a 10-streak in Easy, 7-streak in Hard).

### 🛍️ The Power-Up Store
Use the points earned from answering questions correctly to buy consumable items and permanent upgrades:
*   **Consumables:** *Time Freeze* (+30s), *Time Boost* (+60s), *Time Warp* (+90s), *Diplomat's Pass* (hints without pausing the timer), *Streak Insurance* (saves a streak from one mistake), *Scholar's Bookmark* (+1 Skip).
*   **Permanent Upgrades:** *Hunch Upgrade* (removes 2 wrong answers instead of 1), *Letter Insight* (reveals the first and last letters in Skibidi mode), *Lore Master's Scroll* (correct answers are worth 1.25x points).

### 🎨 Tech & Design
*   **Vanilla JS & HTML5:** No heavy frameworks, ensuring fast load times and easy modifiability.
*   **Sound Effects:** Synthesized, zero-dependency audio generation using `Tone.js` for dynamic feedback on answers, purchases, and UI interactions.
*   **Visuals:** Fully responsive design built with Tailwind CSS. Includes custom CSS keyframe animations (glitch effects, glowing borders, jiggling elements) and a dynamic confetti particle system (`canvas-confetti`) for rewarding achievements.

## Code Overview

### Project Structure
*   **`index.html`**: The heart of the application. It contains all the HTML markup, inline Tailwind CSS styles, and the core JavaScript game engine. This includes the game state, timer, drag-and-drop mechanics for Fill-in-the-Blank, and the Tone.js synthesized sound engine.
*   **`GameQuestions6th.js`**, **`GameQuestions7th.js`**, **`GameQuestions8th.js`**: These files define the massive data structures holding all the questions, hints, distractors, and explanations. They are divided by grade, mode (Easy, Hard, Skibidi, Myth, Fill_Blank), and curriculum unit.
*   **`learning_targets_8th.json`**: An example JSON structure that maps the curriculum units and chapters to specific educational "I can" learning targets to ensure state standards are met.

## For Educators / Customization

This game is designed to be easily forkable and customizable for other classrooms:
1.  **Change the Content:** You can edit the `GameQuestions*.js` files to include questions for any subject (Science, English, Math). The JSON-like structure is easy to modify.
2.  **Adjust Rewards:** Search for `pantherBuckAbilityEl` in `index.html` to change the "Panther Bucks" text to whatever reward system your school or classroom uses (e.g., "Eagle Tickets", "Bonus Points").
3.  **Adjust Timers:** The default timer is 5 minutes (300 seconds). You can adjust `timeLeft = 300` in the `startTimer()` function to make games shorter or longer based on your class period.
