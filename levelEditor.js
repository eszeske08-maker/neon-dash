class LevelEditor {
    constructor(game) {
        this.game = game;
        this.grid = [];
        this.width = GRID_WIDTH;
        this.height = GRID_HEIGHT;
        this.selectedTile = TYPES.DIRT;
        this.selectedEnemyType = ENEMY_TYPES.BASIC;
        this.isDrawing = false;
        this.isErasing = false;
        this.cursorX = -1;
        this.cursorY = -1;
        this.showGrid = true;

        this.levelName = "Custom Level";
        this.diamondsNeeded = 10;
        this.timeLimit = 120;

        this.initGrid();
        this.setupInput();
        this.initPalette();
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

    setupInput() {
        this.game.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.game.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.game.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
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
            { type: TYPES.DYNAMITE_PICKUP, label: 'TNT', color: this.game.currentTheme[TYPES.DYNAMITE_PICKUP] }
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
        const tileTypes = [TYPES.EMPTY, TYPES.DIRT, TYPES.WALL, TYPES.ROCK, TYPES.DIAMOND, TYPES.PLAYER, TYPES.ENEMY, TYPES.EXIT, TYPES.DYNAMITE_PICKUP];
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
            '4': TYPES.DIAMOND, '5': TYPES.PLAYER, '6': TYPES.ENEMY, '7': TYPES.EXIT, '8': TYPES.DYNAMITE_PICKUP
        };

        if (key in tileMap) {
            this.selectedTile = tileMap[key];
            this.updatePaletteUI();
            return;
        }

        if (key === 'e' || key === 'E') {
            const types = [ENEMY_TYPES.BASIC, ENEMY_TYPES.SEEKER, ENEMY_TYPES.PATROLLER];
            const currentIndex = types.indexOf(this.selectedEnemyType);
            this.selectedEnemyType = types[(currentIndex + 1) % types.length];
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

    handleMouseDown(e) {
        if (this.game.state !== STATE.EDITOR) return;

        const rect = this.game.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
        const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

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
        const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
        const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

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
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            // Prevent drawing on border walls UNLESS it's an EXIT
            const isBorder = x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1;

            if (isBorder && this.selectedTile !== TYPES.EXIT) {
                return; // Cannot place anything else on border
            }

            this.grid[y][x] = this.selectedTile;
        }
    }

    removeTile(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
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
        }
    }

    updateEnemyTypeUI() {
        const indicator = document.getElementById('enemy-type-indicator');
        if (indicator) {
            const typeNames = {
                [ENEMY_TYPES.BASIC]: 'BASIC',
                [ENEMY_TYPES.SEEKER]: 'SEEKER',
                [ENEMY_TYPES.PATROLLER]: 'PATROLLER'
            };
            indicator.innerText = typeNames[this.selectedEnemyType] || 'BASIC';
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
                    this.game.enemies.push(new Enemy(x, y, this.selectedEnemyType));
                }
            }
        }

        document.getElementById('editor-overlay').classList.add('hidden');
        this.game.state = STATE.PLAYING;
        this.game.startGame();
        console.log('Test Play started!');
    }

    saveLevel() {
        const levelData = {
            name: this.levelName,
            grid: this.grid,
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
