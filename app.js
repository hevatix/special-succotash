'use strict'

var path = require('path');
var express = require('express');
var config = require('./config');
var gcloud = require('gcloud');
var bodyParser = require("body-parser");
var images = require('./uploadFile')(config.gcloud, config.cloudStorageBucket);

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser());

var ds = gcloud.datastore.dataset(config.gcloud);
var tipo = 'Mensaje';

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-PINGOTHER, Content-Range, Content-Disposition, Content-Description ");
  next();
});


app.get('/', function(req, res)
	{
		res.render('index', { title: 'Hola', message: 'Nacho!'});
	});

app.post('/subir',images.multer.single('file'), images.sendUploadToGCS,  function(req, res)
	{
		
	});




var server = app.listen(config.port, function()
	{
		var host = server.address().address;
		var port = server.address().port;
		console.log('Servidor corriendo en ',host,port);
	}
);