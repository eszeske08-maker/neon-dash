// Mobile Touch Controls - Simple version with mouse/touch support
(function () {
    window.addEventListener('load', () => {
        const game = window.game;
        if (!game) {
            console.warn('Game not found');
            return;
        }

        function vibrate(pattern) {
            if (navigator.vibrate) navigator.vibrate(pattern);
        }

        // START button
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (game.state === 0 && !game.highScorePending) {
                    game.initLevel();
                    game.startGame();
                }
            });
        }

        // D-pad - works with both touch and mouse
        const dpadButtons = document.querySelectorAll('.dpad-btn');
        const keyMap = { 'up': 'ArrowUp', 'down': 'ArrowDown', 'left': 'ArrowLeft', 'right': 'ArrowRight' };

        dpadButtons.forEach(btn => {
            const keyCode = keyMap[btn.dataset.direction];

            // Mouse events (for DevTools emulation)
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                if (game.keys) game.keys[keyCode] = true;
                console.log('Direction:', keyCode, 'ON');
                vibrate(10);
            });

            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                if (game.keys) game.keys[keyCode] = false;
                console.log('Direction:', keyCode, 'OFF');
            });

            btn.addEventListener('mouseleave', () => {
                if (game.keys) game.keys[keyCode] = false;
            });

            // Touch events (for real mobile)
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (game.keys) game.keys[keyCode] = true;
                vibrate(10);
            });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (game.keys) game.keys[keyCode] = false;
            });
        });

        // TNT button
        const tntBtn = document.getElementById('mobile-tnt-btn');
        if (tntBtn) {
            const handleTnt = (e) => {
                e.preventDefault();
                if (game.state === 2 && game.placeDynamite) {
                    game.placeDynamite();
                    vibrate(30);
                }
            };
            tntBtn.addEventListener('click', handleTnt);
            tntBtn.addEventListener('touchstart', handleTnt);
        }

        // Pause button
        const pauseBtn = document.getElementById('mobile-pause-btn');
        if (pauseBtn) {
            const handlePause = (e) => {
                e.preventDefault();
                if (game.state === 2) {
                    game.prevState = 2;
                    game.state = 3;
                    document.getElementById('pause-overlay').classList.remove('hidden');
                } else if (game.state === 3) {
                    game.state = 2;
                    document.getElementById('pause-overlay').classList.add('hidden');
                }
                vibrate(15);
            };
            pauseBtn.addEventListener('click', handlePause);
            pauseBtn.addEventListener('touchstart', handlePause);
        }

        // Haptic feedback on game events
        const origDiamond = game.collectDiamond;
        if (origDiamond) {
            game.collectDiamond = function (x, y) {
                vibrate(20);
                return origDiamond.call(this, x, y);
            };
        }

        const origGameOver = game.gameOver;
        if (origGameOver) {
            game.gameOver = function () {
                vibrate([100, 50, 100]);
                return origGameOver.call(this);
            };
        }

        console.log('Mobile controls ready! (mouse + touch)');
    });
})();
