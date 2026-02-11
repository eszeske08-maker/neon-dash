/**
 * Neon Dash - Settings
 */

// Game settings (persisted to localStorage)
const gameSettings = {
    colorblindMode: localStorage.getItem('colorblindMode') || 'off',
    language: localStorage.getItem('gameLanguage') || 'auto',
    tutorialEnabled: localStorage.getItem('tutorialEnabled') !== 'false',
    tutorialCompleted: localStorage.getItem('tutorialCompleted') === 'true'
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
