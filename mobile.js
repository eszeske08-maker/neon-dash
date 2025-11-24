// Mobile Controls with Debug
(function () {
    window.addEventListener('load', () => {
        const game = window.game;
        if (!game) return;

        function vib(p) { if (navigator.vibrate) navigator.vibrate(p); }

        // Debug Panel
        const d = document.createElement('div');
        d.style.cssText = 'position:fixed;top:0;left:0;width:100%;max-height:150px;overflow-y:auto;background:rgba(0,0,0,0.9);color:#0f0;font:10px monospace;z-index:99999;padding:5px;';
        document.body.appendChild(d);
        const log = (...a) => { console.log(...a); d.innerHTML += a.join(' ') + '<br>'; d.scrollTop = d.scrollHeight; };
        log('Debug ON');

        // START
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (game.state === 0 && !game.highScorePending) { game.initLevel(); game.startGame(); }
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
            const h = e => { e.preventDefault(); e.stopPropagation(); if (game.state === 1 && game.placeDynamite) { game.placeDynamite(); vib(30); } };
            tnt.addEventListener('touchstart', h, { passive: false });
            tnt.addEventListener('mousedown', h);
        }

        // Pause
        const pause = document.getElementById('mobile-pause-btn');
        if (pause) {
            let lock = false;
            const h = e => {
                e.preventDefault(); e.stopPropagation();
                if (lock) return;
                lock = true;
                setTimeout(() => lock = false, 300);
                if (game.state === 1) { game.state = 6; document.getElementById('pause-overlay').classList.remove('hidden'); }
                else if (game.state === 6) { game.state = 1; document.getElementById('pause-overlay').classList.add('hidden'); }
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

        // RESTART - detailed debug
        const rb = document.getElementById('message-restart-btn');
        log('getElementById:', rb ? 'YES' : 'NO');
        log('Total buttons:', document.querySelectorAll('button').length);

        if (rb) {
            log('RESTART OK');
            log('display:', rb.style.display);
            log('class:', rb.className);

            const restart = () => {
                log('Tapped! State:' + game.state);
                if (game.state === 2 || game.state === 3) {
                    if (!game.highScorePending) {
                        if (game.state === 3 && game.currentLevelIndex >= 10) game.currentLevelIndex = 0;
                        game.resetGame();
                        rb.classList.add('hidden');
                    }
                }
            };
            rb.addEventListener('click', restart);
            rb.addEventListener('touchstart', e => { e.preventDefault(); restart(); }, { passive: false });

            // Poll
            let lastS = game.state;
            setInterval(() => {
                const s = game.state;
                if ((s === 2 || s === 3) && lastS !== s) {
                    log('GameOver! Showing btn');
                    rb.classList.remove('hidden');
                    rb.style.display = 'block';
                    rb.style.visibility = 'visible';
                } else if (s !== 2 && s !== 3 && (lastS === 2 || lastS === 3)) {
                    log('Hiding btn');
                    rb.classList.add('hidden');
                }
                lastS = s;
            }, 100);
        } else {
            log('RESTART NOT FOUND!');
        }

        log('Ready!');
    });
})();
