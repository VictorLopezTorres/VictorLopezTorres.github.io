        // --- DATA ---
        const gameQuestions = {
            EASY: {
                grade6: gameQuestions6th.EASY,
                grade7: gameQuestions7th.EASY,
                grade8: gameQuestions8th.EASY
            },
            HARD: {
                grade6: gameQuestions6th.HARD,
                grade7: gameQuestions7th.HARD,
                grade8: gameQuestions8th.HARD
            },
            SKIBIDI: {
                grade6: gameQuestions6th.SKIBIDI,
                grade7: gameQuestions7th.SKIBIDI,
                grade8: gameQuestions8th.SKIBIDI
            },
            MYTH: {
                grade6: gameQuestions6th.MYTH,
                grade7: gameQuestions7th.MYTH,
                grade8: gameQuestions8th.MYTH
            },
            FILL_BLANK: {
                grade6: gameQuestions6th.FILL_BLANK,
                grade7: gameQuestions7th.FILL_BLANK,
                grade8: gameQuestions8th.FILL_BLANK
            }
        };

        // --- SOUND ENGINE ---
        const filter = new Tone.Filter(400, "lowpass").toDestination();
        const filterEnv = new Tone.FrequencyEnvelope({
            attack: 0.01,
            decay: 0.1,
            sustain: 0,
            release: 0.1,
            baseFrequency: 200,
            octaves: 2
        });
        filterEnv.connect(filter.frequency);
        const synth = new Tone.PolySynth(Tone.Synth).toDestination();
        const pluckSynth = new Tone.PluckSynth().connect(filter);

        function playCorrectSound() {
            if (isMuted) return;
            const now = Tone.now();
            synth.triggerAttackRelease("C4", "8n", now);
            synth.triggerAttackRelease("E4", "8n", now + 0.1);
            synth.triggerAttackRelease("G4", "8n", now + 0.2);
            synth.triggerAttackRelease("C5", "8n", now + 0.3);
        }
        function playIncorrectSound() { if (isMuted) return;
            const now = Tone.now();
            synth.triggerAttackRelease("C2", "8n", now);
        }
        function playClickSound() { if (isMuted) return;
            if (Tone.context.state !== 'running') Tone.start();
            window.lastClickTime = window.lastClickTime || 0;
            let playTime = Tone.now() + 0.05;
            if (playTime <= window.lastClickTime) {
                playTime = window.lastClickTime + 0.01;
            }
            window.lastClickTime = playTime;
            pluckSynth.triggerAttack("C4", playTime);
            filterEnv.triggerAttack(playTime);
        }
        function playPurchaseSound() { if (isMuted) return;
            const now = Tone.now();
            synth.triggerAttackRelease("E5", "16n", now);
            synth.triggerAttackRelease("G5", "16n", now + 0.1);
        }
        function playStartSound() { if (isMuted) return;
            const now = Tone.now();
            synth.triggerAttackRelease("G3", "8n", now);
            synth.triggerAttackRelease("C4", "8n", now + 0.1);
        }
        function playStreakSound() { if (isMuted) return;
            const now = Tone.now();
            synth.triggerAttackRelease("G4", "8n", now);
            synth.triggerAttackRelease("C5", "8n", now + 0.1);
            synth.triggerAttackRelease("E5", "4n", now + 0.2);
        }
        function playPantherBuckSound() {
            const now = Tone.now();
            if (!isMuted) synth.triggerAttackRelease("A5", "8n", now);
        }

        // --- GAME STATE ---
        let playerState = {};
        let timerInterval = null;
        let timeLeft = 300;
        let storeNotificationInterval = null;
        let currentQuestionIndex = -1;
        let questionsCopy = [];
        let activeQuestionSet = [];
        let wrongAnswers = [];
        let permanentWrongAnswers = [];
        let abilities = {};
        let notificationQueue = [];
        let isModalActive = false;
        let isGamePaused = false;
        let isTransitioning = false;
        let notificationTimer = null;
        let isMuted = false;
        let lastNotificationMessage = '';
        let reviewIndex = 0;
        let gameMode = 'EASY';
        let sigmaStage = 1;
        let sigmaCorrectInStage = 0;
        let timeHistory = [];
        const correctMessages = [
            "Excellent!",
            "Great job!",
            "You're on fire!",
            "That's right!",
            "Keep it up!",
            "Awesome!",
            "Correct! You've got this.",
            "Nice one!",
            "Brilliant!",
            "You're a history whiz!"
        ];

        // --- DOM ELEMENTS ---
        const bodyEl = document.body;
        const timerEl = document.getElementById('timer');
        const timeCardEl = document.getElementById('timeCard');
        const scoreEl = document.getElementById('score');
        const streakEl = document.getElementById('streak');
        const correctAnswersEl = document.getElementById('correctAnswers');
        const gameAreaEl = document.getElementById('gameArea');
        const questionTextEl = document.getElementById('questionText');
        const answerChoices = document.querySelectorAll('.answer-choice');
        const headerGridEl = document.getElementById('headerGrid');

        // Modals
        const difficultyModal = document.getElementById('difficultyModal');
        const gradeModal = document.getElementById('gradeModal');
        const endGameModal = document.getElementById('endGameModal');
        const reviewModal = document.getElementById('reviewModal');
        const easyRulesModal = document.getElementById('easyRulesModal');
        const hardRulesModal = document.getElementById('hardRulesModal');
        const mythRulesModal = document.getElementById('mythRulesModal');
        const skibidiRulesModal = document.getElementById('skibidiRulesModal');
        const fitbRulesModal = document.getElementById('fitbRulesModal');
        const aboutModal = document.getElementById('aboutModal');
        const resetConfirmModal = document.getElementById('resetConfirmModal');
        const hintModal = document.getElementById('hintModal');
        const settingsModal = document.getElementById('settingsModal');
        const streakModal = document.getElementById('streakModal');
        const streakTextEl = document.getElementById('streakText');
        const abilityInfoModal = document.getElementById('abilityInfoModal');
        const pantherBuckModal = document.getElementById('pantherBuckModal');
        const storeModal = document.getElementById('storeModal');
        const hunchUpgradeStoreItem = document.getElementById('hunchUpgradeStoreItem');
        const sigmaRulesModal = document.getElementById('sigmaRulesModal');
        const skibidiIncorrectModal = document.getElementById('skibidiIncorrectModal');
        const firstLetterModal = document.getElementById('firstLetterModal');

        const explanationModal = document.getElementById('explanationModal');
        const explanationTextEl = document.getElementById('explanationText');
        const sigmaStageUpModal = document.getElementById('sigmaStageUpModal');
        const unitLabelEl = document.getElementById('unitLabel');
        const reviewUnitLabelEl = document.getElementById('reviewUnitLabel');
        const dokLabel = document.getElementById('dokLabel');
        const closeSigmaStageUpBtn = document.getElementById('closeSigmaStageUpBtn');
        // Sigma Mode UI
        const sigmaProgressContainer = document.getElementById('sigmaProgressContainer');
        const sigmaProgressBar = document.getElementById('sigmaProgressBar');
        const sigmaProgressText = document.getElementById('sigmaProgressText');
        const sigmaStageDisplay = document.getElementById('sigmaStageDisplay');


        // Buttons
        const easyModeBtn = document.getElementById('easyModeBtn');
        const hardModeBtn = document.getElementById('hardModeBtn');
        const skibidiModeBtn = document.getElementById('skibidiModeBtn');
        const fitbModeBtn = document.getElementById('fitbModeBtn');
        const acceptEasyBtn = document.getElementById('acceptEasyBtn');
        const declineEasyBtn = document.getElementById('declineEasyBtn');
        const acceptHardBtn = document.getElementById('acceptHardBtn');
        const declineHardBtn = document.getElementById('declineHardBtn');
        const acceptSkibidiBtn = document.getElementById('acceptSkibidiBtn');
        const declineSkibidiBtn = document.getElementById('declineSkibidiBtn');
        const mythModeBtn = document.getElementById('mythModeBtn');
        const acceptFitbBtn = document.getElementById('acceptFitbBtn');
        const declineFitbBtn = document.getElementById('declineFitbBtn');
        const acceptMythBtn = document.getElementById('acceptMythBtn');
        const declineMythBtn = document.getElementById('declineMythBtn');
        const sigmaModeBtn = document.getElementById('sigmaModeBtn');
        const acceptSigmaBtn = document.getElementById('acceptSigmaBtn');
        const declineSigmaBtn = document.getElementById('declineSigmaBtn');
        const backToDifficultyBtn = document.getElementById('backToDifficultyBtn');
        const gradeButtonContainer = document.getElementById('gradeButtonContainer');
        const unitButtonContainer = document.getElementById('unitButtonContainer');
        let selectedGrade = 'grade6';
        let selectedUnit = 'all';
        const startGameBtn = document.getElementById('startGameBtn');
        const newGameBtn = document.getElementById('newGameBtn');
        const storeBtn = document.getElementById('storeBtn');
        const reviewMistakesBtn = document.getElementById('reviewMistakesBtn');
        const closeReviewBtn = document.getElementById('closeReviewBtn');
        const nextReviewBtn = document.getElementById('nextReviewBtn');
        const prevReviewBtn = document.getElementById('prevReviewBtn');
        const endTurnBtn = document.getElementById('endTurnBtn');
        const resetAllBtn = document.getElementById('resetAllBtn');
        const aboutBtn = document.getElementById('aboutBtn');
        const hintBtn = document.getElementById('hintBtn');
        const closeAboutBtn = document.getElementById('closeAboutBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const closeSettingsBtn = document.getElementById('closeSettingsBtn');
        const soundToggle = document.getElementById('soundToggle');
        const confirmResetBtn = document.getElementById('confirmResetBtn');
        const cancelResetBtn = document.getElementById('cancelResetBtn');
        const closeHintBtn = document.getElementById('closeHintBtn');
        const closeStreakBtn = document.getElementById('closeStreakBtn');
        const closeAbilityInfoBtn = document.getElementById('closeAbilityInfoBtn');
        const closePantherBuckBtn = document.getElementById('closePantherBuckBtn');
        const closeStoreBtn = document.getElementById('closeStoreBtn');
        const buyBtns = document.querySelectorAll('.buy-btn');
        const closeSkibidiIncorrectBtn = document.getElementById('closeSkibidiIncorrectBtn');
        const closeExplanationBtn = document.getElementById('closeExplanationBtn');
        const firstLetterBtn = document.getElementById('firstLetterBtn');
        const closeFirstLetterBtn = document.getElementById('closeFirstLetterBtn');
        const sigmaStageUpText = document.getElementById('sigmaStageUpText');

        // Modal Content
        const finalScoreEl = document.getElementById('finalScore');
        const mistakesReviewTextEl = document.getElementById('mistakesReviewText');
        const reviewQuestionEl = document.getElementById('reviewQuestion');
        const reviewChoicesEl = document.getElementById('reviewChoices');
        const reviewUserAnswerEl = document.getElementById('reviewUserAnswer');
        const reviewUserAnswerTextEl = document.getElementById('reviewUserAnswerText');
        const hintTextEl = document.getElementById('hintText');
        const storeScoreDisplay = document.getElementById('storeScoreDisplay');
        const skibidiCorrectAnswerTextEl = document.getElementById('skibidiCorrectAnswerText');
        const firstLetterTextEl = document.getElementById('firstLetterText');

        const firstLastLetterStoreItem = document.getElementById('firstLastLetterStoreItem');
        const fitbWordBank = document.getElementById('fitbWordBank');

        // Ability & Notification Elements
        const abilitySkipEl = document.getElementById('abilitySkip');
        const abilityRedoEl = document.getElementById('abilityRedo');
        const abilityBoostEl = document.getElementById('abilityBoost');
        const abilityInfoBtn = document.getElementById('abilityInfoBtn');
        const skipUsesEl = document.getElementById('skipUses');
        const redoUsesEl = document.getElementById('redoUses');
        const hunchAbilityEl = document.getElementById('hunchAbility');
        const tinkerAbilityEl = document.getElementById('tinkerAbility');
        const pantherBuckAbilityEl = document.getElementById('pantherBuckAbility');
        const hunchProgressEl = document.getElementById('hunchProgress');
        const tinkerProgressEl = document.getElementById('tinkerProgress');
        const pantherBuckProgressEl = document.getElementById('pantherBuckProgress');
        const pantherBuckCounterEl = document.getElementById('pantherBuckCounter');
        const notificationTextEl = document.getElementById('notificationText');

        // Skibidi Mode elements
        const answerAreaEl = document.getElementById('answerArea');
        const skibidiFormEl = document.getElementById('skibidi-form');
        const skibidiInputEl = document.getElementById('skibidi-input');
        const answerGridEl = document.querySelector('.answer-grid');
        // NEW Myth Mode elements
        const mythAnswerButtons = document.getElementById('mythAnswerButtons');
        const factBtn = document.getElementById('factBtn');
        const mythBtn = document.getElementById('mythBtn');

        // FITB elements placeholder
        const fitbAnswerArea = document.getElementById('fitbAnswerArea');
        const fitbSubmitBtn = document.getElementById('fitbSubmitBtn');


        // --- SOUND ENGINE ---
        function playCorrectSound() {
            if (isMuted) return;
            const now = Tone.now();
            synth.triggerAttackRelease("C4", "8n", now);
            synth.triggerAttackRelease("E4", "8n", now + 0.1);
            synth.triggerAttackRelease("G4", "8n", now + 0.2);
            synth.triggerAttackRelease("C5", "8n", now + 0.3);
        }
        function playIncorrectSound() { if (isMuted) return;
            const now = Tone.now();
            synth.triggerAttackRelease("C2", "8n", now);
        }
        function playClickSound() { if (isMuted) return;
            if (Tone.context.state !== 'running') {
                Tone.start().catch(e => console.warn('Tone.start failed', e));
            }
            window.lastClickTime = window.lastClickTime || 0;
            let playTime = Tone.now() + 0.05;
            if (playTime <= window.lastClickTime) {
                playTime = window.lastClickTime + 0.01;
            }
            window.lastClickTime = playTime;
            pluckSynth.triggerAttack("C4", playTime);
            filterEnv.triggerAttack(playTime);
        }
        function playPurchaseSound() { if (isMuted) return;
            const now = Tone.now();
            synth.triggerAttackRelease("E5", "16n", now);
            synth.triggerAttackRelease("G5", "16n", now + 0.1);
        }
        function playStartSound() { if (isMuted) return;
            const now = Tone.now();
            synth.triggerAttackRelease("G3", "8n", now);
            synth.triggerAttackRelease("C4", "8n", now + 0.1);
        }
        function playStreakSound() { if (isMuted) return;
            const now = Tone.now();
            synth.triggerAttackRelease("G4", "8n", now);
            synth.triggerAttackRelease("C5", "8n", now + 0.1);
            synth.triggerAttackRelease("E5", "4n", now + 0.2);
        }
        function playPantherBuckSound() {
            const now = Tone.now();
            if (!isMuted) synth.triggerAttackRelease("A5", "8n", now);
        }

        // --- FITB SOUND FUNCTIONS ---
        function playDragStartSound() {
            if (isMuted) return;
            pluckSynth.triggerAttack("E3", Tone.now());
            filterEnv.triggerAttack();
        }
        function playDropSound() {
            if (isMuted) return;
            synth.triggerAttackRelease("C6", "32n", Tone.now());
        }
        function playUndoSound() {
            if (isMuted) return;
            synth.triggerAttackRelease("G2", "16n", Tone.now());
        }

        // --- HELPER & NOTIFICATION FUNCTIONS ---
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function adjustFontSize(element) {
            if (!element) return;
            const parent = document.getElementById('questionBox');
            if (!parent) return;

            const isFitb = gameMode === 'FILL_BLANK';

            // 1. Calculate available space
            const controls = document.getElementById('question-controls');

            // Only subtract controls height if they are actually in the question box
            let controlsHeight = 0;
            if (controls && parent.contains(controls)) {
                controlsHeight = controls.offsetHeight > 0 ? controls.offsetHeight : 70;
            }

            // Get parent padding
            const style = window.getComputedStyle(parent);
            const paddingTop = parseFloat(style.paddingTop) || 0;
            const paddingBottom = parseFloat(style.paddingBottom) || 0;
            const paddingLeft = parseFloat(style.paddingLeft) || 0;
            const paddingRight = parseFloat(style.paddingRight) || 0;
            const gap = parseFloat(style.gap) || 0;

            // Calculate the maximum height the text element can occupy
            // We use a 20px safety buffer
            const maxH = Math.max(parent.clientHeight - paddingTop - paddingBottom - controlsHeight - (controlsHeight > 0 ? gap : 0) - 20, 40);
            const maxW = Math.max(parent.clientWidth - paddingLeft - paddingRight - 20, 100);

            if (maxH <= 0 || maxW <= 0) return;

            // Apply constraints to the element
            element.style.maxHeight = maxH + 'px';
            element.style.maxWidth = maxW + 'px';

            // 2. Set starting font size
            let fontSize = isFitb ? 70 : 120; // Lowered initial for MC
            const minFontSize = isFitb ? 18 : 32; // Lowered min for MC too

            element.style.fontSize = fontSize + 'px';

            // 3. Shrink loop
            let iterations = 0;
            while (fontSize > minFontSize && iterations < 150) {
                iterations++;
                // Force reflow
                void element.offsetHeight;

                // Use scrollHeight vs maxH directly to be safe
                const overflowsY = element.scrollHeight > maxH + 1;
                const overflowsX = element.scrollWidth > maxW + 1;

                // Also check if the parent box is overflowing (ultimate safety)
                const parentOverflows = parent.scrollHeight > parent.clientHeight + 1;

                if (!overflowsY && !overflowsX && !parentOverflows) {
                    break;
                }

                fontSize -= 2; // Faster shrink
                element.style.fontSize = fontSize + 'px';
            }

            if (fontSize <= minFontSize) {
                element.style.fontSize = minFontSize + 'px';
            }
        }

        function triggerConfetti() {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 101 });
        }

        function addNotification(notification) {
            notificationQueue.push(notification);
            processNotificationQueue();
        }

        function processNotificationQueue() {
            if (isModalActive || notificationQueue.length === 0) {
                return;
            }
            isModalActive = true;
            const notification = notificationQueue.shift();

            triggerConfetti();

            if (notification.type === 'streak') {
                playStreakSound();
                streakTextEl.textContent = notification.text;
                streakModal.classList.remove('hidden');
            } else if (notification.type === 'pantherBuck') {
                playPantherBuckSound();
                pantherBuckModal.classList.remove('hidden');
            }
        }

        function updateNotification(message) {
            if (message === lastNotificationMessage) return;
            lastNotificationMessage = message;

            if (notificationTimer) clearTimeout(notificationTimer);

            // Reset all animations and content
            notificationTextEl.classList.remove('typing', 'glitch');
            notificationTextEl.textContent = '';
            notificationTextEl.dataset.text = '';

            // Force a reflow to restart the animation
            void notificationTextEl.offsetWidth;

            notificationTextEl.textContent = message;
            notificationTextEl.classList.add('typing');

            notificationTimer = setTimeout(() => {
                notificationTextEl.classList.remove('typing');
                notificationTextEl.classList.add('glitch');
                notificationTextEl.dataset.text = message; // Apply text for glitch effect
            }, 1000); // Duration should match the typing animation
        }

        // --- STORE LOGIC ---
        const storeItems = {
            timeFreeze: { cost: 3 },
            timeBoost: { cost: 8 },
            timeWarp: { cost: 10 },
            diplomatsPass: { cost: 8 },
            hunchUpgrade: { cost: 15, permanent: true },
            streakInsurance: { cost: 5 },
            scholarsBookmark: { cost: 4 },
            loreMastersScroll: { cost: 25, permanent: true },
            firstLastLetterUpgrade: { cost: 3, permanent: true }
        };

        function openStore() {
            playClickSound();
            storeScoreDisplay.textContent = Math.floor(playerState.score);

            buyBtns.forEach(btn => {
                let originalItemName = btn.getAttribute('data-item-original') || btn.dataset.item;
                if (!btn.getAttribute('data-item-original')) {
                    btn.setAttribute('data-item-original', originalItemName);
                }

                let itemName = originalItemName;

                // Toggle store items based on game mode
                if (originalItemName === 'hunchUpgrade') {
                    const isSkibidi = gameMode === 'SKIBIDI' || (gameMode === 'SIGMA' && sigmaStage === 3);
                    const isHunchEnabled = gameMode === 'EASY' || gameMode === 'HARD' || (gameMode === 'SIGMA' && sigmaStage < 3);

                    const storeItem = btn.closest('.store-item');

                    if (!isSkibidi && !isHunchEnabled) {
                        storeItem.classList.add('hidden');
                    } else {
                        storeItem.classList.remove('hidden');
                        hunchUpgradeStoreItem.classList.toggle('hidden', isSkibidi);
                        firstLastLetterStoreItem.classList.toggle('hidden', !isSkibidi);

                        if (isSkibidi) {
                            storeItem.dataset.description = "Permanent: The letter hint shows the first AND last letter of the answer.";
                            itemName = 'firstLastLetterUpgrade';
                        } else {
                            storeItem.dataset.description = "Permanent: Hunch removes 2 wrong answers.";
                            itemName = 'hunchUpgrade';
                        }

                        btn.textContent = `Buy (${storeItems[itemName].cost} Pts)`; // Explicitly update text here
                        btn.dataset.item = itemName; // Update the button's current data attribute
                    }
                }

                // Re-fetch item after potential name change
                const currentItem = storeItems[itemName];
                if (!currentItem) return;

                // Disable if already purchased (for permanent items)
                if (currentItem.permanent && ((abilities.hunchUpgraded && itemName === 'hunchUpgrade') || (abilities.loreMasterActive && itemName === 'loreMastersScroll') || (abilities.firstLastLetterUpgraded && itemName === 'firstLastLetterUpgrade'))) {
                    btn.disabled = true;
                    btn.textContent = 'Purchased';
                    btn.classList.add('purchased');
                }

                // Disable if already have an active consumable
                else if ( (itemName === 'streakInsurance' && abilities.streakInsurance) || (itemName === 'diplomatsPass' && abilities.diplomatsPass) ) {
                     btn.disabled = true;
                     btn.textContent = 'Active';
                }
                // Disable if not enough points
                else if (playerState.score < currentItem.cost) {
                    btn.disabled = true;
                } else {
                    btn.disabled = false;
                    btn.textContent = `Buy (${currentItem.cost} Pts)`;
                    btn.classList.remove('purchased');
                }
            });

            storeModal.classList.remove('hidden');
        }

        function buyItem(e) {
            const itemName = e.target.dataset.item;
            const item = storeItems[itemName];

            if (Math.floor(playerState.score) >= item.cost) {
                playPurchaseSound();
                playerState.score -= item.cost;
                scoreEl.textContent = Math.floor(playerState.score);

                // Apply item effect
                switch (itemName) {
                    case 'timeFreeze':
                        timeLeft += 30;
                        timeCardEl.classList.add('flash-green');
                        setTimeout(() => timeCardEl.classList.remove('flash-green'), 1000);
                        updateNotification("+30 seconds purchased!");
                        break;
                    case 'timeBoost':
                        timeLeft += 60;
                        timeCardEl.classList.add('flash-green');
                        setTimeout(() => timeCardEl.classList.remove('flash-green'), 1000);
                        updateNotification("+60 seconds purchased!");
                        break;
                    case 'timeWarp':
                        timeLeft += 90;
                        timeCardEl.classList.add('flash-green');
                        setTimeout(() => timeCardEl.classList.remove('flash-green'), 1000);
                        updateNotification("+90 seconds purchased!");
                        break;
                    case 'diplomatsPass':
                        abilities.diplomatsPass = true;
                        updateNotification("Diplomat's Pass is active!");
                        break;
                    case 'hunchUpgrade':
                        abilities.hunchUpgraded = true;
                        updateNotification("Hunch Upgrade purchased!");
                        break;
                    case 'streakInsurance':
                        abilities.streakInsurance = true;
                        updateNotification("Streak Insurance is active!");
                        break;
                    case 'scholarsBookmark':
                        abilities.skip++;
                        updateAbilitiesUI();
                        updateNotification("Scholar's Bookmark purchased! +1 SKIP.");
                        break;
                    case 'loreMastersScroll':
                        // Ensure score is updated immediately if it's not a whole number
                        if (playerState.score % 1 !== 0) {
                            scoreEl.textContent = playerState.score.toFixed(2);
                        }
                        abilities.loreMasterActive = true;
                        updateNotification("Lore Master's Scroll purchased!");
                        break;
                    case 'firstLastLetterUpgrade':
                        abilities.firstLastLetterUpgraded = true;
                        firstLetterBtn.classList.add('first-letter-btn-glow');
                        updateNotification("Letter Insight purchased!");
                        break;
                }
                openStore(); // Refresh store UI after purchase
            }
        }


        // --- ABILITY LOGIC ---
        function updateAbilitiesUI() {
            const isSkibidi = gameMode === 'SKIBIDI' || (gameMode === 'SIGMA' && sigmaStage === 3);
            const isHunchEnabled = gameMode === 'EASY' || gameMode === 'HARD' || (gameMode === 'SIGMA' && sigmaStage < 3);
            const hunchThreshold = isSkibidi ? 3 : 5;
            const tinkerThreshold = isSkibidi ? 2 : 4;
            const buckStreakThreshold = gameMode === 'HARD' ? 7 : (isSkibidi ? 5 : (gameMode === 'FILL_BLANK' ? 4 : 10));

            pantherBuckCounterEl.textContent = `${playerState.pantherBucksEarned} 🐾`;

            if(!isHunchEnabled) {
                hunchAbilityEl.style.display = 'none';
            } else {
                hunchAbilityEl.style.display = 'block';
                const hunchProgress = (playerState.correctAnswers % hunchThreshold) / hunchThreshold * 100;
                hunchProgressEl.style.width = `${hunchProgress}%`;
                hunchAbilityEl.classList.toggle('ready', hunchProgress >= 80);
                hunchAbilityEl.querySelector('.passive-ability-title').textContent = `Historian's Hunch (Next: ${hunchThreshold})`;
                if (hunchProgress > 50) {
                    hunchAbilityEl.classList.add('jiggle');
                    const duration = 0.4 - ((hunchProgress - 50) / 50) * 0.3;
                    hunchAbilityEl.style.animationDuration = `${duration}s`;
                } else {
                    hunchAbilityEl.classList.remove('jiggle');
                    hunchAbilityEl.style.animationDuration = '';
                }
            }

            const tinkerProgress = Math.min((playerState.streak / tinkerThreshold) * 100, 100);
            tinkerProgressEl.style.width = `${tinkerProgress}%`;
            tinkerAbilityEl.classList.toggle('ready', playerState.streak >= tinkerThreshold);
            tinkerAbilityEl.querySelector('.passive-ability-title').textContent = `Time Tinkerer (Streak: ${tinkerThreshold})`;
            if (tinkerProgress > 50) {
                tinkerAbilityEl.classList.add('jiggle');
                const duration = 0.4 - ((tinkerProgress - 50) / 50) * 0.3;
                tinkerAbilityEl.style.animationDuration = `${duration}s`;
            } else {
                tinkerAbilityEl.classList.remove('jiggle');
                tinkerAbilityEl.style.animationDuration = '';
            }

            // Update Panther Buck progress bar based on current streak
            const buckProgress = (playerState.streak % buckStreakThreshold) / buckStreakThreshold * 100;
            pantherBuckProgressEl.style.width = `${buckProgress}%`;
            pantherBuckAbilityEl.querySelector('.passive-ability-title').textContent = `Panther Buck (Streak: ${buckStreakThreshold})`;
            if (abilities.skip > 0) {
                abilitySkipEl.classList.remove('locked');
                abilitySkipEl.classList.add('earned');
                skipUsesEl.textContent = abilities.skip;
                skipUsesEl.classList.remove('hidden');
            } else {
                abilitySkipEl.classList.add('locked');
                abilitySkipEl.classList.remove('earned');
                skipUsesEl.classList.add('hidden');
            }
            if (abilities.redo > 0) {
                abilityRedoEl.classList.remove('locked');
                abilityRedoEl.classList.add('earned');
                redoUsesEl.textContent = abilities.redo;
                redoUsesEl.classList.remove('hidden');
            } else {
                abilityRedoEl.classList.add('locked');
                abilityRedoEl.classList.remove('earned');
                redoUsesEl.classList.add('hidden');
            }
            if (abilities.boost2xActive || abilities.boost3xActive) {
                abilityBoostEl.classList.remove('locked');
                abilityBoostEl.classList.add('active');
            } else {
                abilityBoostEl.classList.remove('active');
                // The 'locked' class is only added if no boost is active and streak is 0
                if (playerState.streak < (isSkibidi ? 4 : 7)) abilityBoostEl.classList.add('locked');
            }
        }

        function activateSkip() {
            if (isTransitioning) return;
            if (abilities.skip > 0) {
                playClickSound();
                abilities.skip--;
                updateAbilitiesUI();
                updateNotification("Question skipped!");
                displayNextQuestion();
            }
        }

        function activateRedo() {
            if (isTransitioning) return;
            if (abilities.redo > 0 && wrongAnswers.length > 0) {
                playClickSound();
                abilities.redo--;
                if (currentQuestionIndex !== -1) {
                    const currentQuestionObject = activeQuestionSet[currentQuestionIndex];
                    questionsCopy.push(currentQuestionObject);
                    shuffleArray(questionsCopy);
                }
                const questionsToRedo = [...wrongAnswers];
                questionsCopy.unshift(...questionsToRedo);
                updateNotification(`Second Chance! Answering ${wrongAnswers.length} questions again.`);
                wrongAnswers = [];
                updateAbilitiesUI();
                displayNextQuestion();
            }
        }

        // --- CORE GAME LOGIC ---
        function resetPlayerState() {
             playerState = {
                score: 0, questionsAnswered: 0, streak: 0, correctAnswers: 0,
                wrongStreak: 0, earned10Streak: false,
                earned3Streak: false, earned4Streak: false, earned5Streak: false, earned7Streak: false, hasSeenStoreInvite: false, pantherBucksAwardedForStreaks: [],
                historiansHunchPending: false, pantherBucksEarned: 0
            };
            abilities = {
                skip: 0, redo: 0, boost2xActive: false, boost3xActive: false,
                hunchUpgraded: false, streakInsurance: false, // Reset store-bought abilities
                loreMasterActive: false, diplomatsPass: false, historiansArchive: false, firstLastLetterUpgraded: false
            };
            wrongAnswers = [];
            permanentWrongAnswers = [];
        }

        function getQuestions(mode, grade, unit = 'all') {
            if (!gameQuestions[mode]) {
                console.warn(`Mode ${mode} not found.`);
                return [];
            }
            if (!gameQuestions[mode][grade]) {
                console.warn(`Grade ${grade} not found in mode ${mode}.`);
                return [];
            }

            const gradeData = gameQuestions[mode][grade];
            let questions = [];

            if (unit === 'all') {
                // Iterate over units (unit1, unit2, etc.)
                Object.entries(gradeData).forEach(([unitKey, unitQuestions]) => {
                    if (Array.isArray(unitQuestions)) {
                        const taggedQuestions = unitQuestions.map(q => ({
                            ...q,
                            unitName: unitKey.replace('unit', 'Unit ')
                        }));
                        questions = questions.concat(taggedQuestions);
                    }
                });
            } else if (gradeData[unit]) {
                questions = gradeData[unit].map(q => ({
                    ...q,
                    unitName: unit.replace('unit', 'Unit ')
                }));
            } else {
                console.warn(`Unit ${unit} not found in grade ${grade} for mode ${mode}.`);
            }

            return questions;
        }

        function updateUnitOptions() {
            const currentMode = gameMode === 'SIGMA' ? 'EASY' : gameMode;

            // Clear current buttons
            unitButtonContainer.innerHTML = '';

            // Add "All Units" button
            const allUnitsBtn = document.createElement('button');
            allUnitsBtn.className = 'selection-button all-units-btn';
            if (selectedUnit === 'all') allUnitsBtn.classList.add('selected');
            allUnitsBtn.textContent = 'All Units';
            allUnitsBtn.onclick = () => {
                playClickSound();
                selectedUnit = 'all';
                updateUnitOptions(); // Refresh to show selection
            };
            unitButtonContainer.appendChild(allUnitsBtn);

            if (gameQuestions[currentMode] && gameQuestions[currentMode][selectedGrade]) {
                const units = Object.keys(gameQuestions[currentMode][selectedGrade]);
                units.forEach(unit => {
                    const btn = document.createElement('button');
                    btn.className = 'selection-button';
                    if (selectedUnit === unit) btn.classList.add('selected');
                    // Format unit name (e.g., "unit1" -> "Unit 1")
                    btn.textContent = unit.charAt(0).toUpperCase() + unit.slice(1).replace(/(\d+)/, ' $1');
                    btn.onclick = () => {
                        playClickSound();
                        selectedUnit = unit;
                        updateUnitOptions(); // Refresh to show selection
                    };
                    unitButtonContainer.appendChild(btn);
                });
            }
        }

        // Initialize Grade Buttons
        gradeButtonContainer.querySelectorAll('.selection-button').forEach(btn => {
            btn.addEventListener('click', () => {
                playClickSound();
                selectedGrade = btn.dataset.value;
                selectedUnit = 'all'; // Reset unit when grade changes

                // Update visual selection
                gradeButtonContainer.querySelectorAll('.selection-button').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');

                updateUnitOptions();
            });

            // Set initial selection
            if (btn.dataset.value === selectedGrade) {
                btn.classList.add('selected');
            }
        });

        async function startGame() {
            try {
                if (Tone.context.state !== 'running') {
                    await Tone.start();
                }
            } catch (error) {
                console.warn("Tone.start() failed:", error);
            }
            if (storeNotificationInterval) clearInterval(storeNotificationInterval);
            playStartSound();
            resetPlayerState();
            isGamePaused = false; // Explicitly unpause the game at the start
            scoreEl.textContent = '0';
            streakEl.textContent = '0';
            correctAnswersEl.textContent = '0';
            sigmaProgressContainer.classList.add('hidden'); // Hide by default
            gradeModal.classList.add('hidden');

            let questionBank;
            let activeQuestionSetKey = selectedGrade; // Use the value from the selected grade button
            let initialNotification = "The challenge has begun. Good luck!";

            if (gameMode === 'SIGMA') {
                sigmaStage = 1;
                sigmaCorrectInStage = 0;
                sigmaProgressContainer.classList.remove('hidden');
                // Start with easy questions for stage 1
                activeQuestionSet = getQuestions('EASY', activeQuestionSetKey, selectedUnit);
                questionsCopy = [...activeQuestionSet];
                initialNotification = "SIGMA MODE: Stage 1 - Easy Questions. Good luck!";
            } else if (gameMode === 'FILL_BLANK') { // Handle FITB mode data loading
                activeQuestionSet = getQuestions('FILL_BLANK', activeQuestionSetKey, selectedUnit);
                questionsCopy = [...activeQuestionSet];
                initialNotification = "Drag the correct words to complete the historical passage!";
            } else {
                activeQuestionSet = getQuestions(gameMode, activeQuestionSetKey, selectedUnit);
                questionsCopy = [...activeQuestionSet];
            }

            shuffleArray(questionsCopy);
            // UI setup based on game mode
            const isSkibidi = gameMode === 'SKIBIDI';
            answerGridEl.classList.toggle('hidden', isSkibidi);
            skibidiFormEl.classList.toggle('hidden', !isSkibidi);
            mythAnswerButtons.classList.add('hidden'); // Hide myth buttons by default
            fitbAnswerArea.classList.add('hidden');
            hunchAbilityEl.classList.toggle('hidden', isSkibidi);
            firstLetterBtn.classList.toggle('hidden', !isSkibidi);

            const hunchUpgradeBtn = hunchUpgradeStoreItem.parentElement.querySelector('.buy-btn');
            if (isSkibidi) {
                firstLetterBtn.classList.remove('first-letter-btn-glow');
                if (hunchUpgradeBtn) hunchUpgradeBtn.dataset.item = 'firstLastLetterUpgrade';
            } else {
                if (hunchUpgradeBtn) hunchUpgradeBtn.dataset.item = 'hunchUpgrade';
            }

            updateAbilitiesUI();
            startTimer();
            updateNotification(initialNotification);
            displayNextQuestion();
            if (gameMode === 'SIGMA') {
                updateSigmaProgress();
            }
            startStoreNotifier();
        }

        function updateSigmaProgress() {
            if (gameMode !== 'SIGMA') return;

            const totalQuestionsInStage = activeQuestionSet.length;
            const requiredForNextStage = Math.ceil(totalQuestionsInStage / 2);

            // Progress is now based on correct answers in the stage
            const progress = (sigmaCorrectInStage / requiredForNextStage) * 100;
            sigmaProgressBar.style.width = `${progress}%`;
            sigmaProgressText.textContent = `${sigmaCorrectInStage} / ${requiredForNextStage} Correct`;
            sigmaStageDisplay.textContent = sigmaStage;
        }
        function startTimer() {
            if (timerInterval) clearInterval(timerInterval);
            timeLeft = gameMode === 'SIGMA' ? 60 : 300;
            timeHistory = [timeLeft];
            const initialMinutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const initialSeconds = (timeLeft % 60).toString().padStart(2, '0');

            timerEl.textContent = `${initialMinutes}:${initialSeconds}`;
            timerInterval = setInterval(() => {
                if (isGamePaused) return;
                timeLeft--;
                timeHistory.push(timeLeft);
                const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
                const seconds = (timeLeft % 60).toString().padStart(2, '0');
                timerEl.textContent = `${minutes}:${seconds}`;

                if (timeLeft === 150) updateNotification("Halfway through! Keep up the pace!");
                else if (timeLeft === 60) updateNotification("Warning: One minute remaining!");

                if (timeLeft <= 0) endGame();
            }, 1000);
        }

        function startStoreNotifier() {
            if (storeNotificationInterval) clearInterval(storeNotificationInterval);

            storeNotificationInterval = setInterval(() => {
                if (isGamePaused || isModalActive) return;

                // Find the minimum cost of an available item
                const minCost = Object.values(storeItems)
                    .filter(item => !item.permanent || !isItemPurchased(item))
                    .reduce((min, item) => Math.min(min, item.cost), Infinity);

                if (Math.floor(playerState.score) >= minCost) {
                    storeBtn.classList.add('store-ready');
                    updateNotification("You have enough points to buy items in the store! 🛍️");
                } else {
                    storeBtn.classList.remove('store-ready');
                }
            }, 10000); // Check every 10 seconds
        }

        function isItemPurchased(item) { return false; }

        function displayNextQuestion() {
            const questionControls = document.getElementById('question-controls');
            const fitbAnswerArea = document.getElementById('fitbAnswerArea');
            const questionBox = document.getElementById('questionBox');
            gameAreaEl.classList.add('switching');
            setTimeout(() => {
                const totalQuestionsInStage = activeQuestionSet.length;
                const requiredForNextStage = Math.ceil(totalQuestionsInStage / 2);

                // SIGMA Mode Stage Progression
                if (gameMode === 'SIGMA' && sigmaCorrectInStage >= requiredForNextStage) {
                    sigmaStage++;
                    let nextQuestionSet = null;
                    let stageName = '';

                    if (sigmaStage === 2) {
                        nextQuestionSet = getQuestions('HARD', selectedGrade, selectedUnit);
                        stageName = 'Hard';
                    } else if (sigmaStage === 3) {
                        nextQuestionSet = getQuestions('SKIBIDI', selectedGrade, selectedUnit);
                        stageName = 'Skibidi';
                    }

                    if (nextQuestionSet && nextQuestionSet.length > 0) {
                        activeQuestionSet = nextQuestionSet;
                        isGamePaused = true;
                        questionsCopy = [...activeQuestionSet];
                        shuffleArray(questionsCopy);
                        sigmaCorrectInStage = 0; // Reset correct counter for new stage

                        sigmaStageUpText.textContent = `Congratulations! You are now entering Stage ${sigmaStage}: ${stageName} Questions!`;
                        sigmaStageUpModal.classList.remove('hidden');

                        updateSigmaProgress();
                        playStreakSound();
                    } else {
                        // All stages are complete
                        endGame();
                        return;
                    }
                }

                if (questionsCopy.length === 0) {
                    endGame();
                    return;
                }


                const question = questionsCopy.shift();
                currentQuestionIndex = activeQuestionSet.indexOf(question); // Keep track of the original question

                const isMythTypeQuestion = gameMode === 'MYTH';
                const isSkibidiTypeQuestion = gameMode === 'SKIBIDI' || (gameMode === 'SIGMA' && sigmaStage === 3);
                const isFitbTypeQuestion = gameMode === 'FILL_BLANK';

                selectedWordEl = null; // Reset selection
                document.body.classList.remove('word-selected');
                // Reset UI elements for all modes
                answerGridEl.classList.add('hidden');
                skibidiFormEl.classList.add('hidden');
                mythAnswerButtons.classList.add('hidden');
                fitbAnswerArea.classList.add('hidden');
                hintBtn.classList.add('hidden'); // Hide by default, then show if applicable
                firstLetterBtn.classList.add('hidden'); // Hide by default, then show if applicable
                dokLabel.classList.add('hidden'); // Hide by default, then show if applicable

                // DOK Label Logic
                // DOK is only relevant for multiple-choice questions (Easy/Hard/Sigma-MC)
                if (question.dok && (gameMode === 'EASY' || gameMode === 'HARD' || gameMode === 'FILL_BLANK' || (gameMode === 'SIGMA' && sigmaStage < 3))) {
                    dokLabel.textContent = `DOK ${question.dok}`;
                    dokLabel.classList.remove('hidden');
                } else {
                    dokLabel.classList.add('hidden');
                }

                // Unit Label Logic
                if (question.unitName) {
                    unitLabelEl.textContent = question.unitName;
                    unitLabelEl.classList.remove('hidden');
                } else {
                    unitLabelEl.classList.add('hidden');
                }


                if (isMythTypeQuestion) {
                    // --- MYTH DEBUNKER LOGIC ---
                    mythAnswerButtons.classList.remove('hidden');
                    factBtn.disabled = false;
                    mythBtn.disabled = false;
                    questionBox.appendChild(questionControls);
                    questionBox.style.flex = "3 1 0";
                    answerAreaEl.style.flex = "1 1 0";
                } else if (isSkibidiTypeQuestion) {
                    // --- TYPED ANSWER LOGIC (SKIBIDI/SIGMA-SKIBIDI) ---
                    skibidiFormEl.classList.remove('hidden');
                    hintBtn.classList.remove('hidden'); // Show the standard hint button
                    firstLetterBtn.classList.remove('hidden'); // Show letter hint button for skibidi
                    questionBox.appendChild(questionControls);
                    questionBox.style.flex = "3 1 0";
                    answerAreaEl.style.flex = "1 1 0";
                } else if (isFitbTypeQuestion) {
                    // --- FILL IN THE BLANK LOGIC ---
                    fitbAnswerArea.classList.remove('hidden');
                    hintBtn.classList.remove('hidden');
                    // Move controls to the new submit container in FITB mode
                    document.getElementById('fitbSubmitContainer').appendChild(questionControls);
                    // Adjust flex ratios for FITB: Question needs more space, Answer area needs less
                    questionBox.style.flex = "4 1 0";
                    answerAreaEl.style.flex = "1 1 0";
                } else {
                    // --- MULTIPLE CHOICE LOGIC (EASY/HARD/SIGMA-MC) ---
                    answerGridEl.classList.remove('hidden');
                    hintBtn.classList.remove('hidden'); // Show the standard hint button
                    questionBox.appendChild(questionControls);
                    // Reset flex ratios for standard modes
                    questionBox.style.flex = "3 1 0";
                    answerAreaEl.style.flex = "1 1 0";
                }

                if(!isSkibidiTypeQuestion && !isMythTypeQuestion && !isFitbTypeQuestion) {
                    // --- MULTIPLE CHOICE LOGIC (EASY/HARD/SIGMA-MC) ---
                    if (!question || !question.choices) {
                        displayNextQuestion();
                        return;
                    }

                    // --- Answer Randomization ---
                    // 1. Create a mappable array of choices with their original index
                    let choicesWithOriginalIndex = question.choices.map((text, index) => ({ text, originalIndex: index }));

                    // 2. Shuffle this new array
                    shuffleArray(choicesWithOriginalIndex);

                    // 3. Find the new position of the correct answer
                    const newCorrectAnswerIndex = choicesWithOriginalIndex.findIndex(choice => choice.originalIndex === question.answer);

                    // Reset UI elements
                    answerChoices.forEach(choice => {
                        choice.classList.remove('correct', 'incorrect', 'removed');
                        choice.style.pointerEvents = 'auto';
                    });

                    // Apply Hunch logic before displaying, using the shuffled positions
                    if (playerState.historiansHunchPending) {
                        let wrongChoiceElements = [0, 1, 2, 3].filter(i => i !== newCorrectAnswerIndex);
                        shuffleArray(wrongChoiceElements);
                        const choicesToRemove = abilities.hunchUpgraded ? 2 : 1;
                        for(let i=0; i < choicesToRemove && i < wrongChoiceElements.length; i++) {
                            answerChoices[wrongChoiceElements[i]].classList.add('removed');
                            answerChoices[wrongChoiceElements[i]].style.pointerEvents = 'none';
                        }
                        playerState.historiansHunchPending = false;
                        const message = abilities.hunchUpgraded ? "Hunch Upgrade: Two wrong answers removed." : "Historian's Hunch: One wrong answer removed.";
                        updateNotification(message);
                    }

                    // 4. Populate the UI with the shuffled choices
                    answerChoices.forEach((choiceEl, index) => {
                        const choice = choicesWithOriginalIndex[index];
                        if (choice) {
                            choiceEl.classList.remove('hidden');
                            choiceEl.querySelector('p').textContent = choice.text;
                        } else {
                            choiceEl.classList.add('hidden');
                        }
                        // Temporarily store the new correct index on the game area for handleAnswerClick
                        gameAreaEl.dataset.correct = newCorrectAnswerIndex;
                    });
                } else if (isFitbTypeQuestion) {
                    renderFitbQuestion(question);
                } else { // --- TYPED ANSWER LOGIC (SKIBIDI/SIGMA-SKIBIDI) ---
                }

                // Reset hint button state
                hintBtn.disabled = false;
                if (gameMode === 'SKIBIDI') {
                    firstLetterBtn.disabled = false;
                }

                if (isFitbTypeQuestion) {
                    questionTextEl.classList.add('fitb-text');
                } else {
                    questionTextEl.classList.remove('fitb-text');
                    questionTextEl.textContent = question.question;
                }

                // For Skibidi and Myth mode, clear and enable input/buttons
                if (isSkibidiTypeQuestion) {
                    skibidiInputEl.value = '';
                    skibidiInputEl.disabled = false;
                    skibidiInputEl.focus();
                    skibidiInputEl.classList.remove('correct', 'incorrect');
                }

                gameAreaEl.classList.remove('switching');

                // Call adjustment to ensure layout is settled after transition
                adjustFontSize(questionTextEl);
                setTimeout(() => adjustFontSize(questionTextEl), 100);

                // Update progress AFTER the question has been shifted from the array.
                updateSigmaProgress();
                isTransitioning = false;
            }, 300);
        }

        // --- Resize Observer for Question Box ---
        const questionResizeObserver = new ResizeObserver(() => {
            const questionTextEl = document.getElementById('questionText');
            if (questionTextEl && !isTransitioning) {
                adjustFontSize(questionTextEl);
            }
        });
        const questionBox = document.getElementById('questionBox');
        if (questionBox) {
            questionResizeObserver.observe(questionBox);
        }

        // --- FITB ENGINE ---
        function renderFitbQuestion(question) {
            // 1. Render question text with drop zones
            let formattedText = question.text.replace(/\[\[(\d+)\]\]/g, '<span class="drop-zone empty" data-blank-index="$1"></span>');
            questionTextEl.innerHTML = formattedText;

            // 2. Generate Word Bank
            fitbWordBank.innerHTML = '';
            let allWords = [...question.blanks, ...question.distractors];
            shuffleArray(allWords);

            allWords.forEach(word => {
                const wordEl = document.createElement('div');
                wordEl.className = 'draggable-word';
                wordEl.textContent = word;
                wordEl.setAttribute('draggable', 'true');
                wordEl.dataset.word = word;
                fitbWordBank.appendChild(wordEl);
            });

            fitbSubmitBtn.classList.remove('hidden');
            fitbSubmitBtn.disabled = false;
            setupDragAndDrop();
        }

        let draggedWordEl = null;
        let touchClone = null;
        let currentDropZone = null;
        let selectedWordEl = null;

        function attachDraggableListeners(draggable) {
            // Click Events (Click to select)
            draggable.addEventListener('click', (e) => {
                playClickSound();
                if (selectedWordEl === draggable) {
                    draggable.classList.remove('selected');
                    selectedWordEl = null;
                    document.body.classList.remove('word-selected');
                } else {
                    if (selectedWordEl) {
                        selectedWordEl.classList.remove('selected');
                    }
                    draggable.classList.add('selected');
                    selectedWordEl = draggable;
                    document.body.classList.add('word-selected');
                }
            });

            // Mouse Events
            draggable.addEventListener('dragstart', (e) => {
                playDragStartSound();
                draggedWordEl = draggable;
                // Deselect if dragging
                if (selectedWordEl) {
                    selectedWordEl.classList.remove('selected');
                    selectedWordEl = null;
                }
                e.dataTransfer.setData('text/plain', draggable.dataset.word);
                setTimeout(() => draggable.classList.add('opacity-50'), 0);
            });
            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('opacity-50');
                draggedWordEl = null;
            });

            // Touch Events (Mobile Support)
            draggable.addEventListener('touchstart', (e) => {
                playDragStartSound();
                draggedWordEl = draggable;
                if (selectedWordEl) {
                    selectedWordEl.classList.remove('selected');
                    selectedWordEl = null;
                }
                const touch = e.touches[0];

                // Create a floating clone to follow the finger
                touchClone = draggable.cloneNode(true);
                touchClone.style.position = 'fixed';
                touchClone.style.left = (touch.clientX - draggable.offsetWidth / 2) + 'px';
                touchClone.style.top = (touch.clientY - draggable.offsetHeight / 2) + 'px';
                touchClone.style.opacity = '0.8';
                touchClone.style.pointerEvents = 'none'; // Essential so document.elementFromPoint works
                touchClone.style.zIndex = '1000';
                document.body.appendChild(touchClone);

                draggable.classList.add('opacity-50');
            }, { passive: false });

            draggable.addEventListener('touchmove', (e) => {
                if (!touchClone) return;
                e.preventDefault(); // Prevent screen scrolling while dragging
                const touch = e.touches[0];
                touchClone.style.left = (touch.clientX - touchClone.offsetWidth / 2) + 'px';
                touchClone.style.top = (touch.clientY - touchClone.offsetHeight / 2) + 'px';

                // Detect if the finger is hovering over a drop zone
                const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const dropZoneBelow = elemBelow ? elemBelow.closest('.drop-zone') : null;

                if (currentDropZone !== dropZoneBelow) {
                    if (currentDropZone) currentDropZone.classList.remove('drag-over');
                    currentDropZone = dropZoneBelow;
                    if (currentDropZone) currentDropZone.classList.add('drag-over');
                }
            }, { passive: false });

            draggable.addEventListener('touchend', (e) => {
                if (touchClone) {
                    touchClone.remove();
                    touchClone = null;
                }
                draggable.classList.remove('opacity-50');

                if (currentDropZone) {
                    currentDropZone.classList.remove('drag-over');
                    handleDrop(currentDropZone, draggedWordEl);
                    currentDropZone = null;
                }
                draggedWordEl = null;
            });

            draggable.addEventListener('touchcancel', () => {
                if (touchClone) {
                    touchClone.remove();
                    touchClone = null;
                }
                draggable.classList.remove('opacity-50');
                if (currentDropZone) {
                    currentDropZone.classList.remove('drag-over');
                    currentDropZone = null;
                }
                draggedWordEl = null;
            });
        }

        function setupDragAndDrop() {
            const draggables = document.querySelectorAll('.draggable-word');
            const dropZones = document.querySelectorAll('.drop-zone');

            draggables.forEach(attachDraggableListeners);

            dropZones.forEach(zone => {
                // Mouse Events for Drop Zones
                zone.addEventListener('dragover', (e) => {
                    e.preventDefault(); // Necessary to allow dropping
                    zone.classList.add('drag-over');
                });
                zone.addEventListener('dragleave', () => {
                    zone.classList.remove('drag-over');
                });
                zone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    zone.classList.remove('drag-over');
                    if (draggedWordEl) {
                        handleDrop(zone, draggedWordEl);
                    }
                });

                // Undo Mechanic & Click-to-drop
                zone.addEventListener('click', () => {
                    if (selectedWordEl) {
                        // User clicked a zone while a word is selected -> drop it
                        handleDrop(zone, selectedWordEl);
                    } else if (!zone.classList.contains('empty')) {
                        // User clicked a filled zone with no word selected -> undo
                        undoDrop(zone);
                    }
                });
            });
        }

        function handleDrop(zone, draggable) {
            if (!zone.classList.contains('empty')) { undoDrop(zone); } // Swap out existing word

            if (selectedWordEl === draggable) {
                selectedWordEl = null;
                document.body.classList.remove('word-selected');
            }

            const word = draggable.dataset.word;
            zone.textContent = word;
            zone.dataset.filledWord = word;
            zone.classList.remove('empty');
            zone.classList.remove('hint-highlight');
            zone.classList.add('filled');

            draggable.remove(); // Remove from word bank
            playDropSound();

            adjustFontSize(questionTextEl);
        }

        function undoDrop(zone) {
            const word = zone.dataset.filledWord;
            zone.textContent = '';
            zone.dataset.filledWord = '';
            zone.classList.add('empty');
            zone.classList.remove('filled');

            // Return to word bank
            const wordEl = document.createElement('div');
            wordEl.className = 'draggable-word';
            wordEl.textContent = word;
            wordEl.setAttribute('draggable', 'true');
            wordEl.dataset.word = word;
            fitbWordBank.appendChild(wordEl);
            attachDraggableListeners(wordEl);

            playUndoSound();

            adjustFontSize(questionTextEl);
        }

        function handleFitbSubmit() {
            const dropZones = document.querySelectorAll('.drop-zone');
            let allFilled = true;
            let allCorrect = true;

            const currentQuestion = activeQuestionSet[currentQuestionIndex];

            dropZones.forEach(zone => {
                if (zone.classList.contains('empty')) {
                    allFilled = false;
                } else {
                    const blankIndex = parseInt(zone.dataset.blankIndex);
                    const userWord = zone.dataset.filledWord;
                    if (userWord !== currentQuestion.blanks[blankIndex]) {
                        allCorrect = false;
                    }
                }
            });

            if (!allFilled) {
                updateNotification("Finish the passage first!");
                return;
            }

            // Disable buttons to prevent double-clicks
            fitbSubmitBtn.disabled = true;
            hintBtn.disabled = true;

            dropZones.forEach(zone => {
                const blankIndex = parseInt(zone.dataset.blankIndex);
                const userWord = zone.dataset.filledWord;
                if (userWord === currentQuestion.blanks[blankIndex]) {
                    zone.classList.add('success-bounce');
                } else {
                    zone.classList.add('error-shake');
                }
            });

            if (!allCorrect) {
                const bankWords = document.querySelectorAll('#fitbWordBank .draggable-word');
                bankWords.forEach(wordEl => {
                    if (currentQuestion.blanks.includes(wordEl.dataset.word)) {
                        wordEl.classList.add('correct');
                    }
                });
            }

            setTimeout(() => {
                handleAnswer(allCorrect, null);
            }, 500); // Give the animation time to play
        }
        // --- END FITB ENGINE ---

        function normalizeAnswer(answer) {
            return answer.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        }

        function handleSkibidiSubmit(e) {
            e.preventDefault();
            const userAnswer = skibidiInputEl.value;
            if (!userAnswer) return;

            const question = activeQuestionSet[currentQuestionIndex];
            const correctAnswers = Array.isArray(question.answer) ? question.answer : [question.answer];
            const isCorrect = correctAnswers.some(ans => normalizeAnswer(userAnswer) === normalizeAnswer(ans));

            skibidiInputEl.disabled = true;
            // Disable hint buttons after answering
            hintBtn.disabled = true;
            firstLetterBtn.disabled = true;

            handleAnswer(isCorrect, null);
        }


        function handleAnswerClick(e) {
            const selectedChoiceEl = e.currentTarget;
            const selectedAnswer = parseInt(selectedChoiceEl.dataset.choice);
            // Retrieve the correct answer's current position from the dataset
            const correctAnswer = parseInt(gameAreaEl.dataset.correct);

            // Disable hint buttons after answering
            hintBtn.disabled = true;
            firstLetterBtn.disabled = true;

            answerChoices.forEach(choice => choice.style.pointerEvents = 'none');
            selectedChoiceEl.classList.add(selectedAnswer === correctAnswer ? 'correct' : 'incorrect');
            if(selectedAnswer !== correctAnswer) {
                 answerChoices[correctAnswer].classList.add('correct');
            }

            handleAnswer(selectedAnswer === correctAnswer, selectedChoiceEl, selectedChoiceEl.querySelector('p').textContent);
        }

        function handleMythAnswerClick(e) {
            const selectedButton = e.currentTarget;
            const userAnswerIsFact = selectedButton.id === 'factBtn';

            // Disable buttons to prevent double-clicking
            factBtn.disabled = true;
            mythBtn.disabled = true;

            const question = activeQuestionSet[currentQuestionIndex];
            const isCorrect = userAnswerIsFact === question.isFact;

            // Highlight correct/incorrect
            selectedButton.classList.add(isCorrect ? 'correct' : 'incorrect');
            if (!isCorrect) {
                const correctButton = question.isFact ? factBtn : mythBtn;
                correctButton.classList.add('correct');
            }
            handleAnswer(isCorrect, null); // Pass null for selectedChoiceEl as it's not a standard MC
            showExplanation(question.explanation); // Always show explanation in Myth mode
        }

        function showExplanation(explanation, isCorrect) {
            isGamePaused = true;
            explanationTextEl.textContent = explanation;
            explanationModal.classList.remove('hidden');
        }

        function handleAnswer(isCorrect, selectedChoiceEl) {
            isTransitioning = true;
            let proceedToNextQuestionAutomatically = true;
            playerState.questionsAnswered++;
            const isSkibidi = gameMode === 'SKIBIDI' || (gameMode === 'SIGMA' && sigmaStage === 3);
            const isHunchEnabled = gameMode === 'EASY' || gameMode === 'HARD' || (gameMode === 'SIGMA' && sigmaStage < 3);
            const hunchThreshold = isSkibidi ? 3 : 5;
            const tinkerThreshold = isSkibidi ? 2 : 4;
            const skipThreshold = isSkibidi ? 2 : 3;
            const redoThreshold = isSkibidi ? 3 : 5;
            const boostThreshold = isSkibidi ? 4 : 7;

            // Update Score Boost button text and fill
            const boost3xThreshold = isSkibidi ? 6 : 10;
            const nextBoostThreshold = abilities.boost2xActive ? boost3xThreshold : boostThreshold;
            const boostText = abilities.boost3xActive ? '3x BOOST' : (abilities.boost2xActive ? '2x BOOST (Next: 3x)' : '2x BOOST');
            abilityBoostEl.querySelector('span').textContent = boostText;


            if (isCorrect) {
                // Add time in SIGMA mode
                if (gameMode === 'SIGMA') {
                    let timeToAdd = 15; // Default for stage 1
                    if (sigmaStage === 2) timeToAdd = 20;
                    if (sigmaStage === 3) timeToAdd = 25;
                    timeLeft += timeToAdd;
                    sigmaCorrectInStage++;
                    timeCardEl.classList.add('flash-green');
                    setTimeout(() => timeCardEl.classList.remove('flash-green'), 1000);
                } else if (isSkibidi) {
                    // This is for the original skibidi mode, not sigma skibidi stage
                    // No time is added here.
                }

                if(skibidiFormEl.style.display !== 'none') skibidiInputEl.classList.add('correct');
                playerState.correctAnswers++;
                playerState.wrongStreak = 0;

                let basePoints = abilities.loreMasterActive ? 1.25 : 1;
                let pointsToAdd;

                if (abilities.boost3xActive) {
                    pointsToAdd = basePoints * 3;
                } else if (abilities.boost2xActive) {
                    pointsToAdd = basePoints * 2;
                } else {
                    pointsToAdd = basePoints;
                }

                playerState.score += pointsToAdd; // Always update the actual score
                scoreEl.textContent = Number(playerState.score.toFixed(2)).toString().replace(/\.00$/, ''); // Then update the display
                correctAnswersEl.textContent = playerState.correctAnswers;

                if (isHunchEnabled && playerState.correctAnswers > 0 && playerState.correctAnswers % hunchThreshold === 0) {
                    playerState.historiansHunchPending = true;
                }

                playerState.streak++;
                streakEl.textContent = playerState.streak;

                let specialEventOccurred = false;
                if (playerState.streak === skipThreshold && !playerState.earned3Streak) {
                    abilities.skip++;
                    playerState.earned3Streak = true;
                    addNotification({ type: 'streak', text: "You earned a SKIP!" });
                    specialEventOccurred = true;
                } else if (playerState.streak === tinkerThreshold && !playerState.earned4Streak) {
                    timeLeft += 15;
                    timeCardEl.classList.add('flash-green');
                    setTimeout(() => timeCardEl.classList.remove('flash-green'), 1000);
                    playerState.earned4Streak = true;
                    addNotification({ type: 'streak', text: "TIME BONUS! +15 Seconds!" });
                    specialEventOccurred = true;
                } else if (playerState.streak === redoThreshold && !playerState.earned5Streak) {
                    abilities.redo++;
                    playerState.earned5Streak = true;
                    addNotification({ type: 'streak', text: "You earned a SECOND CHANCE!" });
                    specialEventOccurred = true;
                } else if (playerState.streak === boostThreshold && !abilities.boost2xActive) {
                    abilities.boost2xActive = true;
                    playerState.earned7Streak = true;
                    addNotification({ type: 'streak', text: "2x SCORE BOOST is active!" });
                    specialEventOccurred = true;
                } else if (playerState.streak === boost3xThreshold && !abilities.boost3xActive) {
                    abilities.boost3xActive = true;
                    playerState.earned10Streak = true;
                    addNotification({ type: 'streak', text: "UPGRADE! 3x SCORE BOOST is active!" });
                    specialEventOccurred = true;
                }

                // New Panther Buck Streak Logic
                const buckStreakThreshold = gameMode === 'HARD' ? 7 : (isSkibidi ? 5 : (gameMode === 'FILL_BLANK' ? 4 : 10));
                if (playerState.streak > 0 && playerState.streak % buckStreakThreshold === 0 && !playerState.pantherBucksAwardedForStreaks.includes(playerState.streak)) {
                    playerState.pantherBucksEarned++;
                    playerState.pantherBucksAwardedForStreaks.push(playerState.streak);
                    addNotification({ type: 'pantherBuck' });
                    updateNotification(`A ${playerState.streak}-streak earned you a Panther Buck!`);
                    specialEventOccurred = true; // This ensures the panther buck modal shows
                }

                if (!specialEventOccurred && notificationQueue.length === 0) {
                    playCorrectSound();
                    triggerConfetti();
                }

                if (abilities.skip > 0) updateNotification("SKIP ability is ready to use.");
                // This notification is no longer relevant with the new streak-based system.
                // else if (buckThreshold - playerState.pantherBuckProgress === 1) updateNotification("One more for a Panther Buck!");
                else if (playerState.streak === 2) updateNotification("Great! That's two in a row.");
                else if (playerState.streak === 6) updateNotification("Incredible 6-question streak!");
                else {
                    const randomMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)];
                    updateNotification(randomMessage);
                }

                if (isSkibidi && !abilities.firstLastLetterUpgraded && playerState.score >= 5) {
                    updateNotification("You can afford Letter Insight in the store!");
                }

            } else { // If the answer is INCORRECT
                playIncorrectSound();
                document.body.classList.add('red-flash');

                // Store the actual question object
                const currentQuestionObject = activeQuestionSet[currentQuestionIndex];

                if (currentQuestionObject && !wrongAnswers.includes(currentQuestionObject)) {
                    wrongAnswers.push(currentQuestionObject);
                }

                if (currentQuestionObject && !permanentWrongAnswers.includes(currentQuestionObject)) {
                    permanentWrongAnswers.push(currentQuestionObject);
                }

                // Streak Insurance Check
                if (abilities.streakInsurance) {
                    abilities.streakInsurance = false; // Use up the insurance
                    updateNotification("Streak Insurance saved your streak!");
                } else {
                    playerState.streak = 0;
                    playerState.earned3Streak = false;
                    playerState.earned4Streak = false;
                    playerState.earned5Streak = false;
                    playerState.earned7Streak = false;
                    playerState.earned10Streak = false;
                    // Resetting streak also means they can earn panther bucks again for those streaks if they reach them.
                    if (abilities.boost2xActive || abilities.boost3xActive) {
                        abilities.boost2xActive = abilities.boost3xActive = false;
                        updateNotification("2x Boost lost! Be careful.");
                    }
                }

                playerState.wrongStreak++;
                streakEl.textContent = playerState.streak;

                if (playerState.wrongStreak === 2 && gameMode !== 'MYTH') playerState.wrongStreak = 0; // Only reset wrong streak for non-myth modes

                headerGridEl.classList.add('shake');
                gameAreaEl.classList.add('shake');

                if (!skibidiFormEl.classList.contains('hidden')) { // Check if it's a typed-answer question
                    proceedToNextQuestionAutomatically = false; // Stop the automatic next question
                    skibidiInputEl.classList.add('incorrect');
                    updateNotification("Incorrect. Review the answer below.");

                    // Show the modal with the correct answer
                    const question = activeQuestionSet[currentQuestionIndex];
                    if (!question) { // Fallback if question is somehow undefined
                        updateNotification("Error: Question not found for review.");
                        return;
                    }
                    const correctAnswer = Array.isArray(question.answer) ? question.answer.join(' / ') : question.answer;
                    skibidiCorrectAnswerTextEl.textContent = correctAnswer;
                    isGamePaused = true;
                    skibidiIncorrectModal.classList.remove('hidden');
                } else {
                    updateNotification("Incorrect. Don't lose focus!");
                }

                setTimeout(() => {
                    headerGridEl.classList.remove('shake');
                    gameAreaEl.classList.remove('shake');
                    document.body.classList.remove('red-flash');
                    if(!skibidiFormEl.classList.contains('hidden')) {
                        skibidiInputEl.classList.remove('correct', 'incorrect');
                    }
                }, 500);
            }

            updateAbilitiesUI();
            if (proceedToNextQuestionAutomatically && gameMode !== 'MYTH') { // Do not auto-proceed in Myth mode
                setTimeout(displayNextQuestion, 2000);
            }
        }

        function endGame() {
            if (!timerInterval && endGameModal.classList.contains('hidden')) return;
            clearInterval(timerInterval);
            clearInterval(storeNotificationInterval);
            timerInterval = null;
            isGamePaused = true;
            timerEl.textContent = "00:00";
            finalScoreEl.textContent = Math.floor(playerState.score);

            if (permanentWrongAnswers.length > 0) {
                mistakesReviewTextEl.textContent = `You made ${permanentWrongAnswers.length} mistake(s).`;
                reviewMistakesBtn.classList.remove('hidden');
            } else {
                mistakesReviewTextEl.textContent = "You made 0 mistakes. Perfect game!";
                reviewMistakesBtn.classList.add('hidden');
            }

            endGameModal.classList.remove('hidden');
        }


        function setupNewTurn() {
            if(timerInterval) clearInterval(timerInterval);
            if(storeNotificationInterval) clearInterval(storeNotificationInterval);
            timeLeft = 300;
            timerEl.textContent = "05:00";
            endGameModal.classList.add('hidden');
            difficultyModal.classList.remove('hidden'); // Go back to difficulty select
            gradeModal.classList.add('hidden');
            reviewModal.classList.add('hidden');
            scoreEl.textContent = '0';
            streakEl.textContent = '0';
            sigmaProgressContainer.classList.add('hidden');
            correctAnswersEl.textContent = '0';
            questionTextEl.textContent = 'Choose your difficulty to begin!';

            if(gameMode !== 'SKIBIDI') {
                answerChoices.forEach(choice => {
                    choice.querySelector('p').textContent = '';
                    choice.classList.remove('correct', 'incorrect');
                });
            } else {
                // Reset store buttons to their default state on a new turn
                buyBtns.forEach(btn => {
                    btn.disabled = false;
                    btn.classList.remove('purchased');
                    const itemName = btn.dataset.item;
                    if (storeItems[itemName]) {
                        btn.textContent = `Buy (${storeItems[itemName].cost} Pts)`;
                    }
                });
                skibidiInputEl.value = '';
            }

            fitbAnswerArea.classList.add('hidden');
            document.getElementById('fitbWordBank').innerHTML = '';

            selectedWordEl = null; // Reset selection
            document.body.classList.remove('word-selected');
            resetPlayerState();
            updateAbilitiesUI();
            storeBtn.classList.remove('store-ready');
            updateNotification("Welcome! Choose your difficulty to begin.");
        }

        function resetAllData() {
            playClickSound();
            resetConfirmModal.classList.add('hidden');
            setupNewTurn();
        }

        function showHint() {
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

                // Highlight the first empty drop zone in FITB mode
                if (gameMode === 'FILL_BLANK') {
                    const firstEmptyZone = document.querySelector('.drop-zone.empty');
                    if (firstEmptyZone) {
                        firstEmptyZone.classList.add('hint-highlight');
                    }
                }
            }
        }

        function showFirstLetters() {
            playClickSound();
            const currentQuestion = activeQuestionSet[currentQuestionIndex];
            const isSkibidiTypeQuestion = currentQuestion && !currentQuestion.choices;

            if (currentQuestionIndex > -1 && isSkibidiTypeQuestion) {
                isGamePaused = true;
                const question = activeQuestionSet[currentQuestionIndex];
                // Use the first answer in the array if multiple are possible
                const answer = (Array.isArray(question.answer) ? question.answer[0] : question.answer).trim();
                let hintText;
                if (abilities.firstLastLetterUpgraded) {
                    const first = answer.charAt(0);
                    const last = answer.length > 1 ? answer.charAt(answer.length - 1) : '';
                    hintText = `${first}...${last}`;
                } else {
                    hintText = answer.split(' ').map(word => word.charAt(0)).join(' ');
                }
                firstLetterTextEl.textContent = hintText.toUpperCase();
                firstLetterModal.classList.remove('hidden');
            }
        }

        function showHelpModal() {
            playClickSound();
            isGamePaused = true;
            const isSkibidi = gameMode === 'SKIBIDI';

            // Clear existing content
            const helpContainer = document.getElementById('helpContentContainer');
            helpContainer.innerHTML = '';

            // Set title
            abilityInfoModal.querySelector('h2').textContent = "Help Center";

            // Generate content based on game mode
            const helpContent = `
                <div class="grid md:grid-cols-2 gap-4 text-base">
                    <div class="bg-slate-100 p-4 rounded-lg border-2 border-slate-300">
                        <h3 class="font-bold text-lg mb-2 text-blue-600">🎯 Game Goal</h3>
                        <p>Answer as many questions as you can before the timer runs out! Correct answers earn points, and streaks unlock special abilities.</p>
                    </div>
                    <div class="bg-slate-100 p-4 rounded-lg border-2 border-slate-300">
                        <h3 class="font-bold text-lg mb-2 text-yellow-600">🛍️ The Store</h3>
                        <p>Click the "Store" button to spend points on powerful one-time items and permanent upgrades to help you in your game.</p>
                    </div>
                    <div class="bg-slate-100 p-4 rounded-lg border-2 border-slate-300 ${isSkibidi ? '' : 'md:col-span-2'}">
                        <h3 class="font-bold text-lg mb-2 text-orange-600">${isSkibidi ? '⌨️ Skibidi Mode' : '❓ Hints'}</h3>
                        ${isSkibidi ? `
                        <ul class="list-disc list-inside space-y-1">
                            <li><strong>Type Your Answers:</strong> No multiple choice! Spelling counts.</li>
                            <li><strong>Letter Hints:</strong> Use the 'A_' button to see the first letter(s) of the answer.</li>
                            <li><strong>Faster Abilities:</strong> All streak and correct-answer requirements are reduced!</li>
                        </ul>
                        ` : `
                        <p>Click the <strong>'?' button</strong> below the question to get a clue. Be careful, the timer will pause while the hint is open unless you have a special item from the store!</p>
                        `}
                    </div>
                    <div class="bg-slate-100 p-4 rounded-lg border-2 border-slate-300 ${isSkibidi ? '' : 'md:col-span-2'}">
                        <h3 class="font-bold text-lg mb-2 text-purple-600">⚡ Abilities</h3>
                        <p class="mb-2">Abilities are earned through streaks and total correct answers. They are divided into Passive (automatic) and Active (clickable) types.</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li><strong>Time Tinkerer (Passive):</strong> Get a <strong>${isSkibidi ? '2' : '4'}-streak</strong> to add <strong>15 seconds</strong> to the clock.</li>
                            ${!isSkibidi ? `<li><strong>Historian's Hunch (Passive):</strong> For every <strong>5 correct answers</strong>, one wrong choice is removed on the next question.</li>` : ''}
                            <li><strong>Panther Bucks (Streak-Based):</strong> Earn a Panther Buck for achieving a <strong>${gameMode === 'HARD' ? '7' : (isSkibidi ? '5' : '10')}-streak</strong>!</li>
                            <li><strong>SKIP (Active):</strong> Earned at a <strong>${isSkibidi ? '2' : '3'}-streak</strong>. Click to skip a hard question.</li>
                            <li><strong>REDO (Active):</strong> Earned at a <strong>${isSkibidi ? '3' : '5'}-streak</strong>. Brings back all your wrong answers for another try.</li>
                            <li><strong>2x BOOST (Active):</strong> Earned at a <strong>${isSkibidi ? '4' : '7'}-streak</strong>. Doubles your points until you get one wrong.</li>
                        </ul>
                    </div>
                </div>
            `;
            helpContainer.innerHTML = helpContent;
            abilityInfoModal.classList.remove('hidden');
        }

        // --- REVIEW MISTAKES LOGIC ---
        function openReviewModal() {
            playClickSound();
            if (permanentWrongAnswers.length === 0) return;
            reviewIndex = 0;
            endGameModal.classList.add('hidden');
            reviewModal.classList.remove('hidden');
            displayReviewQuestion();
        }

        function displayReviewQuestion() {
            const question = permanentWrongAnswers[reviewIndex];

            document.getElementById('reviewCounter').textContent = `${reviewIndex + 1} / ${permanentWrongAnswers.length}`;

            if (question.unitName) {
                reviewUnitLabelEl.textContent = question.unitName;
                reviewUnitLabelEl.classList.remove('hidden');
            } else {
                reviewUnitLabelEl.classList.add('hidden');
            }

            if (question.text) {
                reviewQuestionEl.innerHTML = question.text.replace(/\[\[\d+\]\]/g, '_______');
            } else {
                reviewQuestionEl.textContent = question.question;
            }

            reviewChoicesEl.innerHTML = ''; // Clear previous choices

            if (gameMode === 'MYTH') {
                reviewUserAnswerEl.classList.add('hidden');
                const correctAnswerText = question.isFact ? 'Fact' : 'Myth';
                reviewChoicesEl.innerHTML = `
                    <div class="p-3 rounded-lg bg-green-200 border-2 border-green-700 text-green-800 font-bold">Correct Answer: ${correctAnswerText}</div>
                    <div class="p-3 mt-2 rounded-lg bg-yellow-100 border-2 border-yellow-400 text-yellow-800">${question.explanation}</div>
                `;
            } else if (question.blanks) { // FILL_BLANK check
                reviewUserAnswerEl.classList.add('hidden');
                const correctAnswerText = question.blanks.join(', ');
                reviewChoicesEl.innerHTML = `<div class="p-3 rounded-lg bg-green-200 border-2 border-green-700 text-green-800 font-bold">Correct Answers: ${correctAnswerText}</div>`;
            } else if (!question.choices) { // Check if it's a skibidi-type question
                reviewUserAnswerEl.classList.add('hidden'); // Not tracking user's typed answer for now
                const correctAnswerText = Array.isArray(question.answer) ? question.answer.join(' / ') : question.answer;
                reviewChoicesEl.innerHTML = `<div class="p-3 rounded-lg bg-green-200 border-2 border-green-700 text-green-800 font-bold">Correct Answer: ${correctAnswerText}</div>`;
            } else { // Standard multiple-choice question
                reviewUserAnswerEl.classList.add('hidden'); // Not tracking user's choice for now
                question.choices.forEach((choiceText, index) => {
                    const choiceDiv = document.createElement('div');
                    choiceDiv.textContent = choiceText;
                    choiceDiv.className = 'p-3 rounded-lg border-2';
                    if (index === question.answer) {
                        choiceDiv.classList.add('bg-green-200', 'border-green-700', 'text-green-800', 'font-bold');
                    } else {
                        choiceDiv.classList.add('bg-gray-100', 'border-gray-400');
                    }
                    reviewChoicesEl.appendChild(choiceDiv);
                });
            }

            prevReviewBtn.disabled = reviewIndex === 0;
            nextReviewBtn.disabled = reviewIndex === permanentWrongAnswers.length - 1;
        }




        // --- EVENT LISTENERS ---
        easyModeBtn.addEventListener('click', () => {
            playClickSound();
            gameMode = 'EASY';
            difficultyModal.classList.add('hidden');
            easyRulesModal.classList.remove('hidden');
        });
        hardModeBtn.addEventListener('click', () => {
            playClickSound();
            gameMode = 'HARD';
            difficultyModal.classList.add('hidden');
            hardRulesModal.classList.remove('hidden');
        });

        acceptEasyBtn.addEventListener('click', () => {
            playClickSound();
            easyRulesModal.classList.add('hidden');
            updateUnitOptions();
            gradeModal.classList.remove('hidden');
        });
        declineEasyBtn.addEventListener('click', () => {
            playClickSound();
            easyRulesModal.classList.add('hidden');
            difficultyModal.classList.remove('hidden');
        });
        acceptHardBtn.addEventListener('click', () => {
            playClickSound();
            hardRulesModal.classList.add('hidden');
            updateUnitOptions();
            gradeModal.classList.remove('hidden');
        });
        declineHardBtn.addEventListener('click', () => {
            playClickSound();
            hardRulesModal.classList.add('hidden');
            difficultyModal.classList.remove('hidden');
        });
        skibidiModeBtn.addEventListener('click', () => {
            playClickSound();
            gameMode = 'SKIBIDI';
            difficultyModal.classList.add('hidden');
            skibidiRulesModal.classList.remove('hidden');
        });

        fitbModeBtn.addEventListener('click', () => {
            playClickSound();
            gameMode = 'FILL_BLANK';
            difficultyModal.classList.add('hidden');
            fitbRulesModal.classList.remove('hidden');
        });
        acceptFitbBtn.addEventListener('click', () => {
            playClickSound();
            fitbRulesModal.classList.add('hidden');
            updateUnitOptions();
            gradeModal.classList.remove('hidden');
        });
        declineFitbBtn.addEventListener('click', () => {
            playClickSound();
            fitbRulesModal.classList.add('hidden');
            difficultyModal.classList.remove('hidden');
        });

        sigmaModeBtn.addEventListener('click', () => {
            playClickSound();
            gameMode = 'SIGMA';
            difficultyModal.classList.add('hidden');
            sigmaRulesModal.classList.remove('hidden');
        });
        acceptSigmaBtn.addEventListener('click', () => {
            playClickSound();
            sigmaRulesModal.classList.add('hidden');
            updateUnitOptions();
            gradeModal.classList.remove('hidden');
        });
        declineSigmaBtn.addEventListener('click', () => {
            playClickSound();
            sigmaRulesModal.classList.add('hidden');
            difficultyModal.classList.remove('hidden');
        });

        acceptSkibidiBtn.addEventListener('click', () => {
            playClickSound();
            skibidiRulesModal.classList.add('hidden');
            updateUnitOptions();
            gradeModal.classList.remove('hidden');
        });
        declineSkibidiBtn.addEventListener('click', () => {
            playClickSound();
            skibidiRulesModal.classList.add('hidden');
            difficultyModal.classList.remove('hidden');
        });

        mythModeBtn.addEventListener('click', () => {
            playClickSound();
            gameMode = 'MYTH';
            difficultyModal.classList.add('hidden');
            mythRulesModal.classList.remove('hidden');
        });
        acceptMythBtn.addEventListener('click', () => {
            playClickSound();
            mythRulesModal.classList.add('hidden');
            updateUnitOptions();
            gradeModal.classList.remove('hidden');
        });
        declineMythBtn.addEventListener('click', () => {
            playClickSound();
            mythRulesModal.classList.add('hidden');
            difficultyModal.classList.remove('hidden');
        });

        backToDifficultyBtn.addEventListener('click', () => {
            playClickSound();
            gradeModal.classList.add('hidden');
            difficultyModal.classList.remove('hidden');
        });


        startGameBtn.addEventListener('click', startGame);
        newGameBtn.addEventListener('click', () => { playClickSound(); setupNewTurn(); });
        reviewMistakesBtn.addEventListener('click', openReviewModal);
        closeReviewBtn.addEventListener('click', () => {
            playClickSound();
            reviewModal.classList.add('hidden');
            endGameModal.classList.remove('hidden'); // Show end game modal again
        });
        nextReviewBtn.addEventListener('click', () => {
            playClickSound();
            if (reviewIndex < permanentWrongAnswers.length - 1) { reviewIndex++; displayReviewQuestion(); }
        });
        prevReviewBtn.addEventListener('click', () => {
            playClickSound();
            if (reviewIndex > 0) { reviewIndex--; displayReviewQuestion(); }
        });
        storeBtn.addEventListener('click', openStore);
        endTurnBtn.addEventListener('click', () => { playClickSound(); endGame(); });
        resetAllBtn.addEventListener('click', () => { playClickSound(); resetConfirmModal.classList.remove('hidden'); });
        aboutBtn.addEventListener('click', () => { playClickSound(); aboutModal.classList.remove('hidden'); });
        hintBtn.addEventListener('click', showHint);
        closeAboutBtn.addEventListener('click', () => { playClickSound(); aboutModal.classList.add('hidden'); });
        confirmResetBtn.addEventListener('click', resetAllData);
        cancelResetBtn.addEventListener('click', () => { playClickSound(); resetConfirmModal.classList.add('hidden'); });

        // Settings Modal Listeners
        settingsBtn.addEventListener('click', () => {
            playClickSound();
            isGamePaused = true;
            // Sync sound toggle UI
            soundToggle.classList.toggle('bg-green-500', !isMuted);
            soundToggle.classList.toggle('bg-gray-300', isMuted);
            document.getElementById('soundToggleKnob').classList.toggle('translate-x-6', !isMuted);
            document.getElementById('soundToggleKnob').classList.toggle('translate-x-1', isMuted);
            settingsModal.classList.remove('hidden');
        });
        closeSettingsBtn.addEventListener('click', () => {
            playClickSound();
            settingsModal.classList.add('hidden');
            if (timerInterval) isGamePaused = false;
        });
        soundToggle.addEventListener('click', () => {
            isMuted = !isMuted;
            soundToggle.classList.toggle('bg-green-500', !isMuted);
            soundToggle.classList.toggle('bg-gray-300', isMuted);
            document.getElementById('soundToggleKnob').classList.toggle('translate-x-6', !isMuted);
            document.getElementById('soundToggleKnob').classList.toggle('translate-x-1', isMuted);
            if (!isMuted) playClickSound();
        });

        closeHintBtn.addEventListener('click', () => {
            playClickSound();
            hintModal.classList.add('hidden');
            if (timerInterval) isGamePaused = false;
        });
        closeExplanationBtn.addEventListener('click', () => {
            playClickSound();
            explanationModal.classList.add('hidden');
            isGamePaused = false;
            displayNextQuestion(); // Move to the next question after closing the explanation
        });
        closeStreakBtn.addEventListener('click', () => {
            playClickSound();
            streakModal.classList.add('hidden');
            isModalActive = false;
            processNotificationQueue();
        });
        firstLetterBtn.addEventListener('click', showFirstLetters);
        closeFirstLetterBtn.addEventListener('click', () => {
            playClickSound();
            firstLetterModal.classList.add('hidden');
            isGamePaused = false;
        });
        answerChoices.forEach(choice => choice.addEventListener('click', handleAnswerClick));
        factBtn.addEventListener('click', handleMythAnswerClick);
        mythBtn.addEventListener('click', handleMythAnswerClick);
        skibidiFormEl.addEventListener('submit', handleSkibidiSubmit);
        fitbSubmitBtn.addEventListener('click', handleFitbSubmit);

        // Listener for the new Skibidi incorrect modal
        closeSkibidiIncorrectBtn.addEventListener('click', () => {
            playClickSound();
            skibidiIncorrectModal.classList.add('hidden');
            isGamePaused = false;
            displayNextQuestion(); // Proceed to the next question only after closing the modal
        });

        closeSigmaStageUpBtn.addEventListener('click', () => {
            playClickSound();
            sigmaStageUpModal.classList.add('hidden');
            isGamePaused = false;
            updateNotification(`Stage ${sigmaStage} has begun. Good luck!`);
        });

        // Store Listeners
        closeStoreBtn.addEventListener('click', () => { playClickSound(); storeModal.classList.add('hidden'); });
        buyBtns.forEach(btn => btn.addEventListener('click', buyItem));

        // Ability Listeners
        abilitySkipEl.addEventListener('click', activateSkip);
        abilityRedoEl.addEventListener('click', activateRedo);
        abilityInfoBtn.addEventListener('click', showHelpModal);
        closeAbilityInfoBtn.addEventListener('click', () => {
            playClickSound();
            abilityInfoModal.classList.add('hidden');
            // Only unpause if the game is actually running and not showing another modal
            if (timerInterval) isGamePaused = false;
        });
        closePantherBuckBtn.addEventListener('click', () => {
            playClickSound();
            pantherBuckModal.classList.add('hidden');
            isModalActive = false;
            processNotificationQueue();
        });

        // Initial setup
        updateNotification("Welcome! Choose your difficulty to begin.");

        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (currentQuestionIndex > -1) {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    adjustFontSize(questionTextEl);
                }, 150);
            }
        });

        // Tooltip Logic (Store and Game Modes)
        const storeTooltip = document.getElementById('storeTooltip');
        const tooltipElements = document.querySelectorAll('[data-description]');

        tooltipElements.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                const desc = item.dataset.description;
                if (desc) {
                    storeTooltip.textContent = desc;
                    storeTooltip.style.display = 'block';
                }
            });
            item.addEventListener('mousemove', (e) => {
                storeTooltip.style.left = e.clientX + 15 + 'px';
                storeTooltip.style.top = e.clientY + 15 + 'px';
            });
            item.addEventListener('mouseleave', () => {
                storeTooltip.style.display = 'none';
            });
        });
