/**
 * Neon Dash - Achievements System
 */

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

// Helper to safely load stats from localStorage
function loadStat(key, defaultVal = 0) {
    try {
        const val = localStorage.getItem(key);
        if (val === null) return defaultVal;
        if (typeof defaultVal === 'boolean') return val === 'true';
        return parseInt(val) || defaultVal;
    } catch (e) {
        console.error(`Error loading stat ${key}:`, e);
        return defaultVal;
    }
}

// Player stats (persisted to localStorage)
const playerStats = {
    totalDiamonds: loadStat('stats_totalDiamonds'),
    totalEnemiesKilledByRock: loadStat('stats_enemiesKilledByRock'),
    totalEnemiesKilledByTNT: loadStat('stats_enemiesKilledByTNT'),
    levelsCompleted: loadStat('stats_levelsCompleted'),
    campaignCompleted: loadStat('stats_campaignCompleted', false),
    maxEndlessLevel: loadStat('stats_maxEndlessLevel'),
    maxRogueDepth: loadStat('stats_maxRogueDepth'),
    maxHardcoreLevel: loadStat('stats_maxHardcoreLevel')
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

// Achievement unlock conditions mapping
const achievementConditions = [
    { id: 'firstSteps', condition: () => playerStats.levelsCompleted >= 1 },
    { id: 'minerComplete', condition: () => playerStats.campaignCompleted },
    { id: 'endlessRunner', condition: () => playerStats.maxEndlessLevel >= 10 },
    { id: 'deepDigger', condition: () => playerStats.maxRogueDepth >= 20 },
    { id: 'gemCollector', condition: () => playerStats.totalDiamonds >= 100 },
    { id: 'diamondHoarder', condition: () => playerStats.totalDiamonds >= 1000 },
    { id: 'crusher', condition: () => playerStats.totalEnemiesKilledByRock >= 1 },
    { id: 'demolitionExpert', condition: () => playerStats.totalEnemiesKilledByTNT >= 10 },
    { id: 'survivor', condition: () => playerStats.maxHardcoreLevel >= 5 }
];

// Check and unlock achievements based on current stats
function checkAchievements() {
    achievementConditions.forEach(({ id, condition }) => {
        if (condition()) unlockAchievement(id);
    });
}

// Save stats to localStorage
function savePlayerStats() {
    try {
        localStorage.setItem('stats_totalDiamonds', playerStats.totalDiamonds);
        localStorage.setItem('stats_enemiesKilledByRock', playerStats.totalEnemiesKilledByRock);
        localStorage.setItem('stats_enemiesKilledByTNT', playerStats.totalEnemiesKilledByTNT);
        localStorage.setItem('stats_levelsCompleted', playerStats.levelsCompleted);
        localStorage.setItem('stats_campaignCompleted', playerStats.campaignCompleted);
        localStorage.setItem('stats_maxEndlessLevel', playerStats.maxEndlessLevel);
        localStorage.setItem('stats_maxRogueDepth', playerStats.maxRogueDepth);
        localStorage.setItem('stats_maxHardcoreLevel', playerStats.maxHardcoreLevel);
    } catch (e) {
        console.error('Error saving player stats:', e);
    }
}
