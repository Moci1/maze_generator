var Maze = {};

window.onload = function() {
	var optionsbox = id('optionsbox'),
		settings = id('settings'),
		generate = id('generate');
	
	settings.addEventListener('click', function() {
		optionsbox.classList.toggle('nullheight');
	});
	
	generate.addEventListener('click', function(e) {
		e.preventDefault();
		Maze.start();
	});
};

Maze.start = function() {
	Maze.init();
	Maze.generate();
	Maze.render();
	Maze.solve(
		{ x: 0, y: 0 }, // start coords
		{ x: Maze.cols - 1, y: Maze.rows - 1 } // finish coords
	);
	Maze.done();
};

Maze.init = function() {
	Maze.rows = +id('row').value;
	Maze.cols = +id('col').value;
	Maze.block = +id('block').value;
	Maze.canvas = id('mazeCanvas');
	Maze.ctx = Maze.canvas.getContext('2d');
	Maze.width = Maze.cols * Maze.block;
	Maze.height = Maze.rows * Maze.block;
	
	console.group('Maze generator by Gábor Bokodi');
	console.log('Rows: ', Maze.rows);
	console.log('Columns: ', Maze.cols);
	console.log('Block: ', Maze.block + 'px');
	console.log('Size: ', Maze.width + ' x ' + Maze.height);
};

Maze.generate = function() {
	console.time('generate took');

	Maze.mazeList = new indexedArray(Maze.cols, Maze.rows);
	var frontierCells = new indexedArray(Maze.cols, Maze.rows),
		cell = Maze.mazeList.generateRandom(), p;
	
	Maze.mazeList.add(cell);

	adjacents(cell.x, cell.y, function(x, y) {
		if (Maze.validCell(x, y)) {
			frontierCells.add(new Cell(x, y));
		}
	});

	do {
		cell = frontierCells.getRandom();
		Maze.mazeList.add(cell);
		frontierCells.remove(cell);

		// pick a random frontier cell (which is already part of the maze)
		points = [];
		adjacents(cell.x, cell.y, function(x, y) {
			if (Maze.validCell(x, y) && !frontierCells.exists(x, y)) {
				(p = Maze.mazeList.get(x, y)) ? points.push(p) : frontierCells.add(new Cell(x, y));
			}
		});
		point = points.getRandom();

		// carve a passage from that frontier cell
		Maze.walkAble(cell, point, false);
	} while (frontierCells.hasItems())

	console.timeEnd('generate took');
};

Maze.render = function() {
	console.time('render took');
	
	Maze.canvas.width = Maze.width;
	Maze.canvas.height = Maze.height;
	
	Maze.ctx.beginPath();
	Maze.ctx.lineWidth = 0.5;
	Maze.ctx.strokeStyle = '#222222';
	
	var xx, yy;
	
	Maze.mazeList.loopThrough(function(item) {
		xx = item.x * Maze.block;
		yy = item.y * Maze.block;
		
		if (item.walls[0] && item.y != 0) {
			Maze.ctx.moveTo(xx, yy);
			Maze.ctx.lineTo(xx + Maze.block, yy);
		}
		if (item.walls[1] && item.x != 0) {
			Maze.ctx.moveTo(xx, yy);
			Maze.ctx.lineTo(xx, yy + Maze.block);
		}
	});
	
	Maze.ctx.closePath();
	Maze.ctx.stroke();
	
	console.timeEnd('render took');
};

Maze.solve = function(startCoords, endCoords) {
	console.time('solve took');

	var startCell = Maze.mazeList.get(endCoords.x, endCoords.y),
		endCell = Maze.mazeList.get(startCoords.x, startCoords.y),
		openList = [],
		impossible = { f: Maze.rows * Maze.cols },
		from = endCell,
		lowest, tempPath;

	startCell.scorePath(endCell.x, endCell.y);
	startCell.pathState = 'open';
	openList.push(startCell);

	do {
		lowest = impossible;
		
		// pick the lowest F cost square on the open list
		openList.loopThrough(function(item) {
			if (item.f <= lowest.f) { lowest = item; }
		});

		adjacents(lowest.x, lowest.y, function(x, y) {
			// valid, walkable, not checked yet
			if (Maze.validCell(x, y) && (tempPath = Maze.mazeList.get(x, y)) && Maze.walkAble(lowest, tempPath) && !tempPath.pathState) {
				tempPath.scorePath(endCell.x, endCell.y);
				tempPath.parent = lowest;
				tempPath.g++;
				openList.push(tempPath);
			}
		});
		
		lowest.pathState = 'closed';
		openList.splice(openList.indexOf(lowest), 1);
	} while (lowest.h)

	console.timeEnd('solve took');

	Maze.ctx.beginPath();
	Maze.ctx.lineWidth = Maze.block / 4;
	Maze.ctx.strokeStyle = '#ff2222';
	
	var solveInterval = setInterval(function() {
		Maze.ctx.lineTo(from.x * Maze.block + Maze.block / 2, from.y * Maze.block + Maze.block / 2);
		Maze.ctx.stroke();
		if (!(from = from.parent)) { clearInterval(solveInterval); }
	}, 30);
};

Maze.validCell = function(x, y) {
	return x >= 0 && x < Maze.cols && y >= 0 && y < Maze.rows;
};

Maze.walkAble = function(source, destiny, set) {
	var wall,
		editWall = typeof set != 'undefined';
		
	if (source.x == destiny.x) { // vertical
		if (source.y > destiny.y) {
			if (editWall) { source.walls[0] = set; }
			wall = source.walls[0];
		} else {
			if (editWall) { destiny.walls[0] = set; }
			wall = destiny.walls[0];
		}
	} else { // horizontal
		if (source.x > destiny.x) {
			if (editWall) { source.walls[1] = set; }
			wall = source.walls[1];
		} else {
			if (editWall) { destiny.walls[1] = set; }
			wall = destiny.walls[1];
		}
	}
	
	return !wall;
};

Maze.done = function() {
	console.groupEnd('Maze generator by Gábor Bokodi');
	settings.click();
};
