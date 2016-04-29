function random(i) {
	return Math.floor(Math.random() * i);
}

function createEmptyArray(y, x) {
	var array = [];
	for (var i = 0; i < y; i++) {
		array.push(new Array());
		for (var j = 0; j < x; j++) {
			array[i].push(0);
		}
	}
	return array;
}