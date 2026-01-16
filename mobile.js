// Mobile Controls - Final Clean Version
(function () {
    // Wait for game object to be available (retry mechanism for race condition)
    function initMobileControls() {
        const game = window.game;
        if (!game) {
            // Retry after 100ms if game not ready yet
            setTimeout(initMobileControls, 100);
            return;
        }

        // Mobile device detection using User Agent (most reliable method)
        function isMobileDevice() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }


        function vib(p) { if (navigator.vibrate) navigator.vibrate(p); }

        // Mobile controls visibility - only show during gameplay AND on mobile devices
        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) {
            setInterval(() => {
                // STATE.PLAYING = 1, and must be a mobile device
                if (game.state === 1 && isMobileDevice()) {
                    mobileControls.classList.add('visible');
                } else {
                    mobileControls.classList.remove('visible');
                }
            }, 100);
        }

        // START


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

            // Check if map has any dynamite pickups or player has dynamite
            function hasDynamiteAvailable() {
                // Check if player already has dynamite
                if (game.dynamiteCount && game.dynamiteCount > 0) return true;

                // Check if grid has any DYNAMITE_PICKUP (type 8)
                if (game.grid) {
                    for (let y = 0; y < game.grid.length; y++) {
                        for (let x = 0; x < game.grid[y].length; x++) {
                            if (game.grid[y][x] === 8) return true; // TYPES.DYNAMITE_PICKUP
                        }
                    }
                }
                return false;
            }

            // Show/hide TNT button based on dynamite availability
            setInterval(() => {
                if (game.state === 1 && isMobileDevice() && hasDynamiteAvailable()) {
                    tnt.style.display = 'flex';
                } else {
                    tnt.style.display = 'none';
                }
            }, 100);
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
                        document.getElementById('message-overlay').classList.add('hidden');
                        rb.classList.add('hidden');

                        // In Hardcore/Rogue mode, go straight to menu (no restart allowed)
                        if (game.gameMode === 'hardcore' || game.gameMode === 'rogue') {
                            game.state = 0; // STATE.MENU
                            game.sound.stopGameMusic();
                            game.updateMenuUI();
                            return;
                        }

                        if (game.state === 2) {
                            // GAMEOVER: restart current level only
                            game.restartCurrentLevel();
                        } else if (game.state === 3) {
                            // WIN: restart from beginning
                            if (game.currentLevelIndex >= 10) game.currentLevelIndex = 0;
                            game.resetGame();
                        }
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

        // ===== MOBILE EDITOR TOOLBAR =====
        // Always register handlers - visibility controlled by CSS
        const editorToolbar = document.getElementById('editor-mobile-toolbar');
        if (editorToolbar) {
            // Helper for button handlers with debounce to prevent double-triggering
            const addEditorBtn = (id, action) => {
                const btn = document.getElementById(id);
                if (btn) {
                    let lastTrigger = 0;
                    const handler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const now = Date.now();
                        if (now - lastTrigger < 100) return; // Debounce 100ms
                        lastTrigger = now;
                        vib(15);
                        action(btn);
                    };
                    btn.addEventListener('touchstart', handler, { passive: false });
                    btn.addEventListener('mousedown', handler);
                    btn.addEventListener('click', handler); // For desktop browser emulation
                }
            };

            // Exit button
            addEditorBtn('editor-btn-exit', () => {
                if (game.state === 7 && game.levelEditor) { // STATE.EDITOR = 7
                    game.state = 0; // STATE.MENU
                    document.getElementById('editor-overlay').classList.add('hidden');
                    document.getElementById('menu-screen').classList.remove('hidden');
                }
            });

            // Erase mode toggle
            addEditorBtn('editor-btn-erase', (btn) => {
                if (game.levelEditor) {
                    game.levelEditor.eraseMode = !game.levelEditor.eraseMode;
                    btn.classList.toggle('active', game.levelEditor.eraseMode);
                }
            });

            // Enemy type cycle
            addEditorBtn('editor-btn-enemy', () => {
                if (game.levelEditor) {
                    const editor = game.levelEditor;
                    const types = [0, 1, 2, 3]; // BASIC, SEEKER, PATROLLER, BUTTERFLY
                    const names = ['BASIC', 'SEEKER', 'PATROL', 'BTFLY'];
                    const idx = types.indexOf(editor.selectedEnemyType);
                    editor.selectedEnemyType = types[(idx + 1) % types.length];
                    editor.selectedTile = 6; // TYPES.ENEMY
                    editor.updatePaletteUI();

                    const indicator = document.getElementById('mob-enemy-type');
                    if (indicator) indicator.textContent = names[(idx + 1) % names.length];
                    editor.updateEnemyTypeUI();
                }
            });

            // Grid toggle
            addEditorBtn('editor-btn-grid', () => {
                if (game.levelEditor) {
                    game.levelEditor.showGrid = !game.levelEditor.showGrid;
                }
            });

            // Test play
            addEditorBtn('editor-btn-test', () => {
                if (game.levelEditor) {
                    game.levelEditor.testPlay();
                }
            });

            // Save
            addEditorBtn('editor-btn-save', () => {
                if (game.levelEditor) {
                    game.levelEditor.saveLevel();
                }
            });

            // Load
            addEditorBtn('editor-btn-load', () => {
                if (game.levelEditor) {
                    game.levelEditor.loadLevel();
                }
            });

            // Copy to clipboard
            addEditorBtn('editor-btn-copy', () => {
                if (game.levelEditor) {
                    game.levelEditor.copyToClipboard();
                }
            });

            // Download JSON
            addEditorBtn('editor-btn-download', () => {
                if (game.levelEditor) {
                    game.levelEditor.downloadJSON();
                }
            });
        }
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileControls);
    } else {
        initMobileControls();
    }
})();
