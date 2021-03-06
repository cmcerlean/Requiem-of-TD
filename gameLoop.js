var FPS = 30;
var gameInterval,
    towers,
    enemies,
    money,
    score,
    enemyStartX,
    enemyStartY,
    enemiesKilled,
    towerLocations,
    playerHealth,
    wave = 0,
    enemyDist = [];

var spawnInt = [];

var towerTypes = [
    ['Lightning', [65, 100, 1.5, 'blue']],
    ['Fire', [200, 50, 5, 'red']],
];

var waves = [
    [50, [.999, 1.05]],
    [100, [.999, 1.1]],
    [200, [.99, 1.15]],
    [500, [.9, 1.2]],
];


function addTower(x, y) {
    let ti = parseInt($('.selectedTower').val());
    let [tName, [tCost, tRange, tAttack, tColor]] = towerTypes[ti];

    if (money >= tCost) {
	money -= tCost;
	drawStats();
	
	towerLocations.push([x, y]);
	towers.push(new Tower(
	    context,
	    x*25+12,
	    y*25+12,
	    tRange,
	    tAttack,
	    tColor,
	));
    }
}

function spawnEnemies() {
    for (let i of spawnInt) {
	clearInterval(i);
    }

    for (let [secs, [health, atk, speed, color, width, money, sValue]] of enemyDist) {
	spawnInt.push(setInterval(function() {
	    enemies.push(new Enemy(
		context,
		enemyStartX,
		enemyStartY,
		health,
		atk,
		speed,
		color,
		width,
		money,
		sValue
	    ));
	}, secs*1000));
    }
}

function startGame() {
    spawnEnemies();
    gameInterval = setInterval(gameLoop, 1000/FPS);
}

function nextWave() {
    let [numDead, [timeMult, statMult]] = waves[wave];
    if (enemiesKilled >= numDead) {
	if (wave + 1 < waves.length) {
	    wave++;
	}
	let newEnemies = [];
	for (let [secs, [health, atk, speed, color, width, money, sValue]] of enemyDist) {
	    newEnemies.push([secs * timeMult, [health * statMult, atk * statMult, speed * statMult, color, width, money * statMult, sValue * statMult]])
	}
	enemyDist = newEnemies;
	spawnEnemies();
	drawWave();
    }
}

function resetGame() {
    clearInterval(gameInterval);
    for (let i of spawnInt) {
    clearInterval(i);
    }

    enemyDist = [
	[0.5, [25, 5, 5, 'green', 7, 10, 20]],
	[0.9, [75, 10, 3, 'blue', 15, 20, 40]],
    ];

    towers = [];
    enemies = [];

    wave = 0;

    money = 200;
    playerHealth = 100;
    score = 0;

    enemiesKilled = 0;

    enemyStartX = 0;
    enemyStartY = 37.5;
    spawnInt = [];

    towerLocations = [];

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FDF2E9";
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawPath();
    drawStats();
    drawWave();
}

function gameEnd() {
    $("#resetBtn").hide();
    $("#startBtn").show();
    highscore(Math.floor(score));
    resetGame();
}

function gameLoop() {

    if (playerHealth <= 0) {
        gameEnd();
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FDF2E9";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawPath();
    for (let tower of towers) {
	tower.draw();
	for (let e of enemies) {
	    if (tower.targetInRange(e)) {
		  tower.fire(e);
          break;
	    }
	}
    }

    let i = enemies.length;
    while (i--) {
	let e = enemies[i];
	
	if (e.isDead()) {
	    enemiesKilled++;
	    nextWave();
	    
	    money += e.moneyValue;
        score += e.scoreValue;
	    drawStats();
	    enemies.splice(i, 1);
	} else {
	    e.move();
	    e.draw();
	}
    }
}
