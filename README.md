# 💎 Neon Dash

A modern, neon-styled **Boulder Dash** clone with retro vibes and cutting-edge features. Built with pure vanilla JavaScript, HTML5 Canvas, and Web Audio API.

🎮 **[Play Now](https://eszeske08-maker.github.io/neon-dash/)** — No installation required!

## ✨ Features

### 🎮 Game Modes
- **Campaign** — Play through handcrafted levels with increasing difficulty
- **Endless** — Procedurally generated levels that go on forever. How far can you go?
- **Hardcore** — One life only! No restarts. The ultimate challenge
- **Rogue Miner** — Roguelike mode with upgrades between levels. Collect perks to become stronger!
- **Load Level** — Load custom level packs from URL or local JSON files

### ⛏️ Core Gameplay
- **Classic Boulder Dash mechanics** — Dig dirt, collect diamonds, avoid falling rocks
- **13 tile types** — Empty, Dirt, Wall, Rock, Diamond, Player, Enemy, Exit, TNT Pickup, TNT Active, Steel Wall, Magic Wall, Amoeba
- **4 enemy types** — Basic, Seeker, Patroller, and Butterfly (each with unique AI)
- **Dynamic physics** — Realistic rock and diamond gravity system
- **Explosives** — TNT pickups for strategic rock destruction
- **High score system** — Persistent leaderboard with localStorage
- **Demo mode** — Attract screen when idle on the main menu

### 🧬 Rogue Miner Perks
Choose upgrades between levels in Rogue Miner mode:

| Perk | Effect |
|------|--------|
| ⛏️ Drill Bit+ | Digging speed +20% |
| 🏃 Runner | Movement speed +10% |
| ⛑️ Hard Hat | Blocks first damage per level |
| 💣 Dynamite Pouch | Start every level with +1 TNT |
| 🍀 Lucky Charm | Diamonds give +50% more score |
| 📡 Mineral Scanner | Reveals map briefly at level start |
| 💥 Sonic Boom | Enemy kills destroy adjacent blocks |
| 🧲 Magnet | Diamonds within 2 tiles fly to you |
| ⏰ Time Warp | Level timer +30 seconds |

### 🏆 Achievements
11 unlockable achievements across 4 categories: Progress, Collection, Combat, and Challenge. Tracked persistently via localStorage.

### 🛠️ Level Editor
- **Full-featured editor** — Create and test custom levels instantly
- **Save/Load system** — Persist custom levels to localStorage
- **Export/Import** — Copy JSON to clipboard or download as file
- **Undo/Redo** — Full edit history support
- **13 tile types** — Including Steel Wall, Magic Wall and Amoeba
- **4 enemy AI types** — Basic, Seeker, Patroller, Butterfly
- **Real-time testing** — Press `T` to instantly playtest your level
- **Grid overlay** — Toggle grid for precise placement
- **Gamepad support** — Full controller support in the editor

### 🌐 Internationalization
Automatic language detection with 8 supported languages:
🇬🇧 English · 🇭🇺 Magyar · 🇩🇪 Deutsch · 🇪🇸 Español · 🇫🇷 Français · 🇯🇵 日本語 · 🇨🇳 中文 · 🇰🇷 한국어

### 📱 Mobile Support
- **Touch controls** — Virtual D-pad and action buttons
- **Haptic feedback** — Vibration patterns for game events
- **Responsive design** — Adapts to any screen size
- **Touch-optimized UI** — Large, accessible buttons for mobile play

### 🎨 Visual & Audio
- **8 visual themes** — Cyberpunk, Synthwave, Matrix, Inferno, Ice, Gold, Toxic, Vaporwave
- **3 colorblind modes** — Deuteranopia, Tritanopia, High Contrast
- **Smooth animations** — Particle effects for explosions and collections
- **Retro pixel-perfect** rendering with high-DPI support
- **Synthesized audio** — No files needed. All sounds generated in-browser via Web Audio API
- **Separate volume controls** — Master, Music, and SFX sliders

### ♿ Accessibility
- **Colorblind themes** — Optimized palettes for different color vision types
- **High contrast mode** — Maximum visibility for all tile types
- **Settings modal** — Centralized audio, display, and accessibility options
- **Tutorial hints** — Optional in-game guidance for new players

## 🕹️ Controls

### Keyboard
| Key | Action |
|-----|--------|
| **Arrow Keys** / **WASD** | Move player |
| **Space** | Place dynamite |
| **Escape** | Pause/Resume |
| **R** | Restart level (double-tap to confirm) |
| **M** | Toggle sound |
| **F** | Fullscreen toggle |
| **F3** | FPS counter |
| **L** | Open Level Editor |

### Gamepad Support
- **D-Pad / Left Stick** — Movement
- **Button A / Cross** — Start game / Confirm
- **Button B / Circle** — Place dynamite
- **Start Button** — Pause/Resume

### Mobile Touch
- **Virtual D-Pad** — Movement control
- **TNT Button** — Place dynamite
- **Pause Button** — Pause/Resume game

> 📖 For detailed controls (including Level Editor keyboard, gamepad, and mobile controls), see [CONTROLS.md](CONTROLS.md).

## 🚀 Quick Start

1. **Play online** — Visit **[eszeske08-maker.github.io/neon-dash](https://eszeske08-maker.github.io/neon-dash/)**

2. **Or clone and run locally**
   ```bash
   git clone https://github.com/eszeske08-maker/neon-dash.git
   cd neon-dash
   ```
   Simply open `index.html` in a modern browser, or serve with a local server:
   ```bash
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

3. **Play!**
   - Select a game mode from the main menu
   - Collect all diamonds to unlock the exit
   - Reach the exit before time runs out

## 🏗️ Tech Stack

- **HTML5 Canvas** — Rendering engine with high-DPI scaling
- **Vanilla JavaScript** — No frameworks, pure ES6+
- **Web Audio API** — Real-time sound synthesis (music + SFX)
- **localStorage** — High scores, achievements, settings, and level persistence
- **Gamepad API** — Controller support
- **Vibration API** — Mobile haptic feedback
- **Service Worker** — Offline play & PWA support
- **Web App Manifest** — Installable as a Progressive Web App
- **CSS3** — Neon-styled UI with animations

## 📂 Project Structure

```
neon-dash/
├── index.html          # Main HTML structure & UI
├── game.js             # Core game engine & rendering
├── constants.js        # Tile types, game modes, perks, config
├── enemy.js            # Enemy AI (Basic, Seeker, Patroller, Butterfly)
├── levelEditor.js      # Level editor implementation
├── levels.js           # Built-in level definitions & generators
├── sound.js            # Web Audio API sound synthesis
├── themes.js           # 8 visual themes + 3 colorblind palettes
├── achievements.js     # Achievement system & tracking
├── highscores.js       # High score management
├── settings.js         # Settings modal controller
├── i18n.js             # Internationalization (8 languages)
├── mobile.js           # Touch controls & haptic feedback
├── particle.js         # Particle effect system
├── style.css           # Main stylesheet (neon theme)
├── mobile.css          # Mobile-specific styles
├── sw.js               # Service Worker (offline/PWA)
├── manifest.json       # PWA manifest
├── CONTROLS.md         # Detailed controls documentation (HU/EN)
├── levels/             # Level pack JSON files
│   ├── BD1_pack.json
│   ├── labirintus_pack.json
│   └── ...             # Additional level packs
├── favicon.svg         # Vector favicon
├── icon-192.png        # PWA icon (192×192)
├── icon-512.png        # PWA icon (512×512)
└── apple-touch-icon.png # iOS icon
```

## 🎯 Game Mechanics

### Tile Types
| Tile | Description |
|------|-------------|
| **Empty** | Clear space |
| **Dirt** | Diggable terrain (10 points) |
| **Wall** | Indestructible barrier |
| **Rock** | Falls when unsupported, deadly when falling. Rolls off other rocks |
| **Diamond** | Collectible gem (100 points). Collect enough to unlock the exit |
| **Player** | Your character |
| **Enemy** | 4 types with different AI behaviors |
| **Exit** | Level goal (unlocks when enough diamonds collected) |
| **TNT Pickup** | Grants explosive charges |
| **Steel Wall** | Reinforced barrier — cannot be destroyed even by explosions |
| **Magic Wall** | Transforms rocks → diamonds and diamonds → rocks when they fall through |
| **Amoeba** | Living organism that grows over time. Turns to rocks if too large, diamonds if trapped |

### Enemy AI
1. **Basic** — Random wandering, unpredictable
2. **Seeker** — Actively pursues the player
3. **Patroller** — Follows walls clockwise
4. **Butterfly** — Follows walls counter-clockwise. Explodes into diamonds when crushed by rocks!

### Scoring
| Action | Points |
|--------|--------|
| Digging Dirt | 10 |
| Collecting Diamond | 100 |
| Time Bonus | Remaining seconds × 10 |
| Level Complete | 1000 |

## 🌐 Browser Compatibility

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✅ | ✅ |
| Firefox | ✅ | ✅ |
| Safari | ✅ | ✅ |
| Edge | ✅ | ✅ |

**Requirements:**
- Modern browser with ES6+ support
- HTML5 Canvas support
- Web Audio API (for sound)

## 🐛 Known Issues

- Gamepad API: Only one browser can access a controller at a time on Windows
- Haptic feedback: Requires HTTPS or localhost on some mobile browsers
- Safari: May need user interaction before audio plays (tap to start)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Share custom levels

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
