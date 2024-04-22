export class Ball {
	constructor(game, x, y, radius, xDir, yDir, speed, maxSpeed) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speed = speed;
		this.maxSpeed = maxSpeed;
		this.cSpeed = this.maxSpeed;
		this.xDir = xDir;
		this.yDir = yDir;
	}
	update(coords)
	{
		this.x = coords.x;
		this.y = coords.y;
	}
	draw(ctx)
	{
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.fill();
	}
}


// update(leftPaddle, rightPaddle)
// {
// 	if (this.x + this.xDir + this.radius >= this.game.width || this.x + this.xDir - this.radius <= 0)
// 	{
// 		this.xDir *= -1;
// 		this.x = this.game.width/2;
// 		this.y = this.game.height/2;
// 		this.cSpeed = this.maxSpeed;
// 	}

// 	if (this.y + this.yDir + this.radius >= this.game.height || this.y + this.yDir - this.radius <= 0)
// 		this.yDir *= -1;
// 	// if ((this.x >= leftPaddle.x &&
// 	// 	 this.x <= leftPaddle.x + leftPaddle.width)
// 	// 	&& (this.y + this.yDir >= leftPaddle.y && 
// 	// 	this.y + this.yDir <= leftPaddle.y - leftPaddle.height))
// 	// 	this.yDir *= -1;

// 	// if (this.x <= leftPaddle.x && this.x)

// 	if (((this.y + this.radius >= leftPaddle.y && this.y - this.radius <= leftPaddle.y + leftPaddle.height)
// 		&& this.x + this.xDir - this.radius <= leftPaddle.x + leftPaddle.width) ||
// 		((this.y + this.radius >= rightPaddle.y && this.y - this.radius <= rightPaddle.y + rightPaddle.height)
// 		&& this.x + this.xDir + this.radius >= rightPaddle.x))
// 		{
// 			this.xDir *= -1;
// 			this.cSpeed += 1;
// 		}
// 	this.x += this.xDir * this.cSpeed;
// 	this.y += this.yDir * this.cSpeed;
// }