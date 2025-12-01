/**
 * Neon Dash - Game Logic
 */

// Constants
const TILE_SIZE = 32;
const GRID_WIDTH = 40;
const GRID_HEIGHT = 22;
const FPS = 60;

// Game State
const STATE = {
    MENU: 0,
    PLAYING: 1,
    GAMEOVER: 2,
    WIN: 3,
    TRANSITION: 4,
    NAME_ENTRY: 5,
    PAUSED: 6,
    EDITOR: 7,
    DEMO: 8
};

// Entity Types
// Entity Types
const TYPES = {
    EMPTY: 0,
    DIRT: 1,
    WALL: 2,
    ROCK: 3,
    DIAMOND: 4,
    PLAYER: 5,
    ENEMY: 6,
    EXIT: 7,
    DYNAMITE_PICKUP: 8,
    DYNAMITE_ACTIVE: 9
};

const THEMES = [
    { // Theme 0: Neon Blue (Cyberpunk)
        [TYPES.DIRT]: '#5d4037',
        [TYPES.WALL]: '#757575',
        [TYPES.ROCK]: '#795548',
        [TYPES.DIAMOND]: '#00ffff',
        [TYPES.PLAYER]: '#ff00ff',
        [TYPES.ENEMY]: '#ff0000',
        [TYPES.EXIT]: '#00ff00',
        [TYPES.DYNAMITE_PICKUP]: '#ff4444',
        [TYPES.DYNAMITE_ACTIVE]: '#ff0000',
        background: '#050510',
        wallGlow: '#00f3ff',
        dirtColor: '#5d4037',
        dirtDetail: '#3e2723',
        enemySeeker: '#00ff00',
        enemyPatroller: '#0088ff',
        playerDetail: '#ffffff'
    },
    { // Theme 1: Neon Pink (Synthwave)
        [TYPES.DIRT]: '#4a148c',
        [TYPES.WALL]: '#880e4f',
        [TYPES.ROCK]: '#ad1457',
        [TYPES.DIAMOND]: '#ff4081',
        [TYPES.PLAYER]: '#00e5ff',
        [TYPES.ENEMY]: '#ffea00',
        [TYPES.EXIT]: '#76ff03',
        [TYPES.DYNAMITE_PICKUP]: '#ff9100',
        [TYPES.DYNAMITE_ACTIVE]: '#ff3d00',
        background: '#1a001a',
        wallGlow: '#ff00ff',
        dirtColor: '#4a148c',
        dirtDetail: '#311b92',
        enemySeeker: '#ffff00',
        enemyPatroller: '#aa00ff',
        playerDetail: '#000000'
    },
    { // Theme 2: Neon Green (Matrix)
        [TYPES.DIRT]: '#1b5e20',
        [TYPES.WALL]: '#004d40',
        [TYPES.ROCK]: '#33691e',
        [TYPES.DIAMOND]: '#00e676',
        [TYPES.PLAYER]: '#ffffff',
        [TYPES.ENEMY]: '#d50000',
        [TYPES.EXIT]: '#64dd17',
        [TYPES.DYNAMITE_PICKUP]: '#ffab00',
        [TYPES.DYNAMITE_ACTIVE]: '#dd2c00',
        background: '#001a05',
        wallGlow: '#00ff00',
        dirtColor: '#1b5e20',
        dirtDetail: '#003300',
        enemySeeker: '#ff0000',
        enemyPatroller: '#ff6d00',
        playerDetail: '#000000'
    },
    { // Theme 3: Neon Orange (Inferno)
        [TYPES.DIRT]: '#bf360c',
        [TYPES.WALL]: '#3e2723',
        [TYPES.ROCK]: '#5d4037',
        [TYPES.DIAMOND]: '#ffab00',
        [TYPES.PLAYER]: '#00b0ff',
        [TYPES.ENEMY]: '#6200ea',
        [TYPES.EXIT]: '#00e676',
        [TYPES.DYNAMITE_PICKUP]: '#ff1744',
        [TYPES.DYNAMITE_ACTIVE]: '#d50000',
        background: '#1a0500',
        wallGlow: '#ff3d00',
        dirtColor: '#bf360c',
        dirtDetail: '#870000',
        enemySeeker: '#2962ff',
        enemyPatroller: '#00c853',
        playerDetail: '#ffffff'
    },
    { // Theme 4: Ice / Frozen
        [TYPES.DIRT]: '#455a64', // Blue-grey dirt
        [TYPES.WALL]: '#37474f', // Dark slate
        [TYPES.ROCK]: '#b0bec5', // Light blue-grey rock
        [TYPES.DIAMOND]: '#e0f7fa', // Ice white/cyan
        [TYPES.PLAYER]: '#00e5ff', // Cyan player
        [TYPES.ENEMY]: '#ff4081', // Pink enemy (contrast)
        [TYPES.EXIT]: '#18ffff', // Bright cyan exit
        [TYPES.DYNAMITE_PICKUP]: '#ff5252',
        [TYPES.DYNAMITE_ACTIVE]: '#d50000',
        background: '#000a12', // Very dark blue
        wallGlow: '#00bcd4', // Cyan glow
        dirtColor: '#455a64',
        dirtDetail: '#263238',
        enemySeeker: '#ff80ab',
        enemyPatroller: '#80d8ff',
        playerDetail: '#000000'
    },
    { // Theme 5: Gold / Luxury
        [TYPES.DIRT]: '#3e2723', // Dark brown
        [TYPES.WALL]: '#4a148c', // Deep purple
        [TYPES.ROCK]: '#ffd700', // Gold rock
        [TYPES.DIAMOND]: '#00e676', // Emerald
        [TYPES.PLAYER]: '#ffffff', // White
        [TYPES.ENEMY]: '#ff1744', // Ruby
        [TYPES.EXIT]: '#ffd700', // Gold exit
        [TYPES.DYNAMITE_PICKUP]: '#ff6d00',
        [TYPES.DYNAMITE_ACTIVE]: '#dd2c00',
        background: '#12002b', // Dark purple background
        wallGlow: '#ffd700', // Gold glow
        dirtColor: '#3e2723',
        dirtDetail: '#210e09',
        enemySeeker: '#d500f9',
        enemyPatroller: '#ffab00',
        playerDetail: '#000000'
    },
    { // Theme 6: Toxic / Acid
        [TYPES.DIRT]: '#76ff03', // Lime Green
        [TYPES.WALL]: '#424242', // Dark Grey
        [TYPES.ROCK]: '#616161', // Grey
        [TYPES.DIAMOND]: '#ffff00', // Yellow
        [TYPES.PLAYER]: '#ff3d00', // Bright Orange
        [TYPES.ENEMY]: '#d500f9', // Purple
        [TYPES.EXIT]: '#00e5ff', // Cyan
        [TYPES.DYNAMITE_PICKUP]: '#ffea00',
        [TYPES.DYNAMITE_ACTIVE]: '#ff0000',
        background: '#1a001a', // Dark Purple
        wallGlow: '#76ff03', // Lime Glow
        dirtColor: '#76ff03',
        dirtDetail: '#33691e',
        enemySeeker: '#ff00ff',
        enemyPatroller: '#00e5ff',
        playerDetail: '#ffffff'
    },
    { // Theme 7: Vaporwave
        [TYPES.DIRT]: '#7b1fa2', // Purple
        [TYPES.WALL]: '#00bcd4', // Cyan
        [TYPES.ROCK]: '#f06292', // Pink
        [TYPES.DIAMOND]: '#00e5ff', // Bright Cyan
        [TYPES.PLAYER]: '#ffff00', // Yellow
        [TYPES.ENEMY]: '#ff4081', // Hot Pink
        [TYPES.EXIT]: '#76ff03', // Lime
        [TYPES.DYNAMITE_PICKUP]: '#ff9100',
        [TYPES.DYNAMITE_ACTIVE]: '#ff3d00',
        background: '#1a1a2e', // Dark blue-purple
        wallGlow: '#ff00ff', // Magenta glow
        dirtColor: '#7b1fa2',
        dirtDetail: '#4a148c',
        enemySeeker: '#00e5ff',
        enemyPatroller: '#f50057',
        playerDetail: '#000000'
    }
];

// Default to first theme initially
let COLORS = THEMES[0];

// Level Definitions
const LEVELS = [
    // Level 1: Tutorial - Just Digging & Diamonds
    {
        type: 'fixed',
        diamondsNeeded: 5,
        time: 100,
        map: [
            "########################################",
            "#S.....................................#",
            "#......................................#",
            "#..DDDDD...............................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#.....................................X#",
            "#......................................#",
            "########################################"
        ]
    },
    // Level 2: Rocks Introduction
    {
        type: 'fixed',
        diamondsNeeded: 8,
        time: 120,
        map: [
            "########################################",
            "#S.....................................#",
            "#......................................#",
            "#..O..O................................#",
            "#..D..D................................#",
            "#......................................#",
            "#.......O..............................#",
            "#.......DDD............................#",
            "#......................................#",
            "#...........OOO........................#",
            "#...........DDD........................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#.....................................X#",
            "#......................................#",
            "########################################"
        ]
    },
    // Level 3: Enemies Introduction
    {
        type: 'fixed',
        diamondsNeeded: 8,
        time: 120,
        map: [
            "########################################",
            "#S.....................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#....E.................................#",
            "#......................................#",
            "#......................................#",
            "#..........D...D...D...................#",
            "#..........D...D...D...................#",
            "#..........D...D...D...................#",
            "#......................................#",
            "#.............E........................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#.....................................X#",
            "#......................................#",
            "########################################"
        ]
    },
    // Level 4: Mixed Challenge
    {
        type: 'fixed',
        diamondsNeeded: 10,
        time: 150,
        map: [
            "########################################",
            "#S.....................................#",
            "#..O.O.................................#",
            "#..D.D.................................#",
            "#......................................#",
            "#....E.................................#",
            "#.......###............................#",
            "#....... D ............................#",
            "#.......###............................#",
            "#......................................#",
            "#...........OOO........................#",
            "#...........DDD........................#",
            "#...........DDD........................#",
            "#.............E........................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#......................................#",
            "#...DD.................................#",
            "#.....................................X#",
            "#......................................#",
            "########################################"
        ]
    },
    // Levels 5-10: Generated with increasing difficulty
    { type: 'generated', diamondsNeeded: 12, time: 150, rockChance: 0.10, enemyChance: 0.02, wallChance: 0.12 },
    { type: 'generated', diamondsNeeded: 15, time: 150, rockChance: 0.11, enemyChance: 0.03, wallChance: 0.13 },
    { type: 'generated', diamondsNeeded: 18, time: 140, rockChance: 0.12, enemyChance: 0.03, wallChance: 0.14 },
    { type: 'generated', diamondsNeeded: 20, time: 140, rockChance: 0.13, enemyChance: 0.04, wallChance: 0.15 },
    { type: 'generated', diamondsNeeded: 22, time: 130, rockChance: 0.14, enemyChance: 0.04, wallChance: 0.16 },
    { type: 'generated', diamondsNeeded: 25, time: 120, rockChance: 0.15, enemyChance: 0.05, wallChance: 0.18 }
];


class Particle {
    constructor(x, y, color, speed, life) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.life = life;
        this.maxLife = life;
        this.size = Math.random() * 3 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.size *= 0.95; // Shrink
    }

    draw(ctx) {
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1.0;
    }
}

const ENEMY_TYPES = {
    BASIC: 0,
    SEEKER: 1,
    PATROLLER: 2
};

class Enemy {
    constructor(x, y, type = ENEMY_TYPES.BASIC) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.dirX = 1; // Start moving right
        this.dirY = 0;
        this.moveTimer = 0;
        // Seeker moves slower to be fair
        this.moveInterval = type === ENEMY_TYPES.SEEKER ? 600 : 400;

        if (type === ENEMY_TYPES.PATROLLER) {
            // Randomize start direction for patroller
            if (Math.random() < 0.5) {
                this.dirX = Math.random() < 0.5 ? 1 : -1;
                this.dirY = 0;
            } else {
                this.dirX = 0;
                this.dirY = Math.random() < 0.5 ? 1 : -1;
            }
        }
    }

    update(dt, game) {
        this.moveTimer += dt;
        if (this.moveTimer > this.moveInterval) {
            this.moveTimer = 0;
            this.move(game);
        }
    }

    move(game) {
        if (this.type === ENEMY_TYPES.SEEKER) {
            this.moveSeeker(game);
        } else if (this.type === ENEMY_TYPES.PATROLLER) {
            this.movePatroller(game);
        } else {
            this.moveBasic(game);
        }
    }

    moveBasic(game) {
        let nextX = this.x + this.dirX;
        let nextY = this.y + this.dirY;

        if (!this.isValidMove(nextX, nextY, game)) {
            this.changeDirectionClockwise();
            // Try again
            nextX = this.x + this.dirX;
            nextY = this.y + this.dirY;
            if (!this.isValidMove(nextX, nextY, game)) return;
        }

        this.performMove(nextX, nextY, game);
    }

    moveSeeker(game) {
        // Simple A* or just direct direction? Direct is easier and sufficient.
        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;

        // Prefer axis with larger distance
        let tryX = 0, tryY = 0;
        if (Math.abs(dx) > Math.abs(dy)) {
            tryX = Math.sign(dx);
        } else {
            tryY = Math.sign(dy);
        }

        // Try primary direction
        if (this.isValidMove(this.x + tryX, this.y + tryY, game)) {
            this.performMove(this.x + tryX, this.y + tryY, game);
            return;
        }

        // Try secondary direction (the other axis)
        if (tryX !== 0) { tryX = 0; tryY = Math.sign(dy); }
        else { tryY = 0; tryX = Math.sign(dx); }

        if (tryY === 0 && tryX === 0) {
            // Aligned on one axis but blocked, try perpendicular
            if (Math.abs(dx) > Math.abs(dy)) { // Was trying X
                tryY = 1; // Try down
                if (!this.isValidMove(this.x, this.y + tryY, game)) tryY = -1; // Try up
            } else {
                tryX = 1;
                if (!this.isValidMove(this.x + tryX, this.y, game)) tryX = -1;
            }
        }

        if (this.isValidMove(this.x + tryX, this.y + tryY, game)) {
            this.performMove(this.x + tryX, this.y + tryY, game);
        } else {
            // Stuck, maybe random move?
            this.moveBasic(game);
        }
    }

    movePatroller(game) {
        let nextX = this.x + this.dirX;
        let nextY = this.y + this.dirY;

        if (!this.isValidMove(nextX, nextY, game)) {
            // Reverse direction
            this.dirX *= -1;
            this.dirY *= -1;
            nextX = this.x + this.dirX;
            nextY = this.y + this.dirY;

            if (!this.isValidMove(nextX, nextY, game)) return; // Trapped
        }

        this.performMove(nextX, nextY, game);
    }

    isValidMove(x, y, game) {
        if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return false;
        const tile = game.grid[y][x];
        return tile === TYPES.EMPTY || tile === TYPES.PLAYER;
    }

    performMove(nextX, nextY, game) {
        const nextTile = game.grid[nextY][nextX];

        if (nextTile === TYPES.PLAYER || (game.player.x === nextX && game.player.y === nextY)) {
            game.die();
        }

        game.grid[this.y][this.x] = TYPES.EMPTY;
        this.x = nextX;
        this.y = nextY;
        game.grid[this.y][this.x] = TYPES.ENEMY;
    }

    changeDirectionClockwise() {
        if (this.dirX === 1) { this.dirX = 0; this.dirY = 1; }
        else if (this.dirX === -1) { this.dirX = 0; this.dirY = -1; }
        else if (this.dirY === 1) { this.dirX = -1; this.dirY = 0; }
        else if (this.dirY === -1) { this.dirX = 1; this.dirY = 0; }
    }
}

class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
        this.musicInterval = null;
        this.menuMusicInterval = null;
    }

    async playTone(freq, type, duration, vol = 1.0) {
        if (!this.enabled || !this.ctx) return;
        if (this.ctx.state === 'suspended') await this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol * 0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    async playNoise(duration, vol = 1.0) {
        if (!this.enabled || !this.ctx) return;
        if (this.ctx.state === 'suspended') await this.ctx.resume();

        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(vol * 0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        noise.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    }

    playDig() { this.playNoise(0.05, 0.5); }
    playStep() { this.playNoise(0.02, 0.2); }
    playExplosion() { this.playNoise(0.5, 1.0); }
    playCollect() { this.playTone(1200, 'sine', 0.1, 0.5); }

    // Menu Sounds
    playMenuHover() { this.playTone(800, 'sine', 0.03, 0.2); }
    playMenuBlip() { this.playTone(1000, 'square', 0.05, 0.3); }
    playMenuConfirm() {
        // Quick two-note confirmation
        this.playTone(880, 'square', 0.08, 0.4);
        setTimeout(() => this.playTone(1320, 'square', 0.12, 0.4), 50);
    }

    playWin() {
        // Victory arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 'square', 0.2, 0.5), i * 100);
        });
    }

    async unlock() {
        if (!this.enabled) return;

        // Create AudioContext on first user interaction if it doesn't exist
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            console.log('AudioContext created in unlock');
        }

        // Resume context immediately inside user gesture
        if (this.ctx.state === 'suspended') {
            try {
                await this.ctx.resume();
                console.log('AudioContext resumed via unlock');
            } catch (e) {
                console.error('AudioContext resume failed:', e);
            }
        }

        // Play silent buffer to force audio engine to wake up
        try {
            const buffer = this.ctx.createBuffer(1, 1, 22050);
            const source = this.ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(this.ctx.destination);
            source.start(0);
            console.log('Audio unlock buffer played');
        } catch (e) {
            console.error('Audio unlock failed:', e);
        }
    }

    startGameMusic() {
        console.log('startGameMusic called', 'Enabled:', this.enabled, 'Interval:', this.musicInterval);
        if (!this.enabled || this.musicInterval) return;
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();

        const bassLine = [110, 110, 220, 110, 130.81, 110, 164.81, 146.83]; // A2, A2, A3, A2, C3, A2, E3, D3
        let noteIndex = 0;

        this.musicInterval = setInterval(() => {
            const freq = bassLine[noteIndex];
            this.playTone(freq, 'sawtooth', 0.1, 0.15); // Short bass notes
            noteIndex = (noteIndex + 1) % bassLine.length;
        }, 250);
    }

    stopGameMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    }

    startMenuMusic() {
        if (!this.enabled || this.menuMusicInterval) return;
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();

        // Synthwave Bass Sequence (Am - F - C - G)
        const notes = [110.00, 87.31, 130.81, 98.00]; // Root notes
        let step = 0;

        this.menuMusicInterval = setInterval(() => {
            const root = notes[Math.floor(step / 8) % 4];

            // Bass (Sawtooth) - Pumping effect
            if (step % 2 === 0) {
                this.playTone(root, 'sawtooth', 0.2, 0.15);
            } else {
                this.playTone(root, 'sawtooth', 0.1, 0.1); // Off-beat lighter
            }

            // Arpeggio (Square) - Cyberpunk feel
            const arpNotes = [root * 2, root * 3, root * 4, root * 3];
            const arpNote = arpNotes[step % 4];
            this.playTone(arpNote, 'square', 0.05, 0.05);

            step++;
        }, 200); // ~150 BPM (double time feel)
    }

    stopMenuMusic() {
        if (this.menuMusicInterval) {
            clearInterval(this.menuMusicInterval);
            this.menuMusicInterval = null;
        }
    }
}

class HighScoreManager {
    constructor() {
        try {
            const stored = localStorage.getItem('neonDashScores');
            this.scores = stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to parse high scores:', e);
            this.scores = [];
        }

        if (!Array.isArray(this.scores) || this.scores.length === 0) {
            this.generateDefaults();
        }
    }

    generateDefaults() {
        this.scores = [
            { name: 'ZEU', score: 999999, level: 10 },
            { name: 'NEO', score: 500000, level: 9 },
            { name: 'TRN', score: 250000, level: 8 },
            { name: 'FLY', score: 150000, level: 7 },
            { name: 'CPU', score: 120000, level: 6 },
            { name: 'AAA', score: 100000, level: 5 },
            { name: 'BBB', score: 90000, level: 5 },
            { name: 'CCC', score: 80000, level: 4 },
            { name: 'DDD', score: 70000, level: 4 },
            { name: 'EEE', score: 65000, level: 3 },
            { name: 'FFF', score: 60000, level: 3 },
            { name: 'GGG', score: 58000, level: 2 },
            { name: 'HHH', score: 55000, level: 2 },
            { name: 'III', score: 52000, level: 1 },
            { name: 'JJJ', score: 50000, level: 1 }
        ];
        this.save();
    }

    save() {
        localStorage.setItem('neonDashScores', JSON.stringify(this.scores));
    }

    getScores() {
        return this.scores.sort((a, b) => b.score - a.score).slice(0, 15);
    }

    isHighScore(score) {
        const topScores = this.getScores();
        if (topScores.length < 15) return true;
        return score > topScores[topScores.length - 1].score;
    }

    addScore(name, score, level) {
        this.scores.push({ name, score, level });
        this.scores.sort((a, b) => b.score - a.score);
        this.scores = this.scores.slice(0, 15); // Keep top 15
        this.save();
    }
}

class Game {

    constructor() {
        console.log('Game Constructor called');
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = GRID_WIDTH * TILE_SIZE;
        this.height = GRID_HEIGHT * TILE_SIZE;

        // Resize canvas to fit grid
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.state = STATE.MENU;
        this.prevState = STATE.MENU;

        // Demo Mode Properties
        this.idleTimer = 0;
        this.demoTimer = 0;
        this.demoInputTimer = 0;
        this.demoDuration = 30000; // 30 seconds
        this.idleThreshold = 10000; // 10 seconds wait time
        this.grid = [];
        this.player = { x: 1, y: 1, dirX: 0, dirY: 0, nextDirX: 0, nextDirY: 0, moveTimer: 0 };
        this.score = 0;
        this.diamondsCollected = 0;
        this.diamondsNeeded = 10;
        this.dynamiteCount = 0; // New: Dynamite Inventory
        this.bombs = []; // New: Active Bombs
        this.timeLeft = 150;
        this.lastTime = 0;
        this.animationFrameId = null;

        this.currentLevelIndex = 0;

        this.fallingEntities = new Set();
        this.fallingEntityFrames = new Map(); // Track falling duration
        this.particles = [];
        this.enemies = [];
        this.isTesting = false; // Track if in test mode from editor

        this.physicsTimer = 0; // Control falling speed
        this.shakeTimer = 0;
        this.flashTimer = 0; // Flash effect for exit open
        this.globalTime = 0;
        this.currentTheme = THEMES[0];
        this.highScorePending = false;

        // Background Stars
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1
            });
        }

        // Menu Particles (Falling Diamonds/Rocks)
        this.menuParticles = [];
        for (let i = 0; i < 30; i++) {
            this.menuParticles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                speed: Math.random() * 2 + 1,
                type: Math.random() < 0.6 ? TYPES.DIAMOND : TYPES.ROCK,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.1,
                scale: Math.random() * 0.5 + 0.5
            });
        }

        // Input handling
        this.keys = {};
        this.gamepadInput = null;
        this.gamepadActionLocked = false;
        this.gamepadPauseLocked = false;

        this.sound = new SoundManager();
        this.highScores = new HighScoreManager();
        this.levelEditor = new LevelEditor(this);

        this.highScorePage = 0;
        this.highScoreTimer = 0;

        // Quick Wins Features
        this.showFPS = false;
        this.fps = 60;
        this.frameCount = 0;
        this.fpsTime = 0;

        this.prevState = null; // Store state before pause

        // Load sound preference
        const soundEnabled = localStorage.getItem('soundEnabled');
        if (soundEnabled !== null) {
            this.sound.enabled = soundEnabled === 'true';
        }

        // Global Audio Unlocker
        const unlockAudio = () => {
            if (!this.sound.ctx || this.sound.ctx.state === 'suspended') {
                this.sound.unlock();
            }
        };

        window.addEventListener('keydown', (e) => {
            this.handleInput(e, true);
            unlockAudio();
        });
        window.addEventListener('keyup', (e) => this.handleInput(e, false));
        window.addEventListener('click', () => { unlockAudio(); this.resetIdle(); });
        window.addEventListener('touchstart', () => { unlockAudio(); this.resetIdle(); });
        window.addEventListener('mousemove', () => this.resetIdle());

        // Name Entry UI
        this.nameInput = document.getElementById('player-name-input');
        this.submitBtn = document.getElementById('submit-score-btn');
        this.submitBtn.addEventListener('click', () => this.submitHighScore());

        // Pause Menu UI
        document.getElementById('btn-resume').addEventListener('click', () => {
            this.sound.playMenuConfirm();
            if (this.state === STATE.PAUSED) {
                this.state = this.prevState || STATE.PLAYING;
                document.getElementById('pause-overlay').classList.add('hidden');
            }
        });

        document.getElementById('btn-restart').addEventListener('click', () => {
            this.sound.playMenuConfirm();
            if (this.state === STATE.PAUSED) {
                document.getElementById('pause-overlay').classList.add('hidden');
                if (this.isTesting) {
                    this.levelEditor.testPlay();
                } else {
                    this.resetGame();
                }
            }
        });

        document.getElementById('btn-sound').addEventListener('click', () => {
            this.sound.playMenuBlip();
            this.sound.enabled = !this.sound.enabled;
            localStorage.setItem('soundEnabled', this.sound.enabled.toString());
            document.getElementById('btn-sound').innerText = `SOUND: ${this.sound.enabled ? 'ON' : 'OFF'}`;
        });

        document.getElementById('btn-fullscreen').addEventListener('click', () => {
            const elem = document.documentElement;
            // Check if already in fullscreen
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement ||
                document.mozFullScreenElement || document.msFullscreenElement;

            if (!isFullscreen) {
                // Enter fullscreen - try all vendor prefixes
                if (elem.requestFullscreen) {
                    elem.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
            } else {
                // Exit fullscreen - try all vendor prefixes
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        });

        document.getElementById('btn-menu').addEventListener('click', () => {
            this.sound.playMenuConfirm();
            if (this.state === STATE.PAUSED) {
                this.state = STATE.MENU;
                document.getElementById('pause-overlay').classList.add('hidden');
                this.sound.stopGameMusic();
                this.sound.startMenuMusic();
                this.updateMenuUI();
            }
        });

        // Add hover sounds to all pause menu buttons
        ['btn-resume', 'btn-restart', 'btn-sound', 'btn-fullscreen', 'btn-menu'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('mouseenter', () => this.sound.playMenuHover());
            }
        });

        this.updateMenuUI();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    initLevel() {
        const levelDef = LEVELS[this.currentLevelIndex] || LEVELS[LEVELS.length - 1];
        this.diamondsNeeded = levelDef.diamondsNeeded;
        this.timeLeft = levelDef.time;
        this.diamondsCollected = 0;
        this.dynamiteCount = 0;
        this.bombs = [];
        this.particles = [];
        this.enemies = [];
        this.fallingEntities.clear();
        this.fallingEntityFrames.clear(); // Clear falling duration tracking
        this.shakeTimer = 0;
        this.flashTimer = 0;

        // Select Theme
        const themeIndex = this.currentLevelIndex % THEMES.length;
        this.currentTheme = THEMES[themeIndex];
        COLORS = this.currentTheme;

        // Generate Grid
        this.grid = [];
        for (let y = 0; y < GRID_HEIGHT; y++) {
            const row = [];
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (y === 0 || y === GRID_HEIGHT - 1 || x === 0 || x === GRID_WIDTH - 1) {
                    row.push(TYPES.WALL);
                } else {
                    row.push(TYPES.DIRT);
                }
            }
            this.grid.push(row);
        }

        if (levelDef.type === 'fixed') {
            // Load fixed map
            for (let y = 0; y < GRID_HEIGHT; y++) {
                const mapRow = levelDef.map[y] || "";
                for (let x = 0; x < GRID_WIDTH; x++) {
                    const char = mapRow[x] || " ";
                    if (char === '#') this.grid[y][x] = TYPES.WALL;
                    else if (char === '.') this.grid[y][x] = TYPES.DIRT;
                    else if (char === ' ') this.grid[y][x] = TYPES.EMPTY;
                    else if (char === 'O') this.grid[y][x] = TYPES.ROCK;
                    else if (char === 'D') this.grid[y][x] = TYPES.DIAMOND;
                    else if (char === 'S') {
                        this.grid[y][x] = TYPES.EMPTY;
                        this.player.x = x;
                        this.player.y = y;
                    } else if (char === 'X') this.grid[y][x] = TYPES.EXIT;
                    else if (char === 'E') {
                        this.grid[y][x] = TYPES.EMPTY;
                        this.enemies.push(new Enemy(x, y, ENEMY_TYPES.BASIC));
                    }
                }
            }
            // Add some dynamite randomly
            for (let i = 0; i < 3; i++) {
                let dx, dy;
                do {
                    dx = Math.floor(Math.random() * (GRID_WIDTH - 2)) + 1;
                    dy = Math.floor(Math.random() * (GRID_HEIGHT - 2)) + 1;
                } while (this.grid[dy][dx] !== TYPES.DIRT);
                this.grid[dy][dx] = TYPES.DYNAMITE_PICKUP;
            }

        } else {
            // Procedural Generation
            this.player.x = 1;
            this.player.y = 1;
            this.grid[1][1] = TYPES.EMPTY;

            // Exit
            this.grid[GRID_HEIGHT - 2][GRID_WIDTH - 2] = TYPES.EXIT;
            // Clear area around exit
            this.grid[GRID_HEIGHT - 2][GRID_WIDTH - 3] = TYPES.DIRT;
            this.grid[GRID_HEIGHT - 3][GRID_WIDTH - 2] = TYPES.DIRT;
            this.grid[GRID_HEIGHT - 3][GRID_WIDTH - 3] = TYPES.DIRT;

            for (let y = 1; y < GRID_HEIGHT - 1; y++) {
                for (let x = 1; x < GRID_WIDTH - 1; x++) {
                    if (x === this.player.x && y === this.player.y) continue;
                    if (this.grid[y][x] === TYPES.EXIT) continue;

                    const rand = Math.random();
                    if (rand < levelDef.rockChance) this.grid[y][x] = TYPES.ROCK;
                    else if (rand < levelDef.rockChance + 0.05) this.grid[y][x] = TYPES.DIAMOND;
                    else if (rand < levelDef.rockChance + 0.05 + levelDef.wallChance) this.grid[y][x] = TYPES.WALL;
                    else if (rand < levelDef.rockChance + 0.05 + levelDef.wallChance + levelDef.enemyChance) {
                        this.grid[y][x] = TYPES.EMPTY;
                        const eType = Math.random() < 0.3 ? ENEMY_TYPES.SEEKER : (Math.random() < 0.6 ? ENEMY_TYPES.PATROLLER : ENEMY_TYPES.BASIC);
                        this.enemies.push(new Enemy(x, y, eType));
                    } else if (rand < levelDef.rockChance + 0.05 + levelDef.wallChance + levelDef.enemyChance + 0.01) {
                        this.grid[y][x] = TYPES.DYNAMITE_PICKUP;
                    }
                }
            }
        }

        // Clear safe zone around player
        this.grid[this.player.y][this.player.x] = TYPES.PLAYER;
        this.grid[this.player.y + 1][this.player.x] = TYPES.EMPTY;
        this.grid[this.player.y][this.player.x + 1] = TYPES.EMPTY;

        // Clear space around enemies
        this.enemies.forEach(e => {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (this.grid[e.y + dy] && this.grid[e.y + dy][e.x + dx] === TYPES.DIRT) {
                        this.grid[e.y + dy][e.x + dx] = TYPES.EMPTY;
                    }
                }
            }
            this.grid[e.y][e.x] = TYPES.ENEMY;
        });
    }

    update(dt) {
        this.updateParticles();
        this.updateUI();
        this.pollGamepad();

        // FPS calculation
        this.frameCount++;
        this.fpsTime += dt;
        if (this.fpsTime >= 1000) {
            this.fps = Math.round(this.frameCount * 1000 / this.fpsTime);
            const fpsCounter = document.getElementById('fps-counter');
            if (fpsCounter) {
                fpsCounter.innerText = `FPS: ${this.fps}`;
            }
            this.frameCount = 0;
            this.fpsTime = 0;
        }



        if (this.shakeTimer > 0) {
            this.shakeTimer -= dt;
            if (this.shakeTimer < 0) this.shakeTimer = 0;
        }

        if (this.flashTimer > 0) {
            this.flashTimer -= dt;
            if (this.flashTimer < 0) this.flashTimer = 0;
        }

        this.globalTime += dt;

        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.height) {
                star.y = 0;
                star.x = Math.random() * this.width;
            }
        });

        // Update Menu Particles
        if (this.state === STATE.MENU) {
            this.menuParticles.forEach(p => {
                p.y += p.speed;
                p.rotation += p.rotSpeed;
                if (p.y > this.height) {
                    p.y = -TILE_SIZE;
                    p.x = Math.random() * this.width;
                }
            });

            // Demo Idle Timer
            this.idleTimer += dt;
            if (this.idleTimer > this.idleThreshold) {
                this.startDemo();
            }
        }

        // Pause Menu Gamepad Input
        if (this.state === STATE.PAUSED) {
            const gamepads = navigator.getGamepads();
            const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
            if (gp) {
                let anyButtonPressed = false;

                // Resume (A or B button only, not Start)
                if ((gp.buttons[0].pressed || gp.buttons[1].pressed) && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    this.state = this.prevState || STATE.PLAYING;
                    document.getElementById('pause-overlay').classList.add('hidden');
                    anyButtonPressed = true;
                }
                // Y - Restart
                else if (gp.buttons[3].pressed && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    document.getElementById('pause-overlay').classList.add('hidden');
                    if (this.isTesting) {
                        this.levelEditor.testPlay();
                    } else {
                        this.resetGame();
                    }
                    anyButtonPressed = true;
                }
                // X - Sound Toggle
                else if (gp.buttons[2].pressed && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    this.sound.enabled = !this.sound.enabled;
                    localStorage.setItem('soundEnabled', this.sound.enabled.toString());
                    document.getElementById('btn-sound').innerText = `SOUND: ${this.sound.enabled ? 'ON' : 'OFF'}`;
                    anyButtonPressed = true;
                }
                // Select/Back - Menu
                else if (gp.buttons[8].pressed && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    this.state = STATE.MENU;
                    document.getElementById('pause-overlay').classList.add('hidden');
                    this.sound.stopGameMusic();
                    this.sound.startMenuMusic();
                    this.updateMenuUI();
                    anyButtonPressed = true;
                }

                // Reset lock when no buttons pressed
                if (!gp.buttons[0].pressed && !gp.buttons[1].pressed && !gp.buttons[2].pressed &&
                    !gp.buttons[3].pressed && !gp.buttons[8].pressed) {
                    this.gamepadActionLocked = false;
                }
            }
            return;
        }

        // Editor gamepad input
        if (this.state === STATE.EDITOR) {
            this.levelEditor.handleGamepadInput(dt);
            return;
        }

        // Demo Mode Logic
        if (this.state === STATE.DEMO) {
            this.updateDemoAI(dt);

            this.physicsTimer += dt;
            if (this.physicsTimer > 120) {
                this.updatePhysics();
                this.physicsTimer = 0;
            }
            this.updateEnemies(dt);

            this.player.moveTimer += dt;
            if (this.player.moveTimer > 100) {
                this.movePlayer();
                this.player.moveTimer = 0;
            }

            if (this.state === STATE.GAMEOVER) {
                this.stopDemo();
            }
            return;
        }

        if (this.state === STATE.MENU) {
            // Gamepad support in menu
            const gamepads = navigator.getGamepads();
            const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
            if (gp) {
                // Y - Level Editor (check FIRST to avoid conflict)
                if (gp.buttons[3].pressed && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    this.levelEditor.reset();
                    this.sound.stopMenuMusic();
                    this.state = STATE.EDITOR;
                    document.getElementById('menu-screen').classList.add('hidden');
                    document.getElementById('editor-overlay').classList.remove('hidden');
                    this.updateMenuUI();
                    // Lock Y button in editor to prevent immediate test play
                    this.levelEditor.gamepadButtonLocked[3] = true;
                }
                else if ((gp.buttons[0].pressed || gp.buttons[9].pressed) && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    if (this.highScorePending) return;
                    this.fadeToGame();
                }
                // Reset lock when no buttons pressed
                else if (!gp.buttons[0].pressed && !gp.buttons[3].pressed && !gp.buttons[9].pressed) {
                    this.gamepadActionLocked = false;
                }
            }

            // High score page auto-rotation
            this.highScoreTimer += dt;
            if (this.highScoreTimer > 3000) {
                this.highScoreTimer = 0;
                this.highScorePage = (this.highScorePage + 1) % 3;
                this.updateMenuUI();
            }
            return;
        }

        // Skip game logic if paused
        if (this.state === STATE.PAUSED) {
            return;
        }

        if (this.state !== STATE.PLAYING) return;

        // Gamepad Start button to pause
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
        if (gp && gp.buttons[9].pressed && !this.gamepadPauseLocked) {
            this.gamepadPauseLocked = true;
            this.gamepadActionLocked = true; // Prevent immediate resume
            this.prevState = STATE.PLAYING;
            this.state = STATE.PAUSED;
            document.getElementById('pause-overlay').classList.remove('hidden');
        }
        if (gp && !gp.buttons[9].pressed) {
            this.gamepadPauseLocked = false;
        }

        this.timeLeft -= dt / 1000;
        if (this.timeLeft <= 0) {
            this.timeLeft = 0;
            this.die();
        }

        for (let i = this.bombs.length - 1; i >= 0; i--) {
            const bomb = this.bombs[i];
            bomb.timer -= dt / 1000;
            if (bomb.timer <= 0) {
                this.explode(bomb.x, bomb.y);
                this.bombs.splice(i, 1);
            }
        }

        let dirX = 0;
        let dirY = 0;

        if (this.keys['ArrowUp']) dirY = -1;
        else if (this.keys['ArrowDown']) dirY = 1;
        else if (this.keys['ArrowLeft']) dirX = -1;
        else if (this.keys['ArrowRight']) dirX = 1;

        if (this.gamepadInput) {
            if (this.gamepadInput.y !== 0) {
                dirY = this.gamepadInput.y;
                dirX = 0;
            } else if (this.gamepadInput.x !== 0) {
                dirX = this.gamepadInput.x;
                dirY = 0;
            }
        }

        this.player.nextDirX = dirX;
        this.player.nextDirY = dirY;

        this.player.moveTimer += dt;
        if (this.player.moveTimer > 100) {
            this.movePlayer();
            this.player.moveTimer = 0;
        }

        // Slow down physics (falling rocks) to be slightly slower than player
        this.physicsTimer += dt;
        if (this.physicsTimer > 120) {
            this.updatePhysics();
            this.physicsTimer = 0;
        }

        this.updateEnemies(dt);
    }

    draw() {
        if (this.state === STATE.EDITOR) {
            this.levelEditor.draw(this.ctx);
            return;
        }

        this.ctx.fillStyle = this.currentTheme.background;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw Menu Particles
        if (this.state === STATE.MENU) {
            this.menuParticles.forEach(p => {
                this.ctx.save();
                this.ctx.translate(p.x + TILE_SIZE / 2, p.y + TILE_SIZE / 2);
                this.ctx.rotate(p.rotation);
                this.ctx.scale(p.scale, p.scale);
                this.ctx.translate(-(p.x + TILE_SIZE / 2), -(p.y + TILE_SIZE / 2));

                // Draw slightly faded
                this.ctx.globalAlpha = 0.6;
                if (p.type === TYPES.DIAMOND) {
                    this.drawDiamond(p.x, p.y);
                } else {
                    this.drawRock(p.x, p.y);
                }
                this.ctx.globalAlpha = 1.0;
                this.ctx.restore();
            });
        }

        // Flash Background if Exit just opened
        if (this.flashTimer > 0) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(star => {
            this.ctx.globalAlpha = Math.random() * 0.5 + 0.3;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
        this.ctx.globalAlpha = 1.0;

        if (this.state === STATE.MENU) return;

        const shakeX = this.shakeTimer > 0 ? (Math.random() - 0.5) * 10 : 0;
        const shakeY = this.shakeTimer > 0 ? (Math.random() - 0.5) * 10 : 0;

        this.ctx.save();
        this.ctx.translate(shakeX, shakeY);

        for (let y = 0; y < GRID_HEIGHT; y++) {
            if (!this.grid[y]) continue;
            for (let x = 0; x < GRID_WIDTH; x++) {
                const type = this.grid[y][x];
                if (type !== TYPES.EMPTY) {
                    this.drawTile(x, y, type);
                }
            }
        }

        this.drawPlayer(this.player.x * TILE_SIZE, this.player.y * TILE_SIZE);

        this.enemies.forEach(enemy => {
            this.drawEnemy(enemy.x * TILE_SIZE, enemy.y * TILE_SIZE);
        });

        this.bombs.forEach(bomb => {
            const px = bomb.x * TILE_SIZE;
            const py = bomb.y * TILE_SIZE;
            const flash = Math.floor(this.globalTime / 100) % 2 === 0;
            this.ctx.fillStyle = flash ? '#ff0000' : '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, TILE_SIZE / 2 - 6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#ffff00';
            this.ctx.fillRect(px + TILE_SIZE / 2 - 1, py + 2, 2, 6);
        });

        this.particles.forEach(p => p.draw(this.ctx));

        // Demo Mode Overlay
        if (this.state === STATE.DEMO) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fillRect(0, 0, this.width, this.height);

            this.ctx.save();
            this.ctx.shadowColor = '#00ffff';
            this.ctx.shadowBlur = 20;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '40px Orbitron';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('DEMO MODE', this.width / 2, this.height / 2);

            this.ctx.font = '20px Orbitron';
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#cccccc';

            if (Math.floor(Date.now() / 500) % 2 === 0) {
                this.ctx.fillText('PRESS ANY KEY', this.width / 2, this.height / 2 + 40);
            }
            this.ctx.restore();
        }

        this.ctx.restore();
    }

    drawTile(x, y, type) {
        const cx = x * TILE_SIZE;
        const cy = y * TILE_SIZE;

        switch (type) {
            case TYPES.DIRT:
                this.ctx.fillStyle = this.currentTheme.dirtColor;
                this.ctx.fillRect(cx, cy, TILE_SIZE, TILE_SIZE);
                this.ctx.fillStyle = this.currentTheme.dirtDetail;
                this.ctx.fillRect(cx + 4, cy + 4, 4, 4);
                this.ctx.fillRect(cx + 20, cy + 10, 4, 4);
                this.ctx.fillRect(cx + 10, cy + 20, 4, 4);
                break;
            case TYPES.WALL:
                const isBorder = x === 0 || x === GRID_WIDTH - 1 || y === 0 || y === GRID_HEIGHT - 1;

                if (isBorder) {
                    this.drawSteelWall(cx, cy);
                } else {
                    // Inner Wall Style (Original / Brick-like)
                    this.ctx.fillStyle = this.currentTheme[TYPES.WALL];
                    this.ctx.fillRect(cx, cy, TILE_SIZE, TILE_SIZE);
                    this.ctx.strokeStyle = this.currentTheme.wallGlow;
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(cx + 2, cy + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                    this.ctx.fillStyle = '#424242';
                    this.ctx.fillRect(cx + 8, cy + 8, TILE_SIZE - 16, TILE_SIZE - 16);
                }
                break;
            case TYPES.ROCK:
                this.drawRock(cx, cy);
                break;
            case TYPES.DIAMOND:
                this.drawDiamond(cx, cy);
                break;
            case TYPES.PLAYER:
                this.drawPlayer(cx, cy);
                break;
            case TYPES.ENEMY:
                this.drawEnemy(cx, cy);
                break;
            case TYPES.EXIT:
                this.drawExit(cx, cy);
                break;
            case TYPES.DYNAMITE_PICKUP:
                this.ctx.fillStyle = this.currentTheme[TYPES.DYNAMITE_PICKUP];
                this.ctx.fillRect(cx + 10, cy + 6, 12, 20);
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(cx + 12, cy + 8, 2, 16);
                break;
        }
    }

    drawSteelWall(cx, cy) {
        // Steel Plate Style (Border / Titanium Wall)
        const wallColor = this.currentTheme[TYPES.WALL];

        // Base
        this.ctx.fillStyle = wallColor;
        this.ctx.fillRect(cx, cy, TILE_SIZE, TILE_SIZE);

        // 3D Bevel Effect
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#ffffff40'; // Highlight
        this.ctx.beginPath();
        this.ctx.moveTo(cx + TILE_SIZE, cy);
        this.ctx.lineTo(cx, cy);
        this.ctx.lineTo(cx, cy + TILE_SIZE);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#00000060'; // Shadow
        this.ctx.beginPath();
        this.ctx.moveTo(cx + TILE_SIZE, cy);
        this.ctx.lineTo(cx + TILE_SIZE, cy + TILE_SIZE);
        this.ctx.lineTo(cx, cy + TILE_SIZE);
        this.ctx.stroke();

        // Inner Plate
        this.ctx.fillStyle = '#00000020';
        this.ctx.fillRect(cx + 4, cy + 4, TILE_SIZE - 8, TILE_SIZE - 8);

        // Rivets (4 corners)
        this.ctx.fillStyle = this.currentTheme.wallGlow;
        const rivetSize = 2;
        this.ctx.fillRect(cx + 6, cy + 6, rivetSize, rivetSize);
        this.ctx.fillRect(cx + TILE_SIZE - 8, cy + 6, rivetSize, rivetSize);
        this.ctx.fillRect(cx + 6, cy + TILE_SIZE - 8, rivetSize, rivetSize);
        this.ctx.fillRect(cx + TILE_SIZE - 8, cy + TILE_SIZE - 8, rivetSize, rivetSize);
    }

    drawRock(x, y) {
        this.ctx.fillStyle = this.currentTheme[TYPES.ROCK];
        this.ctx.beginPath();
        this.ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE / 2 - 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#00000040'; // Shadow
        this.ctx.beginPath();
        this.ctx.arc(x + TILE_SIZE / 2 - 4, y + TILE_SIZE / 2 - 4, TILE_SIZE / 4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawDiamond(x, y) {
        const pulse = Math.sin(this.globalTime * 0.005) * 2;
        const offset = -pulse / 2;

        this.ctx.fillStyle = this.currentTheme[TYPES.DIAMOND];
        this.ctx.shadowBlur = 10 + pulse * 2;
        this.ctx.shadowColor = this.currentTheme[TYPES.DIAMOND];

        this.ctx.beginPath();
        this.ctx.moveTo(x + TILE_SIZE / 2, y + 4 + offset);
        this.ctx.lineTo(x + TILE_SIZE - 4 - offset, y + TILE_SIZE / 2);
        this.ctx.lineTo(x + TILE_SIZE / 2, y + TILE_SIZE - 4 - offset);
        this.ctx.lineTo(x + 4 + offset, y + TILE_SIZE / 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.moveTo(x + TILE_SIZE / 2, y + 8 + offset);
        this.ctx.lineTo(x + TILE_SIZE - 8 - offset, y + TILE_SIZE / 2);
        this.ctx.lineTo(x + TILE_SIZE / 2, y + TILE_SIZE - 8 - offset);
        this.ctx.lineTo(x + 8 + offset, y + TILE_SIZE / 2);
        this.ctx.fill();
    }

    drawEnemy(x, y) {
        const enemy = this.enemies.find(e => e.x * TILE_SIZE === x && e.y * TILE_SIZE === y);
        let color = this.currentTheme[TYPES.ENEMY]; // Default Basic
        // BASIC: Black eyes for Theme 1 (yellow body), yellow otherwise
        let eyeColor = (this.currentLevelIndex % THEMES.length) === 1 ? '#000000' : '#ffff00';
        let type = ENEMY_TYPES.BASIC;

        if (enemy) {
            type = enemy.type;
            if (enemy.type === ENEMY_TYPES.SEEKER) {
                color = this.currentTheme.enemySeeker;
                eyeColor = '#ff0000'; // Red eyes
            } else if (enemy.type === ENEMY_TYPES.PATROLLER) {
                color = this.currentTheme.enemyPatroller;
                eyeColor = '#ffffff'; // White eyes
            }
        }

        this.ctx.fillStyle = color;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = color;

        // Draw different shapes based on type
        if (type === ENEMY_TYPES.BASIC) {
            // BASIC: Circle/Oval (butterfly/bug style)
            this.ctx.beginPath();
            this.ctx.ellipse(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE / 2 - 6, TILE_SIZE / 2 - 4, 0, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (type === ENEMY_TYPES.SEEKER) {
            // SEEKER: Triangle (aggressive, hunter)
            this.ctx.beginPath();
            this.ctx.moveTo(x + TILE_SIZE / 2, y + 6); // Top point
            this.ctx.lineTo(x + TILE_SIZE - 6, y + TILE_SIZE - 6); // Bottom right
            this.ctx.lineTo(x + 6, y + TILE_SIZE - 6); // Bottom left
            this.ctx.closePath();
            this.ctx.fill();
        } else {
            // PATROLLER: Square (original, patrol guard)
            this.ctx.fillRect(x + 6, y + 6, TILE_SIZE - 12, TILE_SIZE - 12);
        }

        // Eyes (animated) - position adjusted per type
        const eyeOffset = Math.sin(this.globalTime * 0.01) * 2;
        this.ctx.fillStyle = eyeColor;
        this.ctx.shadowBlur = 0;

        if (type === ENEMY_TYPES.SEEKER) {
            // Triangle eyes - higher up
            this.ctx.fillRect(x + 10 + eyeOffset, y + 12, 3, 3);
            this.ctx.fillRect(x + 19 + eyeOffset, y + 12, 3, 3);
        } else {
            // Circle and Square eyes - centered
            this.ctx.fillRect(x + 8 + eyeOffset, y + 10, 4, 4);
            this.ctx.fillRect(x + 20 + eyeOffset, y + 10, 4, 4);
        }
    }

    drawPlayer(x, y) {
        this.ctx.fillStyle = this.currentTheme[TYPES.PLAYER];
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.currentTheme[TYPES.PLAYER];

        // Breathing animation
        const breath = Math.sin(this.globalTime * 0.008) * 1;
        this.ctx.fillRect(x + 4 - breath, y + 4 - breath, TILE_SIZE - 8 + breath * 2, TILE_SIZE - 8 + breath * 2);

        // Eyes - dynamic color based on theme
        const eyeColor = this.currentTheme.playerDetail || '#ffffff';
        this.ctx.fillStyle = eyeColor;
        this.ctx.shadowBlur = 0;

        // Look direction
        let lookX = 0;
        let lookY = 0;
        if (this.player.nextDirX !== 0) lookX = this.player.nextDirX * 2;
        if (this.player.nextDirY !== 0) lookY = this.player.nextDirY * 2;

        this.ctx.fillRect(x + 8 + lookX, y + 10 + lookY, 6, 6);
        this.ctx.fillRect(x + 18 + lookX, y + 10 + lookY, 6, 6);
    }

    drawExit(x, y) {
        const isOpen = this.diamondsCollected >= this.diamondsNeeded;

        // If locked, it looks exactly like the steel wall
        if (!isOpen) {
            this.drawSteelWall(x, y);
            return;
        }

        // If open, flash between steel wall and exit door
        // Flash speed: 250ms
        const flash = Math.floor(this.globalTime / 250) % 2 === 0;

        if (flash) {
            this.drawSteelWall(x, y);
        } else {
            // Draw Open Exit (Green Door)
            this.ctx.fillStyle = this.currentTheme[TYPES.EXIT];
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;

            // Draw frame
            this.ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);

            // Draw door
            this.ctx.fillRect(x + 6, y + 6, TILE_SIZE - 12, TILE_SIZE - 12);

            // Glow effect
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = this.currentTheme[TYPES.EXIT];
            this.ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            this.ctx.shadowBlur = 0;
        }
    }


    handleInput(e, isKeyDown) {
        this.resetIdle();
        try {
            // Editor Input Handling
            if (this.state === STATE.EDITOR) {
                this.levelEditor.handleInput(e, isKeyDown);
                // Allow L key to toggle back to menu even in editor mode
                if ((e.key === 'l' || e.key === 'L') && isKeyDown) {
                    this.state = STATE.MENU;
                    document.getElementById('editor-overlay').classList.add('hidden');
                    this.updateMenuUI();
                }
                return;
            }

            // ESC - Pause/Unpause
            if (e.key === 'Escape' && isKeyDown) {
                if (this.state === STATE.PLAYING) {
                    this.prevState = STATE.PLAYING;
                    this.state = STATE.PAUSED;
                    document.getElementById('pause-overlay').classList.remove('hidden');
                    return;
                } else if (this.state === STATE.PAUSED) {
                    this.state = this.prevState || STATE.PLAYING;
                    document.getElementById('pause-overlay').classList.add('hidden');
                    return;
                }
            }

            // M - Toggle Sound
            if ((e.key === 'm' || e.key === 'M') && isKeyDown) {
                this.sound.enabled = !this.sound.enabled;
                localStorage.setItem('soundEnabled', this.sound.enabled.toString());
                document.getElementById('btn-sound').innerText = `SOUND: ${this.sound.enabled ? 'ON' : 'OFF'}`;
                this.showMessage(this.sound.enabled ? "SOUND ON" : "SOUND OFF", "");
                setTimeout(() => {
                    if (this.state !== STATE.MENU) {
                        document.getElementById('message-overlay').classList.add('hidden');
                    }
                }, 1000);
                return;
            }

            // F - Fullscreen Toggle
            if ((e.key === 'f' || e.key === 'F') && isKeyDown) {
                const elem = document.documentElement;
                const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement ||
                    document.mozFullScreenElement || document.msFullscreenElement;

                if (!isFullscreen) {
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                    } else if (elem.mozRequestFullScreen) {
                        elem.mozRequestFullScreen();
                    } else if (elem.msRequestFullscreen) {
                        elem.msRequestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                }
                return;
            }

            // F3 - FPS Counter Toggle
            if (e.key === 'F3' && isKeyDown) {
                this.showFPS = !this.showFPS;
                const fpsCounter = document.getElementById('fps-counter');
                if (this.showFPS) {
                    fpsCounter.classList.remove('hidden');
                } else {
                    fpsCounter.classList.add('hidden');
                }
                return;
            }

            // L - Toggle Level Editor
            if ((e.key === 'l' || e.key === 'L') && isKeyDown) {
                if (this.state === STATE.MENU) {
                    this.levelEditor.reset();
                    this.state = STATE.EDITOR;
                    document.getElementById('menu-screen').classList.add('hidden');
                    document.getElementById('editor-overlay').classList.remove('hidden');
                } else if (this.state === STATE.EDITOR) {
                    this.state = STATE.MENU;
                    document.getElementById('editor-overlay').classList.add('hidden');
                    this.updateMenuUI();
                }
                return;
            }

            if (this.state === STATE.NAME_ENTRY) {
                if (isKeyDown && e.key === 'Enter') {
                    this.submitHighScore();
                }
                return;
            }

            // R - Instant Restart (no confirmation needed)
            if ((e.key === 'r' || e.key === 'R') && isKeyDown) {
                if (this.state === STATE.GAMEOVER || this.state === STATE.WIN || this.state === STATE.PLAYING || this.state === STATE.PAUSED) {
                    if (this.highScorePending) return;

                    document.getElementById('pause-overlay').classList.add('hidden');

                    // If in test mode, restart the test level
                    if (this.isTesting) {
                        this.levelEditor.testPlay();
                    } else {
                        // Normal mode: restart current story level
                        if (this.state === STATE.WIN && this.currentLevelIndex >= LEVELS.length) {
                            this.currentLevelIndex = 0;
                        }
                        this.resetGame();
                    }
                }
                return;
            }

            // Space/Enter for game start, restart, and dynamite (check both e.code and e.key for compatibility)
            const isSpace = e.code === 'Space' || e.key === ' ';
            const isEnter = e.code === 'Enter' || e.key === 'Enter';

            if (isSpace || isEnter) {
                if (isKeyDown && this.state === STATE.PLAYING && isSpace) {
                    this.placeDynamite();
                } else if (isKeyDown && (this.state === STATE.GAMEOVER || this.state === STATE.WIN)) {
                    if (this.highScorePending) return;

                    if (this.isTesting) {
                        // Return to editor immediately
                        this.state = STATE.EDITOR;
                        document.getElementById('editor-overlay').classList.remove('hidden');
                        document.getElementById('message-overlay').classList.add('hidden');
                        this.isTesting = false;
                        return;
                    }

                    if (this.state === STATE.WIN && this.currentLevelIndex >= LEVELS.length) {
                        this.currentLevelIndex = 0;
                    }
                    this.resetGame();
                } else if (isKeyDown && this.state === STATE.MENU) {
                    if (this.highScorePending) return;
                    this.initLevel();
                    this.startGame();
                }
            }

            this.keys[e.code] = isKeyDown;
        } catch (err) {
            console.error('Input Error:', err);
        }
    }

    startGame() {
        if (this.state === STATE.PLAYING) return;

        const startingFromMenu = (this.state === STATE.MENU);

        console.log('Starting Game...');
        this.state = STATE.PLAYING;

        // Unlock audio engine and then start music
        this.sound.unlock().then(() => {
            console.log('Audio unlocked, starting music');
            this.sound.stopMenuMusic();
            this.sound.startGameMusic();
        }).catch(e => console.error('Audio unlock failed:', e));

        // Auto-pause on mobile when starting from menu to allow fullscreen toggle
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (startingFromMenu && isMobile) {
            this.state = STATE.PAUSED;
            this.prevState = STATE.PLAYING;
            document.getElementById('pause-overlay').classList.remove('hidden');
        }

        this.updateUI();
        this.updateMenuUI();
        document.getElementById('message-overlay').classList.add('hidden');

        // Ensure game loop is running
        if (!this.animationFrameId) {
            this.loop(0);
        }
    }

    fadeToGame() {
        console.log('fadeToGame called');
        // Step 1: Fade out menu
        const menuScreen = document.getElementById('menu-screen');
        menuScreen.style.opacity = '1'; // Ensure starting opacity
        menuScreen.classList.add('fade-out');
        console.log('Added fade-out class');

        setTimeout(() => {
            // Step 2: Hide menu, show READY message
            menuScreen.classList.add('hidden');
            menuScreen.classList.remove('fade-out');
            menuScreen.style.opacity = ''; // Reset inline style
            console.log('Menu hidden, showing READY');

            const messageOverlay = document.getElementById('message-overlay');
            const messageTitle = document.getElementById('message-title');
            const messageSubtitle = document.getElementById('message-subtitle');

            messageTitle.innerText = 'READY?';
            messageSubtitle.innerText = 'Get Ready...';
            messageOverlay.style.opacity = '0'; // Start from transparent
            messageOverlay.classList.remove('hidden');
            messageOverlay.classList.add('fade-in');

            setTimeout(() => {
                // Step 3: Start game
                messageOverlay.classList.remove('fade-in');
                messageOverlay.style.opacity = '';
                messageOverlay.classList.add('hidden'); // Ensure READY is hidden
                console.log('Starting game');

                this.initLevel();
                this.startGame();
            }, 1500); // Show READY for 1.5 seconds
        }, 1000); // Menu fade out duration (1s)
    }

    resetGame() {
        this.score = 0;
        this.initLevel();
        this.startGame();
    }

    resetIdle() {
        this.idleTimer = 0;
        if (this.state === STATE.DEMO) {
            this.stopDemo();
        }
    }

    startDemo() {
        if (this.state !== STATE.MENU) return;
        console.log('Starting Demo Mode');
        this.state = STATE.DEMO;
        this.demoTimer = 0;
        this.demoInputTimer = 0;

        // Use a random Generated Level (5-10) for Demo to rotate themes
        // Levels 5-10 are at indices 4-9
        this.currentLevelIndex = 4 + Math.floor(Math.random() * 6);
        this.initLevel();

        // Hide UI
        document.getElementById('menu-screen').classList.add('hidden');
        document.querySelector('.hud-panel').classList.add('hidden');
    }

    stopDemo() {
        console.log('Stopping Demo Mode');
        this.idleTimer = 0; // Reset idle timer to prevent immediate restart
        this.state = STATE.MENU;
        this.updateMenuUI();
        document.getElementById('message-overlay').classList.add('hidden');
        // Reset to Level 1 for normal play
        this.currentLevelIndex = 0;
    }

    updateDemoAI(dt) {
        this.demoTimer += dt;
        if (this.demoTimer > this.demoDuration) {
            this.stopDemo();
            return;
        }

        this.demoInputTimer += dt;
        if (this.demoInputTimer > 400) { // New move every 0.4s (slower)
            this.demoInputTimer = 0;

            // Simple Random Walk
            const dirs = [
                { x: 0, y: -1 }, // Up
                { x: 0, y: 1 },  // Down
                { x: -1, y: 0 }, // Left
                { x: 1, y: 0 }   // Right
            ];

            // Try to find a valid move (not into wall)
            let validMoves = [];
            for (let dir of dirs) {
                const nextX = this.player.x + dir.x;
                const nextY = this.player.y + dir.y;
                if (nextX >= 0 && nextX < GRID_WIDTH && nextY >= 0 && nextY < GRID_HEIGHT) {
                    const tile = this.grid[nextY][nextX];
                    // Avoid walls and rocks (unless rock is falling, but simple check is enough)
                    if (tile !== TYPES.WALL && tile !== TYPES.ROCK) {
                        validMoves.push(dir);
                    }
                }
            }

            if (validMoves.length > 0) {
                const move = validMoves[Math.floor(Math.random() * validMoves.length)];
                this.player.nextDirX = move.x;
                this.player.nextDirY = move.y;
            }
        }
    }

    updateMenuUI() {
        const menuOverlay = document.getElementById('menu-screen');
        const highScoreList = document.getElementById('high-score-list');
        const highScoreTitle = document.getElementById('high-score-title');

        if (this.state === STATE.MENU) {
            menuOverlay.classList.remove('hidden');
            document.querySelector('.hud-panel').classList.add('hidden');
            document.getElementById('message-overlay').classList.add('hidden');
            document.getElementById('name-entry-overlay').classList.add('hidden');

            // Update High Scores
            const scores = this.highScores.getScores();
            const startIdx = this.highScorePage * 5;
            const pageScores = scores.slice(startIdx, startIdx + 5);

            highScoreList.innerHTML = pageScores.map((s, i) =>
                `<li><span>${startIdx + i + 1}. ${s.name}</span> <span>Lvl ${s.level}</span> <span>${s.score.toString().padStart(5, '0')}</span></li>`
            ).join('');

            // Fill empty slots if less than 5
            for (let i = pageScores.length; i < 5; i++) {
                highScoreList.innerHTML += `<li><span>${startIdx + i + 1}. ---</span> <span>---</span> <span>-----</span></li>`;
            }

            highScoreTitle.innerText = `HIGH SCORES (${this.highScorePage + 1}/3)`;

            // Start menu music if not already playing
            if (!this.sound.menuMusicInterval) {
                this.sound.startMenuMusic();
            }

        } else {
            menuOverlay.classList.add('hidden');
            document.querySelector('.hud-panel').classList.remove('hidden');
        }
    }



    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    updateUI() {
        document.getElementById('score').innerText = this.score.toString().padStart(5, '0');
        document.getElementById('diamonds').innerText = `${this.diamondsCollected}/${this.diamondsNeeded}`;
        document.getElementById('time').innerText = Math.floor(this.timeLeft).toString().padStart(3, '0');
        document.getElementById('level').innerText = this.currentLevelIndex + 1;
        document.getElementById('dynamite').innerText = this.dynamiteCount;
    }

    pollGamepad() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gp = gamepads[0]; // Use first gamepad

        if (gp && gp.connected) {
            this.gamepadInput = { x: 0, y: 0 };

            // D-Pad (Buttons 12, 13, 14, 15)
            if (gp.buttons[12] && gp.buttons[12].pressed) this.gamepadInput.y = -1; // Up
            else if (gp.buttons[13] && gp.buttons[13].pressed) this.gamepadInput.y = 1; // Down

            if (gp.buttons[14] && gp.buttons[14].pressed) this.gamepadInput.x = -1; // Left
            else if (gp.buttons[15] && gp.buttons[15].pressed) this.gamepadInput.x = 1; // Right

            // Analog Stick (Axes 0, 1) with deadzone
            if (gp.axes && gp.axes.length >= 2) {
                if (Math.abs(gp.axes[0]) > 0.3) this.gamepadInput.x = Math.sign(gp.axes[0]);
                if (Math.abs(gp.axes[1]) > 0.3) this.gamepadInput.y = Math.sign(gp.axes[1]);
            }

            // Start Button (Button 9) for Pause
            if (gp.buttons[9] && gp.buttons[9].pressed) {
                if (!this.gamepadPauseLocked) {
                    this.gamepadPauseLocked = true;
                    if (this.state === STATE.PLAYING) {
                        this.prevState = STATE.PLAYING;
                        this.state = STATE.PAUSED;
                        document.getElementById('pause-overlay').classList.remove('hidden');
                    } else if (this.state === STATE.PAUSED) {
                        this.state = this.prevState || STATE.PLAYING;
                        document.getElementById('pause-overlay').classList.add('hidden');
                    }
                }
            } else {
                this.gamepadPauseLocked = false;
            }

            // Action Button (A/Cross - Button 0) for Restart/Start
            if (gp.buttons[0] && gp.buttons[0].pressed) {
                if (!this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    if (this.state === STATE.NAME_ENTRY) {
                        this.submitHighScore();
                    } else if (this.state === STATE.MENU) {
                        if (this.highScorePending) return;
                        this.initLevel();
                        this.startGame();
                    } else if (this.state === STATE.GAMEOVER || this.state === STATE.WIN) {
                        if (this.highScorePending) return;

                        if (this.isTesting) {
                            // Return to editor immediately
                            this.state = STATE.EDITOR;
                            document.getElementById('editor-overlay').classList.remove('hidden');
                            document.getElementById('message-overlay').classList.add('hidden');
                            this.isTesting = false;
                            return;
                        }

                        if (this.state === STATE.WIN && this.currentLevelIndex >= LEVELS.length) {
                            this.currentLevelIndex = 0;
                        }
                        this.resetGame();
                    }
                }
            } else if (gp.buttons[1] && gp.buttons[1].pressed) {
                // Button B/Circle for Dynamite
                if (!this.gamepadActionLocked && this.state === STATE.PLAYING) {
                    this.gamepadActionLocked = true;
                    this.placeDynamite();
                }
            } else {
                this.gamepadActionLocked = false;
            }
        } else {
            // No gamepad connected - don't reset gamepadInput (allows touch controls)
            if (!this.gamepadInput) {
                this.gamepadInput = null;
            }
        }
    }

    vibrate(duration, weakMagnitude = 1.0, strongMagnitude = 1.0) {
        // 1. Gamepad Vibration
        const gp = navigator.getGamepads()[0];
        if (gp) {
            // Try Chrome/Edge standard method
            if (gp.vibrationActuator && typeof gp.vibrationActuator.playEffect === 'function') {
                try {
                    gp.vibrationActuator.playEffect('dual-rumble', {
                        startDelay: 0,
                        duration: duration,
                        weakMagnitude: weakMagnitude,
                        strongMagnitude: strongMagnitude
                    });
                } catch (e) {
                    console.warn('playEffect failed:', e);
                }
            }
            // Try Firefox fallback (pulse method)
            else if (gp.vibrationActuator && typeof gp.vibrationActuator.pulse === 'function') {
                try {
                    const intensity = Math.max(weakMagnitude, strongMagnitude);
                    gp.vibrationActuator.pulse(intensity, duration);
                } catch (e) {
                    console.warn('pulse failed:', e);
                }
            }
        }

        // 2. Mobile Device Vibration (Android)
        // Works on Android Chrome/Firefox. Does NOT work on iOS (Apple restriction).
        if (navigator.vibrate) {
            try {
                navigator.vibrate(duration);
            } catch (e) {
                // Ignore errors
            }
        }
    }

    movePlayer() {
        if (this.player.nextDirX === 0 && this.player.nextDirY === 0) return;

        const nextX = this.player.x + this.player.nextDirX;
        const nextY = this.player.y + this.player.nextDirY;

        // Boundary check
        if (nextX < 0 || nextX >= GRID_WIDTH || nextY < 0 || nextY >= GRID_HEIGHT) return;

        const nextTile = this.grid[nextY][nextX];

        // Handle movement based on tile type
        if (nextTile === TYPES.EMPTY || nextTile === TYPES.DIRT || nextTile === TYPES.DIAMOND || nextTile === TYPES.EXIT || nextTile === TYPES.DYNAMITE_PICKUP) {

            // Digging
            if (this.grid[nextY][nextX] === TYPES.DIRT) {
                this.grid[nextY][nextX] = TYPES.EMPTY;
                this.spawnParticles(nextX * TILE_SIZE + TILE_SIZE / 2, nextY * TILE_SIZE + TILE_SIZE / 2, '#5d4037', 5);
                this.sound.playDig();
            } else if (this.grid[nextY][nextX] === TYPES.DIAMOND) {
                this.collectDiamond(nextX, nextY);
            } else if (this.grid[nextY][nextX] === TYPES.DYNAMITE_PICKUP) {
                this.collectDynamite(nextX, nextY);
            } else if (this.grid[nextY][nextX] === TYPES.EXIT) {
                // Only allow exit if enough diamonds collected
                if (this.diamondsCollected >= this.diamondsNeeded) {
                    this.winGame();
                    return;
                } else {
                    // Not enough diamonds - block movement
                    return;
                }
            } else {
                this.sound.playStep();
            }

            this.grid[this.player.y][this.player.x] = TYPES.EMPTY;
            this.player.x = nextX;
            this.player.y = nextY;

            if (nextTile !== TYPES.EXIT) {
                this.grid[nextY][nextX] = TYPES.PLAYER;
            }

        } else if (nextTile === TYPES.ROCK) {
            // Push Rock (Horizontal only)
            if (this.player.nextDirY === 0) {
                const rockNextX = nextX + this.player.nextDirX;
                if (rockNextX >= 0 && rockNextX < GRID_WIDTH && this.grid[nextY][rockNextX] === TYPES.EMPTY) {
                    // Move Rock
                    this.grid[nextY][nextX] = TYPES.EMPTY; // Old rock pos (becomes player)
                    this.grid[nextY][rockNextX] = TYPES.ROCK; // New rock pos

                    // Move Player
                    this.grid[this.player.y][this.player.x] = TYPES.EMPTY;
                    this.player.x = nextX;
                    this.player.y = nextY;
                    this.grid[nextY][nextX] = TYPES.PLAYER;

                    this.sound.playNoise(0.1, 0.5); // Push sound
                }
            }
        } else if (nextTile === TYPES.ENEMY) {
            this.die();
        }
    }

    collectDynamite(x, y) {
        this.grid[y][x] = TYPES.EMPTY;
        this.dynamiteCount++;
        this.spawnParticles(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, '#ff4444', 10);
        this.sound.playCollect(); // Reuse collect sound or new one? Reuse for now.
        this.updateUI();
    }

    collectDiamond(x, y) {
        this.grid[y][x] = TYPES.EMPTY;
        this.score += 10;
        this.diamondsCollected++;

        // Trigger Flash if Exit opens
        if (this.diamondsCollected === this.diamondsNeeded) {
            this.flashTimer = 150; // 150ms white flash
            this.sound.playTone(1200, 'square', 0.2, 0.2); // High pitch alert
        }

        this.spawnParticles(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, '#00ffff', 10);
        this.sound.playCollect();
        this.updateUI();
    }

    placeDynamite() {
        if (this.dynamiteCount <= 0) return;

        this.dynamiteCount--;
        this.updateUI();

        const bomb = {
            x: this.player.x,
            y: this.player.y,
            timer: 2000
        };

        this.bombs.push(bomb);
        this.grid[bomb.y][bomb.x] = TYPES.DYNAMITE_ACTIVE;

        setTimeout(() => {
            this.explode(bomb.x, bomb.y);
            const idx = this.bombs.indexOf(bomb);
            if (idx !== -1) this.bombs.splice(idx, 1);
        }, bomb.timer);
    }

    explode(cx, cy) {
        const radius = 1;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const x = cx + dx;
                const y = cy + dy;

                if (x > 0 && x < GRID_WIDTH - 1 && y > 0 && y < GRID_HEIGHT - 1) {
                    const tile = this.grid[y][x];

                    // Kill player if in explosion radius
                    if (tile === TYPES.PLAYER || (x === this.player.x && y === this.player.y)) {
                        this.die();
                        return;
                    }

                    if (tile === TYPES.DIRT || tile === TYPES.ROCK || tile === TYPES.DIAMOND || tile === TYPES.DYNAMITE_ACTIVE || tile === TYPES.WALL) {
                        this.grid[y][x] = TYPES.EMPTY;
                        this.spawnParticles(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, '#ff4400', 15);
                    }

                    if (tile === TYPES.ENEMY) {
                        const enemyIndex = this.enemies.findIndex(e => e.x === x && e.y === y);
                        if (enemyIndex !== -1) {
                            this.enemies.splice(enemyIndex, 1);
                            this.score += 50;
                        }
                        this.grid[y][x] = TYPES.EMPTY;
                        this.spawnParticles(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, '#ff0000', 20);
                    }
                }
            }
        }

        this.shakeTimer = 300;
        this.sound.playExplosion();
        this.vibrate(300, 0.8, 0.8);
    }

    submitHighScore() {
        const name = this.nameInput.value.trim().toUpperCase().substring(0, 3) || 'AAA';
        this.highScores.addScore(name, this.score, this.currentLevelIndex);

        document.getElementById('name-entry-overlay').classList.add('hidden');
        this.nameInput.value = '';

        this.highScorePending = false;
        this.highScorePage = 0;
        this.state = STATE.MENU;
        this.updateMenuUI();
    }

    updateEnemies(dt) {
        this.enemies.forEach(enemy => enemy.update(dt, this));
    }

    updatePhysics() {
        // Process rocks falling
        // We iterate from bottom to top to handle stacking correctly
        // We use a temporary set for this frame to avoid double updating
        const processed = new Set();

        for (let y = GRID_HEIGHT - 2; y >= 0; y--) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (this.grid[y][x] === TYPES.ROCK || this.grid[y][x] === TYPES.DIAMOND) {
                    const id = `${x},${y}`;
                    if (processed.has(id)) continue;

                    const type = this.grid[y][x];

                    // Check below
                    if (this.grid[y + 1][x] === TYPES.EMPTY) {
                        // Fall down
                        this.grid[y][x] = TYPES.EMPTY;
                        this.grid[y + 1][x] = type;
                        processed.add(`${x},${y + 1}`);
                        this.fallingEntities.add(`${x},${y + 1}`); // Mark as falling

                        // Track falling duration
                        const prevFrames = this.fallingEntityFrames.get(`${x},${y}`) || 0;
                        this.fallingEntityFrames.set(`${x},${y + 1}`, prevFrames + 1);
                    } else if (this.fallingEntities.has(`${x},${y}`) && this.player.x === x && this.player.y === y + 1) {
                        // Crush player if rock has ANY momentum (1+ frames)
                        // This matches original Boulder Dash: you can't outrun a falling rock downwards
                        const fallingFrames = this.fallingEntityFrames.get(`${x},${y}`) || 0;
                        if (fallingFrames >= 1) {
                            this.die();
                        } else {
                            // Increment frame count while sitting on player so grace period eventually expires!
                            this.fallingEntityFrames.set(`${x},${y}`, fallingFrames + 1);
                        }
                    } else if (this.fallingEntities.has(`${x},${y}`) && this.grid[y + 1][x] === TYPES.ENEMY) {
                        // Crush enemy
                        const enemyIndex = this.enemies.findIndex(e => e.x === x && e.y === y + 1);
                        if (enemyIndex !== -1) {
                            const enemy = this.enemies[enemyIndex];
                            const enemyX = x;
                            const enemyY = y + 1;

                            this.enemies.splice(enemyIndex, 1);
                            this.score += 50;
                            this.spawnParticles(enemyX * TILE_SIZE + TILE_SIZE / 2, enemyY * TILE_SIZE + TILE_SIZE / 2, '#ff0000', 20);

                            this.grid[y][x] = TYPES.EMPTY; // Rock is gone
                            this.grid[enemyY][enemyX] = TYPES.EMPTY; // Enemy is gone

                            // Different effects based on enemy type
                            if (enemy.type === ENEMY_TYPES.BASIC) {
                                // BASIC: Spawn 3x3 diamonds
                                for (let dy = -1; dy <= 1; dy++) {
                                    for (let dx = -1; dx <= 1; dx++) {
                                        const nx = enemyX + dx;
                                        const ny = enemyY + dy;

                                        // Skip border walls
                                        if (nx > 0 && nx < GRID_WIDTH - 1 && ny > 0 && ny < GRID_HEIGHT - 1) {
                                            // Only place diamond if cell is empty or was the enemy/rock
                                            if (this.grid[ny][nx] === TYPES.EMPTY || (nx === enemyX && ny === enemyY)) {
                                                this.grid[ny][nx] = TYPES.DIAMOND;
                                                this.spawnParticles(nx * TILE_SIZE + TILE_SIZE / 2, ny * TILE_SIZE + TILE_SIZE / 2, '#00ffff', 5);
                                            }
                                        }
                                    }
                                }
                            } else {
                                // SEEKER or PATROLLER: Explode 3x3 area
                                for (let dy = -1; dy <= 1; dy++) {
                                    for (let dx = -1; dx <= 1; dx++) {
                                        const nx = enemyX + dx;
                                        const ny = enemyY + dy;

                                        // Skip border walls
                                        if (nx > 0 && nx < GRID_WIDTH - 1 && ny > 0 && ny < GRID_HEIGHT - 1) {
                                            const tile = this.grid[ny][nx];

                                            // Destroy most things (like dynamite explosion)
                                            if (tile === TYPES.DIRT || tile === TYPES.ROCK || tile === TYPES.DIAMOND || tile === TYPES.WALL) {
                                                this.grid[ny][nx] = TYPES.EMPTY;
                                                this.spawnParticles(nx * TILE_SIZE + TILE_SIZE / 2, ny * TILE_SIZE + TILE_SIZE / 2, '#ff4400', 10);
                                            }
                                        }
                                    }
                                }
                            }

                            // Trigger Shake
                            this.shakeTimer = 200;
                            this.sound.playExplosion();
                        }
                    } else if (this.grid[y + 1][x] === TYPES.ROCK || this.grid[y + 1][x] === TYPES.DIAMOND || this.grid[y + 1][x] === TYPES.WALL) {
                        // Roll off rounded objects
                        if (this.grid[y][x - 1] === TYPES.EMPTY && this.grid[y + 1][x - 1] === TYPES.EMPTY) {
                            // Roll Left
                            this.grid[y][x] = TYPES.EMPTY;
                            this.grid[y][x - 1] = type;
                            processed.add(`${x - 1},${y}`);
                            this.fallingEntities.add(`${x - 1},${y}`);
                            const prevFrames = this.fallingEntityFrames.get(`${x},${y}`) || 0;
                            this.fallingEntityFrames.set(`${x - 1},${y}`, prevFrames + 1);
                        } else if (this.grid[y][x + 1] === TYPES.EMPTY && this.grid[y + 1][x + 1] === TYPES.EMPTY) {
                            // Roll Right
                            this.grid[y][x] = TYPES.EMPTY;
                            this.grid[y][x + 1] = type;
                            processed.add(`${x + 1},${y}`);
                            this.fallingEntities.add(`${x + 1},${y}`);
                            const prevFrames = this.fallingEntityFrames.get(`${x},${y}`) || 0;
                            this.fallingEntityFrames.set(`${x + 1},${y}`, prevFrames + 1);
                        } else {
                            // Stopped falling
                            this.fallingEntities.delete(`${x},${y}`);
                            this.fallingEntityFrames.delete(`${x},${y}`);
                        }
                    } else {
                        // Landed on dirt or something stable
                        this.fallingEntities.delete(`${x},${y}`);
                        this.fallingEntityFrames.delete(`${x},${y}`);
                    }
                }
            }
        }
    }


    spawnParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color, 2, 30));
        }
    }

    die() {
        if (this.state === STATE.GAMEOVER) return;

        if (this.isTesting) {
            this.showMessage("TEST FAILED", "Returning to Editor...");
            setTimeout(() => {
                this.state = STATE.EDITOR;
                document.getElementById('editor-overlay').classList.remove('hidden');
                document.getElementById('message-overlay').classList.add('hidden');
                this.isTesting = false;
            }, 2000);
            return;
        }

        this.state = STATE.GAMEOVER;
        this.sound.stopGameMusic();

        // Explosion effect
        this.spawnParticles(this.player.x * TILE_SIZE + TILE_SIZE / 2, this.player.y * TILE_SIZE + TILE_SIZE / 2, '#ff00ff', 50);

        // 3x3 Explosion clearing
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const ex = this.player.x + dx;
                const ey = this.player.y + dy;
                if (ex > 0 && ex < GRID_WIDTH - 1 && ey > 0 && ey < GRID_HEIGHT - 1) {
                    this.grid[ey][ex] = TYPES.EMPTY;
                    this.spawnParticles(ex * TILE_SIZE + TILE_SIZE / 2, ey * TILE_SIZE + TILE_SIZE / 2, '#ff4400', 10);
                }
            }
        }

        this.shakeTimer = 500;
        this.sound.playExplosion();
        this.vibrate(500, 1.0, 1.0); // Strong vibration

        if (this.highScores.isHighScore(this.score)) {
            this.highScorePending = true;
            this.showMessage("NEW HIGH SCORE!", "Enter your name...");
            setTimeout(() => {
                this.state = STATE.NAME_ENTRY;
                this.nameInput.value = 'UNK';
                document.getElementById('name-entry-overlay').classList.remove('hidden');
                document.getElementById('submit-score-btn').focus();
            }, 2000);
        } else {
            this.showMessage("GAME OVER", "Press R to Restart Level");
        }
    }

    winGame() {
        if (this.state === STATE.TRANSITION) return;

        if (this.isTesting) {
            this.showMessage("TEST SUCCESS", "Returning to Editor...");
            this.sound.playWin();
            setTimeout(() => {
                this.state = STATE.EDITOR;
                document.getElementById('editor-overlay').classList.remove('hidden');
                document.getElementById('message-overlay').classList.add('hidden');
                this.isTesting = false;
            }, 2000);
            return;
        }

        this.state = STATE.TRANSITION;
        this.sound.stopGameMusic();

        this.score += Math.floor(this.timeLeft) * 10; // Time bonus
        this.updateUI();

        this.currentLevelIndex++;

        if (this.currentLevelIndex < LEVELS.length) {
            this.showMessage("LEVEL COMPLETE", "Get Ready for Next Level...");
            this.sound.playWin();
            setTimeout(() => {
                this.initLevel();
                this.startGame();
            }, 2000);
        } else {
            this.state = STATE.WIN;
            this.sound.playWin();

            if (this.highScores.isHighScore(this.score)) {
                this.highScorePending = true;
                this.showMessage("VICTORY!", "NEW HIGH SCORE!");
                setTimeout(() => {
                    this.state = STATE.NAME_ENTRY;
                    this.nameInput.value = 'UNK';
                    document.getElementById('name-entry-overlay').classList.remove('hidden');
                    document.getElementById('submit-score-btn').focus();
                }, 3000);
            } else {
                this.showMessage("VICTORY!", `Final Score: ${this.score}`);
            }
        }
    }

    showMessage(title, subtitle) {
        const overlay = document.getElementById('message-overlay');
        const titleEl = document.getElementById('message-title');
        const subEl = document.getElementById('message-subtitle');

        titleEl.innerText = title;
        subEl.innerText = subtitle;
        overlay.classList.remove('hidden');
    }

    loop(timestamp) {
        try {
            const dt = timestamp - this.lastTime;
            this.lastTime = timestamp;

            this.update(dt);
            this.draw();

            this.animationFrameId = requestAnimationFrame(this.loop);
        } catch (e) {
            console.error('Game Loop Error:', e);
            // Try to recover or stop loop
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

// Start Game
window.onload = () => {
    window.game = new Game();
};
