/**
 * Neon Dash - Enemy System
 */

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
        this.moveWallFollow(game, 'left');
    }

    moveWallFollow(game, followSide) {
        // Parametric wall-following behavior:
        // followSide='left'  → left-hand rule, CLOCKWISE motion (BASIC enemy)
        // followSide='right' → right-hand rule, COUNTER-CLOCKWISE motion (BUTTERFLY enemy)
        const getFollowDir = followSide === 'left'
            ? () => this.getLeftDirection()
            : () => this.getRightDirection();
        const getOppositeDir = followSide === 'left'
            ? () => this.getRightDirection()
            : () => this.getLeftDirection();

        // If in searching mode (no wall found yet), go straight until we find one
        if (this.searchingForWall) {
            const straightX = this.x + this.dirX;
            const straightY = this.y + this.dirY;

            // Check if there's now a wall on our follow side
            const followDir = getFollowDir();
            const followX = this.x + followDir.x;
            const followY = this.y + followDir.y;
            if (!this.isValidMove(followX, followY, game)) {
                // Found a wall on the follow side! Switch to normal wall-following
                this.searchingForWall = false;
            }

            if (this.isValidMove(straightX, straightY, game)) {
                this.performMove(straightX, straightY, game);
                return;
            } else {
                // Hit something - turn opposite and continue searching
                const oppDir = getOppositeDir();
                this.dirX = oppDir.x;
                this.dirY = oppDir.y;
                const newX = this.x + this.dirX;
                const newY = this.y + this.dirY;
                if (this.isValidMove(newX, newY, game)) {
                    this.performMove(newX, newY, game);
                }
                return;
            }
        }

        // Normal wall-following mode:
        // 1. If FOLLOW SIDE is now FREE (wall ended) -> turn that way and move (to keep following the wall)
        // 2. If FOLLOW SIDE is blocked, try to go STRAIGHT
        // 3. If STRAIGHT blocked, try OPPOSITE SIDE
        // 4. If OPPOSITE SIDE blocked, REVERSE

        // Get follow-side direction
        const followDir = getFollowDir();
        const followX = this.x + followDir.x;
        const followY = this.y + followDir.y;

        // Check if follow side is free (wall ended, we should turn to follow it)
        if (this.isValidMove(followX, followY, game)) {
            this.dirX = followDir.x;
            this.dirY = followDir.y;
            this.performMove(followX, followY, game);
            return;
        }

        // Follow side is blocked (wall is there), try straight
        const straightX = this.x + this.dirX;
        const straightY = this.y + this.dirY;
        if (this.isValidMove(straightX, straightY, game)) {
            this.performMove(straightX, straightY, game);
            return;
        }

        // Straight blocked, try opposite side
        const oppDir = getOppositeDir();
        const oppX = this.x + oppDir.x;
        const oppY = this.y + oppDir.y;
        if (this.isValidMove(oppX, oppY, game)) {
            this.dirX = oppDir.x;
            this.dirY = oppDir.y;
            this.performMove(oppX, oppY, game);
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
        this.moveWallFollow(game, 'right');
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
