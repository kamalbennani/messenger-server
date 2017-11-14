const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const cors = require('cors');

// Server Configuration
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware Configuration
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

// POST Request sent by twilio
app.post('/', (req, res) => {
  const { Body, From } = req.body;
  const message = {
    body: Body,
    from: From,
    date: new Date().toString()
  };

  io.emit('new received message', message);
});

// Socket Configuration
io.on('connection', function(socket) {
  socket.on('new message', function(data) {
    console.log('message received', data);
    socket.broadcast.emit('new received message', {
      body: data.body,
      from: socket.id.slice(8),
      date: new Date().toString()
    });
  });
});

server.listen(3030);
console.log('Server listen on port 3030');
