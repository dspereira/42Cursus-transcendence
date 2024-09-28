import * as const_vars from "./const_vars.js";
import get_position_percentage from "./logicUtils.js"

export class Paddle {
	constructor(side) {
		this.screen_height = const_vars.SCREEN_HEIGHT;
		this.screen_width = const_vars.SCREEN_WIDTH;
		this.height = const_vars.PADDLE_HEIGHT;
		this.width = const_vars.PADDLE_WIDTH;
		this.wall_distance = 10;
		this.half_height = this.height / 2;
		this.half_width = this.width / 2;
		this.step = 6;
		this.side = side;
		this.y = this.screen_height / 2;
		this.x = this.#getX(side);
		this.state = null;
		this.last_time = null;
	}

	getPosition() {
		return get_position_percentage(this.y - this.half_height, const_vars.SCREEN_HEIGHT);
	}

	update() {
		if (this.state) {
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
			this.step = value * const_vars.PADDLE_SPEED;

			if (this.state === 'up')
				this.y -= this.step;
			else if (this.state === 'down')
				this.y += this.step;

			if (this.y > this.screen_height - this.half_height)
				this.y = this.screen_height - this.half_height;
			else if (this.y < this.half_height)
				this.y = this.half_height;
		}
	}

	setState(key, status) {
		if (this.state === key || !this.state) {
			if (status === 'pressed')
				this.state = key;
			else {
				this.state = null;
				this.last_time = null;
			}
		}
	}

	getColisionPoint(oldBallX, oldBallY, newBallX, newBallY, ballRadius) {
		let xColision = false;
		let yColision = false;
		let newX, newY;

		if (this.side === 'left') {
			xColision = Math.abs(newBallX - this.x) <= (ballRadius + this.half_width);
			yColision = Math.abs(newBallY - this.y) <= (ballRadius + this.half_height);
			newX = this.x + ballRadius;
		}
		else if (this.side === 'right') {
			xColision = Math.abs(this.x - newBallX) <= (ballRadius + this.half_width);
			yColision = Math.abs(this.y - newBallY) <= (ballRadius + this.half_height);
			newX = this.x - ballRadius;
		}

		if (xColision && yColision) {
			const m = (newBallY - oldBallY) / (newBallX - oldBallX);
			const b = newBallY - m * newBallX;
			newY = m * newX + b;
		}
		else
			return null;

		const hitPaddleValue = this.y - this.half_height - newY;
		const hitPaddlePercentage = Math.abs((hitPaddleValue * 100) / this.height);

		return { x: newX, y: newY, hit_paddle_percentage: hitPaddlePercentage };
	}

	endGamePosition() {
		this.y = this.screen_height / 2;
	}

	#getX(side) {
		if (side === 'left')
			return this.wall_distance + this.width;
		else
			return this.screen_width - this.wall_distance - this.width;
	}
}
