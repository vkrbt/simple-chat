'use strict';

const nunjucks = require('nunjucks');
const mongoose = require('mongoose');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  serveClient: true
});

const port = 3100;

mongoose.connect('mongodb://vkrbt:123456@ds111804.mlab.com:11804/chat', {
  useMongoClient: true,
});
mongoose.Promise = require('bluebird');

nunjucks.configure('./client/views', {
  autoescape: true,
  express: app,
  watch: true
});

app.use('/assets', express.static('./client/public'));

app.get('/', (req, res) => {
  res.render('index.html', { date: new Date });
});

require('./sockets')(io);

server.listen(port, () => {
  console.log(`Server is running on port ${'http://' + 'localhost' + ':' + port}`)
});