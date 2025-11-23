// Mobile Touch Controls and Haptic Feedback
// Simple standalone script to add mobile support

(function () {
    // Wait for game to load
    window.addEventListener('load', () => {
        const game = window.game; // Assumes game is global
        if (!game) {
            console.warn('Game not found, mobile controls not initialized');
            return;
        }

        // Touch input state
        let touchDir = { x: 0, y: 0 };

        // Haptic feedback helper
        function vibrate(pattern) {
            if (navigator.vibrate) {
                navigator.vibrate(pattern);
            }
        }

        // START button handler (for mobile and desktop)
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                // Check if in menu (state 0) and not in highscore entry
                if (game.state === 0 && !game.highScorePending) {
                    game.initLevel();
                    game.startGame();
                }
            });
        }

        // D-pad buttons
        const dpadButtons = document.querySelectorAll('.dpad-btn');
        dpadButtons.forEach(btn => {
            const dir = btn.dataset.direction;

            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                switch (dir) {
                    case 'up': touchDir.y = -1; break;
                    case 'down': touchDir.y = 1; break;
                    case 'left': touchDir.x = -1; break;
                    case 'right': touchDir.x = 1; break;
                }
                vibrate(10); // Short pulse
            });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (dir === 'up' || dir === 'down') touchDir.y = 0;
                if (dir === 'left' || dir === 'right') touchDir.x = 0;
            });
        });

        // TNT button
        const tntBtn = document.getElementById('mobile-tnt-btn');
        if (tntBtn) {
            tntBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                // STATE.PLAYING is 2
                if (game.state === 2 && game.placeDynamite) {
                    game.placeDynamite();
                    vibrate(30); // Medium pulse
                }
            });
        }

        // Pause button
        const pauseBtn = document.getElementById('mobile-pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                // STATE.PLAYING = 2, STATE.PAUSED = 3
                if (game.state === 2) {
                    game.prevState = 2;
                    game.state = 3;
                    document.getElementById('pause-overlay').classList.remove('hidden');
                } else if (game.state === 3) {
                    game.state = game.prevState || 2;
                    document.getElementById('pause-overlay').classList.add('hidden');
                }
                vibrate(15);
            });
        }

        // Initialize gamepadInput if not exists
        if (!game.gamepadInput) {
            game.gamepadInput = { x: 0, y: 0 };
        }

        // Continuously update gamepadInput from touch
        setInterval(() => {
            game.gamepadInput.x = touchDir.x;
            game.gamepadInput.y = touchDir.y;
        }, 16); // ~60fps

        // Add haptic feedback to key game events
        const originalCollectDiamond = game.collectDiamond;
        if (originalCollectDiamond) {
            game.collectDiamond = function (x, y) {
                vibrate(20); // Diamond collect
                return originalCollectDiamond.call(this, x, y);
            };
        }

        const originalGameOver = game.gameOver;
        if (originalGameOver) {
            game.gameOver = function () {
                vibrate([100, 50, 100]); // Death vibration pattern
                return originalGameOver.call(this);
            };
        }

        console.log('Mobile touch controls initialized!');
        console.log('Touch input:', touchDir);
    });
})();
