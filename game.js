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
    DEMO: 8,
    LOAD_MODAL: 9,
    LEVEL_SELECT: 10,
    PERK_SELECT: 11
};

const GAME_MODES = {
    CAMPAIGN: 'campaign',
    ENDLESS: 'endless',
    HARDCORE: 'hardcore',
    CUSTOM: 'custom',
    ROGUE: 'rogue'
};

// Rogue Miner Perks
const PERKS = [
    { id: 'drillBit', name: 'Drill Bit+', icon: '⛏️', description: 'Digging speed +20%', type: 'passive' },
    { id: 'runner', name: 'Runner', icon: '🏃', description: 'Movement speed +10%', type: 'passive' },
    { id: 'hardHat', name: 'Hard Hat', icon: '⛑️', description: 'Blocks first damage per level', type: 'defense' },
    { id: 'dynamitePouch', name: 'Dynamite Pouch', icon: '💣', description: 'Start every level with +1 TNT', type: 'resource' },
    { id: 'luckyCharm', name: 'Lucky Charm', icon: '🍀', description: 'Diamonds give +50% more score', type: 'economy' },
    { id: 'mineralScanner', name: 'Mineral Scanner', icon: '📡', description: 'Reveals map briefly at level start', type: 'utility' },
    { id: 'sonicBoom', name: 'Sonic Boom', icon: '💥', description: 'Enemy kills destroy adjacent blocks', type: 'combat' },
    { id: 'magnet', name: 'Magnet', icon: '🧲', description: 'Diamonds within 2 tiles fly to you', type: 'passive' },
    { id: 'timeWarp', name: 'Time Warp', icon: '⏰', description: 'Level timer +30 seconds', type: 'utility' }
];

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
    DYNAMITE_ACTIVE: 9,
    STEEL: 10,
    MAGIC_WALL: 11,
    AMOEBA: 12
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
        enemyButterfly: '#ffff00',
        playerDetail: '#ffffff',
        [TYPES.AMOEBA]: '#00ff00'
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
        enemyButterfly: '#00ffff',
        playerDetail: '#000000',
        [TYPES.AMOEBA]: '#00e676'
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
        enemyButterfly: '#ffff00',
        playerDetail: '#000000',
        [TYPES.AMOEBA]: '#76ff03'
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
        enemyButterfly: '#ff80ab',
        playerDetail: '#ffffff',
        [TYPES.AMOEBA]: '#ff3d00'
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
        enemyButterfly: '#ffff00',
        playerDetail: '#000000',
        [TYPES.AMOEBA]: '#00b8d4'
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
        enemyButterfly: '#00e5ff',
        playerDetail: '#000000',
        [TYPES.AMOEBA]: '#00c853'
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
        enemyButterfly: '#ff1744',
        playerDetail: '#ffffff',
        [TYPES.AMOEBA]: '#64dd17'
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
        enemyButterfly: '#ffd740',
        playerDetail: '#000000',
        [TYPES.AMOEBA]: '#ffea00'
    }
];

// Colorblind-friendly themes
const COLORBLIND_THEMES = {
    deuteranopia: { // Red-Green colorblindness
        [TYPES.DIRT]: '#5c4033',
        [TYPES.WALL]: '#1a1a2e',
        [TYPES.ROCK]: '#ffa500',
        [TYPES.DIAMOND]: '#00bfff',
        [TYPES.PLAYER]: '#ffff00',
        [TYPES.ENEMY]: '#ff00ff',
        [TYPES.EXIT]: '#ffffff',
        [TYPES.DYNAMITE_PICKUP]: '#ff6600',
        [TYPES.DYNAMITE_ACTIVE]: '#ff3300',
        background: '#0d0d1a',
        wallGlow: '#6666ff',
        dirtColor: '#5c4033',
        dirtDetail: '#3d2b1f',
        enemySeeker: '#ff66ff',
        enemyPatroller: '#ffaa00',
        enemyButterfly: '#00ffff',
        playerDetail: '#000000',
        [TYPES.AMOEBA]: '#00ffaa'
    },
    tritanopia: { // Blue-Yellow colorblindness
        [TYPES.DIRT]: '#3d2b1f',
        [TYPES.WALL]: '#4a4a4a',
        [TYPES.ROCK]: '#cc5500',
        [TYPES.DIAMOND]: '#ff69b4',
        [TYPES.PLAYER]: '#00ff00',
        [TYPES.ENEMY]: '#ff0000',
        [TYPES.EXIT]: '#ffffff',
        [TYPES.DYNAMITE_PICKUP]: '#ff9900',
        [TYPES.DYNAMITE_ACTIVE]: '#ff3300',
        background: '#1a0d0d',
        wallGlow: '#ff6666',
        dirtColor: '#3d2b1f',
        dirtDetail: '#261a12',
        enemySeeker: '#ff9999',
        enemyPatroller: '#00cc00',
        enemyButterfly: '#ff66ff',
        playerDetail: '#ffffff',
        [TYPES.AMOEBA]: '#66ff66'
    },
    highcontrast: { // Maximum contrast
        [TYPES.DIRT]: '#4a4a4a',
        [TYPES.WALL]: '#ffffff',
        [TYPES.ROCK]: '#8b4513',
        [TYPES.DIAMOND]: '#00ffff',
        [TYPES.PLAYER]: '#ffff00',
        [TYPES.ENEMY]: '#ff3333',
        [TYPES.EXIT]: '#00ff00',
        [TYPES.DYNAMITE_PICKUP]: '#ff6600',
        [TYPES.DYNAMITE_ACTIVE]: '#ff0000',
        background: '#000000',
        wallGlow: '#ffffff',
        dirtColor: '#4a4a4a',
        dirtDetail: '#333333',
        enemySeeker: '#ff6600',
        enemyPatroller: '#cc00cc',
        enemyButterfly: '#00ccff',
        playerDetail: '#000000',
        [TYPES.AMOEBA]: '#33ff33'
    }
};

// Game settings (persisted to localStorage)
const gameSettings = {
    colorblindMode: localStorage.getItem('colorblindMode') || 'off',
    language: localStorage.getItem('gameLanguage') || 'auto',
    tutorialEnabled: localStorage.getItem('tutorialEnabled') !== 'false',
    tutorialCompleted: localStorage.getItem('tutorialCompleted') === 'true'
};

// Achievements System
const ACHIEVEMENTS = [
    { id: 'firstSteps', icon: '👣', category: 'progress' },
    { id: 'minerComplete', icon: '⛏️', category: 'progress' },
    { id: 'endlessRunner', icon: '🏃', category: 'progress' },
    { id: 'deepDigger', icon: '🕳️', category: 'progress' },
    { id: 'gemCollector', icon: '💎', category: 'collect' },
    { id: 'diamondHoarder', icon: '👑', category: 'collect' },
    { id: 'perfectLevel', icon: '✨', category: 'collect' },
    { id: 'crusher', icon: '🪨', category: 'combat' },
    { id: 'demolitionExpert', icon: '💥', category: 'combat' },
    { id: 'speedrunner', icon: '⚡', category: 'challenge' },
    { id: 'survivor', icon: '💀', category: 'challenge' }
];

// Player stats (persisted to localStorage)
const playerStats = {
    totalDiamonds: parseInt(localStorage.getItem('stats_totalDiamonds')) || 0,
    totalEnemiesKilledByRock: parseInt(localStorage.getItem('stats_enemiesKilledByRock')) || 0,
    totalEnemiesKilledByTNT: parseInt(localStorage.getItem('stats_enemiesKilledByTNT')) || 0,
    levelsCompleted: parseInt(localStorage.getItem('stats_levelsCompleted')) || 0,
    campaignCompleted: localStorage.getItem('stats_campaignCompleted') === 'true',
    maxEndlessLevel: parseInt(localStorage.getItem('stats_maxEndlessLevel')) || 0,
    maxRogueDepth: parseInt(localStorage.getItem('stats_maxRogueDepth')) || 0,
    maxHardcoreLevel: parseInt(localStorage.getItem('stats_maxHardcoreLevel')) || 0
};

// Unlocked achievements (persisted to localStorage)
const unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];

// Export achievements to window for i18n.js modal
window.ACHIEVEMENTS = ACHIEVEMENTS;
window.unlockedAchievements = unlockedAchievements;

// Achievement unlock function
function unlockAchievement(id) {
    if (unlockedAchievements.includes(id)) return false;

    unlockedAchievements.push(id);
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));

    // Show popup notification
    showAchievementPopup(id);

    // Play sound
    if (window.game && window.game.sound) {
        window.game.sound.playWin();
    }

    return true;
}

// Show achievement popup
function showAchievementPopup(id) {
    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    if (!achievement) return;

    const popup = document.getElementById('achievement-popup');
    if (!popup) return;

    const iconEl = popup.querySelector('.achievement-popup-icon');
    const nameEl = popup.querySelector('.achievement-popup-name');
    const descEl = popup.querySelector('.achievement-popup-desc');

    iconEl.textContent = achievement.icon;
    nameEl.textContent = typeof t === 'function' ? t(`achievement.${id}.name`) : id;
    descEl.textContent = typeof t === 'function' ? t(`achievement.${id}.desc`) : '';

    popup.classList.remove('hidden');
    popup.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.classList.add('hidden'), 500);
    }, 3000);
}

// Check and unlock achievements based on current stats
function checkAchievements(game) {
    // First Steps - Complete first level
    if (playerStats.levelsCompleted >= 1) {
        unlockAchievement('firstSteps');
    }

    // Miner Complete - Campaign finished
    if (playerStats.campaignCompleted) {
        unlockAchievement('minerComplete');
    }

    // Endless Runner - 10 levels in endless mode
    if (playerStats.maxEndlessLevel >= 10) {
        unlockAchievement('endlessRunner');
    }

    // Deep Digger - Rogue depth 20
    if (playerStats.maxRogueDepth >= 20) {
        unlockAchievement('deepDigger');
    }

    // Gem Collector - 100 total diamonds
    if (playerStats.totalDiamonds >= 100) {
        unlockAchievement('gemCollector');
    }

    // Diamond Hoarder - 1000 total diamonds
    if (playerStats.totalDiamonds >= 1000) {
        unlockAchievement('diamondHoarder');
    }

    // Crusher - Kill enemy with rock
    if (playerStats.totalEnemiesKilledByRock >= 1) {
        unlockAchievement('crusher');
    }

    // Demolition Expert - 10 enemies with TNT
    if (playerStats.totalEnemiesKilledByTNT >= 10) {
        unlockAchievement('demolitionExpert');
    }

    // Survivor - 5+ levels in hardcore
    if (playerStats.maxHardcoreLevel >= 5) {
        unlockAchievement('survivor');
    }
}

// Save stats to localStorage
function savePlayerStats() {
    localStorage.setItem('stats_totalDiamonds', playerStats.totalDiamonds);
    localStorage.setItem('stats_enemiesKilledByRock', playerStats.totalEnemiesKilledByRock);
    localStorage.setItem('stats_enemiesKilledByTNT', playerStats.totalEnemiesKilledByTNT);
    localStorage.setItem('stats_levelsCompleted', playerStats.levelsCompleted);
    localStorage.setItem('stats_campaignCompleted', playerStats.campaignCompleted);
    localStorage.setItem('stats_maxEndlessLevel', playerStats.maxEndlessLevel);
    localStorage.setItem('stats_maxRogueDepth', playerStats.maxRogueDepth);
    localStorage.setItem('stats_maxHardcoreLevel', playerStats.maxHardcoreLevel);
}

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
    PATROLLER: 2,
    BUTTERFLY: 3
};

class Enemy {
    constructor(x, y, type = ENEMY_TYPES.BASIC) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.dirX = 0; // Start moving up (for clockwise wall-following with left-hand rule)
        this.dirY = -1;
        this.moveTimer = 0;
        this.needsDirectionInit = (type === ENEMY_TYPES.BUTTERFLY || type === ENEMY_TYPES.BASIC); // Wall-aware init
        this.searchingForWall = false;
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

    initializeDirectionForButterfly(game) {
        // For BUTTERFLY (counter-clockwise, wall on RIGHT side):
        // Set initial direction so that the nearest wall is on the RIGHT
        const up = this.isBlocked(this.x, this.y - 1, game);
        const down = this.isBlocked(this.x, this.y + 1, game);
        const left = this.isBlocked(this.x - 1, this.y, game);
        const right = this.isBlocked(this.x + 1, this.y, game);

        // Choose direction based on where walls are (wall should be on RIGHT)
        // getRightDirection mapping: RIGHT→DOWN, DOWN→LEFT, LEFT→UP, UP→RIGHT
        if (down) {
            // Wall below → face RIGHT (when facing right, getRightDirection = down)
            this.dirX = 1; this.dirY = 0;
            this.searchingForWall = false;
        } else if (left) {
            // Wall on left → face DOWN (when facing down, getRightDirection = left)
            this.dirX = 0; this.dirY = 1;
            this.searchingForWall = false;
        } else if (up) {
            // Wall above → face LEFT (when facing left, getRightDirection = up)
            this.dirX = -1; this.dirY = 0;
            this.searchingForWall = false;
        } else if (right) {
            // Wall on right → face UP (when facing up, getRightDirection = right)
            this.dirX = 0; this.dirY = -1;
            this.searchingForWall = false;
        } else {
            // No adjacent walls - go straight until we find one (counter-clockwise preference: go left)
            this.dirX = -1; this.dirY = 0;
            this.searchingForWall = true;
        }

        this.needsDirectionInit = false;
    }

    initializeDirectionForBasic(game) {
        // For BASIC (clockwise, wall on LEFT side):
        // Set initial direction so that the nearest wall is on the LEFT
        const up = this.isBlocked(this.x, this.y - 1, game);
        const down = this.isBlocked(this.x, this.y + 1, game);
        const left = this.isBlocked(this.x - 1, this.y, game);
        const right = this.isBlocked(this.x + 1, this.y, game);

        // Choose direction based on where walls are (wall should be on LEFT)
        // getLeftDirection mapping: RIGHT→UP, UP→LEFT, LEFT→DOWN, DOWN→RIGHT
        if (down) {
            // Wall below → face LEFT (when facing left, getLeftDirection = down)
            this.dirX = -1; this.dirY = 0;
            this.searchingForWall = false;
        } else if (right) {
            // Wall on right → face DOWN (when facing down, getLeftDirection = right)
            this.dirX = 0; this.dirY = 1;
            this.searchingForWall = false;
        } else if (up) {
            // Wall above → face RIGHT (when facing right, getLeftDirection = up)
            this.dirX = 1; this.dirY = 0;
            this.searchingForWall = false;
        } else if (left) {
            // Wall on left → face UP (when facing up, getLeftDirection = left)
            this.dirX = 0; this.dirY = -1;
            this.searchingForWall = false;
        } else {
            // No adjacent walls - go straight until we find one (clockwise preference: go right)
            this.dirX = 1; this.dirY = 0;
            this.searchingForWall = true;
        }

        this.needsDirectionInit = false;
    }

    isBlocked(x, y, game) {
        if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return true;
        const tile = game.grid[y][x];
        return tile !== TYPES.EMPTY && tile !== TYPES.PLAYER && tile !== TYPES.AMOEBA;
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
        } else if (this.type === ENEMY_TYPES.BUTTERFLY) {
            if (this.needsDirectionInit) {
                this.initializeDirectionForButterfly(game);
            }
            this.moveButterfly(game);  // BUTTERFLY: right-hand rule = counter-clockwise
        } else {
            if (this.needsDirectionInit) {
                this.initializeDirectionForBasic(game);
            }
            this.moveBasic(game);  // BASIC: left-hand rule = clockwise
        }
    }

    moveBasic(game) {
        // Boulder Dash wall-following behavior (left-hand rule for CLOCKWISE motion):
        // The enemy keeps a wall on its LEFT side and follows it.

        // If in searching mode (no wall found yet), go straight until we find one
        if (this.searchingForWall) {
            const straightX = this.x + this.dirX;
            const straightY = this.y + this.dirY;

            // Check if there's now a wall on our left side
            const leftDir = this.getLeftDirection();
            const leftX = this.x + leftDir.x;
            const leftY = this.y + leftDir.y;
            if (!this.isValidMove(leftX, leftY, game)) {
                // Found a wall on the left! Switch to normal wall-following
                this.searchingForWall = false;
            }

            if (this.isValidMove(straightX, straightY, game)) {
                this.performMove(straightX, straightY, game);
                return;
            } else {
                // Hit something - turn right (clockwise) and continue searching
                const rightDir = this.getRightDirection();
                this.dirX = rightDir.x;
                this.dirY = rightDir.y;
                const newX = this.x + this.dirX;
                const newY = this.y + this.dirY;
                if (this.isValidMove(newX, newY, game)) {
                    this.performMove(newX, newY, game);
                }
                return;
            }
        }

        // Normal wall-following mode:
        // 1. If LEFT is now FREE (wall ended) -> turn left and move (to keep following the wall)
        // 2. If LEFT is blocked, try to go STRAIGHT
        // 3. If STRAIGHT blocked, try RIGHT
        // 4. If RIGHT blocked, REVERSE

        // Get left direction (counter-clockwise from current direction)
        const leftDir = this.getLeftDirection();
        const leftX = this.x + leftDir.x;
        const leftY = this.y + leftDir.y;

        // Check if left side is free (wall ended, we should turn left to follow it)
        if (this.isValidMove(leftX, leftY, game)) {
            this.dirX = leftDir.x;
            this.dirY = leftDir.y;
            this.performMove(leftX, leftY, game);
            return;
        }

        // Left is blocked (wall is there), try straight
        const straightX = this.x + this.dirX;
        const straightY = this.y + this.dirY;
        if (this.isValidMove(straightX, straightY, game)) {
            this.performMove(straightX, straightY, game);
            return;
        }

        // Straight blocked, try right (clockwise)
        const rightDir = this.getRightDirection();
        const rightX = this.x + rightDir.x;
        const rightY = this.y + rightDir.y;
        if (this.isValidMove(rightX, rightY, game)) {
            this.dirX = rightDir.x;
            this.dirY = rightDir.y;
            this.performMove(rightX, rightY, game);
            return;
        }

        // All directions blocked, reverse (180 degrees)
        this.dirX = -this.dirX;
        this.dirY = -this.dirY;
        const reverseX = this.x + this.dirX;
        const reverseY = this.y + this.dirY;
        if (this.isValidMove(reverseX, reverseY, game)) {
            this.performMove(reverseX, reverseY, game);
        }
        // If all directions blocked, stay in place
    }

    getLeftDirection() {
        // Counter-clockwise rotation: Right→Up, Up→Left, Left→Down, Down→Right
        if (this.dirX === 1 && this.dirY === 0) return { x: 0, y: -1 };  // Right → Up
        if (this.dirX === 0 && this.dirY === -1) return { x: -1, y: 0 }; // Up → Left
        if (this.dirX === -1 && this.dirY === 0) return { x: 0, y: 1 };  // Left → Down
        if (this.dirX === 0 && this.dirY === 1) return { x: 1, y: 0 };   // Down → Right
        return { x: 0, y: -1 }; // Default
    }

    getRightDirection() {
        // Clockwise rotation: Right→Down, Down→Left, Left→Up, Up→Right
        if (this.dirX === 1 && this.dirY === 0) return { x: 0, y: 1 };   // Right → Down
        if (this.dirX === 0 && this.dirY === 1) return { x: -1, y: 0 };  // Down → Left
        if (this.dirX === -1 && this.dirY === 0) return { x: 0, y: -1 }; // Left → Up
        if (this.dirX === 0 && this.dirY === -1) return { x: 1, y: 0 };  // Up → Right
        return { x: 0, y: 1 }; // Default
    }

    moveButterfly(game) {
        // Boulder Dash wall-following behavior (right-hand rule for COUNTER-CLOCKWISE motion):
        // The enemy keeps a wall on its RIGHT side and follows it.

        // If in searching mode (no wall found yet), go straight until we find one
        if (this.searchingForWall) {
            const straightX = this.x + this.dirX;
            const straightY = this.y + this.dirY;

            // Check if there's now a wall on our right side
            const rightDir = this.getRightDirection();
            const rightX = this.x + rightDir.x;
            const rightY = this.y + rightDir.y;
            if (!this.isValidMove(rightX, rightY, game)) {
                // Found a wall on the right! Switch to normal wall-following
                this.searchingForWall = false;
            }

            if (this.isValidMove(straightX, straightY, game)) {
                this.performMove(straightX, straightY, game);
                return;
            } else {
                // Hit something - turn left (counter-clockwise) and continue searching
                const leftDir = this.getLeftDirection();
                this.dirX = leftDir.x;
                this.dirY = leftDir.y;
                const newX = this.x + this.dirX;
                const newY = this.y + this.dirY;
                if (this.isValidMove(newX, newY, game)) {
                    this.performMove(newX, newY, game);
                }
                return;
            }
        }

        // Normal wall-following mode:
        // 1. If RIGHT is now FREE (wall ended) -> turn right and move (to keep following the wall)
        // 2. If RIGHT is blocked, try to go STRAIGHT
        // 3. If STRAIGHT blocked, try LEFT
        // 4. If LEFT blocked, REVERSE

        // Get right direction (clockwise from current direction)
        const rightDir = this.getRightDirection();
        const rightX = this.x + rightDir.x;
        const rightY = this.y + rightDir.y;

        // Check if right side is free (wall ended, we should turn right to follow it)
        if (this.isValidMove(rightX, rightY, game)) {
            this.dirX = rightDir.x;
            this.dirY = rightDir.y;
            this.performMove(rightX, rightY, game);
            return;
        }

        // Right is blocked (wall is there), try straight
        const straightX = this.x + this.dirX;
        const straightY = this.y + this.dirY;
        if (this.isValidMove(straightX, straightY, game)) {
            this.performMove(straightX, straightY, game);
            return;
        }

        // Straight blocked, try left (counter-clockwise)
        const leftDir = this.getLeftDirection();
        const leftX = this.x + leftDir.x;
        const leftY = this.y + leftDir.y;
        if (this.isValidMove(leftX, leftY, game)) {
            this.dirX = leftDir.x;
            this.dirY = leftDir.y;
            this.performMove(leftX, leftY, game);
            return;
        }

        // All directions blocked, reverse (180 degrees)
        this.dirX = -this.dirX;
        this.dirY = -this.dirY;
        const reverseX = this.x + this.dirX;
        const reverseY = this.y + this.dirY;
        if (this.isValidMove(reverseX, reverseY, game)) {
            this.performMove(reverseX, reverseY, game);
        }
        // If all directions blocked, stay in place
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
        return tile === TYPES.EMPTY || tile === TYPES.PLAYER || tile === TYPES.AMOEBA;
    }

    performMove(nextX, nextY, game) {
        const nextTile = game.grid[nextY][nextX];

        if (nextTile === TYPES.PLAYER || (game.player.x === nextX && game.player.y === nextY)) {
            game.die();
            return;
        }

        // If moving onto Amoeba, enemy dies
        if (nextTile === TYPES.AMOEBA) {
            game.killEnemyAt(this.x, this.y);
            return;
        }

        game.grid[this.y][this.x] = TYPES.EMPTY;
        this.x = nextX;
        this.y = nextY;
        game.grid[this.y][this.x] = TYPES.ENEMY;
    }

    changeDirectionClockwise() {
        // Clockwise: Right → Down → Left → Up → Right
        if (this.dirX === 1 && this.dirY === 0) { this.dirX = 0; this.dirY = 1; }       // Right → Down
        else if (this.dirX === 0 && this.dirY === 1) { this.dirX = -1; this.dirY = 0; } // Down → Left
        else if (this.dirX === -1 && this.dirY === 0) { this.dirX = 0; this.dirY = -1; } // Left → Up
        else if (this.dirX === 0 && this.dirY === -1) { this.dirX = 1; this.dirY = 0; } // Up → Right
    }
}

class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
        this.musicInterval = null;
        this.menuMusicInterval = null;

        // Volume levels (0-1)
        this.masterVolume = parseFloat(localStorage.getItem('volumeMaster') || '0.8');
        this.musicVolume = parseFloat(localStorage.getItem('volumeMusic') || '0.6');
        this.sfxVolume = parseFloat(localStorage.getItem('volumeSfx') || '1.0');
    }

    setMasterVolume(value) {
        this.masterVolume = Math.max(0, Math.min(1, value));
        localStorage.setItem('volumeMaster', this.masterVolume.toString());
    }

    setMusicVolume(value) {
        this.musicVolume = Math.max(0, Math.min(1, value));
        localStorage.setItem('volumeMusic', this.musicVolume.toString());
    }

    setSfxVolume(value) {
        this.sfxVolume = Math.max(0, Math.min(1, value));
        localStorage.setItem('volumeSfx', this.sfxVolume.toString());
    }

    getEffectiveVolume(isMusic = false) {
        const base = isMusic ? this.musicVolume : this.sfxVolume;
        return base * this.masterVolume;
    }

    async playTone(freq, type, duration, vol = 1.0, isMusic = false) {
        if (!this.enabled || !this.ctx) return;
        if (this.ctx.state === 'suspended') await this.ctx.resume();

        const effectiveVol = vol * this.getEffectiveVolume(isMusic);
        if (effectiveVol < 0.01) return; // Skip if too quiet

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(effectiveVol * 0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    async playNoise(duration, vol = 1.0) {
        if (!this.enabled || !this.ctx) return;
        if (this.ctx.state === 'suspended') await this.ctx.resume();

        const effectiveVol = vol * this.getEffectiveVolume(false);
        if (effectiveVol < 0.01) return; // Skip if too quiet

        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(effectiveVol * 0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        noise.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    }

    playDig() { this.playNoise(0.05, 0.5); }
    playStep() { this.playNoise(0.02, 0.2); }
    playExplosion() { this.playNoise(0.5, 1.0); }
    playCollect() { this.playTone(1200, 'sine', 0.1, 0.5); }
    playAmoeba() { this.playTone(150 + Math.random() * 50, 'triangle', 0.1, 0.2); }

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

    startGameMusic(themeIndex = 0) {
        console.log('startGameMusic called', 'Enabled:', this.enabled, 'Interval:', this.musicInterval, 'Theme:', themeIndex);
        if (!this.enabled || this.musicInterval) return;
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();

        // Theme-specific music configurations
        const themeMusic = [
            // Theme 0: Neon Blue (Cyberpunk) - Dark, atmospheric, electronic
            {
                bassLine: [82.41, 82.41, 110, 82.41, 98, 82.41, 73.42, 82.41], // E2 based, dark minor
                tempo: 220,
                waveform: 'sawtooth',
                arpEnabled: true,
                arpNotes: [329.63, 392, 493.88, 392], // E4, G4, B4
                arpWave: 'square',
                volume: 0.12
            },
            // Theme 1: Neon Pink (Synthwave) - Upbeat 80s, bright and energetic
            {
                bassLine: [110, 130.81, 146.83, 130.81, 110, 98, 110, 130.81], // A2 major progression
                tempo: 180,
                waveform: 'sawtooth',
                arpEnabled: true,
                arpNotes: [440, 554.37, 659.25, 554.37], // A4, C#5, E5
                arpWave: 'square',
                volume: 0.15
            },
            // Theme 2: Neon Green (Matrix) - Mysterious, digital, glitchy
            {
                bassLine: [73.42, 73.42, 87.31, 73.42, 65.41, 73.42, 98, 87.31], // D2 minor, mysterious
                tempo: 200,
                waveform: 'triangle',
                arpEnabled: true,
                arpNotes: [293.66, 349.23, 440, 349.23], // D4, F4, A4
                arpWave: 'square',
                volume: 0.1
            },
            // Theme 3: Neon Orange (Inferno) - Aggressive, fast, intense
            {
                bassLine: [98, 98, 130.81, 98, 110, 130.81, 146.83, 98], // G2 power, aggressive
                tempo: 150,
                waveform: 'sawtooth',
                arpEnabled: true,
                arpNotes: [392, 493.88, 587.33, 493.88], // G4, B4, D5
                arpWave: 'sawtooth',
                volume: 0.18
            },
            // Theme 4: Ice/Frozen - Slow, ethereal, cold and crystalline
            {
                bassLine: [130.81, 146.83, 164.81, 146.83, 130.81, 123.47, 130.81, 146.83], // C3 major, airy
                tempo: 320,
                waveform: 'sine',
                arpEnabled: true,
                arpNotes: [523.25, 659.25, 783.99, 659.25], // C5, E5, G5 - high and sparkly
                arpWave: 'sine',
                volume: 0.08
            },
            // Theme 5: Gold/Luxury - Majestic, rich, royal fanfare
            {
                bassLine: [87.31, 110, 130.81, 110, 87.31, 98, 110, 130.81], // F2 major, regal
                tempo: 240,
                waveform: 'sawtooth',
                arpEnabled: true,
                arpNotes: [349.23, 440, 523.25, 440], // F4, A4, C5
                arpWave: 'triangle',
                volume: 0.12
            },
            // Theme 6: Toxic/Acid - Chaotic, distorted, harsh
            {
                bassLine: [55, 61.74, 55, 73.42, 55, 65.41, 55, 82.41], // A1 chromatic, unstable
                tempo: 170,
                waveform: 'sawtooth',
                arpEnabled: true,
                arpNotes: [220, 277.18, 329.63, 277.18], // A3, C#4, E4 - dissonant
                arpWave: 'square',
                volume: 0.14
            },
            // Theme 7: Vaporwave - Dreamy, slowed down, nostalgic
            {
                bassLine: [146.83, 130.81, 110, 130.81, 146.83, 164.81, 146.83, 130.81], // D3 major 7, dreamy
                tempo: 350,
                waveform: 'triangle',
                arpEnabled: true,
                arpNotes: [587.33, 698.46, 880, 698.46], // D5, F5, A5 - ethereal
                arpWave: 'sine',
                volume: 0.1
            }
        ];

        const music = themeMusic[themeIndex % themeMusic.length];
        let noteIndex = 0;
        let arpIndex = 0;

        this.musicInterval = setInterval(() => {
            // Bass line
            const freq = music.bassLine[noteIndex];
            this.playTone(freq, music.waveform, 0.1, music.volume, true);

            // Arpeggio (every other note for most themes)
            if (music.arpEnabled && noteIndex % 2 === 0) {
                const arpFreq = music.arpNotes[arpIndex % music.arpNotes.length];
                this.playTone(arpFreq, music.arpWave, 0.05, music.volume * 0.4, true);
                arpIndex++;
            }

            noteIndex = (noteIndex + 1) % music.bassLine.length;
        }, music.tempo);
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
                this.playTone(root, 'sawtooth', 0.2, 0.15, true);
            } else {
                this.playTone(root, 'sawtooth', 0.1, 0.1, true); // Off-beat lighter
            }

            // Arpeggio (Square) - Cyberpunk feel
            const arpNotes = [root * 2, root * 3, root * 4, root * 3];
            const arpNote = arpNotes[step % 4];
            this.playTone(arpNote, 'square', 0.05, 0.05, true);

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

        // Magic Wall Properties
        this.magicWallActive = false;
        this.magicWallTimer = 0;
        this.magicWallDuration = 15000;

        this.amoebaTimer = 0;
        this.amoebaGrowthRate = 20; // Slower growth (was 10)
        this.amoebaMaxSize = 500; // Larger max size (was 200)

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
        this.currentThemeIndex = 0;
        this.highScorePending = false;

        // Menu Navigation
        this.menuSelectedIndex = 0;
        this.menuButtons = ['btn-campaign', 'btn-endless', 'btn-hardcore', 'btn-rogue', 'btn-load-level', 'btn-editor', 'btn-help'];
        this.menuNavLocked = false;

        // Pause Menu Navigation
        this.pauseSelectedIndex = 0;
        this.pauseButtons = ['btn-resume', 'btn-restart', 'btn-sound', 'btn-fullscreen', 'btn-menu'];

        // Load Modal Navigation
        this.loadModalSelectedIndex = 0;
        this.loadModalButtons = ['btn-load-confirm', 'btn-load-cancel'];

        // Rogue Miner Mode Properties
        this.rogueDepth = 0;
        this.roguePerks = [];
        this.hasShield = false;
        this.perkChoices = [];
        this.perkSelectedIndex = 0;
        this.deathTimeout = null; // Timeout ID for death->menu transition

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
        for (let i = 0; i < 60; i++) {
            this.menuParticles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                speed: Math.random() * 3 + 2,
                type: Math.random() < 0.6 ? TYPES.DIAMOND : TYPES.ROCK,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.15,
                scale: Math.random() * 0.7 + 0.8
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

        // Environmental Effects System
        this.envEffects = {
            darkZone: false,
            freeze: false,
            earthquake: false
        };
        this.lightRadius = 4; // Visible radius in tiles
        this.snowflakes = []; // For freeze effect
        this.earthquakeTimer = 0;
        this.earthquakeInterval = 6000; // ms between quakes

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
                    this.restartCurrentLevel();
                }
            }
        });

        document.getElementById('btn-sound').addEventListener('click', () => {
            this.sound.playMenuBlip();
            this.sound.enabled = !this.sound.enabled;
            localStorage.setItem('soundEnabled', this.sound.enabled.toString());
            document.getElementById('btn-sound').innerText = this.sound.enabled ? t('pause.soundOn') : t('pause.soundOff');
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

        // Back to Editor button (only visible in test mode)
        document.getElementById('btn-back-editor').addEventListener('click', () => {
            this.sound.playMenuConfirm();
            if (this.state === STATE.PAUSED && this.isTesting) {
                this.state = STATE.EDITOR;
                document.getElementById('pause-overlay').classList.add('hidden');
                document.getElementById('editor-overlay').classList.remove('hidden');
                this.isTesting = false;
                this.sound.stopGameMusic();
            }
        });

        // Add hover sounds to all pause menu buttons
        ['btn-resume', 'btn-back-editor', 'btn-restart', 'btn-sound', 'btn-fullscreen', 'btn-menu'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('mouseenter', () => this.sound.playMenuHover());
            }
        });

        // New Main Menu Buttons
        const bindBtn = (id, mode) => {
            const btn = document.getElementById(id);
            if (btn) {
                console.log(`Binding click event to ${id}`);
                btn.addEventListener('click', (e) => {
                    console.log(`Button clicked: ${id}`);
                    e.stopPropagation(); // Prevent bubbling issues
                    this.startGame(mode);
                });
                btn.addEventListener('mouseenter', () => this.sound.playMenuHover());
            } else {
                console.error(`Button element not found: ${id}`);
            }
        };

        bindBtn('btn-campaign', GAME_MODES.CAMPAIGN);
        bindBtn('btn-endless', GAME_MODES.ENDLESS);
        bindBtn('btn-hardcore', GAME_MODES.HARDCORE);
        bindBtn('btn-rogue', GAME_MODES.ROGUE);

        const loadBtn = document.getElementById('btn-load-level');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.sound.playMenuConfirm();
                this.state = STATE.LOAD_MODAL;
                this.loadModalSelectedIndex = 0;
                document.getElementById('load-level-modal').classList.remove('hidden');
                this.updateLoadModalSelection();
                document.getElementById('level-url-input').focus();
            });
            loadBtn.addEventListener('mouseenter', () => this.sound.playMenuHover());
        }

        const editorBtn = document.getElementById('btn-editor');
        if (editorBtn) {
            editorBtn.addEventListener('click', () => {
                this.sound.playMenuConfirm();
                this.levelEditor.reset();
                this.sound.stopMenuMusic();
                this.state = STATE.EDITOR;
                document.getElementById('menu-screen').classList.add('hidden');
                document.getElementById('editor-overlay').classList.remove('hidden');
                this.updateMenuUI();
            });
            editorBtn.addEventListener('mouseenter', () => this.sound.playMenuHover());
        }

        // Help Button
        const helpBtn = document.getElementById('btn-help');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.sound.playMenuConfirm();
                document.getElementById('help-modal').classList.remove('hidden');
            });
            helpBtn.addEventListener('mouseenter', () => this.sound.playMenuHover());
        }

        // Help Modal Close Button
        const helpCloseBtn = document.getElementById('btn-help-close');
        if (helpCloseBtn) {
            helpCloseBtn.addEventListener('click', () => {
                this.sound.playMenuBlip();
                document.getElementById('help-modal').classList.add('hidden');
            });
            helpCloseBtn.addEventListener('mouseenter', () => this.sound.playMenuHover());
        }

        // Editor Export Buttons
        document.getElementById('btn-copy-level').addEventListener('click', () => {
            this.levelEditor.copyToClipboard();
        });
        document.getElementById('btn-download-level').addEventListener('click', () => {
            this.levelEditor.downloadJSON();
        });

        // Load Level Modal Buttons
        const fileInput = document.getElementById('level-file-input');
        const fileNameDisplay = document.getElementById('file-name-display');

        // File input change handler
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                fileNameDisplay.textContent = file.name;
                // Clear URL input when file is selected
                document.getElementById('level-url-input').value = '';
            }
        });

        document.getElementById('btn-load-confirm').addEventListener('click', () => {
            const file = fileInput.files[0];
            const url = document.getElementById('level-url-input').value.trim();

            if (file) {
                // Load from local file
                this.loadLevelFromFile(file);
            } else if (url) {
                // Load from URL
                this.loadLevelFromUrl(url);
            } else {
                alert('Please enter a URL or choose a file');
            }
        });

        document.getElementById('btn-load-cancel').addEventListener('click', () => {
            this.sound.playMenuBlip();
            this.state = STATE.MENU;
            document.getElementById('load-level-modal').classList.add('hidden');
            // Reset file input
            fileInput.value = '';
            fileNameDisplay.textContent = '';
        });

        this.updateMenuUI();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    initLevel(isRestart = false) {
        let levelDef;
        if (this.gameMode === GAME_MODES.CUSTOM && this.customLevelData) {
            levelDef = this.customLevelData;
        } else if (this.gameMode === GAME_MODES.ENDLESS || this.gameMode === GAME_MODES.HARDCORE) {
            // Generate procedural level with increasing difficulty
            const difficulty = this.currentLevelIndex;
            levelDef = {
                type: 'procedural',
                diamondsNeeded: Math.min(10 + difficulty, 30),
                time: Math.max(150 - difficulty * 5, 60),
                rockChance: Math.min(0.15 + difficulty * 0.01, 0.35),
                wallChance: Math.min(0.05 + difficulty * 0.005, 0.15),
                enemyChance: Math.min(0.02 + difficulty * 0.005, 0.1)
            };
        } else if (this.gameMode === GAME_MODES.ROGUE) {
            // Rogue Miner - procedural with scaling based on depth (same as Endless)
            const difficulty = this.rogueDepth - 1;
            levelDef = {
                type: 'procedural',
                diamondsNeeded: Math.min(10 + difficulty, 30),
                time: Math.max(150 - difficulty * 5, 60),
                rockChance: Math.min(0.15 + difficulty * 0.01, 0.35),
                wallChance: Math.min(0.05 + difficulty * 0.005, 0.15),
                enemyChance: Math.min(0.02 + difficulty * 0.005, 0.1)
            };
        } else {
            levelDef = LEVELS[this.currentLevelIndex] || LEVELS[LEVELS.length - 1];
        }

        this.diamondsNeeded = levelDef.diamondsNeeded;
        this.timeLeft = levelDef.time;
        this.initialTime = levelDef.time; // Track initial time for speedrunner achievement
        this.diamondsCollected = 0;
        this.dynamiteCount = 0;
        this.bombs = [];
        this.particles = [];
        this.enemies = [];
        this.fallingEntities.clear();
        this.fallingEntityFrames.clear(); // Clear falling duration tracking
        this.shakeTimer = 0;
        this.flashTimer = 0;
        this.spawnBlinkTimer = 0; // Will be set for procedural modes

        // Apply Rogue Miner perks
        if (this.gameMode === GAME_MODES.ROGUE && this.roguePerks.length > 0) {
            if (this.roguePerks.includes('timeWarp')) {
                this.timeLeft += 30;
            }
            if (this.roguePerks.includes('dynamitePouch')) {
                this.dynamiteCount += 1;
            }
            if (this.roguePerks.includes('hardHat')) {
                this.hasShield = true;
            }
            if (this.roguePerks.includes('mineralScanner')) {
                this.revealMapTimer = 2000; // Reveal map for 2 seconds
            }
        }

        // Environmental Effects - random for Endless/Hardcore/Rogue, or from custom level data (preserve on restart)
        if (!isRestart) {
            if (this.gameMode === GAME_MODES.CUSTOM && this.customLevelData && this.customLevelData.envEffects) {
                // Use custom level defined environmental effects
                const customEnv = this.customLevelData.envEffects;
                this.envEffects.darkZone = customEnv.darkZone === true;
                this.envEffects.freeze = customEnv.freeze === true;
                this.envEffects.earthquake = customEnv.earthquake === true;
            } else if (this.gameMode === GAME_MODES.ENDLESS ||
                this.gameMode === GAME_MODES.HARDCORE ||
                this.gameMode === GAME_MODES.ROGUE) {
                this.envEffects.darkZone = Math.random() < 0.3;   // 30% chance
                this.envEffects.freeze = Math.random() < 0.2;     // 20% chance
                this.envEffects.earthquake = Math.random() < 0.25; // 25% chance
            } else {
                this.envEffects.darkZone = false;
                this.envEffects.freeze = false;
                this.envEffects.earthquake = false;
            }
        }

        // Reset earthquake timer
        this.earthquakeTimer = 0;

        // Initialize snowflakes for freeze effect
        if (this.envEffects.freeze) {
            this.initSnowflakes();
        } else {
            this.snowflakes = [];
        }

        // Select Theme (use custom theme if specified, otherwise rotate based on level index)
        // Check colorblind mode first - if enabled, always use the colorblind theme
        if (gameSettings.colorblindMode !== 'off' && COLORBLIND_THEMES[gameSettings.colorblindMode]) {
            this.currentTheme = COLORBLIND_THEMES[gameSettings.colorblindMode];
            this.currentThemeIndex = 0; // Colorblind themes don't cycle
        } else {
            let themeIndex;
            if (this.gameMode === GAME_MODES.CUSTOM && this.customLevelData) {
                // Check if custom level specifies a theme
                if (typeof this.customLevelData.theme === 'number' &&
                    this.customLevelData.theme >= 0 &&
                    this.customLevelData.theme < THEMES.length) {
                    themeIndex = this.customLevelData.theme;
                } else {
                    themeIndex = this.customLevelIndex % THEMES.length;
                }
            } else if (this.gameMode === GAME_MODES.ROGUE) {
                themeIndex = (this.rogueDepth - 1) % THEMES.length;
            } else {
                themeIndex = this.currentLevelIndex % THEMES.length;
            }
            this.currentTheme = THEMES[themeIndex];
            this.currentThemeIndex = themeIndex;
        }
        COLORS = this.currentTheme;

        // Select Music Theme (can be different from visual theme)
        // Check if custom level specifies a separate music theme
        if (this.gameMode === GAME_MODES.CUSTOM && this.customLevelData &&
            typeof this.customLevelData.musicTheme === 'number' &&
            this.customLevelData.musicTheme >= 0 &&
            this.customLevelData.musicTheme < 8) { // 8 music themes available
            this.currentMusicThemeIndex = this.customLevelData.musicTheme;
        } else {
            // Use visual theme for music by default
            this.currentMusicThemeIndex = this.currentThemeIndex;
        }

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

        // Load fixed or custom map (if map array of strings exists)
        if (levelDef.map && Array.isArray(levelDef.map) && typeof levelDef.map[0] === 'string') {
            // Load map from string array
            for (let y = 0; y < GRID_HEIGHT && y < levelDef.map.length; y++) {
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
                        this.grid[y][x] = TYPES.ENEMY;
                        this.enemies.push(new Enemy(x, y, ENEMY_TYPES.BASIC));
                    }
                    else if (char === 'P') {
                        this.grid[y][x] = TYPES.ENEMY;
                        this.enemies.push(new Enemy(x, y, ENEMY_TYPES.PATROLLER));
                    }
                    else if (char === 'K') {
                        this.grid[y][x] = TYPES.ENEMY;
                        this.enemies.push(new Enemy(x, y, ENEMY_TYPES.SEEKER));
                    }
                    else if (char === 'B') {
                        this.grid[y][x] = TYPES.ENEMY;
                        this.enemies.push(new Enemy(x, y, ENEMY_TYPES.BUTTERFLY));
                    }
                    else if (char === 'T') this.grid[y][x] = TYPES.DYNAMITE_PICKUP;
                    else if (char === 'W') this.grid[y][x] = TYPES.STEEL;
                    else if (char === 'M') this.grid[y][x] = TYPES.MAGIC_WALL;
                    else if (char === 'A') this.grid[y][x] = TYPES.AMOEBA;
                }
            }
        } else if (levelDef.grid && Array.isArray(levelDef.grid)) {
            // Load from numeric grid format (level editor format)
            for (let y = 0; y < levelDef.grid.length && y < GRID_HEIGHT; y++) {
                for (let x = 0; x < levelDef.grid[y].length && x < GRID_WIDTH; x++) {
                    const tile = levelDef.grid[y][x];
                    this.grid[y][x] = tile;
                    if (tile === TYPES.PLAYER) {
                        this.player.x = x;
                        this.player.y = y;
                        this.grid[y][x] = TYPES.EMPTY;
                    } else if (tile === TYPES.ENEMY) {
                        this.enemies.push(new Enemy(x, y, ENEMY_TYPES.BASIC));
                        // Keep grid as TYPES.ENEMY for collision detection
                    }
                }
            }
        }

        if (levelDef.type === 'procedural' || levelDef.type === 'generated') {
            // Add some dynamite randomly for procedural levels
            for (let i = 0; i < 3; i++) {
                let dx, dy;
                do {
                    dx = Math.floor(Math.random() * (GRID_WIDTH - 2)) + 1;
                    dy = Math.floor(Math.random() * (GRID_HEIGHT - 2)) + 1;
                } while (this.grid[dy][dx] !== TYPES.DIRT);
                this.grid[dy][dx] = TYPES.DYNAMITE_PICKUP;
            }

            // Procedural Generation with random start and exit positions
            // Generate random start position (avoid edges)
            const startX = Math.floor(Math.random() * (GRID_WIDTH - 4)) + 2;
            const startY = Math.floor(Math.random() * (GRID_HEIGHT - 4)) + 2;
            this.player.x = startX;
            this.player.y = startY;
            this.grid[startY][startX] = TYPES.EMPTY;

            // Generate random exit position (minimum distance from start)
            let exitX, exitY;
            const minDistance = Math.max(GRID_WIDTH, GRID_HEIGHT) / 3;
            let attempts = 0;
            do {
                exitX = Math.floor(Math.random() * (GRID_WIDTH - 4)) + 2;
                exitY = Math.floor(Math.random() * (GRID_HEIGHT - 4)) + 2;
                attempts++;
            } while (
                (Math.abs(exitX - startX) + Math.abs(exitY - startY) < minDistance ||
                    (exitX === startX && exitY === startY)) &&
                attempts < 100
            );

            // Place exit and clear area around it
            this.grid[exitY][exitX] = TYPES.EXIT;
            // Clear adjacent cells around exit
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const ny = exitY + dy;
                    const nx = exitX + dx;
                    if (ny > 0 && ny < GRID_HEIGHT - 1 && nx > 0 && nx < GRID_WIDTH - 1) {
                        if (this.grid[ny][nx] !== TYPES.EXIT) {
                            this.grid[ny][nx] = TYPES.DIRT;
                        }
                    }
                }
            }

            // Generate level content
            for (let y = 1; y < GRID_HEIGHT - 1; y++) {
                for (let x = 1; x < GRID_WIDTH - 1; x++) {
                    if (x === this.player.x && y === this.player.y) continue;
                    if (this.grid[y][x] === TYPES.EXIT) continue;
                    // Skip tiles near exit (already cleared)
                    if (Math.abs(x - exitX) <= 1 && Math.abs(y - exitY) <= 1) continue;

                    const rand = Math.random();
                    if (rand < levelDef.rockChance) this.grid[y][x] = TYPES.ROCK;
                    else if (rand < levelDef.rockChance + 0.05) this.grid[y][x] = TYPES.DIAMOND;
                    else if (rand < levelDef.rockChance + 0.05 + levelDef.wallChance) this.grid[y][x] = TYPES.WALL;
                    else if (rand < levelDef.rockChance + 0.05 + levelDef.wallChance + levelDef.enemyChance) {
                        this.grid[y][x] = TYPES.ENEMY;
                        const eRand = Math.random();
                        const eType = eRand < 0.25 ? ENEMY_TYPES.SEEKER : (eRand < 0.5 ? ENEMY_TYPES.PATROLLER : (eRand < 0.75 ? ENEMY_TYPES.BASIC : ENEMY_TYPES.BUTTERFLY));
                        this.enemies.push(new Enemy(x, y, eType));
                    } else if (rand < levelDef.rockChance + 0.05 + levelDef.wallChance + levelDef.enemyChance + 0.01) {
                        this.grid[y][x] = TYPES.DYNAMITE_PICKUP;
                    }
                }
            }

            // BFS pathfinding to ensure exit is reachable
            // If not reachable, carve a path through dirt/rock
            const isPassable = (type) => {
                return type === TYPES.EMPTY || type === TYPES.DIRT || type === TYPES.DIAMOND ||
                    type === TYPES.DYNAMITE_PICKUP || type === TYPES.ROCK || type === TYPES.EXIT ||
                    type === TYPES.PLAYER;
            };

            // Check if path exists using BFS
            const findPath = () => {
                const visited = new Set();
                const queue = [[startX, startY]];
                visited.add(`${startX},${startY}`);

                while (queue.length > 0) {
                    const [cx, cy] = queue.shift();
                    if (cx === exitX && cy === exitY) return true;

                    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
                    for (const [dx, dy] of dirs) {
                        const nx = cx + dx;
                        const ny = cy + dy;
                        const key = `${nx},${ny}`;
                        if (!visited.has(key) && nx > 0 && nx < GRID_WIDTH - 1 && ny > 0 && ny < GRID_HEIGHT - 1) {
                            const tile = this.grid[ny][nx];
                            // Player can pass through: empty, dirt, diamond, rock (pushable), dynamite, exit
                            // Cannot pass through: wall, steel, enemy
                            if (tile !== TYPES.WALL && tile !== TYPES.STEEL && tile !== TYPES.ENEMY) {
                                visited.add(key);
                                queue.push([nx, ny]);
                            }
                        }
                    }
                }
                return false;
            };

            // If no path exists, carve a path
            if (!findPath()) {
                // Carve a simple L-shaped or direct path
                let cx = startX, cy = startY;

                // Move horizontally first
                while (cx !== exitX) {
                    cx += (exitX > cx) ? 1 : -1;
                    if (this.grid[cy][cx] === TYPES.WALL || this.grid[cy][cx] === TYPES.STEEL) {
                        this.grid[cy][cx] = TYPES.DIRT;
                    }
                    // Remove any enemies on the path
                    if (this.grid[cy][cx] === TYPES.ENEMY) {
                        this.enemies = this.enemies.filter(e => !(e.x === cx && e.y === cy));
                        this.grid[cy][cx] = TYPES.DIRT;
                    }
                }
                // Move vertically
                while (cy !== exitY) {
                    cy += (exitY > cy) ? 1 : -1;
                    if (this.grid[cy][cx] === TYPES.WALL || this.grid[cy][cx] === TYPES.STEEL) {
                        this.grid[cy][cx] = TYPES.DIRT;
                    }
                    // Remove any enemies on the path
                    if (this.grid[cy][cx] === TYPES.ENEMY) {
                        this.enemies = this.enemies.filter(e => !(e.x === cx && e.y === cy));
                        this.grid[cy][cx] = TYPES.DIRT;
                    }
                }
            }
        }

        // Clear safe zone around player (only for procedural modes)
        this.grid[this.player.y][this.player.x] = TYPES.PLAYER;
        if (this.gameMode === GAME_MODES.ENDLESS || this.gameMode === GAME_MODES.HARDCORE || this.gameMode === GAME_MODES.ROGUE) {
            // Only clear space around player in procedural modes
            if (this.player.y + 1 < GRID_HEIGHT) {
                this.grid[this.player.y + 1][this.player.x] = TYPES.EMPTY;
            }
            if (this.player.x + 1 < GRID_WIDTH) {
                this.grid[this.player.y][this.player.x + 1] = TYPES.EMPTY;
            }

            // Clear space around enemies (only for procedural modes)
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

        // Set spawn blink timer for all modes (3 seconds)
        this.spawnBlinkTimer = 3000;
    }

    initSnowflakes() {
        this.snowflakes = [];
        for (let i = 0; i < 50; i++) {
            this.snowflakes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 3 + 2,
                speed: Math.random() * 0.5 + 0.3,
                drift: Math.random() * 0.5 - 0.25
            });
        }
    }

    triggerEarthquake() {
        // Screen shake effect
        this.shakeTimer = 500; // Slightly longer shake

        // Sound and vibration
        this.sound.playExplosion();
        // Add a secondary slightly delayed rumble if possible, or just vibrate longer
        this.vibrate(400, 0.6, 0.8);

        // Destabilize random rocks and diamonds (15% chance each)
        // Iterate bottom-to-top to prevent "cascading" teleportation in a single frame
        for (let y = GRID_HEIGHT - 2; y >= 1; y--) {
            for (let x = 1; x < GRID_WIDTH - 1; x++) {
                const type = this.grid[y][x];
                if ((type === TYPES.ROCK || type === TYPES.DIAMOND) && Math.random() < 0.15) {
                    // Check if there's empty space or DIRT below
                    const below = this.grid[y + 1][x];
                    if (below === TYPES.EMPTY || below === TYPES.DIRT) {
                        // Move entity down immediately
                        this.grid[y][x] = TYPES.EMPTY;
                        this.grid[y + 1][x] = type;

                        // Mark as falling for physics system consistency
                        this.fallingEntities.add(`${x},${y + 1}`);
                        this.fallingEntityFrames.set(`${x},${y + 1}`, 1);
                    }
                }
            }
        }
    }

    update(dt) {
        this.updateParticles();
        this.updateUI();
        this.pollGamepad();

        // Update spawn blink timer
        if (this.spawnBlinkTimer > 0) {
            this.spawnBlinkTimer -= dt;
            if (this.spawnBlinkTimer < 0) this.spawnBlinkTimer = 0;
        }

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

        // Animate snowflakes (freeze effect)
        if (this.envEffects.freeze) {
            this.snowflakes.forEach(s => {
                s.y += s.speed;
                s.x += s.drift;
                if (s.y > this.height) {
                    s.y = -5;
                    s.x = Math.random() * this.width;
                }
                if (s.x < 0) s.x = this.width;
                if (s.x > this.width) s.x = 0;
            });
        }

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
                // D-pad navigation
                const upPressed = (gp.buttons[12] && gp.buttons[12].pressed) || (gp.axes && gp.axes[1] < -0.5);
                const downPressed = (gp.buttons[13] && gp.buttons[13].pressed) || (gp.axes && gp.axes[1] > 0.5);

                if (upPressed && !this.menuNavLocked) {
                    this.menuNavLocked = true;
                    this.pauseSelectedIndex = (this.pauseSelectedIndex - 1 + this.pauseButtons.length) % this.pauseButtons.length;
                    this.updatePauseSelection();
                    this.sound.playMenuBlip();
                } else if (downPressed && !this.menuNavLocked) {
                    this.menuNavLocked = true;
                    this.pauseSelectedIndex = (this.pauseSelectedIndex + 1) % this.pauseButtons.length;
                    this.updatePauseSelection();
                    this.sound.playMenuBlip();
                } else if (!upPressed && !downPressed) {
                    this.menuNavLocked = false;
                }

                // A button - activate selected
                if (gp.buttons[0].pressed && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    const selectedBtnId = this.pauseButtons[this.pauseSelectedIndex];

                    // Special handling for fullscreen - needs direct API call
                    if (selectedBtnId === 'btn-fullscreen') {
                        this.toggleFullscreen();
                    } else {
                        const selectedBtn = document.getElementById(selectedBtnId);
                        if (selectedBtn) {
                            selectedBtn.click();
                        }
                    }
                }
                // B button - Resume (quick shortcut)
                else if (gp.buttons[1].pressed && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    this.state = this.prevState || STATE.PLAYING;
                    document.getElementById('pause-overlay').classList.add('hidden');
                }
                // Reset lock when no buttons pressed
                else if (!gp.buttons[0].pressed && !gp.buttons[1].pressed) {
                    this.gamepadActionLocked = false;
                }
            }
            return;
        }

        // Load Modal Gamepad Input
        if (this.state === STATE.LOAD_MODAL) {
            const gamepads = navigator.getGamepads();
            const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
            if (gp) {
                // D-pad left/right navigation
                const leftPressed = (gp.buttons[14] && gp.buttons[14].pressed) || (gp.axes && gp.axes[0] < -0.5);
                const rightPressed = (gp.buttons[15] && gp.buttons[15].pressed) || (gp.axes && gp.axes[0] > 0.5);

                if ((leftPressed || rightPressed) && !this.menuNavLocked) {
                    this.menuNavLocked = true;
                    this.loadModalSelectedIndex = (this.loadModalSelectedIndex + 1) % this.loadModalButtons.length;
                    this.updateLoadModalSelection();
                    this.sound.playMenuBlip();
                } else if (!leftPressed && !rightPressed) {
                    this.menuNavLocked = false;
                }

                // A button - activate selected
                if (gp.buttons[0].pressed && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    const selectedBtn = document.getElementById(this.loadModalButtons[this.loadModalSelectedIndex]);
                    if (selectedBtn) selectedBtn.click();
                }
                // B button - Cancel
                else if (gp.buttons[1].pressed && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    this.sound.playMenuBlip();
                    this.state = STATE.MENU;
                    document.getElementById('load-level-modal').classList.add('hidden');
                }
                // Reset lock when no buttons pressed
                else if (!gp.buttons[0].pressed && !gp.buttons[1].pressed) {
                    this.gamepadActionLocked = false;
                }
            }
            return;
        }

        // Level Selector Gamepad Input
        if (this.state === STATE.LEVEL_SELECT) {
            const gamepads = navigator.getGamepads();
            const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
            if (gp) {
                // D-pad up/down navigation
                const upPressed = (gp.buttons[12] && gp.buttons[12].pressed) || (gp.axes && gp.axes[1] < -0.5);
                const downPressed = (gp.buttons[13] && gp.buttons[13].pressed) || (gp.axes && gp.axes[1] > 0.5);

                if (upPressed && !this.menuNavLocked) {
                    this.menuNavLocked = true;
                    if (this.levelSelectorIndex > 0) {
                        this.levelSelectorIndex--;
                        this.updateLevelSelectorSelection();
                        this.sound.playMenuBlip();
                    }
                } else if (downPressed && !this.menuNavLocked) {
                    this.menuNavLocked = true;
                    if (this.levelSelectorIndex < this.customLevelPack.length - 1) {
                        this.levelSelectorIndex++;
                        this.updateLevelSelectorSelection();
                        this.sound.playMenuBlip();
                    }
                } else if (!upPressed && !downPressed) {
                    this.menuNavLocked = false;
                }

                // A button - Start selected level
                if (gp.buttons[0].pressed && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    this.sound.playMenuConfirm();
                    this.startSelectedLevel();
                }
                // B button - Back to menu
                else if (gp.buttons[1].pressed && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    this.sound.playMenuBlip();
                    this.closeLevelSelector();
                }
                // Reset lock when no buttons pressed
                else if (!gp.buttons[0].pressed && !gp.buttons[1].pressed) {
                    this.gamepadActionLocked = false;
                }
            }
            return;
        }

        // Perk Selection Gamepad Input (Rogue Miner)
        if (this.state === STATE.PERK_SELECT) {
            const gamepads = navigator.getGamepads();
            const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
            if (gp) {
                // D-pad left/right navigation
                const leftPressed = (gp.buttons[14] && gp.buttons[14].pressed) || (gp.axes && gp.axes[0] < -0.5);
                const rightPressed = (gp.buttons[15] && gp.buttons[15].pressed) || (gp.axes && gp.axes[0] > 0.5);

                if (leftPressed && !this.menuNavLocked) {
                    this.menuNavLocked = true;
                    if (this.perkSelectedIndex > 0) {
                        this.perkSelectedIndex--;
                        this.updatePerkSelection();
                        this.sound.playMenuBlip();
                    }
                } else if (rightPressed && !this.menuNavLocked) {
                    this.menuNavLocked = true;
                    if (this.perkSelectedIndex < this.perkChoices.length - 1) {
                        this.perkSelectedIndex++;
                        this.updatePerkSelection();
                        this.sound.playMenuBlip();
                    }
                } else if (!leftPressed && !rightPressed) {
                    this.menuNavLocked = false;
                }

                // A button - Select perk
                if (gp.buttons[0].pressed && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    this.selectPerk(this.perkSelectedIndex);
                }
                // Reset lock when no buttons pressed
                else if (!gp.buttons[0].pressed) {
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
            // Check for gamepad button press to exit demo
            const gamepads = navigator.getGamepads();
            const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
            if (gp) {
                for (let i = 0; i < gp.buttons.length; i++) {
                    if (gp.buttons[i] && gp.buttons[i].pressed) {
                        this.stopDemo();
                        return;
                    }
                }
            }

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
                // D-pad navigation
                const upPressed = (gp.buttons[12] && gp.buttons[12].pressed) || (gp.axes && gp.axes[1] < -0.5);
                const downPressed = (gp.buttons[13] && gp.buttons[13].pressed) || (gp.axes && gp.axes[1] > 0.5);

                if (upPressed && !this.menuNavLocked) {
                    this.menuNavLocked = true;
                    this.menuSelectedIndex = (this.menuSelectedIndex - 1 + this.menuButtons.length) % this.menuButtons.length;
                    this.updateMenuSelection();
                    this.sound.playMenuBlip();
                    this.resetIdle();
                } else if (downPressed && !this.menuNavLocked) {
                    this.menuNavLocked = true;
                    this.menuSelectedIndex = (this.menuSelectedIndex + 1) % this.menuButtons.length;
                    this.updateMenuSelection();
                    this.sound.playMenuBlip();
                    this.resetIdle();
                } else if (!upPressed && !downPressed) {
                    this.menuNavLocked = false;
                }

                // A button - activate selected
                if (gp.buttons[0].pressed && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    console.log('A pressed, menuSelectedIndex:', this.menuSelectedIndex, 'button:', this.menuButtons[this.menuSelectedIndex]);
                    const selectedBtn = document.getElementById(this.menuButtons[this.menuSelectedIndex]);
                    if (selectedBtn && !selectedBtn.disabled) {
                        console.log('Clicking button:', selectedBtn.id);
                        selectedBtn.click();
                    }
                }
                // Y - Level Editor (direct shortcut)
                else if (gp.buttons[3].pressed && !this.gamepadActionLocked) {
                    this.gamepadActionLocked = true;
                    this.levelEditor.reset();
                    this.sound.stopMenuMusic();
                    this.state = STATE.EDITOR;
                    document.getElementById('menu-screen').classList.add('hidden');
                    document.getElementById('editor-overlay').classList.remove('hidden');
                    this.updateMenuUI();
                    this.levelEditor.gamepadButtonLocked[3] = true;
                }
                // Reset lock when no buttons pressed
                else if (!gp.buttons[0].pressed && !gp.buttons[3].pressed) {
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
            this.pauseSelectedIndex = 0; // Reset to first button
            document.getElementById('pause-overlay').classList.remove('hidden');
            this.updatePauseSelection();
        }
        if (gp && !gp.buttons[9].pressed) {
            this.gamepadPauseLocked = false;
        }

        this.timeLeft -= dt / 1000;

        // Low time warning haptic at 10 seconds
        if (this.timeLeft <= 10 && this.timeLeft > 0 && Math.floor(this.timeLeft) !== Math.floor(this.timeLeft + dt / 1000)) {
            this.vibrate(100, 0.4, 0.5); // Pulse warning for low time
        }

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

        // Runner perk: faster movement (80ms instead of 100ms)
        let moveDelay = (this.gameMode === GAME_MODES.ROGUE && this.roguePerks.includes('runner')) ? 80 : 100;

        // Check if next tile is dirt for digging-related effects
        let isDigging = false;
        if (dirX !== 0 || dirY !== 0) {
            const nextX = this.player.x + dirX;
            const nextY = this.player.y + dirY;
            if (nextX >= 0 && nextX < GRID_WIDTH && nextY >= 0 && nextY < GRID_HEIGHT) {
                if (this.grid[nextY][nextX] === TYPES.DIRT) {
                    isDigging = true;
                    // Drill Bit+ perk: faster digging
                    if (this.gameMode === GAME_MODES.ROGUE && this.roguePerks.includes('drillBit')) {
                        moveDelay = 60;
                    }
                }
            }
        }

        // Freeze effect: slower movement but faster digging
        if (this.envEffects.freeze) {
            if (isDigging) {
                moveDelay = Math.min(moveDelay, 80); // Faster digging in frozen ground
            } else {
                moveDelay = Math.round(moveDelay * 1.3); // 30% slower movement
            }
        }

        this.player.moveTimer += dt;
        if (this.player.moveTimer > moveDelay) {
            this.movePlayer();
            this.player.moveTimer = 0;
        }

        // Slow down physics (falling rocks) to be slightly slower than player
        this.physicsTimer += dt;
        if (this.physicsTimer > 120) {
            this.updatePhysics();
            this.physicsTimer = 0;
        }

        // Earthquake effect: periodic quakes
        if (this.envEffects.earthquake) {
            this.earthquakeTimer += dt;
            if (this.earthquakeTimer >= this.earthquakeInterval) {
                this.earthquakeTimer = 0;
                this.triggerEarthquake();
            }
        }

        // Magnet perk: attract diamonds within 2 tiles
        if (this.gameMode === GAME_MODES.ROGUE && this.roguePerks.includes('magnet')) {
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    if (dx === 0 && dy === 0) continue; // Skip player position
                    const nx = this.player.x + dx;
                    const ny = this.player.y + dy;
                    if (nx > 0 && nx < GRID_WIDTH - 1 && ny > 0 && ny < GRID_HEIGHT - 1) {
                        if (this.grid[ny][nx] === TYPES.DIAMOND) {
                            // Move diamond one step closer to player
                            const stepX = Math.sign(this.player.x - nx);
                            const stepY = Math.sign(this.player.y - ny);
                            const targetX = nx + stepX;
                            const targetY = ny + stepY;

                            // Only move if target is empty or is player
                            if (targetX === this.player.x && targetY === this.player.y) {
                                // Collect the diamond
                                this.collectDiamond(nx, ny);
                            } else if (this.grid[targetY][targetX] === TYPES.EMPTY) {
                                this.grid[ny][nx] = TYPES.EMPTY;
                                this.grid[targetY][targetX] = TYPES.DIAMOND;
                            }
                        }
                    }
                }
            }
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
                this.ctx.globalAlpha = 1.0;
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

        // Tutorial Visual Overlay - Visual hints for new players
        if (gameSettings.tutorialEnabled && !gameSettings.tutorialCompleted && this.state === STATE.PLAYING) {
            this.drawTutorialOverlay();
        }

        // Mineral Scanner - Highlight diamonds and enemies
        if (this.gameMode === GAME_MODES.ROGUE && this.revealMapTimer > 0) {
            this.revealMapTimer -= 16; // Approx decrement per frame (60fps)
            const alpha = Math.min(1, this.revealMapTimer / 500); // Fade out last 0.5s

            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.lineWidth = 3;

            for (let y = 0; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    const type = this.grid[y][x];
                    if (type === TYPES.DIAMOND) {
                        this.ctx.strokeStyle = '#00ffff';
                        this.ctx.beginPath();
                        this.ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2 + 5, 0, Math.PI * 2);
                        this.ctx.stroke();
                    } else if (type === TYPES.ENEMY) {
                        this.ctx.strokeStyle = '#ff0000';
                        this.ctx.beginPath();
                        this.ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2 + 5, 0, Math.PI * 2);
                        this.ctx.stroke();
                        // Draw line to enemy
                        this.ctx.lineWidth = 1;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.player.x * TILE_SIZE + TILE_SIZE / 2, this.player.y * TILE_SIZE + TILE_SIZE / 2);
                        this.ctx.lineTo(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2);
                        this.ctx.stroke();
                        this.ctx.lineWidth = 3;
                    }
                }
            }
            this.ctx.restore();
        }

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
            this.ctx.fillText(t('demo.title'), this.width / 2, this.height / 2);

            this.ctx.font = '20px Orbitron';
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#cccccc';

            if (Math.floor(Date.now() / 500) % 2 === 0) {
                this.ctx.fillText(t('demo.pressAnyKey'), this.width / 2, this.height / 2 + 40);
            }
            this.ctx.restore();
        }

        // Environmental Effect: Dark Zone
        if (this.envEffects.darkZone && this.state === STATE.PLAYING) {
            const px = this.player.x * TILE_SIZE + TILE_SIZE / 2;
            const py = this.player.y * TILE_SIZE + TILE_SIZE / 2;
            const r = this.lightRadius * TILE_SIZE;

            const gradient = this.ctx.createRadialGradient(px, py, r * 0.5, px, py, r * 1.5);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(0.6, 'rgba(0,0,0,0.7)');
            gradient.addColorStop(1, 'rgba(0,0,0,0.95)');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        // Environmental Effect: Freeze
        if (this.envEffects.freeze && this.state === STATE.PLAYING) {
            // Blue overlay
            this.ctx.fillStyle = 'rgba(100, 180, 255, 0.08)';
            this.ctx.fillRect(0, 0, this.width, this.height);

            // Snowflakes
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.snowflakes.forEach(s => {
                this.ctx.beginPath();
                this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                this.ctx.fill();
            });
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
            case TYPES.STEEL:
                this.drawSteelWall(cx, cy);
                break;
            case TYPES.MAGIC_WALL:
                if (this.magicWallActive) {
                    // Active Magic Wall Animation
                    this.ctx.fillStyle = this.currentTheme[TYPES.WALL];
                    this.ctx.fillRect(cx, cy, TILE_SIZE, TILE_SIZE);

                    // Static/Noise effect
                    this.ctx.fillStyle = Math.random() < 0.5 ? '#ffffff' : this.currentTheme.wallGlow;
                    for (let i = 0; i < 5; i++) {
                        const rx = Math.random() * TILE_SIZE;
                        const ry = Math.random() * TILE_SIZE;
                        this.ctx.fillRect(cx + rx, cy + ry, 4, 4);
                    }

                    // Border glow
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(cx, cy, TILE_SIZE, TILE_SIZE);
                } else {
                    // Inactive: Looks like normal wall
                    this.ctx.fillStyle = this.currentTheme[TYPES.WALL];
                    this.ctx.fillRect(cx, cy, TILE_SIZE, TILE_SIZE);
                    this.ctx.strokeStyle = this.currentTheme.wallGlow;
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(cx + 2, cy + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                    this.ctx.fillStyle = '#424242';
                    this.ctx.fillRect(cx + 8, cy + 8, TILE_SIZE - 16, TILE_SIZE - 16);
                }
                break;
            case TYPES.AMOEBA:
                this.ctx.fillStyle = this.currentTheme[TYPES.AMOEBA];
                this.ctx.fillRect(cx, cy, TILE_SIZE, TILE_SIZE);

                // Bubbling effect
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                const time = Date.now() / 200;
                const size = (Math.sin(time + x * 0.5 + y * 0.5) + 1) * 4 + 2;
                this.ctx.beginPath();
                this.ctx.arc(cx + TILE_SIZE / 2, cy + TILE_SIZE / 2, size, 0, Math.PI * 2);
                this.ctx.fill();
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
            } else if (enemy.type === ENEMY_TYPES.BUTTERFLY) {
                color = this.currentTheme.enemyButterfly;
                eyeColor = '#00ffff'; // Cyan eyes
            }
        }

        this.ctx.fillStyle = color;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = color;

        // Draw different shapes based on type
        if (type === ENEMY_TYPES.BASIC) {
            // BASIC: Circle/Oval (firefly style)
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
        } else if (type === ENEMY_TYPES.BUTTERFLY) {
            // BUTTERFLY: Butterfly shape with wings
            const cx = x + TILE_SIZE / 2;
            const cy = y + TILE_SIZE / 2;
            // Body
            this.ctx.beginPath();
            this.ctx.ellipse(cx, cy, 3, TILE_SIZE / 2 - 6, 0, 0, Math.PI * 2);
            this.ctx.fill();
            // Left wing
            this.ctx.beginPath();
            this.ctx.ellipse(cx - 8, cy - 2, 6, 8, -0.3, 0, Math.PI * 2);
            this.ctx.fill();
            // Right wing
            this.ctx.beginPath();
            this.ctx.ellipse(cx + 8, cy - 2, 6, 8, 0.3, 0, Math.PI * 2);
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
        } else if (type === ENEMY_TYPES.BUTTERFLY) {
            // Butterfly eyes - on body, smaller
            this.ctx.fillRect(x + 13 + eyeOffset, y + 10, 2, 2);
            this.ctx.fillRect(x + 17 + eyeOffset, y + 10, 2, 2);
        } else {
            // Circle and Square eyes - centered
            this.ctx.fillRect(x + 8 + eyeOffset, y + 10, 4, 4);
            this.ctx.fillRect(x + 20 + eyeOffset, y + 10, 4, 4);
        }
    }

    drawPlayer(x, y) {
        // Spawn blink effect - skip drawing every other frame during blink period
        if (this.spawnBlinkTimer > 0) {
            const blinkPhase = Math.floor(this.globalTime / 100) % 2;
            if (blinkPhase === 0) {
                // Draw a bright highlight around player position instead
                this.ctx.fillStyle = '#ffffff';
                this.ctx.globalAlpha = 0.5;
                this.ctx.fillRect(x - 4, y - 4, TILE_SIZE + 8, TILE_SIZE + 8);
                this.ctx.globalAlpha = 1.0;
            }
        }

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

    // Tutorial Visual Overlay System
    drawTutorialOverlay() {
        const time = Date.now();
        const pulsePhase = Math.sin(time * 0.005) * 0.5 + 0.5; // 0-1 pulsing
        const arrowBounce = Math.sin(time * 0.008) * 5;

        this.ctx.save();

        // 1. Pulsing Glow on Diamonds (first 5 uncollected)
        let diamondCount = 0;
        for (let y = 0; y < GRID_HEIGHT && diamondCount < 5; y++) {
            for (let x = 0; x < GRID_WIDTH && diamondCount < 5; x++) {
                if (this.grid[y][x] === TYPES.DIAMOND) {
                    diamondCount++;
                    const cx = x * TILE_SIZE + TILE_SIZE / 2;
                    const cy = y * TILE_SIZE + TILE_SIZE / 2;

                    // Outer glow ring
                    this.ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + pulsePhase * 0.5})`;
                    this.ctx.lineWidth = 2 + pulsePhase * 2;
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy, TILE_SIZE / 2 + 4 + pulsePhase * 4, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
            }
        }

        // 2. Exit Highlight (when enough diamonds collected)
        if (this.diamondsCollected >= this.diamondsNeeded) {
            for (let y = 0; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    if (this.grid[y][x] === TYPES.EXIT) {
                        const cx = x * TILE_SIZE + TILE_SIZE / 2;
                        const cy = y * TILE_SIZE + TILE_SIZE / 2;

                        // Strong green glow
                        this.ctx.strokeStyle = `rgba(0, 255, 100, ${0.5 + pulsePhase * 0.5})`;
                        this.ctx.lineWidth = 3 + pulsePhase * 3;
                        this.ctx.beginPath();
                        this.ctx.arc(cx, cy, TILE_SIZE / 2 + 6 + pulsePhase * 6, 0, Math.PI * 2);
                        this.ctx.stroke();

                        // Arrow pointing to exit
                        this.drawTutorialArrow(this.player.x, this.player.y, x, y, '#00ff64', arrowBounce);
                    }
                }
            }
        } else {
            // Arrow pointing to nearest diamond
            let nearestDiamond = null;
            let nearestDist = Infinity;
            for (let y = 0; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    if (this.grid[y][x] === TYPES.DIAMOND) {
                        const dist = Math.abs(x - this.player.x) + Math.abs(y - this.player.y);
                        if (dist < nearestDist) {
                            nearestDist = dist;
                            nearestDiamond = { x, y };
                        }
                    }
                }
            }
            if (nearestDiamond && nearestDist > 2) {
                this.drawTutorialArrow(this.player.x, this.player.y, nearestDiamond.x, nearestDiamond.y, '#00ffff', arrowBounce);
            }
        }

        // 3. Danger Zone Warning - Red overlay under falling rocks
        for (let y = 0; y < GRID_HEIGHT - 1; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (this.grid[y][x] === TYPES.ROCK || this.grid[y][x] === TYPES.DIAMOND) {
                    // Check if this rock could fall (empty below)
                    if (this.grid[y + 1][x] === TYPES.EMPTY || this.grid[y + 1][x] === TYPES.PLAYER) {
                        // Draw danger zone where rock would land
                        let fallY = y + 1;
                        while (fallY < GRID_HEIGHT && this.grid[fallY][x] === TYPES.EMPTY) {
                            fallY++;
                        }
                        // Highlight danger zone
                        for (let dangerY = y + 1; dangerY < fallY; dangerY++) {
                            const dx = x * TILE_SIZE;
                            const dy = dangerY * TILE_SIZE;
                            this.ctx.fillStyle = `rgba(255, 0, 0, ${0.15 + pulsePhase * 0.1})`;
                            this.ctx.fillRect(dx, dy, TILE_SIZE, TILE_SIZE);
                        }
                    }
                }
            }
        }

        // 4. Enemy Warning - Red pulse around nearby enemies
        this.enemies.forEach(enemy => {
            const dist = Math.abs(enemy.x - this.player.x) + Math.abs(enemy.y - this.player.y);
            if (dist <= 5) {
                const cx = enemy.x * TILE_SIZE + TILE_SIZE / 2;
                const cy = enemy.y * TILE_SIZE + TILE_SIZE / 2;
                this.ctx.strokeStyle = `rgba(255, 50, 50, ${0.4 + pulsePhase * 0.4})`;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(cx, cy, TILE_SIZE / 2 + 8 + pulsePhase * 4, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        });

        // 5. TNT Pickup Highlight
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (this.grid[y][x] === TYPES.DYNAMITE_PICKUP) {
                    const cx = x * TILE_SIZE + TILE_SIZE / 2;
                    const cy = y * TILE_SIZE + TILE_SIZE / 2;

                    // Orange pulsing glow
                    this.ctx.strokeStyle = `rgba(255, 100, 0, ${0.3 + pulsePhase * 0.5})`;
                    this.ctx.lineWidth = 2 + pulsePhase * 2;
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy, TILE_SIZE / 2 + 4 + pulsePhase * 4, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
            }
        }

        this.ctx.restore();
    }

    // Draw directional arrow from player toward target
    drawTutorialArrow(fromX, fromY, toX, toY, color, bounce) {
        const dx = toX - fromX;
        const dy = toY - fromY;
        if (dx === 0 && dy === 0) return;

        // Normalize direction
        const angle = Math.atan2(dy, dx);

        // Arrow position (near player)
        const arrowDist = TILE_SIZE * 1.5;
        const ax = fromX * TILE_SIZE + TILE_SIZE / 2 + Math.cos(angle) * arrowDist;
        const ay = fromY * TILE_SIZE + TILE_SIZE / 2 + Math.sin(angle) * arrowDist + bounce;

        this.ctx.save();
        this.ctx.translate(ax, ay);
        this.ctx.rotate(angle);

        // Draw arrow
        this.ctx.fillStyle = color;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = color;
        this.ctx.beginPath();
        this.ctx.moveTo(10, 0);
        this.ctx.lineTo(-6, -8);
        this.ctx.lineTo(-6, 8);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.restore();
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

            // Load Modal keyboard handling
            if (this.state === STATE.LOAD_MODAL && isKeyDown) {
                if (e.key === 'Escape') {
                    this.sound.playMenuBlip();
                    this.state = STATE.MENU;
                    document.getElementById('load-level-modal').classList.add('hidden');
                    return;
                }
                if (e.key === 'Enter') {
                    const selectedBtn = document.getElementById(this.loadModalButtons[this.loadModalSelectedIndex]);
                    if (selectedBtn) selectedBtn.click();
                    return;
                }
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Tab') {
                    e.preventDefault();
                    this.loadModalSelectedIndex = (this.loadModalSelectedIndex + 1) % this.loadModalButtons.length;
                    this.updateLoadModalSelection();
                    this.sound.playMenuBlip();
                    return;
                }
            }

            // Level Selector keyboard handling
            if (this.state === STATE.LEVEL_SELECT && isKeyDown) {
                if (e.key === 'Escape') {
                    this.sound.playMenuBlip();
                    this.closeLevelSelector();
                    return;
                }
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.sound.playMenuConfirm();
                    this.startSelectedLevel();
                    return;
                }
                if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                    e.preventDefault();
                    if (this.levelSelectorIndex > 0) {
                        this.levelSelectorIndex--;
                        this.updateLevelSelectorSelection();
                        this.sound.playMenuBlip();
                    }
                    return;
                }
                if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                    e.preventDefault();
                    if (this.levelSelectorIndex < this.customLevelPack.length - 1) {
                        this.levelSelectorIndex++;
                        this.updateLevelSelectorSelection();
                        this.sound.playMenuBlip();
                    }
                    return;
                }
            }

            // Perk Selection keyboard handling (Rogue Miner)
            if (this.state === STATE.PERK_SELECT && isKeyDown) {
                if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                    e.preventDefault();
                    if (this.perkSelectedIndex > 0) {
                        this.perkSelectedIndex--;
                        this.updatePerkSelection();
                        this.sound.playMenuBlip();
                    }
                    return;
                }
                if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                    e.preventDefault();
                    if (this.perkSelectedIndex < this.perkChoices.length - 1) {
                        this.perkSelectedIndex++;
                        this.updatePerkSelection();
                        this.sound.playMenuBlip();
                    }
                    return;
                }
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectPerk(this.perkSelectedIndex);
                    return;
                }
            }

            // Main Menu keyboard navigation
            if (this.state === STATE.MENU && isKeyDown) {
                if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                    e.preventDefault();
                    this.menuSelectedIndex = (this.menuSelectedIndex - 1 + this.menuButtons.length) % this.menuButtons.length;
                    this.updateMenuSelection();
                    this.sound.playMenuBlip();
                    return;
                }
                if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                    e.preventDefault();
                    this.menuSelectedIndex = (this.menuSelectedIndex + 1) % this.menuButtons.length;
                    this.updateMenuSelection();
                    this.sound.playMenuBlip();
                    return;
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const selectedBtn = document.getElementById(this.menuButtons[this.menuSelectedIndex]);
                    if (selectedBtn && !selectedBtn.disabled) {
                        selectedBtn.click();
                    }
                    return;
                }
            }

            // Pause Menu keyboard navigation
            if (this.state === STATE.PAUSED && isKeyDown) {
                if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                    e.preventDefault();
                    this.pauseSelectedIndex = (this.pauseSelectedIndex - 1 + this.pauseButtons.length) % this.pauseButtons.length;
                    this.updatePauseSelection();
                    this.sound.playMenuBlip();
                    return;
                }
                if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                    e.preventDefault();
                    this.pauseSelectedIndex = (this.pauseSelectedIndex + 1) % this.pauseButtons.length;
                    this.updatePauseSelection();
                    this.sound.playMenuBlip();
                    return;
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const selectedBtnId = this.pauseButtons[this.pauseSelectedIndex];
                    // Special handling for fullscreen - needs direct API call
                    if (selectedBtnId === 'btn-fullscreen') {
                        this.toggleFullscreen();
                    } else {
                        const selectedBtn = document.getElementById(selectedBtnId);
                        if (selectedBtn) {
                            selectedBtn.click();
                        }
                    }
                    return;
                }
            }

            // ESC - Pause/Unpause
            if (e.key === 'Escape' && isKeyDown) {
                if (this.state === STATE.PLAYING) {
                    this.prevState = STATE.PLAYING;
                    this.state = STATE.PAUSED;
                    this.pauseSelectedIndex = 0;
                    document.getElementById('pause-overlay').classList.remove('hidden');
                    this.updatePauseSelection();
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
                document.getElementById('btn-sound').innerText = this.sound.enabled ? t('pause.soundOn') : t('pause.soundOff');
                this.showMessage(this.sound.enabled ? t("msg.soundOn") : t("msg.soundOff"), "");
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
                    document.getElementById('message-overlay').classList.add('hidden');

                    // If in test mode, restart the test level
                    if (this.isTesting) {
                        this.levelEditor.testPlay();
                    } else if (this.state === STATE.GAMEOVER) {
                        // In Hardcore/Rogue, prevent restart and go to menu
                        if (this.gameMode === GAME_MODES.HARDCORE || this.gameMode === GAME_MODES.ROGUE) {
                            this.state = STATE.MENU;
                            this.sound.stopGameMusic();
                            this.updateMenuUI();
                            return;
                        }
                        // Game over: restart current level only (keep pack progress)
                        this.restartCurrentLevel();
                    } else if (this.state === STATE.WIN) {
                        // Win/completed: restart from beginning
                        if (this.currentLevelIndex >= LEVELS.length) {
                            this.currentLevelIndex = 0;
                        }
                        this.resetGame();
                    } else {
                        // Playing/Paused: restart current level
                        this.restartCurrentLevel();
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
                } else if (isKeyDown && this.state === STATE.GAMEOVER) {
                    if (this.highScorePending) return;

                    if (this.isTesting) {
                        this.state = STATE.EDITOR;
                        document.getElementById('editor-overlay').classList.remove('hidden');
                        document.getElementById('message-overlay').classList.add('hidden');
                        this.isTesting = false;
                        return;
                    }

                    document.getElementById('message-overlay').classList.add('hidden');

                    // In Hardcore/Rogue, prevent restart and go to menu
                    if (this.gameMode === GAME_MODES.HARDCORE || this.gameMode === GAME_MODES.ROGUE) {
                        this.state = STATE.MENU;
                        this.sound.stopGameMusic();
                        this.updateMenuUI();
                        return;
                    }

                    // GAMEOVER: restart current level only (keep pack progress)
                    this.restartCurrentLevel();
                } else if (isKeyDown && this.state === STATE.WIN) {
                    if (this.highScorePending) return;

                    if (this.isTesting) {
                        this.state = STATE.EDITOR;
                        document.getElementById('editor-overlay').classList.remove('hidden');
                        document.getElementById('message-overlay').classList.add('hidden');
                        this.isTesting = false;
                        return;
                    }

                    if (this.currentLevelIndex >= LEVELS.length) {
                        this.currentLevelIndex = 0;
                    }
                    document.getElementById('message-overlay').classList.add('hidden');
                    // WIN: restart from beginning
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

    startGame(mode = GAME_MODES.CAMPAIGN) {
        if (this.state === STATE.PLAYING) return;

        const startingFromMenu = (this.state === STATE.MENU);
        if (startingFromMenu) {
            this.gameMode = mode;
            if (mode === GAME_MODES.CAMPAIGN) {
                this.currentLevelIndex = 0;
                this.score = 0;
                this.initLevel();
            } else if (mode === GAME_MODES.ENDLESS || mode === GAME_MODES.HARDCORE) {
                // Clear any pending death timeout from previous run
                if (this.deathTimeout) {
                    clearTimeout(this.deathTimeout);
                    this.deathTimeout = null;
                }
                this.currentLevelIndex = 0; // Start from level 1 (0-indexed)
                this.score = 0;
                this.initLevel();
            } else if (mode === GAME_MODES.CUSTOM) {
                // Custom level pack
                this.score = 0;
                this.initLevel();
            } else if (mode === GAME_MODES.ROGUE) {
                // Rogue Miner mode - procedural with perks
                // Clear any pending death timeout from previous run
                if (this.deathTimeout) {
                    clearTimeout(this.deathTimeout);
                    this.deathTimeout = null;
                }
                this.rogueDepth = 1;
                this.roguePerks = [];
                this.hasShield = false;
                this.score = 0;
                this.initLevel();
            }
        }

        console.log('Starting Game...', this.gameMode);
        this.state = STATE.PLAYING;

        // Unlock audio engine and then start music
        this.sound.unlock().then(() => {
            console.log('Audio unlocked, starting music');
            this.sound.stopMenuMusic();
            this.sound.startGameMusic(this.currentMusicThemeIndex);
        }).catch(e => console.error('Audio unlock failed:', e));

        // Show level intro for custom levels with title/description
        if (this.gameMode === GAME_MODES.CUSTOM && this.customLevelData) {
            if (this.customLevelData.title || this.customLevelData.description) {
                const title = this.customLevelData.title || "CUSTOM LEVEL";
                const desc = this.customLevelData.description || "";
                this.showMessage(title, desc);
                setTimeout(() => {
                    document.getElementById('message-overlay').classList.add('hidden');
                }, 2500);
            } else {
                document.getElementById('message-overlay').classList.add('hidden');
            }
        } else {
            document.getElementById('message-overlay').classList.add('hidden');
        }

        this.updateUI();
        this.updateMenuUI();

        // Ensure game loop is running
        if (!this.animationFrameId) {
            this.loop(0);
        }
    }

    loadLevelFromFile(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.processLevelData(data);
            } catch (err) {
                console.error('Failed to parse file:', err);
                alert('Failed to load level: Invalid JSON file');
                this.sound.playMenuBlip();
            }
        };

        reader.onerror = () => {
            alert('Failed to read file');
            this.sound.playMenuBlip();
        };

        reader.readAsText(file);
    }

    processLevelData(data) {
        try {
            let packName = 'Level Pack';
            let packDescription = null;
            let packDetails = null;

            // Check if it's a level pack (array of levels) or single level
            if (Array.isArray(data)) {
                // Level pack - array of levels
                if (data.length === 0) {
                    throw new Error('Level pack is empty');
                }

                // Validate all levels in the pack
                for (let i = 0; i < data.length; i++) {
                    const level = data[i];
                    if (!level.grid && !level.map) {
                        throw new Error(`Level ${i + 1} is missing grid/map data`);
                    }
                }

                console.log(`Loaded level pack with ${data.length} levels`);
                this.customLevelPack = data;
                packName = `${data.length} Levels`;

            } else if (data.levels && Array.isArray(data.levels)) {
                // Level pack with metadata wrapper: { name: "...", levels: [...] }
                if (data.levels.length === 0) {
                    throw new Error('Level pack is empty');
                }

                console.log(`Loaded level pack "${data.name || 'Unnamed'}" with ${data.levels.length} levels`);
                this.customLevelPack = data.levels;
                packName = I18N.getLocalizedField(data, 'name') || `${data.levels.length} Levels`;
                packDescription = I18N.getLocalizedField(data, 'description') || null;
                packDetails = {
                    author: data.author || null,
                    website: data.website || data.url || null,
                    version: data.version || null,
                    date: data.date || null
                };

            } else {
                // Single level
                if (!data.grid && !data.map) {
                    throw new Error('Invalid level format: missing grid or map data');
                }

                console.log('Loaded single custom level');
                this.customLevelPack = [data];
                packName = I18N.getLocalizedField(data, 'name') || I18N.getLocalizedField(data, 'title') || 'Single Level';
                packDescription = I18N.getLocalizedField(data, 'description') || null;
            }

            // Show level selector instead of starting game directly
            this.sound.playMenuConfirm();
            document.getElementById('load-level-modal').classList.add('hidden');
            this.resetFileInput();
            this.showLevelSelector(packName, packDescription, packDetails);

        } catch (e) {
            console.error(e);
            alert('Failed to load level: ' + e.message);
            this.sound.playMenuBlip();
        }
    }
    resetFileInput() {
        const fileInput = document.getElementById('level-file-input');
        const fileNameDisplay = document.getElementById('file-name-display');
        if (fileInput) fileInput.value = '';
        if (fileNameDisplay) fileNameDisplay.textContent = '';
        document.getElementById('level-url-input').value = '';
    }

    // Level Selector Functions
    showLevelSelector(packName, packDescription = null, packDetails = null) {
        this.state = STATE.LEVEL_SELECT;
        this.levelSelectorIndex = 0;
        this.currentPackDetails = packDetails;

        const modal = document.getElementById('level-selector-modal');
        const levelList = document.getElementById('level-list');
        const packInfo = document.getElementById('level-pack-info');

        // Build pack info with optional description and info button
        let packInfoHTML = `<span class="pack-name">${packName}</span>`;

        // Add info button if there are details
        if (packDetails && (packDetails.author || packDetails.website || packDetails.version)) {
            packInfoHTML += ` <button class="pack-info-btn" id="btn-pack-info" title="Pack Info">ℹ️</button>`;
        }

        packInfo.innerHTML = packInfoHTML;

        // Add description if available
        let descElement = document.getElementById('level-pack-desc');
        if (!descElement) {
            descElement = document.createElement('p');
            descElement.id = 'level-pack-desc';
            descElement.className = 'pack-description';
            packInfo.parentNode.insertBefore(descElement, levelList);
        }

        if (packDescription) {
            descElement.textContent = packDescription;
            descElement.classList.remove('hidden');
        } else {
            descElement.textContent = '';
            descElement.classList.add('hidden');
        }

        // Bind info button if exists
        const infoBtn = document.getElementById('btn-pack-info');
        if (infoBtn) {
            infoBtn.onclick = () => this.showPackDetails();
        }

        levelList.innerHTML = '';

        // Create level items
        this.customLevelPack.forEach((level, index) => {
            const item = document.createElement('div');
            item.className = 'level-item' + (index === 0 ? ' selected' : '');
            item.dataset.index = index;

            // Level number
            const number = document.createElement('span');
            number.className = 'level-number';
            number.textContent = (index + 1).toString().padStart(2, '0');

            // Preview canvas
            const preview = document.createElement('canvas');
            preview.className = 'level-preview';
            preview.width = 80;
            preview.height = 40;
            this.renderLevelPreview(level, preview);

            // Level info
            const info = document.createElement('div');
            info.className = 'level-info';

            const title = document.createElement('span');
            title.className = 'level-title';
            title.textContent = I18N.getLocalizedField(level, 'title') || I18N.getLocalizedField(level, 'name') || `Level ${index + 1}`;

            const meta = document.createElement('span');
            meta.className = 'level-meta';
            const diamonds = level.diamondsNeeded || level.diamonds || '?';
            const time = level.time || level.timeLimit || '?';
            meta.innerHTML = `💎 ${diamonds} &nbsp; ⏱️ ${time}s`;

            info.appendChild(title);
            info.appendChild(meta);

            item.appendChild(number);
            item.appendChild(preview);
            item.appendChild(info);

            item.addEventListener('click', () => {
                this.levelSelectorIndex = index;
                this.updateLevelSelectorSelection();
                this.startSelectedLevel();
            });

            item.addEventListener('mouseenter', () => {
                this.levelSelectorIndex = index;
                this.updateLevelSelectorSelection();
                this.sound.playMenuHover();
            });

            levelList.appendChild(item);
        });

        modal.classList.remove('hidden');

        // Bind buttons
        document.getElementById('btn-level-start').onclick = () => this.startSelectedLevel();
        document.getElementById('btn-level-back').onclick = () => this.closeLevelSelector();
    }

    renderLevelPreview(levelData, canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        let gridData = null;
        let gridWidth = GRID_WIDTH;
        let gridHeight = GRID_HEIGHT;

        if (levelData.map) {
            gridHeight = levelData.map.length;
            gridWidth = levelData.map[0] ? levelData.map[0].length : GRID_WIDTH;
        } else if (levelData.grid) {
            gridHeight = levelData.grid.length;
            gridWidth = levelData.grid[0] ? levelData.grid[0].length : GRID_WIDTH;
        }

        const tileW = width / gridWidth;
        const tileH = height / gridHeight;

        const charToColor = {
            '#': '#555', 'W': '#555',
            '.': '#4a3527', 'D': '#00ffff',
            'O': '#8b7355', 'R': '#8b7355',
            'S': '#ff00ff', 'P': '#ff00ff',
            'X': '#00ff00', 'E': '#ff0000',
            ' ': '#111', 'T': '#ff4444'
        };

        const typeToColor = {
            [TYPES.WALL]: '#555',
            [TYPES.DIRT]: '#4a3527',
            [TYPES.DIAMOND]: '#00ffff',
            [TYPES.ROCK]: '#8b7355',
            [TYPES.PLAYER]: '#ff00ff',
            [TYPES.EXIT]: '#00ff00',
            [TYPES.ENEMY]: '#ff0000',
            [TYPES.EMPTY]: '#111',
            [TYPES.DYNAMITE_PICKUP]: '#ff4444',
            [TYPES.STEEL]: '#888',
            [TYPES.MAGIC_WALL]: '#9900ff',
            [TYPES.AMOEBA]: '#00ff00'
        };

        if (levelData.map) {
            levelData.map.forEach((row, y) => {
                for (let x = 0; x < row.length; x++) {
                    const char = row[x];
                    ctx.fillStyle = charToColor[char] || '#222';
                    ctx.fillRect(x * tileW, y * tileH, tileW + 0.5, tileH + 0.5);
                }
            });
        } else if (levelData.grid) {
            levelData.grid.forEach((row, y) => {
                row.forEach((tile, x) => {
                    ctx.fillStyle = typeToColor[tile] || '#222';
                    ctx.fillRect(x * tileW, y * tileH, tileW + 0.5, tileH + 0.5);
                });
            });
        }
    }

    updateLevelSelectorSelection() {
        const items = document.querySelectorAll('.level-item');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.levelSelectorIndex);
        });

        // Scroll selected into view
        const selected = items[this.levelSelectorIndex];
        if (selected) {
            selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    startSelectedLevel() {
        this.customLevelIndex = this.levelSelectorIndex;
        this.customLevelData = this.prepareCustomLevel(this.customLevelPack[this.levelSelectorIndex]);

        this.closeLevelSelector();
        this.state = STATE.MENU;
        this.startGame(GAME_MODES.CUSTOM);
    }

    closeLevelSelector() {
        document.getElementById('level-selector-modal').classList.add('hidden');
        // Remove description element if exists
        const descEl = document.getElementById('level-pack-desc');
        if (descEl) descEl.remove();
        this.state = STATE.MENU;
        this.updateMenuUI();
    }

    showPackDetails() {
        if (!this.currentPackDetails) return;

        const details = this.currentPackDetails;
        let message = '';

        if (details.author) message += `👤 Author: ${details.author}\n`;
        if (details.website) message += `🌐 Website: ${details.website}\n`;
        if (details.version) message += `📦 Version: ${details.version}\n`;
        if (details.date) message += `📅 Date: ${details.date}\n`;

        if (message) {
            alert(message.trim());
        }
    }

    async loadLevelFromUrl(url) {
        try {
            let response;
            let data;

            // Try direct fetch first
            try {
                response = await fetch(url);
                if (!response.ok) throw new Error('Direct fetch failed');
                data = await response.json();
            } catch (directError) {
                console.log('Direct fetch failed, trying CORS proxies...');

                // Try multiple CORS proxies
                const corsProxies = [
                    'https://api.allorigins.win/raw?url=',
                    'https://corsproxy.io/?',
                    'https://cors-anywhere.herokuapp.com/'
                ];

                let proxySuccess = false;
                for (const proxy of corsProxies) {
                    try {
                        response = await fetch(proxy + encodeURIComponent(url));
                        if (response.ok) {
                            data = await response.json();
                            proxySuccess = true;
                            console.log('Loaded via proxy:', proxy);
                            break;
                        }
                    } catch (proxyError) {
                        console.log('Proxy failed:', proxy);
                    }
                }

                if (!proxySuccess) {
                    throw new Error('Failed to load - CORS blocked. Try hosting the JSON on the same server or use a raw GitHub/Gist URL.');
                }
            }

            // Use shared processing method
            this.processLevelData(data);

        } catch (e) {
            console.error(e);
            alert('Failed to load level: ' + e.message);
            this.sound.playMenuBlip();
        }
    }

    prepareCustomLevel(levelData) {
        // Normalize level data format
        const prepared = { ...levelData };

        // If using 'map' format (string array), keep it as is
        // If using 'grid' format (2D number array), keep it as is

        // Set defaults
        prepared.diamondsNeeded = levelData.diamondsNeeded || levelData.diamonds || 10;
        prepared.time = levelData.time || levelData.timeLimit || 120;
        prepared.type = 'custom';

        // Optional metadata (with localization support)
        prepared.title = I18N.getLocalizedField(levelData, 'title') || I18N.getLocalizedField(levelData, 'name') || null;
        prepared.description = I18N.getLocalizedField(levelData, 'description') || levelData.desc || null;

        // Optional theme (0-7)
        if (typeof levelData.theme === 'number') {
            prepared.theme = Math.floor(levelData.theme) % THEMES.length;
        }

        // Optional environmental effects
        if (levelData.envEffects) {
            prepared.envEffects = {
                darkZone: levelData.envEffects.darkZone === true,
                freeze: levelData.envEffects.freeze === true,
                earthquake: levelData.envEffects.earthquake === true
            };
        }

        return prepared;
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

        // Reset custom level pack to first level
        if (this.gameMode === GAME_MODES.CUSTOM && this.customLevelPack) {
            this.customLevelIndex = 0;
            this.customLevelData = this.prepareCustomLevel(this.customLevelPack[0]);
        }

        this.initLevel();
        this.state = STATE.PLAYING;
        this.sound.stopGameMusic();
        this.sound.startGameMusic(this.currentMusicThemeIndex);
    }

    // Restart only the current level (for game over - doesn't reset pack progress)
    restartCurrentLevel() {
        this.initLevel(true); // true = isRestart, preserve env effects
        this.state = STATE.PLAYING;
        this.sound.stopGameMusic();
        this.sound.startGameMusic(this.currentMusicThemeIndex);
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
        this.demoLastDir = null;
        this.demoPositionHistory = []; // Track recent positions to detect oscillation

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
        if (this.demoInputTimer > 300) { // Move every 300ms
            this.demoInputTimer = 0;

            // Track position history
            const currentPos = `${this.player.x},${this.player.y}`;
            this.demoPositionHistory.push(currentPos);
            if (this.demoPositionHistory.length > 10) {
                this.demoPositionHistory.shift();
            }

            // Detect oscillation: if same position appears 3+ times in last 10 moves
            const posCount = this.demoPositionHistory.filter(p => p === currentPos).length;
            const isOscillating = posCount >= 3;

            // If oscillating, use random move to break out
            if (isOscillating) {
                const dirs = [
                    { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
                ];
                let validMoves = [];
                for (let dir of dirs) {
                    if (this.isDemoMoveSafe(this.player.x + dir.x, this.player.y + dir.y)) {
                        validMoves.push(dir);
                    }
                }
                if (validMoves.length > 0) {
                    const move = validMoves[Math.floor(Math.random() * validMoves.length)];
                    this.player.nextDirX = move.x;
                    this.player.nextDirY = move.y;
                    this.demoLastDir = move;
                    this.demoPositionHistory = []; // Reset history after breaking out
                    return;
                }
            }

            const dirs = [
                { x: 0, y: -1 }, // Up
                { x: 0, y: 1 },  // Down
                { x: -1, y: 0 }, // Left
                { x: 1, y: 0 }   // Right
            ];

            // Use dynamite strategically
            if (this.dynamiteCount > 0) {
                // Check if surrounded by rocks or stuck
                let rocksNearby = 0;
                let blockedDirs = 0;
                for (const dir of dirs) {
                    const nx = this.player.x + dir.x;
                    const ny = this.player.y + dir.y;
                    if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
                        const tile = this.grid[ny][nx];
                        if (tile === TYPES.ROCK) rocksNearby++;
                        if (tile === TYPES.WALL || tile === TYPES.ROCK || tile === TYPES.STEEL) {
                            blockedDirs++;
                        }
                    }
                }

                // Place dynamite if mostly blocked or oscillating with rocks nearby
                if ((blockedDirs >= 3 || (isOscillating && rocksNearby >= 1)) && Math.random() < 0.5) {
                    this.placeDynamite();
                    // Move away from bomb!
                    let validMoves = [];
                    for (let dir of dirs) {
                        if (this.isDemoMoveSafe(this.player.x + dir.x, this.player.y + dir.y)) {
                            validMoves.push(dir);
                        }
                    }
                    if (validMoves.length > 0) {
                        const move = validMoves[Math.floor(Math.random() * validMoves.length)];
                        this.player.nextDirX = move.x;
                        this.player.nextDirY = move.y;
                        this.demoLastDir = move;
                    }
                    return;
                }
            }

            // Check for nearby enemies - if too close, flee!
            let nearestEnemy = null;
            let nearestEnemyDist = Infinity;
            for (const enemy of this.enemies) {
                const dist = Math.abs(enemy.x - this.player.x) + Math.abs(enemy.y - this.player.y);
                if (dist < nearestEnemyDist) {
                    nearestEnemyDist = dist;
                    nearestEnemy = enemy;
                }
            }

            // If enemy is very close (within 3 tiles), flee!
            if (nearestEnemy && nearestEnemyDist <= 3) {
                let bestMove = null;
                let bestDist = nearestEnemyDist;

                for (let dir of dirs) {
                    const nextX = this.player.x + dir.x;
                    const nextY = this.player.y + dir.y;
                    if (this.isDemoMoveSafe(nextX, nextY)) {
                        const newDist = Math.abs(nearestEnemy.x - nextX) + Math.abs(nearestEnemy.y - nextY);
                        if (newDist > bestDist) {
                            bestDist = newDist;
                            bestMove = dir;
                        }
                    }
                }

                if (bestMove) {
                    this.player.nextDirX = bestMove.x;
                    this.player.nextDirY = bestMove.y;
                    this.demoLastDir = bestMove;
                    return;
                }
            }

            // Find nearest diamond using BFS
            const path = this.findPathToNearest(TYPES.DIAMOND);

            if (path && path.length > 0) {
                const nextStep = path[0];
                const dir = {
                    x: nextStep.x - this.player.x,
                    y: nextStep.y - this.player.y
                };
                this.player.nextDirX = dir.x;
                this.player.nextDirY = dir.y;
                this.demoLastDir = dir;
                return;
            }

            // No diamond found - try exit if we have enough diamonds
            if (this.diamondsCollected >= this.diamondsNeeded) {
                const exitPath = this.findPathToNearest(TYPES.EXIT);
                if (exitPath && exitPath.length > 0) {
                    const nextStep = exitPath[0];
                    const dir = {
                        x: nextStep.x - this.player.x,
                        y: nextStep.y - this.player.y
                    };
                    this.player.nextDirX = dir.x;
                    this.player.nextDirY = dir.y;
                    this.demoLastDir = dir;
                    return;
                }
            }

            // Fallback: Smart random walk (avoid going back)
            let validMoves = [];
            for (let dir of dirs) {
                const nextX = this.player.x + dir.x;
                const nextY = this.player.y + dir.y;
                if (this.isDemoMoveSafe(nextX, nextY)) {
                    // Avoid going back to where we came from (prevent oscillation)
                    if (this.demoLastDir && dir.x === -this.demoLastDir.x && dir.y === -this.demoLastDir.y) {
                        continue; // Skip reverse direction
                    }
                    validMoves.push(dir);
                }
            }

            // If no valid moves except reverse, allow reverse
            if (validMoves.length === 0) {
                for (let dir of dirs) {
                    const nextX = this.player.x + dir.x;
                    const nextY = this.player.y + dir.y;
                    if (this.isDemoMoveSafe(nextX, nextY)) {
                        validMoves.push(dir);
                    }
                }
            }

            if (validMoves.length > 0) {
                const move = validMoves[Math.floor(Math.random() * validMoves.length)];
                this.player.nextDirX = move.x;
                this.player.nextDirY = move.y;
                this.demoLastDir = move;
            }
        }
    }

    isDemoMoveSafe(x, y) {
        if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return false;
        const tile = this.grid[y][x];
        // Safe tiles: empty, dirt, diamond, exit, dynamite pickup
        if (tile === TYPES.WALL || tile === TYPES.ROCK || tile === TYPES.STEEL ||
            tile === TYPES.ENEMY || tile === TYPES.AMOEBA) {
            return false;
        }
        // Check if enemy is on this tile
        for (const enemy of this.enemies) {
            if (enemy.x === x && enemy.y === y) return false;
        }
        return true;
    }

    findPathToNearest(targetType) {
        // BFS to find shortest path to nearest target
        const queue = [{ x: this.player.x, y: this.player.y, path: [] }];
        const visited = new Set();
        visited.add(`${this.player.x},${this.player.y}`);

        const dirs = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
        ];

        while (queue.length > 0) {
            const current = queue.shift();

            for (const dir of dirs) {
                const nx = current.x + dir.x;
                const ny = current.y + dir.y;
                const key = `${nx},${ny}`;

                if (visited.has(key)) continue;
                if (nx < 0 || nx >= GRID_WIDTH || ny < 0 || ny >= GRID_HEIGHT) continue;

                const tile = this.grid[ny][nx];

                // Found target!
                if (tile === targetType) {
                    return [...current.path, { x: nx, y: ny }];
                }

                // Can we walk through this tile?
                if (tile === TYPES.EMPTY || tile === TYPES.DIRT || tile === TYPES.DIAMOND ||
                    tile === TYPES.DYNAMITE_PICKUP || tile === TYPES.EXIT) {
                    // Check for enemies
                    let hasEnemy = false;
                    for (const enemy of this.enemies) {
                        if (enemy.x === nx && enemy.y === ny) {
                            hasEnemy = true;
                            break;
                        }
                    }
                    if (!hasEnemy) {
                        visited.add(key);
                        queue.push({
                            x: nx,
                            y: ny,
                            path: [...current.path, { x: nx, y: ny }]
                        });
                    }
                }
            }
        }

        return null; // No path found
    }

    updateMenuUI() {
        const menuOverlay = document.getElementById('menu-screen');

        if (this.state === STATE.MENU) {
            menuOverlay.classList.remove('hidden');
            document.querySelector('.hud-panel').classList.add('hidden');
            document.getElementById('message-overlay').classList.add('hidden');

            // Start menu music if not already playing
            if (!this.sound.menuMusicInterval) {
                this.sound.startMenuMusic();
            }

            // Update button selection visual
            this.updateMenuSelection();

        } else {
            menuOverlay.classList.add('hidden');
            document.querySelector('.hud-panel').classList.remove('hidden');
        }
    }

    updateMenuSelection() {
        // Remove selection from all buttons
        this.menuButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.classList.remove('selected');
        });

        // Add selection to current button
        const selectedBtn = document.getElementById(this.menuButtons[this.menuSelectedIndex]);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
    }

    updatePauseSelection() {
        // Handle Back to Editor button visibility based on test mode
        const backEditorBtn = document.getElementById('btn-back-editor');
        if (backEditorBtn) {
            if (this.isTesting) {
                backEditorBtn.classList.remove('hidden');
            } else {
                backEditorBtn.classList.add('hidden');
            }
        }

        // Remove selection from all pause buttons
        this.pauseButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.classList.remove('selected');
        });

        // Add selection to current button
        const selectedBtn = document.getElementById(this.pauseButtons[this.pauseSelectedIndex]);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
    }

    updateLoadModalSelection() {
        // Remove selection from all load modal buttons
        this.loadModalButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.classList.remove('selected');
        });

        // Add selection to current button
        const selectedBtn = document.getElementById(this.loadModalButtons[this.loadModalSelectedIndex]);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
    }

    toggleFullscreen() {
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

        // Show rogueDepth in Rogue mode, otherwise currentLevelIndex
        if (this.gameMode === GAME_MODES.ROGUE) {
            document.getElementById('level').innerText = this.rogueDepth;
        } else {
            document.getElementById('level').innerText = this.currentLevelIndex + 1;
        }

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
                        this.pauseSelectedIndex = 0;
                        document.getElementById('pause-overlay').classList.remove('hidden');
                        this.updatePauseSelection();
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
                    if (this.state === STATE.NAME_ENTRY) {
                        this.gamepadActionLocked = true;
                        this.submitHighScore();
                    } else if (this.state === STATE.MENU) {
                        // Menu selection handled in update() - don't lock here
                    } else if (this.state === STATE.GAMEOVER) {
                        if (this.highScorePending) return;
                        this.gamepadActionLocked = true;

                        if (this.isTesting) {
                            this.state = STATE.EDITOR;
                            document.getElementById('editor-overlay').classList.remove('hidden');
                            document.getElementById('message-overlay').classList.add('hidden');
                            this.isTesting = false;
                            return;
                        }

                        document.getElementById('message-overlay').classList.add('hidden');

                        // In Hardcore/Rogue, prevent restart and go to menu
                        if (this.gameMode === GAME_MODES.HARDCORE || this.gameMode === GAME_MODES.ROGUE) {
                            this.state = STATE.MENU;
                            this.sound.stopGameMusic();
                            this.updateMenuUI();
                            return;
                        }

                        // GAMEOVER: restart current level only (keep pack progress)
                        this.restartCurrentLevel();
                    } else if (this.state === STATE.WIN) {
                        if (this.highScorePending) return;
                        this.gamepadActionLocked = true;

                        if (this.isTesting) {
                            this.state = STATE.EDITOR;
                            document.getElementById('editor-overlay').classList.remove('hidden');
                            document.getElementById('message-overlay').classList.add('hidden');
                            this.isTesting = false;
                            return;
                        }

                        if (this.currentLevelIndex >= LEVELS.length) {
                            this.currentLevelIndex = 0;
                        }
                        document.getElementById('message-overlay').classList.add('hidden');
                        // WIN: restart from beginning
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
        } else if (nextTile === TYPES.ENEMY || nextTile === TYPES.AMOEBA) {
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

        // Lucky Charm perk: +50% diamond score
        let diamondScore = 10;
        if (this.gameMode === GAME_MODES.ROGUE && this.roguePerks.includes('luckyCharm')) {
            diamondScore = 15;
        }
        this.score += diamondScore;
        this.diamondsCollected++;

        // Track total diamonds for achievements
        playerStats.totalDiamonds++;
        savePlayerStats();
        checkAchievements(this);

        // Trigger Flash if Exit opens
        if (this.diamondsCollected === this.diamondsNeeded) {
            this.flashTimer = 150; // 150ms white flash
            this.sound.playTone(1200, 'square', 0.2, 0.2); // High pitch alert
            this.vibrate(200, 0.6, 0.8); // Strong haptic feedback for exit opening
        }

        this.spawnParticles(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, '#00ffff', 10);
        this.sound.playCollect();
        this.vibrate(50, 0.3, 0.4); // Haptic feedback for diamond collection
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
                            // Track TNT kills for achievements
                            playerStats.totalEnemiesKilledByTNT++;
                            savePlayerStats();
                            checkAchievements(this);
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
        // Update Magic Wall Timer
        if (this.magicWallActive) {
            this.magicWallTimer -= 120; // Physics update interval
            if (this.magicWallTimer <= 0) {
                this.magicWallActive = false;
                this.magicWallTimer = 0;
            }
        }

        // Amoeba Logic
        this.amoebaTimer++;
        if (this.amoebaTimer >= this.amoebaGrowthRate) {
            this.amoebaTimer = 0;

            let amoebaCells = [];
            let canGrow = false;

            // Find all amoeba cells
            for (let y = 0; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    if (this.grid[y][x] === TYPES.AMOEBA) {
                        amoebaCells.push({ x, y });

                        // Check if this cell can grow
                        const dirs = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
                        for (const d of dirs) {
                            const nx = x + d.x;
                            const ny = y + d.y;
                            if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
                                if (this.grid[ny][nx] === TYPES.EMPTY || this.grid[ny][nx] === TYPES.DIRT || this.grid[ny][nx] === TYPES.ENEMY) {
                                    canGrow = true;
                                }
                            }
                        }
                    }
                }
            }

            // Transformation Logic
            if (amoebaCells.length > this.amoebaMaxSize) {
                // Too big -> Turn to Rocks
                amoebaCells.forEach(cell => {
                    this.grid[cell.y][cell.x] = TYPES.ROCK;
                });
                this.sound.playExplosion();
            } else if (amoebaCells.length > 0 && !canGrow) {
                // Enclosed -> Turn to Diamonds
                amoebaCells.forEach(cell => {
                    this.grid[cell.y][cell.x] = TYPES.DIAMOND;
                });
                this.sound.playWin();
                this.vibrate(250, 0.7, 0.9); // Strong haptic for amoeba diamond transformation
            } else {
                // Grow Randomly
                const growthAttempts = Math.max(1, Math.floor(amoebaCells.length / 20)) + 1;
                let amoebaGrew = false;

                for (let i = 0; i < growthAttempts; i++) {
                    if (amoebaCells.length === 0) break;
                    const idx = Math.floor(Math.random() * amoebaCells.length);
                    const cell = amoebaCells[idx];

                    const dirs = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
                    const validDirs = dirs.filter(d => {
                        const nx = cell.x + d.x;
                        const ny = cell.y + d.y;
                        return nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT &&
                            (this.grid[ny][nx] === TYPES.EMPTY || this.grid[ny][nx] === TYPES.DIRT || this.grid[ny][nx] === TYPES.ENEMY);
                    });

                    if (validDirs.length > 0) {
                        const d = validDirs[Math.floor(Math.random() * validDirs.length)];
                        const targetX = cell.x + d.x;
                        const targetY = cell.y + d.y;

                        // Check for enemy at target and kill it
                        if (this.grid[targetY][targetX] === TYPES.ENEMY) {
                            this.killEnemyAt(targetX, targetY);
                        }

                        this.grid[targetY][targetX] = TYPES.AMOEBA;
                        amoebaGrew = true;
                    }
                }

                if (amoebaGrew) {
                    this.sound.playAmoeba();
                }
            }
        }

        // Process active dynamite falling (bombs fall like rocks)
        for (const bomb of this.bombs) {
            const belowY = bomb.y + 1;
            if (belowY < GRID_HEIGHT) {
                const below = this.grid[belowY][bomb.x];
                // Bomb falls through EMPTY spaces
                if (below === TYPES.EMPTY) {
                    // Clear old position (only if it was DYNAMITE_ACTIVE)
                    if (this.grid[bomb.y][bomb.x] === TYPES.DYNAMITE_ACTIVE) {
                        this.grid[bomb.y][bomb.x] = TYPES.EMPTY;
                    }
                    // Move bomb down
                    bomb.y = belowY;
                    this.grid[bomb.y][bomb.x] = TYPES.DYNAMITE_ACTIVE;
                }
                // Otherwise bomb stays in place (on rock, diamond, wall, etc.)
            }
        }

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
                    const below = this.grid[y + 1][x];

                    // Magic Wall Interaction
                    if (below === TYPES.MAGIC_WALL && this.fallingEntities.has(`${x},${y}`)) {
                        if (!this.magicWallActive) {
                            this.magicWallActive = true;
                            this.magicWallTimer = this.magicWallDuration;
                            this.sound.playTone(440, 'square', 0.1);
                        }

                        // Check if space below magic wall is empty (y+2)
                        if (this.magicWallActive && y + 2 < GRID_HEIGHT && this.grid[y + 2][x] === TYPES.EMPTY) {
                            this.grid[y][x] = TYPES.EMPTY;
                            const newType = (type === TYPES.ROCK) ? TYPES.DIAMOND : TYPES.ROCK;
                            this.grid[y + 2][x] = newType;
                            processed.add(`${x},${y + 2}`);
                            this.fallingEntities.add(`${x},${y + 2}`);
                            this.sound.playTone(newType === TYPES.DIAMOND ? 880 : 220, 'sine', 0.1);
                            continue;
                        }
                    }

                    if (below === TYPES.EMPTY) {
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
                            if (enemy.type === ENEMY_TYPES.BUTTERFLY) {
                                // BUTTERFLY: Spawn 3x3 diamonds - convert ALL destructible tiles
                                for (let dy = -1; dy <= 1; dy++) {
                                    for (let dx = -1; dx <= 1; dx++) {
                                        const nx = enemyX + dx;
                                        const ny = enemyY + dy;

                                        // Skip border walls
                                        if (nx > 0 && nx < GRID_WIDTH - 1 && ny > 0 && ny < GRID_HEIGHT - 1) {
                                            const tile = this.grid[ny][nx];

                                            // Kill player if in explosion radius
                                            if (this.player.x === nx && this.player.y === ny) {
                                                this.die();
                                            }

                                            // Convert all destructible tiles to diamonds (except STEEL and EXIT)
                                            if (tile !== TYPES.STEEL && tile !== TYPES.EXIT && tile !== TYPES.PLAYER) {
                                                // Remove other enemies in the area
                                                if (tile === TYPES.ENEMY) {
                                                    const otherEnemyIndex = this.enemies.findIndex(e => e.x === nx && e.y === ny);
                                                    if (otherEnemyIndex !== -1) {
                                                        this.enemies.splice(otherEnemyIndex, 1);
                                                    }
                                                }
                                                this.grid[ny][nx] = TYPES.DIAMOND;
                                                this.spawnParticles(nx * TILE_SIZE + TILE_SIZE / 2, ny * TILE_SIZE + TILE_SIZE / 2, '#00ffff', 5);
                                            }
                                        }
                                    }
                                }
                            } else {
                                // BASIC, SEEKER, PATROLLER: Explode 3x3 area (destroy tiles)
                                for (let dy = -1; dy <= 1; dy++) {
                                    for (let dx = -1; dx <= 1; dx++) {
                                        const nx = enemyX + dx;
                                        const ny = enemyY + dy;

                                        // Skip border walls
                                        if (nx > 0 && nx < GRID_WIDTH - 1 && ny > 0 && ny < GRID_HEIGHT - 1) {
                                            const tile = this.grid[ny][nx];

                                            // Kill player if in explosion radius
                                            if (this.player.x === nx && this.player.y === ny) {
                                                this.die();
                                            }

                                            // Destroy most things (like dynamite explosion)
                                            if (tile === TYPES.DIRT || tile === TYPES.ROCK || tile === TYPES.DIAMOND || tile === TYPES.WALL) {
                                                this.grid[ny][nx] = TYPES.EMPTY;
                                                this.spawnParticles(nx * TILE_SIZE + TILE_SIZE / 2, ny * TILE_SIZE + TILE_SIZE / 2, '#ff4400', 10);
                                            }

                                            // Kill other enemies in the area
                                            if (tile === TYPES.ENEMY) {
                                                const otherEnemyIndex = this.enemies.findIndex(e => e.x === nx && e.y === ny);
                                                if (otherEnemyIndex !== -1) {
                                                    this.enemies.splice(otherEnemyIndex, 1);
                                                    this.grid[ny][nx] = TYPES.EMPTY;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // Trigger Shake
                            this.shakeTimer = 200;
                            this.sound.playExplosion();

                            // Haptic feedback for enemy kill
                            if (enemy.type === ENEMY_TYPES.BASIC) {
                                this.vibrate(150, 0.6, 0.8); // Stronger feedback for diamond creation
                            } else {
                                this.vibrate(100, 0.4, 0.6); // Standard feedback for regular explosion
                            }
                        }
                    } else if (this.grid[y + 1][x] === TYPES.WALL || this.grid[y + 1][x] === TYPES.ROCK || this.grid[y + 1][x] === TYPES.DIAMOND || this.grid[y + 1][x] === TYPES.STEEL || this.grid[y + 1][x] === TYPES.MAGIC_WALL) {
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

    killEnemyAt(x, y, killSource = 'rock') {
        const enemyIndex = this.enemies.findIndex(e => e.x === x && e.y === y);
        if (enemyIndex === -1) return;

        const enemy = this.enemies[enemyIndex];
        this.enemies.splice(enemyIndex, 1);
        this.score += 50;
        this.spawnParticles(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, '#ff0000', 20);

        // Track enemy kills for achievements
        if (killSource === 'rock') {
            playerStats.totalEnemiesKilledByRock++;
        } else if (killSource === 'tnt') {
            playerStats.totalEnemiesKilledByTNT++;
        }
        savePlayerStats();
        checkAchievements(this);

        this.grid[y][x] = TYPES.EMPTY;

        if (enemy.type === ENEMY_TYPES.BASIC) {
            // Sonic Boom perk: larger explosion radius (5x5)
            let explosionRadius = 1;
            if (this.gameMode === GAME_MODES.ROGUE && this.roguePerks.includes('sonicBoom')) {
                explosionRadius = 2;
            }

            for (let dy = -explosionRadius; dy <= explosionRadius; dy++) {
                for (let dx = -explosionRadius; dx <= explosionRadius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx > 0 && nx < GRID_WIDTH - 1 && ny > 0 && ny < GRID_HEIGHT - 1) {
                        const tile = this.grid[ny][nx];

                        // Kill player if in explosion radius
                        if (this.player.x === nx && this.player.y === ny) {
                            this.die();
                            return; // Player died, stop processing this explosion
                        }

                        // Convert all destructible tiles to diamonds (except STEEL and EXIT)
                        if (tile !== TYPES.STEEL && tile !== TYPES.EXIT) {
                            // Remove other enemies in the area
                            if (tile === TYPES.ENEMY) {
                                const otherEnemyIndex = this.enemies.findIndex(e => e.x === nx && e.y === ny);
                                if (otherEnemyIndex !== -1) {
                                    this.enemies.splice(otherEnemyIndex, 1);
                                }
                            }
                            this.grid[ny][nx] = TYPES.DIAMOND;
                            this.spawnParticles(nx * TILE_SIZE + TILE_SIZE / 2, ny * TILE_SIZE + TILE_SIZE / 2, '#00ffff', 5);
                        }
                    }
                }
            }
        } else {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx > 0 && nx < GRID_WIDTH - 1 && ny > 0 && ny < GRID_HEIGHT - 1) {
                        const tile = this.grid[ny][nx];

                        if (tile === TYPES.DIRT || tile === TYPES.ROCK || tile === TYPES.DIAMOND || tile === TYPES.WALL) {
                            this.grid[ny][nx] = TYPES.EMPTY;
                            this.spawnParticles(nx * TILE_SIZE + TILE_SIZE / 2, ny * TILE_SIZE + TILE_SIZE / 2, '#ff4400', 10);
                        }
                    }
                }
            }
        }

        this.shakeTimer = 200;
        this.sound.playExplosion();

        // Haptic feedback for enemy kill
        if (enemy.type === ENEMY_TYPES.BASIC) {
            this.vibrate(150, 0.6, 0.8); // Stronger feedback for diamond creation
        } else {
            this.vibrate(100, 0.4, 0.6); // Standard feedback for regular explosion
        }
    }

    die() {
        if (this.state === STATE.GAMEOVER) return;

        // Hard Hat perk - absorb one hit per level
        if (this.gameMode === GAME_MODES.ROGUE && this.hasShield) {
            this.hasShield = false;
            this.shakeTimer = 200;
            this.flashTimer = 100;
            this.spawnParticles(this.player.x * TILE_SIZE + TILE_SIZE / 2, this.player.y * TILE_SIZE + TILE_SIZE / 2, '#00ffff', 30);
            this.sound.playTone(800, 'square', 0.15, 0.5); // Shield break sound
            return; // Survive the hit
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
        this.vibrate(500, 1.0, 1.0);

        if (this.isTesting) {
            this.showMessage(t("msg.testFailed"), t("msg.returnEditor"));
            setTimeout(() => {
                this.state = STATE.EDITOR;
                document.getElementById('editor-overlay').classList.remove('hidden');
                document.getElementById('message-overlay').classList.add('hidden');
                this.isTesting = false;
            }, 2000);
            return;
        }

        if (this.gameMode === GAME_MODES.HARDCORE) {
            this.showMessage(t("msg.gameOver"), t("msg.hardcoreReturn"));
            this.deathTimeout = setTimeout(() => {
                this.state = STATE.MENU;
                this.sound.stopGameMusic();
                document.getElementById('message-overlay').classList.add('hidden');
                this.updateMenuUI();
            }, 3000);
            return;
        }

        if (this.gameMode === GAME_MODES.ROGUE) {
            this.showMessage(t("msg.gameOver"), t("msg.rogueDepth", { depth: this.rogueDepth, score: this.score }));
            this.deathTimeout = setTimeout(() => {
                this.state = STATE.MENU;
                this.sound.stopGameMusic();
                document.getElementById('message-overlay').classList.add('hidden');
                this.updateMenuUI();
            }, 3000);
            return;
        }

        this.showMessage(t("msg.gameOver"), t("msg.pressR"));
    }

    winGame() {
        if (this.state === STATE.TRANSITION) return;

        if (this.isTesting) {
            this.showMessage(t("msg.testSuccess"), t("msg.returnEditor"));
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

        // Track level completion for achievements
        playerStats.levelsCompleted++;

        // Check for perfect level (all diamonds collected)
        let totalDiamondsOnMap = 0;
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (this.grid[y][x] === TYPES.DIAMOND) totalDiamondsOnMap++;
            }
        }
        if (totalDiamondsOnMap === 0 && this.diamondsCollected >= this.diamondsNeeded) {
            unlockAchievement('perfectLevel');
        }

        // Check for speedrunner (level completed in under 30 seconds)
        const levelTime = this.initialTime - this.timeLeft;
        if (levelTime <= 30) {
            unlockAchievement('speedrunner');
        }

        // Track mode-specific stats
        if (this.gameMode === GAME_MODES.ENDLESS) {
            if (this.currentLevelIndex + 1 > playerStats.maxEndlessLevel) {
                playerStats.maxEndlessLevel = this.currentLevelIndex + 1;
            }
        } else if (this.gameMode === GAME_MODES.HARDCORE) {
            if (this.currentLevelIndex + 1 > playerStats.maxHardcoreLevel) {
                playerStats.maxHardcoreLevel = this.currentLevelIndex + 1;
            }
        } else if (this.gameMode === GAME_MODES.ROGUE) {
            if (this.rogueDepth > playerStats.maxRogueDepth) {
                playerStats.maxRogueDepth = this.rogueDepth;
            }
        } else if (this.gameMode === GAME_MODES.CAMPAIGN && this.currentLevelIndex >= LEVELS.length - 1) {
            playerStats.campaignCompleted = true;
        }

        savePlayerStats();
        checkAchievements(this);

        // Handle Rogue Miner Mode - show perk selection
        if (this.gameMode === GAME_MODES.ROGUE) {
            this.sound.playWin();
            this.showPerkSelection();
            return;
        }

        // Handle Custom Level Pack progression
        if (this.gameMode === GAME_MODES.CUSTOM && this.customLevelPack) {
            this.customLevelIndex++;

            if (this.customLevelIndex < this.customLevelPack.length) {
                // More levels in the pack
                this.customLevelData = this.prepareCustomLevel(this.customLevelPack[this.customLevelIndex]);
                const nextTitle = this.customLevelData.title || `Level ${this.customLevelIndex + 1}`;
                const subtitle = this.customLevelData.description || `${this.customLevelIndex + 1} of ${this.customLevelPack.length}`;
                this.showMessage(t("msg.levelComplete"), t("msg.next", { title: nextTitle }));
                this.sound.playWin();
                setTimeout(() => {
                    // Show level intro if has description
                    if (this.customLevelData.description) {
                        this.showMessage(this.customLevelData.title || t("msg.levelStart"), this.customLevelData.description);
                        setTimeout(() => {
                            document.getElementById('message-overlay').classList.add('hidden');
                            this.initLevel();
                            this.startGame();
                        }, 2000);
                    } else {
                        this.initLevel();
                        this.startGame();
                    }
                }, 2000);
            } else {
                // Completed all custom levels
                this.state = STATE.WIN;
                this.sound.playWin();
                this.showMessage(t("msg.packComplete"), t("msg.finalScore", { score: this.score }));
                setTimeout(() => {
                    this.state = STATE.MENU;
                    this.customLevelPack = null;
                    this.customLevelData = null;
                    this.updateMenuUI();
                }, 5000);
            }
            return;
        }

        this.currentLevelIndex++;

        // For Endless and Hardcore modes, always continue to next procedural level
        // Only Campaign mode should end when LEVELS.length is reached
        const isEndlessModeActive = (this.gameMode === GAME_MODES.ENDLESS || this.gameMode === GAME_MODES.HARDCORE);

        if (isEndlessModeActive || this.currentLevelIndex < LEVELS.length) {
            const levelNum = this.currentLevelIndex + 1;
            const message = isEndlessModeActive ? t("msg.levelNum", { n: levelNum }) : t("msg.levelComplete");
            this.showMessage(message, t("msg.getReady"));
            this.sound.playWin();
            setTimeout(() => {
                this.initLevel();
                this.startGame();
            }, 2000);
        } else {
            this.state = STATE.WIN;
            this.sound.playWin();

            this.showMessage(t("msg.victory"), t("msg.finalScore", { score: this.score }));
            setTimeout(() => {
                this.state = STATE.MENU;
                this.updateMenuUI();
            }, 5000);
        }
    }

    // Rogue Miner Perk Selection Methods
    showPerkSelection() {
        // Pick 3 random perks (excluding already owned)
        const availablePerks = PERKS.filter(p => !this.roguePerks.includes(p.id));

        // Shuffle and pick 3
        const shuffled = availablePerks.sort(() => Math.random() - 0.5);
        this.perkChoices = shuffled.slice(0, 3);
        this.perkSelectedIndex = 0;

        // If less than 3 available, just use what we have
        if (this.perkChoices.length === 0) {
            // All perks collected, skip to next level
            this.advanceRogueLevel();
            return;
        }

        // Update UI
        const overlay = document.getElementById('perk-select-overlay');
        const depthInfo = document.getElementById('perk-depth-info');
        depthInfo.innerText = t('perk.depth', { n: this.rogueDepth });

        // Update each card
        for (let i = 0; i < 3; i++) {
            const card = document.getElementById(`perk-card-${i}`);
            if (i < this.perkChoices.length) {
                const perk = this.perkChoices[i];
                card.querySelector('.perk-icon').innerText = perk.icon;
                card.querySelector('.perk-name').innerText = t(`perk.${perk.id}.name`);
                card.querySelector('.perk-desc').innerText = t(`perk.${perk.id}.desc`);
                card.classList.remove('hidden');
                card.onclick = () => this.selectPerk(i);
                card.onmouseenter = () => {
                    this.perkSelectedIndex = i;
                    this.updatePerkSelection();
                    this.sound.playMenuHover();
                };
            } else {
                card.classList.add('hidden');
            }
        }

        this.state = STATE.PERK_SELECT;
        overlay.classList.remove('hidden');
        this.updatePerkSelection();
    }

    selectPerk(index) {
        if (index >= this.perkChoices.length) return;

        const perk = this.perkChoices[index];
        this.roguePerks.push(perk.id);

        this.sound.playMenuConfirm();

        // Hide overlay
        document.getElementById('perk-select-overlay').classList.add('hidden');

        // Advance to next level
        this.advanceRogueLevel();
    }

    advanceRogueLevel() {
        this.rogueDepth++;
        this.initLevel();
        this.state = STATE.PLAYING;
        this.sound.startGameMusic(this.currentMusicThemeIndex);
        document.getElementById('message-overlay').classList.add('hidden');
    }

    updatePerkSelection() {
        const cards = document.querySelectorAll('.perk-card');
        cards.forEach((card, index) => {
            card.classList.toggle('selected', index === this.perkSelectedIndex);
        });
    }

    showMessage(title, subtitle) {
        const overlay = document.getElementById('message-overlay');
        const titleEl = document.getElementById('message-title');
        const subEl = document.getElementById('message-subtitle');

        titleEl.innerText = title;
        subEl.innerText = subtitle;

        // Add keyboard-hint class if subtitle contains keyboard-specific instructions
        if (subtitle.includes('Press ')) {
            subEl.classList.add('keyboard-hint');
        } else {
            subEl.classList.remove('keyboard-hint');
        }

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

    // Initialize Settings Modal
    initSettingsModal();
};

// Settings Modal Controller
function initSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    const settingsBtn = document.getElementById('btn-settings-float');
    const closeBtn = document.getElementById('btn-settings-close');
    const fullscreenBtn = document.getElementById('btn-settings-fullscreen');

    const volumeMaster = document.getElementById('volume-master');
    const volumeMusic = document.getElementById('volume-music');
    const volumeSfx = document.getElementById('volume-sfx');
    const volumeMasterValue = document.getElementById('volume-master-value');
    const volumeMusicValue = document.getElementById('volume-music-value');
    const volumeSfxValue = document.getElementById('volume-sfx-value');

    const colorblindSelect = document.getElementById('colorblind-mode');
    const languageSelect = document.getElementById('language-select');
    const tutorialSelect = document.getElementById('tutorial-mode');

    // Load current values
    function loadSettings() {
        if (window.game && window.game.sound) {
            volumeMaster.value = Math.round(window.game.sound.masterVolume * 100);
            volumeMusic.value = Math.round(window.game.sound.musicVolume * 100);
            volumeSfx.value = Math.round(window.game.sound.sfxVolume * 100);
        }
        updateVolumeDisplays();

        colorblindSelect.value = gameSettings.colorblindMode;
        tutorialSelect.value = gameSettings.tutorialEnabled ? 'on' : 'off';

        // Set current language
        if (typeof getCurrentLanguage === 'function') {
            languageSelect.value = getCurrentLanguage();
        }
    }

    function updateVolumeDisplays() {
        volumeMasterValue.textContent = volumeMaster.value + '%';
        volumeMusicValue.textContent = volumeMusic.value + '%';
        volumeSfxValue.textContent = volumeSfx.value + '%';
    }

    function openSettings() {
        loadSettings();
        settingsModal.classList.remove('hidden');
        // Pause menu music while in settings (optional)
    }

    function closeSettings() {
        settingsModal.classList.add('hidden');
    }

    // Event Listeners
    settingsBtn.addEventListener('click', () => {
        if (window.game && window.game.sound) {
            window.game.sound.unlock();
        }
        openSettings();
    });

    closeBtn.addEventListener('click', closeSettings);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !settingsModal.classList.contains('hidden')) {
            closeSettings();
        }
    });

    // Volume sliders
    volumeMaster.addEventListener('input', () => {
        if (window.game && window.game.sound) {
            window.game.sound.setMasterVolume(volumeMaster.value / 100);
        }
        updateVolumeDisplays();
    });

    volumeMusic.addEventListener('input', () => {
        if (window.game && window.game.sound) {
            window.game.sound.setMusicVolume(volumeMusic.value / 100);
        }
        updateVolumeDisplays();
    });

    volumeSfx.addEventListener('input', () => {
        if (window.game && window.game.sound) {
            window.game.sound.setSfxVolume(volumeSfx.value / 100);
            // Play test sound
            window.game.sound.playCollect();
        }
        updateVolumeDisplays();
    });

    // Colorblind mode
    colorblindSelect.addEventListener('change', () => {
        gameSettings.colorblindMode = colorblindSelect.value;
        localStorage.setItem('colorblindMode', colorblindSelect.value);
        // Note: Theme will apply on next level load
    });

    // Tutorial mode toggle
    tutorialSelect.addEventListener('change', () => {
        const enabled = tutorialSelect.value === 'on';
        gameSettings.tutorialEnabled = enabled;
        localStorage.setItem('tutorialEnabled', enabled ? 'true' : 'false');
        // Reset tutorial completed status when turning tutorial back on
        if (enabled) {
            gameSettings.tutorialCompleted = false;
            localStorage.setItem('tutorialCompleted', 'false');
        }
    });

    // Language selection
    languageSelect.addEventListener('change', () => {
        const newLang = languageSelect.value;
        if (typeof setLanguage === 'function') {
            setLanguage(newLang);
        }
        localStorage.setItem('gameLanguage', newLang);
    });

    // Fullscreen toggle
    fullscreenBtn.addEventListener('click', () => {
        if (window.game) {
            window.game.toggleFullscreen();
        }
    });
}
