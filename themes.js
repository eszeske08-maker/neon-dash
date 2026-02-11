/**
 * Neon Dash - Themes
 */

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
