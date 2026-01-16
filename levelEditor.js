class LevelEditor {
    constructor(game) {
        this.game = game;
        this.grid = [];
        this.width = GRID_WIDTH;
        this.height = GRID_HEIGHT;
        this.selectedTile = TYPES.DIRT;
        this.selectedEnemyType = ENEMY_TYPES.BASIC;
        this.enemyTypes = {}; // Store enemy types by coordinate
        this.isDrawing = false;
        this.isErasing = false;
        this.cursorX = -1;
        this.cursorY = -1;
        this.showGrid = true;

        // Gamepad support
        this.gamepadCursorX = Math.floor(GRID_WIDTH / 2);
        this.gamepadCursorY = Math.floor(GRID_HEIGHT / 2);
        this.gamepadMoveTimer = 0;
        this.gamepadButtonLocked = {};
        this.lastGamepadId = null;

        // Mobile support
        this.eraseMode = false;

        this.levelName = "Custom Level";
        this.diamondsNeeded = 10;
        this.timeLimit = 120;

        this.initGrid();
        this.setupInput();
        this.initPalette();
    }

    // Mobile detection helper
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    initGrid() {
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    row.push(TYPES.WALL);
                } else {
                    row.push(TYPES.EMPTY);
                }
            }
            this.grid.push(row);
        }
        this.grid[1][1] = TYPES.PLAYER;
        this.grid[this.height - 2][this.width - 2] = TYPES.EXIT;
    }

    reset() {
        this.grid = [];
        this.selectedTile = TYPES.DIRT;
        this.selectedEnemyType = ENEMY_TYPES.BASIC;
        this.enemyTypes = {};
        this.levelName = "Custom Level";
        this.diamondsNeeded = 10;
        this.timeLimit = 120;
        this.initGrid();
        this.updatePaletteUI();
        this.updateEnemyTypeUI();
    }

    setupInput() {
        // Mouse events
        this.game.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.game.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.game.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        // Touch events for mobile
        this.game.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.game.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.game.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    }

    handleTouchStart(e) {
        if (this.game.state !== STATE.EDITOR) return;
        e.preventDefault();

        const touch = e.touches[0];
        const rect = this.game.canvas.getBoundingClientRect();
        const scaleX = this.game.canvas.width / rect.width;
        const scaleY = this.game.canvas.height / rect.height;

        const x = Math.floor(((touch.clientX - rect.left) * scaleX) / TILE_SIZE);
        const y = Math.floor(((touch.clientY - rect.top) * scaleY) / TILE_SIZE);

        this.cursorX = x;
        this.cursorY = y;

        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            if (this.eraseMode) {
                this.isErasing = true;
                this.removeTile(x, y);
            } else {
                this.isDrawing = true;
                this.placeTile(x, y);
            }
        }
    }

    handleTouchMove(e) {
        if (this.game.state !== STATE.EDITOR) return;
        e.preventDefault();

        const touch = e.touches[0];
        const rect = this.game.canvas.getBoundingClientRect();
        const scaleX = this.game.canvas.width / rect.width;
        const scaleY = this.game.canvas.height / rect.height;

        const x = Math.floor(((touch.clientX - rect.left) * scaleX) / TILE_SIZE);
        const y = Math.floor(((touch.clientY - rect.top) * scaleY) / TILE_SIZE);

        this.cursorX = x;
        this.cursorY = y;

        if (this.isDrawing) this.placeTile(x, y);
        if (this.isErasing) this.removeTile(x, y);
    }

    handleTouchEnd(e) {
        e.preventDefault();
        this.isDrawing = false;
        this.isErasing = false;
    }

    initPalette() {
        const paletteContainer = document.getElementById('editor-palette');
        paletteContainer.innerHTML = '';

        const tiles = [
            { type: TYPES.EMPTY, label: 'EMPTY', color: '#000' },
            { type: TYPES.DIRT, label: 'DIRT', color: this.game.currentTheme[TYPES.DIRT] },
            { type: TYPES.WALL, label: 'WALL', color: this.game.currentTheme[TYPES.WALL] },
            { type: TYPES.ROCK, label: 'ROCK', color: this.game.currentTheme[TYPES.ROCK] },
            { type: TYPES.DIAMOND, label: 'DIAM', color: this.game.currentTheme[TYPES.DIAMOND] },
            { type: TYPES.PLAYER, label: 'START', color: this.game.currentTheme[TYPES.PLAYER] },
            { type: TYPES.ENEMY, label: 'ENEMY', color: this.game.currentTheme[TYPES.ENEMY] },
            { type: TYPES.EXIT, label: 'EXIT', color: this.game.currentTheme[TYPES.EXIT] },
            { type: TYPES.DYNAMITE_PICKUP, label: 'TNT', color: this.game.currentTheme[TYPES.DYNAMITE_PICKUP] },
            { type: TYPES.STEEL, label: 'STEEL', color: '#607d8b' },
            { type: TYPES.MAGIC_WALL, label: 'MAGIC', color: '#7e57c2' },
            { type: TYPES.AMOEBA, label: 'AMOEBA', color: '#00e676' }
        ];

        tiles.forEach((tile) => {
            const el = document.createElement('div');
            el.className = 'palette-item';
            if (tile.type === this.selectedTile) el.classList.add('selected');
            el.style.backgroundColor = tile.color;
            el.innerText = tile.label;
            el.onclick = () => {
                this.selectedTile = tile.type;
                this.updatePaletteUI();
            };
            paletteContainer.appendChild(el);
        });
    }

    updatePaletteUI() {
        const items = document.querySelectorAll('.palette-item');
        const tileTypes = [TYPES.EMPTY, TYPES.DIRT, TYPES.WALL, TYPES.ROCK, TYPES.DIAMOND, TYPES.PLAYER, TYPES.ENEMY, TYPES.EXIT, TYPES.DYNAMITE_PICKUP, TYPES.STEEL, TYPES.MAGIC_WALL, TYPES.AMOEBA];
        items.forEach((item, index) => {
            if (tileTypes[index] === this.selectedTile) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    handleInput(e, isKeyDown) {
        if (!isKeyDown) return;

        const key = e.key;
        const tileMap = {
            '0': TYPES.EMPTY, '1': TYPES.DIRT, '2': TYPES.WALL, '3': TYPES.ROCK,
            '4': TYPES.DIAMOND, '5': TYPES.PLAYER, '6': TYPES.ENEMY, '7': TYPES.EXIT, '8': TYPES.DYNAMITE_PICKUP,
            '9': TYPES.STEEL, 'm': TYPES.MAGIC_WALL, 'M': TYPES.MAGIC_WALL, 'a': TYPES.AMOEBA, 'A': TYPES.AMOEBA
        };

        if (key in tileMap) {
            this.selectedTile = tileMap[key];
            this.updatePaletteUI();
            return;
        }

        if (key === 'e' || key === 'E') {
            const types = [ENEMY_TYPES.BASIC, ENEMY_TYPES.SEEKER, ENEMY_TYPES.PATROLLER, ENEMY_TYPES.BUTTERFLY];
            const currentIndex = types.indexOf(this.selectedEnemyType);
            this.selectedEnemyType = types[(currentIndex + 1) % types.length];

            // Auto-select Enemy tool
            this.selectedTile = TYPES.ENEMY;
            this.updatePaletteUI();

            this.updateEnemyTypeUI();
            return;
        }

        if (key === 'g' || key === 'G') {
            this.showGrid = !this.showGrid;
            return;
        }

        if (key === 't' || key === 'T') {
            this.testPlay();
            return;
        }

        if (key === 's' || key === 'S') {
            this.saveLevel();
            return;
        }

        if (key === 'o' || key === 'O') {
            this.loadLevel();
            return;
        }
    }

    handleGamepadInput(dt) {
        this.updateControlsUI();

        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
        if (!gamepad) return;

        // D-pad/Stick navigation
        this.gamepadMoveTimer -= dt;
        if (this.gamepadMoveTimer <= 0) {
            const deadzone = 0.3;
            let moved = false;

            if (gamepad.buttons[12]?.pressed || gamepad.axes[1] < -deadzone) { // Up
                this.gamepadCursorY = Math.max(0, this.gamepadCursorY - 1);
                moved = true;
            }
            if (gamepad.buttons[13]?.pressed || gamepad.axes[1] > deadzone) { // Down
                this.gamepadCursorY = Math.min(this.height - 1, this.gamepadCursorY + 1);
                moved = true;
            }
            if (gamepad.buttons[14]?.pressed || gamepad.axes[0] < -deadzone) { // Left
                this.gamepadCursorX = Math.max(0, this.gamepadCursorX - 1);
                moved = true;
            }
            if (gamepad.buttons[15]?.pressed || gamepad.axes[0] > deadzone) { // Right
                this.gamepadCursorX = Math.min(this.width - 1, this.gamepadCursorX + 1);
                moved = true;
            }

            if (moved) {
                this.gamepadMoveTimer = 100;
                this.cursorX = this.gamepadCursorX;
                this.cursorY = this.gamepadCursorY;
            }
        }

        // Button actions
        const checkButton = (index, action) => {
            if (gamepad.buttons[index]?.pressed) {
                if (!this.gamepadButtonLocked[index]) {
                    this.gamepadButtonLocked[index] = true;
                    action();
                }
            } else {
                this.gamepadButtonLocked[index] = false;
            }
        };

        checkButton(0, () => this.placeTile(this.gamepadCursorX, this.gamepadCursorY)); // A = Place
        checkButton(1, () => this.removeTile(this.gamepadCursorX, this.gamepadCursorY)); // B = Erase
        checkButton(2, () => this.showGrid = !this.showGrid); // X = Toggle Grid
        checkButton(3, () => this.testPlay()); // Y = Test

        // L1/R1 = Tool cycling
        checkButton(4, () => {
            const tools = [TYPES.EMPTY, TYPES.DIRT, TYPES.WALL, TYPES.ROCK, TYPES.DIAMOND, TYPES.PLAYER, TYPES.ENEMY, TYPES.EXIT, TYPES.DYNAMITE_PICKUP];
            const idx = tools.indexOf(this.selectedTile);
            this.selectedTile = tools[(idx - 1 + tools.length) % tools.length];
            this.updatePaletteUI();
        });
        checkButton(5, () => {
            const tools = [TYPES.EMPTY, TYPES.DIRT, TYPES.WALL, TYPES.ROCK, TYPES.DIAMOND, TYPES.PLAYER, TYPES.ENEMY, TYPES.EXIT, TYPES.DYNAMITE_PICKUP];
            const idx = tools.indexOf(this.selectedTile);
            this.selectedTile = tools[(idx + 1) % tools.length];
            this.updatePaletteUI();
        });

        checkButton(6, () => this.saveLevel()); // L2 = Save
        checkButton(7, () => this.loadLevel()); // R2 = Load

        // Select/Back = Exit to Menu
        checkButton(8, () => {
            this.game.state = 0; // STATE.MENU
            document.getElementById('editor-overlay').classList.add('hidden');
            document.getElementById('menu-screen').classList.remove('hidden');
            this.game.gamepadActionLocked = true;
        });

        checkButton(9, () => { // Start = Enemy type
            const types = [ENEMY_TYPES.BASIC, ENEMY_TYPES.SEEKER, ENEMY_TYPES.PATROLLER, ENEMY_TYPES.BUTTERFLY];
            const idx = types.indexOf(this.selectedEnemyType);
            this.selectedEnemyType = types[(idx + 1) % types.length];

            // Auto-select Enemy tool
            this.selectedTile = TYPES.ENEMY;
            this.updatePaletteUI();

            this.updateEnemyTypeUI();
        });
    }

    handleMouseDown(e) {
        if (this.game.state !== STATE.EDITOR) return;

        const rect = this.game.canvas.getBoundingClientRect();
        const scaleX = this.game.canvas.width / rect.width;
        const scaleY = this.game.canvas.height / rect.height;

        const x = Math.floor(((e.clientX - rect.left) * scaleX) / TILE_SIZE);
        const y = Math.floor(((e.clientY - rect.top) * scaleY) / TILE_SIZE);

        this.cursorX = x;
        this.cursorY = y;

        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            if (e.button === 0) {
                this.isDrawing = true;
                this.placeTile(x, y);
            } else if (e.button === 2) {
                this.isErasing = true;
                this.removeTile(x, y);
            }
        }
    }

    handleMouseMove(e) {
        if (this.game.state !== STATE.EDITOR) return;

        const rect = this.game.canvas.getBoundingClientRect();
        const scaleX = this.game.canvas.width / rect.width;
        const scaleY = this.game.canvas.height / rect.height;

        const x = Math.floor(((e.clientX - rect.left) * scaleX) / TILE_SIZE);
        const y = Math.floor(((e.clientY - rect.top) * scaleY) / TILE_SIZE);

        this.cursorX = x;
        this.cursorY = y;

        if (this.isDrawing) this.placeTile(x, y);
        if (this.isErasing) this.removeTile(x, y);
    }

    handleMouseUp() {
        this.isDrawing = false;
        this.isErasing = false;
    }

    placeTile(x, y) {
        const isBorder = x <= 0 || x >= this.width - 1 || y <= 0 || y >= this.height - 1;

        // Prevent modifying outer walls, UNLESS placing an EXIT
        if (isBorder && this.selectedTile !== TYPES.EXIT) return;

        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[y][x] = this.selectedTile;
            // Store enemy type if placing an enemy
            if (this.selectedTile === TYPES.ENEMY) {
                this.enemyTypes[`${x},${y}`] = this.selectedEnemyType;
            }
        }
    }

    removeTile(x, y) {
        const isBorder = x <= 0 || x >= this.width - 1 || y <= 0 || y >= this.height - 1;

        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            // Special handling for border: restore to WALL
            if (isBorder) {
                if (this.grid[y][x] === TYPES.WALL) return; // Already a wall
                this.grid[y][x] = TYPES.WALL;
                return;
            }

            // Remove enemy type if removing an enemy
            if (this.grid[y][x] === TYPES.ENEMY) {
                delete this.enemyTypes[`${x},${y}`];
            }
            this.grid[y][x] = TYPES.EMPTY;
        }
    }

    draw(ctx) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.grid[y][x];
                const px = x * TILE_SIZE;
                const py = y * TILE_SIZE;

                ctx.fillStyle = '#111';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = '#222';
                ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);

                if (tile !== TYPES.EMPTY) {
                    this.drawEditorTile(ctx, x, y, tile);
                }
            }
        }

        if (this.showGrid) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x <= this.width; x++) {
                ctx.moveTo(x * TILE_SIZE, 0);
                ctx.lineTo(x * TILE_SIZE, this.height * TILE_SIZE);
            }
            for (let y = 0; y <= this.height; y++) {
                ctx.moveTo(0, y * TILE_SIZE);
                ctx.lineTo(this.width * TILE_SIZE, y * TILE_SIZE);
            }
            ctx.stroke();
        }

        if (this.cursorX >= 0 && this.cursorX < this.width && this.cursorY >= 0 && this.cursorY < this.height) {
            const px = this.cursorX * TILE_SIZE;
            const py = this.cursorY * TILE_SIZE;
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);

            ctx.globalAlpha = 0.5;
            this.drawEditorTile(ctx, this.cursorX, this.cursorY, this.selectedTile);
            ctx.globalAlpha = 1.0;
        }
    }

    drawEditorTile(ctx, x, y, tile) {
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;
        const cx = px + TILE_SIZE / 2;
        const cy = py + TILE_SIZE / 2;
        const theme = this.game.currentTheme;

        switch (tile) {
            case TYPES.DIRT:
                ctx.fillStyle = theme[TYPES.DIRT];
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                break;
            case TYPES.WALL:
                ctx.fillStyle = theme[TYPES.WALL];
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = theme.wallGlow;
                ctx.lineWidth = 2;
                ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                break;
            case TYPES.ROCK:
                ctx.fillStyle = theme[TYPES.ROCK];
                ctx.beginPath();
                ctx.arc(cx, cy, TILE_SIZE / 2 - 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case TYPES.DIAMOND:
                ctx.fillStyle = theme[TYPES.DIAMOND];
                ctx.beginPath();
                ctx.moveTo(cx, py + 4);
                ctx.lineTo(px + TILE_SIZE - 4, cy);
                ctx.lineTo(cx, py + TILE_SIZE - 4);
                ctx.lineTo(px + 4, cy);
                ctx.fill();
                break;
            case TYPES.PLAYER:
                ctx.fillStyle = theme[TYPES.PLAYER];
                ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
                break;
            case TYPES.ENEMY:
                ctx.fillStyle = theme[TYPES.ENEMY];
                ctx.fillRect(px + 6, py + 6, TILE_SIZE - 12, TILE_SIZE - 12);
                break;
            case TYPES.EXIT:
                ctx.fillStyle = theme[TYPES.EXIT];
                ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                ctx.fillStyle = '#000';
                ctx.fillRect(px + 8, py + 8, TILE_SIZE - 16, TILE_SIZE - 16);
                break;
            case TYPES.DYNAMITE_PICKUP:
                ctx.fillStyle = theme[TYPES.DYNAMITE_PICKUP];
                ctx.fillRect(cx - 6, cy - 10, 12, 20);
                break;
            case TYPES.STEEL:
                ctx.fillStyle = '#607d8b';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = '#cfd8dc';
                ctx.lineWidth = 2;
                ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px + TILE_SIZE, py + TILE_SIZE);
                ctx.moveTo(px + TILE_SIZE, py);
                ctx.lineTo(px, py + TILE_SIZE);
                ctx.stroke();
                break;
            case TYPES.MAGIC_WALL:
                ctx.fillStyle = '#7e57c2';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#fff';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('M', cx, cy);
                break;
            case TYPES.AMOEBA:
                ctx.fillStyle = theme[TYPES.AMOEBA];
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(cx, cy, TILE_SIZE / 3, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
    }

    updateEnemyTypeUI() {
        const indicator = document.getElementById('enemy-type-indicator');
        if (indicator) {
            indicator.innerText = this.getEnemyTypeName();
        }
    }

    getEnemyTypeName() {
        const typeNames = {
            [ENEMY_TYPES.BASIC]: 'BASIC',
            [ENEMY_TYPES.SEEKER]: 'SEEKER',
            [ENEMY_TYPES.PATROLLER]: 'PATROLLER',
            [ENEMY_TYPES.BUTTERFLY]: 'BUTTERFLY'
        };
        return typeNames[this.selectedEnemyType] || 'BASIC';
    }

    updateControlsUI() {
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
        const gamepadId = gamepad ? gamepad.id : null;

        // Only update if controller state changed
        if (this.lastGamepadId === gamepadId) return;
        this.lastGamepadId = gamepadId;

        const hints = {
            exit: document.getElementById('hint-exit'),
            grid: document.getElementById('hint-grid'),
            enemy: document.getElementById('hint-enemy'),
            test: document.getElementById('hint-test'),
            save: document.getElementById('hint-save'),
            load: document.getElementById('hint-load'),
            tool: document.getElementById('hint-tool'),
            erase: document.getElementById('hint-erase')
        };

        if (!hints.exit) return;

        if (gamepad) {
            // Detect Controller Type (PS vs Xbox/Generic)
            const isPS = gamepad.id.toLowerCase().includes('playstation') ||
                gamepad.id.toLowerCase().includes('dualshock') ||
                gamepad.id.toLowerCase().includes('dualsense');

            const labels = isPS ? {
                exit: 'Share', grid: '□', enemy: 'Options', test: '△',
                save: 'L2', load: 'R2', tool: 'L1/R1', erase: '○', place: '✕'
            } : {
                exit: 'Back', grid: 'X', enemy: 'Start', test: 'Y',
                save: 'LT', load: 'RT', tool: 'LB/RB', erase: 'B', place: 'A'
            };

            hints.exit.innerText = `${labels.exit} / L: Exit`;
            hints.grid.innerText = `${labels.grid} / G: Grid`;
            hints.enemy.innerHTML = `${labels.enemy} / E: Enemy (<span id="enemy-type-indicator">${this.getEnemyTypeName()}</span>)`;
            hints.test.innerText = `${labels.test} / T: Test Play`;
            hints.save.innerText = `${labels.save} / S: Save`;
            hints.load.innerText = `${labels.load} / O: Load`;
            hints.tool.innerText = `${labels.tool} / 1-8: Tool`;
            hints.erase.innerText = `${labels.erase} / R-Click: Erase (${labels.place}: Place)`;
        } else {
            // Keyboard Defaults
            hints.exit.innerText = 'L: Exit Editor';
            hints.grid.innerText = 'G: Toggle Grid';
            hints.enemy.innerHTML = 'E: Cycle Enemy (<span id="enemy-type-indicator">' + this.getEnemyTypeName() + '</span>)';
            hints.test.innerText = 'T: Test Play';
            hints.save.innerText = 'S: Save';
            hints.load.innerText = 'O: Load';
            hints.tool.innerText = '1-8: Select Tool';
            hints.erase.innerText = 'Right Click: Erase';
        }
    }

    testPlay() {
        this.game.grid = this.grid.map(row => [...row]);

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x] === TYPES.PLAYER) {
                    this.game.player.x = x;
                    this.game.player.y = y;
                }
            }
        }

        this.game.score = 0;
        this.game.diamondsCollected = 0;
        this.game.diamondsNeeded = this.diamondsNeeded;
        this.game.timeLeft = this.timeLimit;
        this.game.dynamiteCount = 0;
        this.game.bombs = [];
        this.game.particles = [];
        this.game.enemies = [];
        this.game.fallingEntities.clear();

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x] === TYPES.ENEMY) {
                    // Use stored enemy type or default to BASIC
                    const enemyType = this.enemyTypes[`${x},${y}`] || ENEMY_TYPES.BASIC;
                    this.game.enemies.push(new Enemy(x, y, enemyType));
                }
            }
        }

        document.getElementById('editor-overlay').classList.add('hidden');
        this.game.isTesting = true;
        this.game.startGame();
        console.log('Test Play started!');
    }

    saveLevel() {
        const levelData = {
            name: this.levelName,
            grid: this.grid,
            enemyTypes: this.enemyTypes,
            diamondsNeeded: this.diamondsNeeded,
            timeLimit: this.timeLimit
        };

        localStorage.setItem('customLevel', JSON.stringify(levelData));
        console.log('Level saved to localStorage!');

        const indicator = document.getElementById('enemy-type-indicator');
        if (indicator) {
            const originalText = indicator.innerText;
            indicator.innerText = 'SAVED!';
            setTimeout(() => {
                indicator.innerText = originalText;
            }, 1000);
        }
    }

    // Convert numeric grid to string map format
    gridToMap() {
        const charMap = {
            [TYPES.EMPTY]: ' ',
            [TYPES.DIRT]: '.',
            [TYPES.WALL]: '#',
            [TYPES.ROCK]: 'O',
            [TYPES.DIAMOND]: 'D',
            [TYPES.PLAYER]: 'S',
            [TYPES.ENEMY]: 'E',  // Default, will be replaced with P/K for different types
            [TYPES.EXIT]: 'X',
            [TYPES.DYNAMITE_PICKUP]: 'T',
            [TYPES.STEEL]: 'W',
            [TYPES.MAGIC_WALL]: 'M',
            [TYPES.AMOEBA]: 'A'
        };

        const map = [];
        for (let y = 0; y < this.height; y++) {
            let row = '';
            for (let x = 0; x < this.width; x++) {
                const tile = this.grid[y][x];
                if (tile === TYPES.ENEMY) {
                    // Use different characters for enemy types
                    const enemyType = this.enemyTypes[`${x},${y}`] || ENEMY_TYPES.BASIC;
                    if (enemyType === ENEMY_TYPES.PATROLLER) {
                        row += 'P';
                    } else if (enemyType === ENEMY_TYPES.SEEKER) {
                        row += 'K';
                    } else if (enemyType === ENEMY_TYPES.BUTTERFLY) {
                        row += 'B';
                    } else {
                        row += 'E';
                    }
                } else {
                    row += charMap[tile] || ' ';
                }
            }
            map.push(row);
        }
        return map;
    }

    // Get export data in map format
    getExportData() {
        return {
            title: this.levelName,
            map: this.gridToMap(),
            diamondsNeeded: this.diamondsNeeded,
            time: this.timeLimit
        };
    }

    // Copy to clipboard
    copyToClipboard() {
        const data = this.getExportData();
        const json = JSON.stringify(data, null, 2);

        navigator.clipboard.writeText(json).then(() => {
            console.log('Copied to clipboard!');
            const indicator = document.getElementById('enemy-type-indicator');
            if (indicator) {
                const originalText = indicator.innerText;
                indicator.innerText = 'COPIED!';
                setTimeout(() => {
                    indicator.innerText = originalText;
                }, 1500);
            }
        }).catch(err => {
            console.error('Failed to copy:', err);
            // Fallback: show in console
            console.log('Level JSON:', json);
            alert('Copy failed. Check console for JSON.');
        });
    }

    // Download as JSON file
    downloadJSON() {
        const data = this.getExportData();
        const json = JSON.stringify(data, null, 2);

        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.levelName.replace(/\s+/g, '_').toLowerCase()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        const indicator = document.getElementById('enemy-type-indicator');
        if (indicator) {
            const originalText = indicator.innerText;
            indicator.innerText = 'DOWNLOADED!';
            setTimeout(() => {
                indicator.innerText = originalText;
            }, 1500);
        }
    }

    loadLevel() {
        const savedData = localStorage.getItem('customLevel');
        if (!savedData) {
            console.log('No saved level found!');
            const indicator = document.getElementById('enemy-type-indicator');
            if (indicator) {
                const originalText = indicator.innerText;
                indicator.innerText = 'NO SAVE!';
                setTimeout(() => {
                    indicator.innerText = originalText;
                }, 1000);
            }
            return;
        }

        try {
            const levelData = JSON.parse(savedData);
            this.grid = levelData.grid;
            this.enemyTypes = levelData.enemyTypes || {};
            this.levelName = levelData.name || 'Custom Level';
            this.diamondsNeeded = levelData.diamondsNeeded || 10;
            this.timeLimit = levelData.timeLimit || 120;

            console.log('Level loaded!');

            const indicator = document.getElementById('enemy-type-indicator');
            if (indicator) {
                const originalText = indicator.innerText;
                indicator.innerText = 'LOADED!';
                setTimeout(() => {
                    indicator.innerText = originalText;
                }, 1000);
            }
        } catch (e) {
            console.error('Failed to load level:', e);
        }
    }
}
