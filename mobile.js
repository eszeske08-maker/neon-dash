// Mobile Controls - Touch optimized with state polling for RESTART
(function () {
    window.addEventListener('load', () => {
        const game = window.game;
        if (!game) return;

        function vib(p) { if (navigator.vibrate) navigator.vibrate(p); }

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

        // D-pad
        const keyMap = { 'up': 'ArrowUp', 'down': 'ArrowDown', 'left': 'ArrowLeft', 'right': 'ArrowRight' };
        document.querySelectorAll('.dpad-btn').forEach(btn => {
            const key = keyMap[btn.dataset.direction];
            btn.addEventListener('mousedown', e => { e.preventDefault(); if (game.keys) game.keys[key] = true; vib(10); });
            btn.addEventListener('mouseup', e => { e.preventDefault(); if (game.keys) game.keys[key] = false; });
            btn.addEventListener('mouseleave', () => { if (game.keys) game.keys[key] = false; });
            btn.addEventListener('touchstart', e => { e.preventDefault(); if (game.keys) game.keys[key] = true; vib(10); });
            btn.addEventListener('touchend', e => { e.preventDefault(); if (game.keys) game.keys[key] = false; });
        });

        // TNT
        const tnt = document.getElementById('mobile-tnt-btn');
        if (tnt) {
            const h = e => {
                e.preventDefault(); e.stopPropagation();
                if (game.state === 1 && game.placeDynamite) { game.placeDynamite(); vib(30); }
            };
            tnt.addEventListener('touchstart', h, { passive: false });
            tnt.addEventListener('mousedown', h);
        }

        // Pause
        const pause = document.getElementById('mobile-pause-btn');
        if (pause) {
            let pauseLocked = false;
            const h = e => {
                e.preventDefault(); e.stopPropagation();
                if (pauseLocked) return;
                pauseLocked = true;
                setTimeout(() => pauseLocked = false, 300);

                if (game.state === 1) {
                    game.state = 6;
                    document.getElementById('pause-overlay').classList.remove('hidden');
                }
                else if (game.state === 6) {
                    game.state = 1;
                    document.getElementById('pause-overlay').classList.add('hidden');
                }
                vib(15);
            };
            pause.addEventListener('touchstart', h, { passive: false });
            pause.addEventListener('mousedown', h);
        }

        // Haptic
        const oD = game.collectDiamond;
        if (oD) game.collectDiamond = function (x, y) { vib(20); return oD.call(this, x, y); };
        const oG = game.gameOver;
        if (oG) game.gameOver = function () { vib([100, 50, 100]); return oG.call(this); };

        // RESTART button with state polling
        const restartBtn = document.getElementById('message-restart-btn');
        if (restartBtn) {
            console.log('✓ RESTART button found');

            const handleRestart = () => {
                console.log('RESTART tapped! State:', game.state);
                if (game.state === 2 || game.state === 3) {
                    if (game.highScorePending) return;
                    if (game.state === 3 && game.currentLevelIndex >= 10) game.currentLevelIndex = 0;
                    game.resetGame();
                    restartBtn.classList.add('hidden');
                }
            };
            restartBtn.addEventListener('click', handleRestart);
            restartBtn.addEventListener('touchstart', e => { e.preventDefault(); handleRestart(); }, { passive: false });

            // Poll game state every 100ms
            let lastState = game.state;
            setInterval(() => {
                const state = game.state;
                if ((state === 2 || state === 3) && lastState !== state) {
                    console.log('→ Game Over/Win! Showing RESTART. State:', state);
                    restartBtn.classList.remove('hidden');
                    restartBtn.style.display = 'block';
                    restartBtn.style.visibility = 'visible';
                } else if (state !== 2 && state !== 3 && (lastState === 2 || lastState === 3)) {
                    console.log('← Hiding RESTART');
                    restartBtn.classList.add('hidden');
                }
                lastState = state;
            }, 100);
        } else {
            console.error('✗ RESTART button NOT in DOM!');
        }

        console.log('Mobile ready! Polling active.');
    });
})();
