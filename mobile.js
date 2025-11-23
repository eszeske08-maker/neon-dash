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
                if (game.state === STATE.PLAYING) {
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
                if (game.state === STATE.PLAYING) {
                    game.prevState = STATE.PLAYING;
                    game.state = STATE.PAUSED;
                    document.getElementById('pause-overlay').classList.remove('hidden');
                } else if (game.state === STATE.PAUSED) {
                    game.state = game.prevState || STATE.PLAYING;
                    document.getElementById('pause-overlay').classList.add('hidden');
                }
                vibrate(15);
            });
        }

        // Inject touch input into game loop
        const originalUpdate = game.update;
        if (originalUpdate) {
            game.update = function (deltaTime) {
                // Apply touch input like keyboard/gamepad
                if (touchDir.x !== 0 || touchDir.y !== 0) {
                    this.gamepadInput = { x: touchDir.x, y: touchDir.y };
                }
                originalUpdate.call(this, deltaTime);
            };
        }

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
    });
})();
