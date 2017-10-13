class Tower {
    constructor(ctx, x, y, range = 100, attack = 10, color = 'blue') {
	this.ctx = ctx;
	this.x = x;
	this.y = y;
	this.range = range;
	this.attack = attack;
	this.color = color;

	this.radius = 10;

	this.draw();
    }
    
    fire(target) {
	this.ctx.beginPath();
	this.ctx.moveTo(this.x, this.y);
	this.ctx.lineTo(target.x, target.y);
	this.ctx.strokeStyle = this.color;
	this.ctx.stroke();

	target.hit(this.attack);
    }

    draw() {
	this.ctx.beginPath();
	this.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
	this.ctx.fillStyle = this.color;
	this.ctx.fill();
    }

    targetInRange(target) {
	let dx = target.x - this.x;
	let dy = target.y - this.y;
	return Math.sqrt(dx*dx + dy*dy) <= this.range;
    }
}

class Enemy {
    constructor(ctx, x, y, health = 100, atk = 10, speed = 3, color = 'green', width = 5) {
	this.ctx = ctx;
	this.x = x;
	this.y = y;
	this.atk = atk;
	this.health = health;
	this.speed = speed;
	this.color = color;
	this.width = width;

	this.targetIndex = 0;
	
	this.draw();
    }

    nextTarget() {
	if (this.targetIndex + 1 < enemyTargets.length) {
	    this.targetIndex += 1;
	}
    }

    move() {
	let target = enemyTargets[this.targetIndex];
	let tx = target[0];
	let ty = target[1];
	
	let dx = this.x - tx;
	let dy = this.y - ty;
	
	if (Math.abs(dx) > 0) {
	    if (Math.abs(dx) <= this.speed) {
		this.x = tx;
		this.nextTarget();
	    } else {
		this.x += this.speed;
	    }
	} else if (Math.abs(dy) > 0) {
	    if (Math.abs(dy) <= this.speed) {
		this.y = ty;
		this.nextTarget();
	    } else {
		this.y += this.speed;
	    }
	} else {
	    this.nextTarget();
	}
    }
    
    draw() {
	this.ctx.fillStyle = this.color;
	this.ctx.fillRect(this.x, this.y, this.width, this.width);
    }

    hit(dmg) {
	if (this.health - dmg < 0) {
	    this.health = 0;
	} else {
	    this.health -= dmg;
	}
    }
}
