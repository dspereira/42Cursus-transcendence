import { SCREEN_HEIGHT, SCREEN_WIDTH, BALL_SPEED, ANGLES_INTERVALS} from "./const_vars.js";

const BALL_RADIUS = 5;

export class Ball {
	constructor() {
		this.screen_height = SCREEN_HEIGHT;
		this.screen_width = SCREEN_WIDTH;
		this.x_start = this.screen_width / 2;
		this.y_start = this.screen_height / 2;
		this.x = this.x_start;
		this.y = this.y_start;
		this.last_time = 0;
		this._setStartAngle();
		this.left_wall_limit = BALL_RADIUS;
		this.right_wall_limit = this.screen_width - BALL_RADIUS;
		this.top_wall_limit = BALL_RADIUS;
		this.bottom_wall_limit = this.screen_height - BALL_RADIUS;
	}

	getPosition() {
		return { x: this.x, y: this.y };
	}

	updatePosition(leftPaddle, rightPaddle) {
		const radius = this._getMovedDistance();
		const x = this.x + radius * this.trig_values.cos_value;
		const y = this.y + radius * this.trig_values.sin_value;
		
		const colisionCoords = this._getColisionPoint(y);
		const paddleColisionsCoords = this._getPaddleColisionsCoords(x, y, leftPaddle, rightPaddle);
		
		if (colisionCoords) {
			this.x = colisionCoords.x;
			this.y = colisionCoords.y;
			this._setNewReflectionAngle();
		} else if (paddleColisionsCoords) {
			this.x = paddleColisionsCoords.x;
			this.y = paddleColisionsCoords.y;
			this._setNewPaddleAngle(paddleColisionsCoords.hit_paddle_percentage);
		} else {
			this.x = x;
			this.y = y;
		}
	}

	goalDetection() {
		const player1Goal = this.x >= this.right_wall_limit;
		const player2Goal = this.x <= this.left_wall_limit;

		if (player1Goal || player2Goal) {
			const goalInfo = { player1: player1Goal, player2: player2Goal };
			this.x = this.x_start;
			this.y = this.y_start;
			this._setStartAngle();
			return goalInfo;
		}

		return null;
	}

	setEndGamePosition() {
		this.x = this.x_start;
		this.y = this.y_start;
	}

	_getMovedDistance() {
		let value;

		if (!this.last_time) {
			this.last_time = Date.now();
			value = 1;
		} else {
			const current_time = Date.now();
			value = (current_time - this.last_time);
			this.last_time = current_time;
		}

		return value * BALL_SPEED;
	}

	_setTrigValues(angleRad) {
		this.trig_values = {
			sin_value: -Math.sin(angleRad),
			cos_value: Math.cos(angleRad),
		};
	}

	_getColisionPoint(y) {
		let col_y;

		if (y > this.bottom_wall_limit) {
			col_y = this.bottom_wall_limit;
		} else if (y < this.top_wall_limit) {
			col_y = BALL_RADIUS;
		} else {
			return null;
		}

		const m = Math.tan(this.angle_rad);
		const b = this.y - m * this.x;
		const col_x = (col_y - b) / m;

		return { x: col_x, y: col_y };
	}

	_setNewReflectionAngle() {
		this._setAngle(360 - this.angle_deg);
	}

	_setStartAngle() {
		const chosenInterval = ANGLES_INTERVALS[Math.floor(Math.random() * ANGLES_INTERVALS.length)];
		this._setAngle(Math.floor(Math.random() * (chosenInterval[1] - chosenInterval[0] + 1)) + chosenInterval[0]);
	}

	_setAngle(angleDeg) {
		if (angleDeg < 0) {
			angleDeg += 360;
		} else if (angleDeg > 360) {
			angleDeg -= 360;
		}
		
		this.angle_deg = angleDeg;
		this.angle_rad = this.angle_deg * (Math.PI / 180);
		this._setTrigValues(this.angle_rad);
	}

	_getPaddleColisionsCoords(x, y, leftPaddle, rightPaddle) {
		let newCoords;

		if (this.angle_deg > 90 && this.angle_deg < 270) {
			newCoords = leftPaddle.getColisionPoint(this.x, this.y, x, y, BALL_RADIUS);
		} else {
			newCoords = rightPaddle.getColisionPoint(this.x, this.y, x, y, BALL_RADIUS);
		}

		return newCoords;
	}

	_setNewPaddleAngle(hitPercentage) {
		let resultAngle;

		if (this.angle_deg > 90 && this.angle_deg < 270) {
			resultAngle = 420 + (hitPercentage / 100) * (300 - 420);
		} else {
			resultAngle = 120 + (hitPercentage / 100) * (240 - 120);
		}

		this._setAngle(resultAngle);
	}
}
