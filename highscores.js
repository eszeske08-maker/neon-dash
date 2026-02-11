/**
 * Neon Dash - High Score Manager
 */

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
