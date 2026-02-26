/**
 * Neon Dash - Sound Manager
 */

class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
        this.musicInterval = null;
        this.menuMusicInterval = null;
        this.noiseBuffer = null;

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

    async playTone(freq, type, duration, vol = 1.0, isMusic = false, startTime = 0) {
        if (!this.enabled || !this.ctx) return;
        if (this.ctx.state === 'suspended') {
            try { await this.ctx.resume(); } catch (e) { }
        }

        const effectiveVol = vol * this.getEffectiveVolume(isMusic);
        if (effectiveVol < 0.01) return; // Skip if too quiet

        const time = startTime || this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(effectiveVol * 0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
            if (isMusic && this.activeMusicNodes) {
                const idx = this.activeMusicNodes.indexOf(osc);
                if (idx !== -1) {
                    this.activeMusicNodes.splice(idx, 1);
                }
            }
        };

        osc.start(time);
        osc.stop(time + duration);

        if (isMusic) {
            if (!this.activeMusicNodes) this.activeMusicNodes = [];
            this.activeMusicNodes.push(osc);
        }
    }

    async playNoise(duration, vol = 1.0) {
        if (!this.enabled || !this.ctx) return;
        if (this.ctx.state === 'suspended') {
            try { await this.ctx.resume(); } catch (e) { }
        }

        const effectiveVol = vol * this.getEffectiveVolume(false);
        if (effectiveVol < 0.01) return; // Skip if too quiet

        // Create or reuse noise buffer (1 second duration)
        if (!this.noiseBuffer) {
            const bufferSize = this.ctx.sampleRate; // 1 second
            this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = this.noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(effectiveVol * 0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        noise.connect(gain);
        gain.connect(this.ctx.destination);

        noise.onended = () => {
            noise.disconnect();
            gain.disconnect();
        };

        noise.start();
        noise.stop(this.ctx.currentTime + duration);
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

        this.musicActive = true;
        this.nextGameNoteTime = this.ctx ? (this.ctx.currentTime + 0.05) : null;
        this.gameNoteIndex = 0;
        this.gameArpIndex = 0;
        this.gameMusicDef = music;
        this.musicInterval = true; // placeholder for checks

        const schedule = () => {
            if (!this.musicActive) return;
            if (!this.ctx) {
                // Wait for the context to be initialized (user interaction)
                this.musicInterval = setTimeout(schedule, 50);
                return;
            }
            if (this.nextGameNoteTime === null) {
                this.nextGameNoteTime = this.ctx.currentTime + 0.05;
            }

            const m = this.gameMusicDef;
            const scheduleAheadTime = 0.15; // 150ms

            while (this.nextGameNoteTime < this.ctx.currentTime + scheduleAheadTime) {
                // Bass line
                const freq = m.bassLine[this.gameNoteIndex];
                this.playTone(freq, m.waveform, 0.1, m.volume, true, this.nextGameNoteTime);

                // Arpeggio (every other note for most themes)
                if (m.arpEnabled && this.gameNoteIndex % 2 === 0) {
                    const arpFreq = m.arpNotes[this.gameArpIndex % m.arpNotes.length];
                    this.playTone(arpFreq, m.arpWave, 0.05, m.volume * 0.4, true, this.nextGameNoteTime);
                    this.gameArpIndex++;
                }

                this.nextGameNoteTime += m.tempo / 1000.0;
                this.gameNoteIndex = (this.gameNoteIndex + 1) % m.bassLine.length;
            }

            this.musicInterval = setTimeout(schedule, 50);
        };

        schedule();
    }

    stopGameMusic() {
        this.musicActive = false;
        if (this.musicInterval && typeof this.musicInterval === 'number') {
            clearTimeout(this.musicInterval);
        }
        this.musicInterval = null;
        if (this.activeMusicNodes) {
            this.activeMusicNodes.forEach(osc => {
                try { osc.stop(); } catch (e) { }
            });
            this.activeMusicNodes = [];
        }
    }

    startMenuMusic() {
        if (!this.enabled || this.menuMusicInterval) return;
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();

        // Synthwave Bass Sequence (Am - F - C - G)
        const notes = [110.00, 87.31, 130.81, 98.00]; // Root notes

        this.menuMusicActive = true;
        this.nextMenuNoteTime = this.ctx ? (this.ctx.currentTime + 0.05) : null;
        this.menuStep = 0;
        this.menuMusicInterval = true; // placeholder for checks

        const schedule = () => {
            if (!this.menuMusicActive) return;
            if (!this.ctx) {
                // Wait for the context to be initialized (user interaction)
                this.menuMusicInterval = setTimeout(schedule, 50);
                return;
            }
            if (this.nextMenuNoteTime === null) {
                this.nextMenuNoteTime = this.ctx.currentTime + 0.05;
            }

            const scheduleAheadTime = 0.15; // 150ms

            while (this.nextMenuNoteTime < this.ctx.currentTime + scheduleAheadTime) {
                const root = notes[Math.floor(this.menuStep / 8) % 4];

                // Bass (Sawtooth) - Pumping effect
                if (this.menuStep % 2 === 0) {
                    this.playTone(root, 'sawtooth', 0.2, 0.15, true, this.nextMenuNoteTime);
                } else {
                    this.playTone(root, 'sawtooth', 0.1, 0.1, true, this.nextMenuNoteTime); // Off-beat lighter
                }

                // Arpeggio (Square) - Cyberpunk feel
                const arpNotes = [root * 2, root * 3, root * 4, root * 3];
                const arpNote = arpNotes[this.menuStep % 4];
                this.playTone(arpNote, 'square', 0.05, 0.05, true, this.nextMenuNoteTime);

                this.nextMenuNoteTime += 200 / 1000.0; // 200ms tempo
                this.menuStep++;
            }

            this.menuMusicInterval = setTimeout(schedule, 50);
        };

        schedule();
    }

    stopMenuMusic() {
        this.menuMusicActive = false;
        if (this.menuMusicInterval && typeof this.menuMusicInterval === 'number') {
            clearTimeout(this.menuMusicInterval);
        }
        this.menuMusicInterval = null;
        if (this.activeMusicNodes) {
            this.activeMusicNodes.forEach(osc => {
                try { osc.stop(); } catch (e) { }
            });
            this.activeMusicNodes = [];
        }
    }
}
