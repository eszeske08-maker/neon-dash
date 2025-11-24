// Mobile Controls - Touch optimized version
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

        // TNT - touchstart only (no click for mobile)
        const tnt = document.getElementById('mobile-tnt-btn');
        if (tnt) {
            const handleTnt = e => {
                e.preventDefault();
                e.stopPropagation();
                console.log('TNT! State:', game.state);
                if (game.state === 1 && game.placeDynamite) {
                    game.placeDynamite();
                    vib(30);
                    console.log('TNT placed');
                }
            };
            tnt.addEventListener('touchstart', handleTnt, { passive: false });
            tnt.addEventListener('mousedown', handleTnt); // DevTools
        }

        // Pause - touchstart only with debounce
        const pause = document.getElementById('mobile-pause-btn');
        if (pause) {
            let pauseLocked = false;
            const handlePause = e => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Pause! State:', game.state, 'Locked:', pauseLocked);
                if (pauseLocked) return;
                pauseLocked = true;
                setTimeout(() => pauseLocked = false, 300);

                if (game.state === 1) {
                    game.state = 6;
                    document.getElementById('pause-overlay').classList.remove('hidden');
                    console.log('Paused');
                }
                else if (game.state === 6) {
                    game.state = 1;
                    document.getElementById('pause-overlay').classList.add('hidden');
                    console.log('Resumed');
                }
                vib(15);
            };
            pause.addEventListener('touchstart', handlePause, { passive: false });
            pause.addEventListener('mousedown', handlePause); // DevTools
        }

        // Haptic
        const oD = game.collectDiamond;
        if (oD) game.collectDiamond = function (x, y) { vib(20); return oD.call(this, x, y); };
        const oG = game.gameOver;
        if (oG) game.gameOver = function () { vib([100, 50, 100]); return oG.call(this); };

        console.log('Mobile ready! Touch events: passive=false');
    });
})();
