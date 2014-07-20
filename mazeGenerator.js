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
	Maze.done();
};

Maze.init = function() {
	Maze.rows = +id('row').value;
	Maze.cols = +id('col').value;
	Maze.block = +id('block').value;
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
		
		points = [];
		adjacents(cell.x, cell.y, function(x, y) {
			if (Maze.validCell(x, y) && !frontierCells.exists(x, y)) {
				(p = Maze.mazeList.get(x, y)) ? points.push(p) : frontierCells.add(new Cell(x, y));
			}
		});
		point = points.getRandom();

		if (point.x == cell.x) {
			point.y > cell.y ? point.walls[0] = 0 : cell.walls[0] = 0;
		} else {
			point.x > cell.x ? point.walls[1] = 0 : cell.walls[1] = 0;
		}
	} while (frontierCells.hasItems())
	
	console.timeEnd('generate took');
};

Maze.render = function() {
	console.time('render took');
	
	var mazeCanvas = id('mazeCanvas'),
		ctx = mazeCanvas.getContext('2d');
	
	mazeCanvas.width = Maze.width;
	mazeCanvas.height = Maze.height;
	
	ctx.beginPath();
	ctx.lineWidth = 0.5;
	ctx.strokeStyle = '#222222';
	
	Maze.mazeList.loopThrough(function(item) {
		if (item.walls[0] && item.y != 0) {
			ctx.moveTo(item.x * Maze.block, item.y * Maze.block);
			ctx.lineTo(item.x * Maze.block + Maze.block, item.y * Maze.block);
		}
		if (item.walls[1] && item.x != 0) {
			ctx.moveTo(item.x * Maze.block, item.y * Maze.block);
			ctx.lineTo(item.x * Maze.block, item.y * Maze.block + Maze.block);
		}
	});
	
	ctx.closePath();
	ctx.stroke();
	
	console.timeEnd('render took');
};

Maze.validCell = function(x, y) {
	return x >= 0 && x < Maze.cols && y >= 0 && y < Maze.rows;
};

Maze.done = function() {
	console.groupEnd('Maze generator by Gábor Bokodi');
	settings.click();
};
