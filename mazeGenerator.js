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
			mazeIndexArr = [],
			frontierCells = [],
			frontierIndexArr = [],
			c = {
				x: Math.floor(Math.random() * Maze.cols),
				y: Math.floor(Math.random() * Maze.rows),
				walls: [1, 1]
			},
			len = Maze.dirs.length,
			index, points, point, mazeItem;
		
		do {
			index = c.y * Maze.cols + c.x;
			mazeList[index] = c;
			mazeIndexArr.push(index);
			for (var i = 0, tempC, tempIndex; i < len; i++) {
				tempC = { x: c.x + Maze.dirs[i][0], y: c.y + Maze.dirs[i][1], walls: [1, 1] };
				tempIndex = tempC.y * Maze.cols + tempC.x;
				if (!mazeList[tempIndex] && !frontierCells[tempIndex] && tempC.x >= 0 && tempC.x < Maze.cols && tempC.y >= 0 && tempC.y < Maze.rows) {
					frontierCells[tempIndex] = tempC;
					frontierIndexArr.push(tempIndex);
				}
			}
			if (frontierCells[index]) {
				delete frontierCells[index];
				frontierIndexArr.splice(frontierIndexArr.indexOf(index), 1);
			}
			if (c = frontierCells[frontierIndexArr[Math.floor(Math.random() * frontierIndexArr.length)]]) {
				points = [];
				for (var j = 0, ji; j < len; j++) {
					if (ji = mazeList[(c.y + Maze.dirs[j][1]) * Maze.cols + c.x + Maze.dirs[j][0]]) {
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
		} while (frontierIndexArr.length)
		
		ctx.beginPath();
		ctx.lineWidth = 0.5;
		ctx.strokeStyle = '#222222';
		for (var i = 0, il = mazeIndexArr.length; i < il; i++) {
			mazeItem = mazeList[mazeIndexArr[i]];
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

function id(id) {
	return document.getElementById(id);
}