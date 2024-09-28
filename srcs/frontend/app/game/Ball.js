import * as const_vars from "./const_vars.js";
import get_position_percentage from "./logicUtils.js"

const BALL_RADIUS = 5;

export class Ball {
	constructor() {
		this.screen_height = const_vars.SCREEN_HEIGHT;
		this.screen_width = const_vars.SCREEN_WIDTH;
		this.x_start = this.screen_width / 2;
		this.y_start = this.screen_height / 2;
		this.x = this.x_start;
		this.y = this.y_start;
		this.last_time = 0;
		this.#setStartAngle();
		this.left_wall_limit = const_vars.BALL_RADIUS;
		this.right_wall_limit = this.screen_width - const_vars.BALL_RADIUS;
		this.top_wall_limit = const_vars.BALL_RADIUS;
		this.bottom_wall_limit = this.screen_height - const_vars.BALL_RADIUS;
	}

	getPosition() {
		return {
			x: get_position_percentage(this.x, const_vars.SCREEN_WIDTH),
			y: get_position_percentage(this.y, const_vars.SCREEN_HEIGHT)
		};
	}

	updatePosition(leftPaddle, rightPaddle) {
		const radius = this.#getMovedDistance();
		const x = this.x + radius * this.trig_values.cos_value;
		const y = this.y + radius * this.trig_values.sin_value;
		const colisionCoords = this.#getColisionPoint(y);
		const paddleColisionsCoords = this.#getPaddleColisionsCoords(x, y, leftPaddle, rightPaddle);

		if (colisionCoords) {
			this.x = colisionCoords.x;
			this.y = colisionCoords.y;
			this.#setNewReflectionAngle();
		}
		else if (paddleColisionsCoords) {
			this.x = paddleColisionsCoords.x;
			this.y = paddleColisionsCoords.y;
			this.#setNewPaddleAngle(paddleColisionsCoords.hit_paddle_percentage);
		}
		else {
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
			this.#setStartAngle();
			return goalInfo;
		}
		return null;
	}

	setEndGamePosition() {
		this.x = this.x_start;
		this.y = this.y_start;
	}

	#getMovedDistance() {
		let value;
		if (!this.last_time) {
			this.last_time = Date.now();
			value = 1;
		}
		else {
			const current_time = Date.now();
			value = (current_time - this.last_time);
			this.last_time = current_time;
		}
		return value * const_vars.BALL_SPEED;
	}

	#setTrigValues(angleRad) {
		this.trig_values = {
			sin_value: -Math.sin(angleRad),
			cos_value: Math.cos(angleRad),
		};
	}

	#getColisionPoint(y) {
		let col_y;
		if (y > this.bottom_wall_limit)
			col_y = this.bottom_wall_limit;
		else if (y < this.top_wall_limit)
			col_y = const_vars.BALL_RADIUS;
		else
			return null;
		const m = Math.tan(this.angle_rad);
		const b = this.y - m * this.x;
		const col_x = (col_y - b) / m;
		return { x: col_x, y: col_y };
	}

	#setNewReflectionAngle() {
		this.#setAngle(360 - this.angle_deg);
	}

	#setStartAngle() {
		const chosenInterval = const_vars.ANGLES_INTERVALS[Math.floor(Math.random() * const_vars.ANGLES_INTERVALS.length)];
		this.#setAngle(Math.floor(Math.random() * (chosenInterval[1] - chosenInterval[0] + 1)) + chosenInterval[0]);
	}

	#setAngle(angleDeg) {
		if (angleDeg < 0)
			angleDeg += 360;
		else if (angleDeg > 360)
			angleDeg -= 360;
		this.angle_deg = angleDeg;
		this.angle_rad = this.angle_deg * (Math.PI / 180);
		this.#setTrigValues(this.angle_rad);
	}

	#getPaddleColisionsCoords(x, y, leftPaddle, rightPaddle) {
		let newCoords;
		if (this.angle_deg > 90 && this.angle_deg < 270)
			newCoords = leftPaddle.getColisionPoint(this.x, this.y, x, y, const_vars.BALL_RADIUS);
		else
			newCoords = rightPaddle.getColisionPoint(this.x, this.y, x, y, const_vars.BALL_RADIUS);
		return newCoords;
	}

	#setNewPaddleAngle(hitPercentage) {
		let resultAngle;
		if (this.angle_deg > 90 && this.angle_deg < 270)
			resultAngle = 420 + (hitPercentage / 100) * (300 - 420);
		else
			resultAngle = 120 + (hitPercentage / 100) * (240 - 120);
		this.#setAngle(resultAngle);
	}
}
