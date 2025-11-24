// Mobile Controls - FINAL VERSION with debounced Pause
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

        // TNT - STATE.PLAYING = 1
        const tnt = document.getElementById('mobile-tnt-btn');
        if (tnt) {
            const h = e => { e.preventDefault(); if (game.state === 1 && game.placeDynamite) { game.placeDynamite(); vib(30); } };
            tnt.addEventListener('click', h);
            tnt.addEventListener('touchstart', h);
        }

        // Pause - PLAYING=1, PAUSED=6 (with 300ms debounce to prevent double-trigger)
        const pause = document.getElementById('mobile-pause-btn');
        if (pause) {
            let pauseLocked = false;
            const h = e => {
                e.preventDefault();
                e.stopPropagation();
                if (pauseLocked) return; // Ignore rapid clicks
                pauseLocked = true;
                setTimeout(() => pauseLocked = false, 300); // Unlock after 300ms

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
            pause.addEventListener('click', h);
            pause.addEventListener('touchstart', h);
        }

        // Haptic feedback
        const oD = game.collectDiamond;
        if (oD) game.collectDiamond = function (x, y) { vib(20); return oD.call(this, x, y); };
        const oG = game.gameOver;
        if (oG) game.gameOver = function () { vib([100, 50, 100]); return oG.call(this); };

        console.log('Mobile OK! PLAYING=1, PAUSED=6, Pause debounced');
    });
})();
