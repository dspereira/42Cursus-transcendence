export default class Game {
	constructor(ctx, width, height) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.animation = null;
		this.colors = {
			paddle: "black",
			ball: "#f9e50c",
			ground: "#807ffb",
			middleLine: "white",
			score: "rgba(200, 200, 200, 0.5)",
		}
		this.gameData = {
			ball: {
				x: width / 2,
				y: height / 2
			},
			paddle_left_pos: height / 2,
			paddle_right_pos:  height / 2,
			player_1_score: "0",
			player_2_score: "0"
		}
		this.startCounter = null;
		this.lastStartCounterValue = null;
		this.winnerUsername = null;
		this.surrender = null;
		this.player1 = null;
		this.player2 = null;
		this.isFullScreen = null;
		this.scoreFont = this.width * 0.25;
		this.startCounterFontStore = this.width * 0.25;
		this.startCounterFont = this.startCounterFontStore;
		this.scoreLeftPos = this.#calculateScorePosition("left");
		this.scoreRigthPos = this.#calculateScorePosition("rigth");
		this.ballRadius = this.#getValueFromPercentage(0.7, this.width);
		this.paddleWidth = this.#getValueFromPercentage(0.5, this.width);
		this.paddleHeigth = this.#getValueFromPercentage(13, this.height);
	}

	updateState(data) {
		this.gameData = data;
		this.startCounter = null;
	}

	updateStartCounter(value) {
		this.startCounter = value;
		if (value == 0)
			this.startCounter = "GO!"

		if (this.lastStartCounterValue == null || this.lastStartCounterValue != this.startCounter) {
			this.startCounterFont = this.startCounterFontStore;
			this.lastStartCounterValue = this.startCounter;
		}
	}

	updateWinner(value) {
		this.winnerUsername = value.winner_username;
		this.surrender = value.surrender;
		this.startCounter = null;
	}

	setColorPallet(color_pallet) {
		this.colors = color_pallet;
	}

	setPlayers(player1, player2) {
		this.player1 = player1;
		this.player2 = player2;
	}

	setIsFullScreen(isFullScreen) {
		this.isFullScreen = isFullScreen;
	}

	start() {
		this.#animate();
	}

	stop() {
		if (this.animation) {
			window.cancelAnimationFrame(this.animation);
			this.animation = null;
		}
	}

	resizeGame(width, height) {
		this.width = width;
		this.height = height;
		this.ballRadius = this.#getValueFromPercentage(0.7, this.width);
		this.paddleWidth = this.#getValueFromPercentage(0.5, this.width);
		this.paddleHeigth = this.#getValueFromPercentage(13, this.height);
		this.scoreFont = this.width * 0.25;
		this.startCounterFontStore = this.width * 0.25;
		this.scoreLeftPos = this.#calculateScorePosition("left");
		this.scoreRigthPos = this.#calculateScorePosition("rigth");
		this.#drawAll();
	}

	#animate() {
		this.#drawAll();
		this.animation = window.requestAnimationFrame(this.#animate.bind(this));
		if (this.winnerUsername)
			this.stop();
	}

	#drawAll() {
		this.#drawField();
		this.#drawPaddle(this.gameData.paddle_left_pos, "left");
		this.#drawPaddle(this.gameData.paddle_right_pos, "rigth");
		this.#drawScore(this.gameData.player_1_score, "left");
		this.#drawScore(this.gameData.player_2_score, "rigth");
		this.#drawStartCounter();
		this.#drawWinner();
		this.#drawPlayers();
		this.#drawBall(this.gameData.ball.x, this.gameData.ball.y);
	}

	#drawField() {
		this.ctx.fillStyle = this.colors.ground;
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.fillRect(100, 100, this.width, 2);
		this.ctx.setLineDash([5, 5]);
		this.ctx.strokeStyle = this.colors.middleLine;
		this.ctx.beginPath();
		this.ctx.moveTo(this.width/2, 20);
		this.ctx.lineTo(this.width/2, this.height - 20);
		this.ctx.stroke();
		this.ctx.setLineDash([0, 0]);
	}

	#drawScore(score, side) {
		if (!score && !side)
			return ;

		this.ctx.font = `${this.scoreFont}px VT323`;
		this.ctx.fillStyle = this.colors.score;
		if (side == "left")
			this.ctx.fillText(score, this.scoreLeftPos.x, this.scoreLeftPos.y);
		else
			this.ctx.fillText(score, this.scoreRigthPos.x, this.scoreRigthPos.y);
	}

	#drawStartCounter() {
		if (this.startCounter == null)
			return ;
		if (this.startCounterFont < this.startCounterFont * 0.8 && this.startCounter == "GO!") {
			this.startCounter = null;
			return ;
		}
		this.startCounterFont = this.startCounterFont - 2;
		this.ctx.font = `${this.startCounterFont}px VT323`;
		this.ctx.fillStyle = "white";
		let pos = this.#calculateStartCounterPosition(this.startCounter, this.startCounterFont);
		this.ctx.fillText(`${this.startCounter}`, pos.x, pos.y);
	}

	#drawPaddle(pos, side) {
		if (!pos && !side)
			return ;

		const distanceToWall = this.width * 0.0125;
		let x = 0;
		if (side == "left")
			x = distanceToWall;
		else
			x = this.width - (distanceToWall + this.paddleWidth);
		
		const y = this.#getValueFromPercentage(pos, this.height);
		this.ctx.strokeStyle = this.colors.paddle;
		this.ctx.fillStyle = this.colors.paddle;
		this.ctx.beginPath();
		this.ctx.rect(x, y, this.paddleWidth, this.paddleHeigth);
		this.ctx.fill();
		this.ctx.stroke();		
	}

	#drawBall(x, y) {
		if (!x && !y)
			return ;

		const xCoor = this.#getValueFromPercentage(x, this.width);
		const yCoor = this.#getValueFromPercentage(y, this.height);
		
		this.ctx.strokeStyle = this.colors.ball;
		this.ctx.fillStyle = this.colors.ball;
		this.ctx.beginPath();
		this.ctx.arc(xCoor, yCoor, this.ballRadius, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
	}

	#drawWinner() {
		if (!this.winnerUsername)
			return ;

		const fontSizeUsername = this.width * 0.09;
		const fontSizeWinner = fontSizeUsername * 0.70;
		const fontSurrender = fontSizeUsername * 0.45;
		const winnerNameSpacing = fontSizeUsername * 0.85;

		this.ctx.fillStyle = "white";

		let pos = this.#calculateStartWinnerPosition("WINNER", fontSizeWinner);
		this.ctx.fillText("WINNER", pos.x, pos.y - winnerNameSpacing);

		pos = this.#calculateStartWinnerPosition(this.winnerUsername, fontSizeUsername);
		this.ctx.fillText(`${this.winnerUsername}`, pos.x, pos.y);

		if (this.surrender) {
			const msg = "OPPONENT LEFT THE GAME";
			pos = this.#calculateStartWinnerPosition(msg, fontSurrender);
			this.ctx.fillText(msg, pos.x, pos.y + this.height * 0.45);
		}
	}

	#drawPlayers() {
		if (!this.isFullScreen)
			return ;
		this.ctx.fillStyle = this.colors.score;
		let pos = this.#calculatePlayersPosition(this.player1, "left");
		this.ctx.fillText(`${this.player1}`, pos.x, pos.y);
		pos = this.#calculatePlayersPosition(this.player2, "right");
		this.ctx.fillText(`${this.player2}`, pos.x, pos.y);
	}

	#getWordHalfDimensions(word, fontSize) {
		this.ctx.font = `${fontSize}px VT323`;
		const metrics = this.ctx.measureText(`${word}`);
		const halfTextHeight = metrics.actualBoundingBoxAscent / 2;
		const halfTextWidth = metrics.width / 2;
		return {
			halfTextWidth: halfTextWidth,
			halfTextHeight: halfTextHeight
		}
	}

	#calculatePlayersPosition(playerName, side) {
		let word = this.#getWordHalfDimensions(playerName, this.width * 0.05);
		let y = (this.height / 10) + word.halfTextHeight;
		let x;

		if (side == "left")
			x = (this.width / 4) - word.halfTextWidth;
		else
			x = (this.width / 4) * 3 - word.halfTextWidth;

		return {
			x: x,
			y: y
		}
	}

	#calculateScorePosition(side) {
		let word = this.#getWordHalfDimensions(5, this.scoreFont);
		let y = (this.height / 2) + word.halfTextHeight;
		let x = 0;

		if (side == "left")
			x = (this.width / 4) - word.halfTextWidth;
		else
			x = (this.width / 4) * 3 - word.halfTextWidth;

		return {
			x: x,
			y: y
		}
	}

	#calculateStartCounterPosition(value, fontSize) {
		let word = this.#getWordHalfDimensions(value, fontSize);
		let y = (this.height / 2) + word.halfTextHeight;
		let x = (this.width / 2) - word.halfTextWidth;

		return {
			x: x,
			y: y
		}
	}

	#calculateStartWinnerPosition(value, fontSize) {
		let word = this.#getWordHalfDimensions(value, fontSize);
		let y = (this.height / 4) + word.halfTextHeight;
		let x = (this.width / 2) - word.halfTextWidth;

		return {
			x: x,
			y: y
		}
	}

	#getValueFromPercentage(valuePercentage, maxValue) {
		return maxValue * valuePercentage / 100;
	}
}
