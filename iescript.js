var directions = {
  UP: 1,
  RIGHT: 2,
  DOWN: 3,
  LEFT: 0
}

/**
 * Circle class.
 * 
 * @constructor
 * @param {Number} color     - The color.
 * @param {Number} x      - The x coordinate.
 * @param {Number} y      - The y coordinate.
 */

function Box (color, x, y) {
			//constants
			this.MOVE_SPEED = 12.5;
			//initial values
			this.boxMoving = false;
			this.isClicked = false;
			//this.blink = true;
			this.xAnim = 0;
			this.yAnim = 0;
			this.direction = 0;
			//parameters
			this.color = color;
			this.x = x;
			this.y = y;
}

 Box.prototype.draw = function(size) {
		/*if (frameCount % 50 == 0) {
				this.blink = !this.blink;
		}*/
		if (this.boxMoving) {
				switch (this.direction) {
						case directions.UP:
								this.yAnim -= size / this.MOVE_SPEED;
								if (this.yAnim <= -size) {
										this.yAnim = 0;
										this.y--;
										this.boxMoving = false;
								}
								break;
						case directions.DOWN:
								this.yAnim += size / this.MOVE_SPEED;
								if (this.yAnim >= size) {
										this.yAnim = 0;
										this.y++;
										this.boxMoving = false;
								}
								break;
						case directions.RIGHT:
								this.xAnim += size / this.MOVE_SPEED;
								if (this.xAnim >= size) {
										this.xAnim = 0;
										this.x++;
										this.boxMoving = false;
								}
								break;
						case directions.LEFT:
								this.xAnim -= size / this.MOVE_SPEED;
								if (this.xAnim <= -size) {
										this.xAnim = 0;
										this.x--;
										this.boxMoving = false;
								}
								break;
				}
		};
		var index = this.color + ((this.isClicked) ? 4 : 0);
		image(Boxes, size * this.x + this.xAnim, size * this.y + this.yAnim, size, size, 0, 60 * index, 60, 60);
}

Box.prototype.click = function (x, y) {
		if (x == this.x && y == this.y) {
				this.isClicked = !this.isClicked;
		} else {
				this.isClicked = false;
		}
}

Box.prototype.setMovement = function (direction, boxPos) {
		var newBoxX = this.x;
		var newBoxY = this.y;
		switch (direction) {
				case directions.UP:
						newBoxY--;
						break;
				case directions.DOWN:
						newBoxY++;
						break;
				case directions.RIGHT:
						newBoxX++;
						break;
				case directions.LEFT:
						newBoxX--;
						break;
		}
		var isOK = true;
		for (var i = 0; i < boxPos.length; i++) {
				isOK = isOK && !((boxPos[i])[0] == newBoxX && (boxPos[i])[1] == newBoxY);
		}
		if (this.isClicked && !this.boxMoving && isOK) {
				this.direction = direction;
				this.boxMoving = true;
		}
}

/**
 * Map class.
 * 
 * @constructor
 * @param {String} levelName     - The level name.
 */

function Map (levelName) {
		this.levelLoaded = false;
		this.levelComplete = false;
		this.levelData = loadStrings("assets/levels/" + levelName + ".txt", this.isDone(data));
}

Map.prototype.isDone = function (data) {
	this.boxes = this.createBoxes(data);
	this.levelLoaded = true;
}

Map.prototype.draw = function () {
		this.tileSize = width / (this.levelData.length - this.levelData[0]);
		for (var y = this.levelData[0]; y < this.levelData.length; y++) {
				for (var x = 0; x < this.levelData[y].length; x++) {
						image(Tileset, this.tileSize * x, this.tileSize * (y - this.levelData[0]), this.tileSize, this.tileSize, 0, 60 * this.levelData[y].charAt(x), 60, 60);
				}
		}
		var levelComplete = true;
		for (var i = 0; i < this.boxes.length; i++) {
				box.draw(this.tileSize);
				levelComplete = levelComplete && this.getBlock(box.x, box.y) == box.color + 2;
		}
		this.levelComplete = levelComplete;
}

Map.prototype.getBlock = function (x, y) {
		return this.levelData[y + Number(this.levelData[0])].charAt(x);
}

Map.prototype.isReady = function () {
		return this.levelLoaded;
}

Map.prototype.createBoxes = function (data) {
		var b = [];
		for (var i = 1; i < this.levelData[0]; i += 2) {
				b.push(new Box((i - 1) / 2, Number(this.levelData[i]), Number(this.levelData[i + 1])));
		}
		return b;
}

Map.prototype.click = function (mX, mY) {
		this.boxes.forEach(this.clickBox(box));
}

Map.prototype.clickBox = function (box) {
	box.click(Math.floor(mX / this.tileSize),
	Math.floor(mY / this.tileSize));
}

Map.prototype.move = function (direction) {
		direction -= 37;
		var boxPos = [];
		for (var i = 0; i < this.boxes.length; i++) {
			boxPos.push([this.boxes[i].x, this.boxes[i].y]);
		}
		for (var i = 0; i < this.boxes.length; i++) {
				switch (direction) {
						case directions.UP:
								if (this.getBlock(this.boxes[i].x, this.boxes[i].y - 1) == '0') {
										return;
								}
								break;
						case directions.DOWN:
								if (this.getBlock(this.boxes[i].x, this.boxes[i].y + 1) == '0') {
										return;
								}
								break;
						case directions.RIGHT:
								if (this.getBlock(this.boxes[i].x + 1, this.boxes[i].y) == '0') {
										return;
								}
								break;
						case directions.LEFT:
								if (this.getBlock(this.boxes[i].x - 1, this.boxes[i].y) == '0') {
										return;
								}
								break;
				}
				this.boxes[i].setMovement(direction, boxPos);
		};
}

var Tileset;
var Boxes;

function preload() {
  Tileset = loadImage("assets/Tileset.png");
  Boxes = loadImage("assets/Boxes.png");
  if (!cookieIsValid(document.cookie)) {
    document.cookie = "1_1"
  }
  map = new Map(document.cookie);
}

function setup() {
  createCanvas(1000, 1000);
  noSmooth();
}

function draw() {
  if (map.isReady()) {
    background(250);
    map.draw();
    if (map.levelComplete) {
      document.cookie = getNewLevelName(document.cookie);
      map = new Map(document.cookie);
    }
  }
}

function mousePressed() {
  if (map.isReady()) {
    map.click(mouseX, mouseY);
  }
}

function keyPressed() {
  if (keyCode >= 37 && keyCode <= 40 && map.isReady()) {
    map.move(keyCode);
  }
  return false;
}

function cookieIsValid(cookie) {
  var splittedCookie = cookie.split('_');
  if (splittedCookie.length == 2) {
    return (!isNaN(parseInt(splittedCookie[0])) && !isNaN(parseInt(splittedCookie[1])));
  }
  return false;
}

function getNewLevelName(oldName) {
  if (oldName == "1_10") {
    return "1_1";
  }
  return (oldName.split('_')[0] + "_" + (Number(oldName.split('_')[1]) + 1));
}
