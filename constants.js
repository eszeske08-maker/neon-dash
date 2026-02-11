/**
 * Neon Dash - Constants & Types
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
