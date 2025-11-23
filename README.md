# 💎 Neon Dash
A modern, neon-styled [rocks-and-diamonds type game](https://en.wikipedia.org/wiki/Category:Rocks-and-diamonds_games) (like ***Boulder Dash, Supaplex, etc.***) clone with retro vibes and cutting-edge features. Built with pure vanilla JavaScript, HTML5 Canvas, and Web Audio API.

> [!NOTE]
> Neon Dash was **entirely vibe-coded** using AI tools - **without any manual human code editing**. All assets and logic were generated through natural language prompts, using a mix of advanced generative models and experimental IDE technology:
>- **Google Gemini 3** - creative and logic generation, primary UI design.
>- **Claude Sonnet (Thinking)** - design reasoning and game structure. Also used for unstuck the agent from a seemingly infinite debug reasoning loop.  
>- **Google Antigravity IDE** - interactive code generation and real-time validation environment  
>
> The project serves as a **technical experiment** in hands-free coding: building a playable HTML5 game purely through conversational instructions.

## ✨ Features
### 🎮 Core Gameplay
- **Classic rocks-and-diamonds mechanics** - Dig dirt, collect diamonds, avoid falling rocks
- **Multiple enemy types** - Basic, Seeker (tracks player), and Patroller enemies
- **Dynamic physics** - Realistic rock and diamond gravity system
- **Explosives** - TNT pickups for strategic rock destruction
- **Progressive difficulty** - 3 built-in levels with increasing challenges
- **High score system** - Persistent leaderboard with localStorage
- **Sound effects** - Retro-style synthesized audio using Web Audio API
### 🛠️ Level Editor
- **Full-featured editor** - Create and test custom levels instantly
- **Save/Load system** - Persist custom levels to localStorage
- **Export/Import** - Share levels via JSON (DevTools Console)
- **Multiple tile types** - 9 different tile types including enemies and TNT pickups
- **Real-time testing** - Press `T` to instantly playtest your level
- **Grid overlay** - Toggle grid for precise placement
- **Enemy type selection** - Choose between 3 enemy AI types
### 📱 Mobile Support
- **Touch controls** - Virtual D-pad and action buttons
- **Haptic feedback** - Vibration patterns for game events
- **Responsive design** - Adapts to any screen size
- **Touch-optimized UI** - Large, accessible buttons for mobile play
### 🎨 Visual & Audio
- **Neon aesthetic** - Vibrant cyan, pink, and purple color scheme
- **Smooth animations** - Particle effects for explosions and collections
- **Retro pixel-perfect** rendering
- **Dynamic themes** - Custom color palettes per level
- **Synthesized audio** - No files needed, all sounds generated in-browser
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
- **D-Pad / Left Stick** - Movement
- **Button A / Cross** - Start game / Restart
- **Button B / Circle** - Place dynamite
- **Start Button** - Pause/Resume
### Mobile Touch
- **Virtual D-Pad** - Movement control
- **TNT Button** - Place dynamite
- **Pause Button** - Pause/Resume game
- **START GAME Button** - Begin playing
## 🎨 Level Editor Controls
| Key | Action |
|-----|--------|
| **0-8** | Quick tile selection |
| **Left Click** | Place selected tile |
| **Right Click** | Erase tile |
| **E** | Cycle enemy type (Basic/Seeker/Patroller) |
| **G** | Toggle grid overlay |
| **T** | Test play current level |
| **S** | Save level to localStorage |
| **O** | Load saved level |
| **L** | Exit editor |
### Export/Import Levels
**Export** (F12 Console):
```javascript
copy(localStorage.getItem('customLevel'))
```
**Import** (F12 Console):
```javascript
localStorage.setItem('customLevel', `PASTE_JSON_HERE`)
```
## 🚀 Quick Start
1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/neon-dash.git
cd neon-dash
```
2. **Open the game**
   - Simply open `index.html` in a modern browser
   - Or serve with a local server:
```bash
python -m http.server 8000
# Visit http://localhost:8000
```
3. **Play!**
   - Press **Space** or click **START GAME**
   - Collect all diamonds to unlock the exit
   - Reach the exit before time runs out
## 🏗️ Tech Stack
- **HTML5 Canvas** - Rendering engine
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Web Audio API** - Real-time sound synthesis
- **localStorage** - High scores and level persistence
- **Gamepad API** - Controller support
- **Vibration API** - Mobile haptic feedback
- **CSS3** - Neon-styled UI with animations
## 📂 Project Structure
```
neon-dash/
├── index.html          # Main HTML structure
├── game.js             # Core game logic and engine
├── levelEditor.js      # Level editor implementation  
├── mobile.js           # Touch controls & haptic feedback
├── style.css           # Main stylesheet (neon theme)
├── mobile.css          # Mobile-specific styles
└── README.md           # This file
```
## 🎯 Game Mechanics
### Tile Types
- **Empty** - Clear space
- **Dirt** - Diggable terrain (collect points)
- **Wall** - Indestructible barrier
- **Rock** - Falls when unsupported, deadly when falling
- **Diamond** - Collectible gem (objective)
- **Player** - Your character
- **Enemy** - 3 types with different AI behaviors
- **Exit** - Level goal (unlocks when all diamonds collected)
- **TNT Pickup** - Grants explosive charges
### Enemy AI
1. **Basic** - Random wandering
2. **Seeker** - Actively pursues the player
3. **Patroller** - Follows predefined patrol routes
### Scoring
- **Dirt**: 10 points
- **Diamond**: 100 points
- **Time Bonus**: Remaining seconds × 10
- **Level Complete**: 1000 points
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


