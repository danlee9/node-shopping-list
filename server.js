var express = require("express");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

var Storage = function() {
	this.items = [];
	this.id = 0;
};

Storage.prototype.add = function(name) {
	var item = {name: name, id: this.id};
	this.items.push(item);
	this.id += 1;
	return item;
}

var storage = new Storage();
storage.add("Broad beans");
storage.add("Tomatoes");
storage.add("Peppers");

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
	res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
	if (!req.body) {
		return res.sendStatus(400);
	}
	var item = storage.add(req.body.name);
	res.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
	var id = req.params.id;
	var found;
	var index;
	for (var i=0; i<storage.items.length; i++) {
		if (storage.items[i].id == id) {
			found = true;
			index = i;
			break;
		}
	}
	if (found) {
		var deleted = storage.items.splice(index, 1);
		res.status(200).json(deleted);
	} else {
		var error = {
			"message": "Id does not exist",
			"serverTime": new Date()
		};
		res.json(error);
	}
});

app.put('/items/:id', jsonParser, function(req, res) {
	if (!req.body) {
		return res.sendStatus(400);
	}
	var id = req.params.id;
	var found;
	var index;
	for (var i=0; i<storage.items.length; i++) {
		if (storage.items[i].id == id) {
			found = true;
			index = i;
			break;
		}
	}
	if (found) {
		storage.items[index].name = req.body.name;
		res.status(200).json(storage.items[index]);
	} else {
		var error = {
			"message": "Id does not exist",
			"serverTime": new Date()
		};
		res.json(error);
	}

});

app.listen(process.env.PORT || 8080);