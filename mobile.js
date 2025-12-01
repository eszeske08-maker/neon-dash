// Mobile Controls - Final Clean Version
(function () {
    window.addEventListener('load', () => {
        const game = window.game;
        if (!game) return;

        function vib(p) { if (navigator.vibrate) navigator.vibrate(p); }

        // START
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('mouseenter', () => game.sound.playMenuHover());
            startBtn.addEventListener('click', () => {
                game.sound.playMenuConfirm();
                if (game.state === 0 && !game.highScorePending) {
                    game.fadeToGame();
                }
            });
        }

        // LEVEL EDITOR
        const editorBtn = document.getElementById('editor-btn');
        if (editorBtn) {
            editorBtn.addEventListener('mouseenter', () => game.sound.playMenuHover());
            editorBtn.addEventListener('click', () => {
                game.sound.playMenuConfirm();
                if (game.state === 0) { // STATE.MENU
                    game.levelEditor.reset();
                    game.sound.stopMenuMusic();
                    game.state = 7; // STATE.EDITOR
                    document.getElementById('menu-screen').classList.add('hidden');
                    document.getElementById('editor-overlay').classList.remove('hidden');
                    game.updateMenuUI();
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
                e.preventDefault();
                e.stopPropagation();
                if (game.state === 1 && game.placeDynamite) {
                    game.placeDynamite();
                    vib(30);
                }
            };
            tnt.addEventListener('touchstart', h, { passive: false });
            tnt.addEventListener('mousedown', h);
        }

        // Pause
        const pause = document.getElementById('mobile-pause-btn');
        if (pause) {
            let lock = false;
            const h = e => {
                e.preventDefault();
                e.stopPropagation();
                if (lock) return;
                lock = true;
                setTimeout(() => lock = false, 300);
                if (game.state === 1) {
                    game.prevState = 1; // Save previous state
                    game.state = 6;
                    document.getElementById('pause-overlay').classList.remove('hidden');
                }
                else if (game.state === 6) {
                    game.state = game.prevState || 1; // Restore previous state
                    document.getElementById('pause-overlay').classList.add('hidden');
                }
                vib(15);
            };
            pause.addEventListener('touchstart', h, { passive: false });
            pause.addEventListener('mousedown', h);
        }

        // Haptic feedback
        const oD = game.collectDiamond;
        if (oD) game.collectDiamond = function (x, y) { vib(20); return oD.call(this, x, y); };
        const oG = game.gameOver;
        if (oG) game.gameOver = function () { vib([100, 50, 100]); return oG.call(this); };

        // RESTART button - create dynamically if needed
        let rb = document.getElementById('message-restart-btn');
        if (!rb) {
            const msgOverlay = document.getElementById('message-overlay');
            if (msgOverlay) {
                rb = document.createElement('button');
                rb.id = 'message-restart-btn';
                rb.className = 'menu-button hidden';
                rb.textContent = 'RESTART';
                msgOverlay.appendChild(rb);
            }
        }

        if (rb) {
            const restart = () => {
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

            // Show/hide based on game state
            let lastS = game.state;
            setInterval(() => {
                const s = game.state;
                if ((s === 2 || s === 3) && lastS !== s) {
                    rb.classList.remove('hidden');
                    rb.style.display = 'block';
                    rb.style.visibility = 'visible';
                } else if (s !== 2 && s !== 3 && (lastS === 2 || lastS === 3)) {
                    rb.classList.add('hidden');
                }
                lastS = s;
            }, 100);
        }
    });
})();
