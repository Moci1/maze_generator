window.onload = function init() {
	var optionsbox = id('optionsbox'),
		settings = id('settings'),
		generate = id('generate'),
		row = id('row'),
		col = id('col'),
		block = id('block'),
		maze = id('maze'),
		ctx = maze.getContext('2d'),
		Maze = {
			dirs: [[-1, 0], [0, 1], [1, 0], [0, -1]]
		};
	
	settings.addEventListener('click', function() {
		optionsbox.classList.toggle('nullheight');
	});
	
	generate.addEventListener('click', function(e) {
		e.preventDefault();
		console.time('s');
		Maze.rows = +row.value;
		Maze.cols = +col.value;
		Maze.block = +block.value;
		
		maze.width = Maze.cols * Maze.block,
		maze.height = Maze.rows * Maze.block;

		var mazeList = [],
			frontierCells = [],
			c = {
				x: Math.floor(Math.random() * Maze.cols),
				y: Math.floor(Math.random() * Maze.rows),
				walls: [1, 1]
			},
			index, tempC, points, point, mazeItem;
		
		do {
			mazeList.push(c);
			for (var i = 0, il = Maze.dirs.length; i < il; i++) {
				tempC = { x: c.x + Maze.dirs[i][0], y: c.y + Maze.dirs[i][1], walls: [1, 1] };
				if (!myFilter(frontierCells, mazeList, tempC) && tempC.x >= 0 && tempC.x < Maze.cols && tempC.y >= 0 && tempC.y < Maze.rows) {
					frontierCells.push(tempC);
				}
			}
			if ((index = frontierCells.indexOf(c)) != -1) {
				frontierCells.splice(index, 1);
			}
			c = frontierCells[Math.floor(Math.random() * frontierCells.length)];
			if (c) {
				points = [];
				for (var j = 0, jl = mazeList.length, ji; j < jl; j++) {
					ji = mazeList[j];
					if (Math.abs(ji.x - c.x) == 1 && Math.abs(ji.y - c.y) == 0 ||
						Math.abs(ji.x - c.x) == 0 && Math.abs(ji.y - c.y) == 1) {
							points.push(ji);
					}
				}
				point = points[Math.floor(Math.random() * points.length)];
				point.x == c.x ?
					point.y > c.y ? point.walls[0] = 0 : c.walls[0] = 0
				:
					point.x > c.x ? point.walls[1] = 0 : c.walls[1] = 0
				;
			}
		} while (frontierCells.length)
		
		ctx.beginPath();
		ctx.lineWidth = 0.5;
		ctx.strokeStyle = '#222222';
		for (var i = 0, il = mazeList.length; i < il; i++) {
			mazeItem = mazeList[i];
			if (mazeItem.walls[0] && mazeItem.y != 0) {
				ctx.moveTo(mazeItem.x * Maze.block, mazeItem.y * Maze.block);
				ctx.lineTo(mazeItem.x * Maze.block + Maze.block, mazeItem.y * Maze.block);
			}
			if (mazeItem.walls[1] && mazeItem.x != 0) {
				ctx.moveTo(mazeItem.x * Maze.block, mazeItem.y * Maze.block);
				ctx.lineTo(mazeItem.x * Maze.block, mazeItem.y * Maze.block + Maze.block);
			}
		}
		ctx.stroke();
		console.timeEnd('s');
		settings.click();
	});
}

// native array.prototype.filter ~10 times slower
function myFilter(frontierArr, mazeArr, item) {
	var matched = [];
	for (var j = 0, jl = frontierArr.length, ji; j < jl; j++) {
		ji = frontierArr[j];
		if (ji.x == item.x && ji.y == item.y) {
			matched.push(ji);
		}
	}
	if (matched.length) {
		return true;
	}
	for (var j = 0, jl = mazeArr.length, ji; j < jl; j++) {
		ji = mazeArr[j];
		if (ji.x == item.x && ji.y == item.y) {
			matched.push(ji);
		}
	}
	return matched.length > 0;
}

function id(id) {
	return document.getElementById(id);
}