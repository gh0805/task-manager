const express = require('express');
const app = express()
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, './dist')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/dist/' +'index.html')
})

var server = app.listen(8082, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})
