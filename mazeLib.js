Array.prototype.getRandom = function() {
	return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.remove = function(item) {
	var index = this.indexOf(item);
	if (index != -1) {
		this.splice(index, 1);
	}
};

var toIndex = function(x, y, c) {
	return y * c + x;
};

var id = function (id) {
	return document.getElementById(id);
};

var adjacents = function(x, y, callback) {
	for (var d = 0, dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]], len = dirs.length; d < len; d++) {
		callback(x + dirs[d][1], y + dirs[d][0]);
	}
};

var indexedArray = function(c, r) {
	this.c = c;
	this.r = r;
	this.indexes = [];
	this.items = [];
};

indexedArray.prototype.add = function(item) {
	var index = toIndex(item.x, item.y, this.c);
	this.indexes.push(index);
	this.items[index] = item;
	item.index = index;
};

indexedArray.prototype.remove = function(item) {
	this.indexes.remove(item.index);
	delete this.items[item.index];
};

indexedArray.prototype.get = function(x, y) {
	return this.items[toIndex(x, y, this.c)];
};

indexedArray.prototype.exists = function(x, y) {
	return !!this.items[toIndex(x, y, this.c)];
};

indexedArray.prototype.hasItems = function() {
	return !!this.indexes.length;
};

indexedArray.prototype.getRandom = function() {
	return this.items[this.indexes.getRandom()];
};

indexedArray.prototype.generateRandom = function() {
	return new Cell(Math.floor(Math.random() * this.c), Math.floor(Math.random() * this.r));
};

indexedArray.prototype.loopThrough = function(callback) {
	for (var i = 0, il = this.indexes.length; i < il; i++) {
		callback(this.items[this.indexes[i]]);
	}
};

var Cell = function(x, y) {
	this.x = x;
	this.y = y;
	this.walls = [1, 1];
};